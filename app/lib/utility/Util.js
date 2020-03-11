var Util = function() {
    var self = {};
    var MODULE_LOGGING_TAG = "Util.";
    var PROPERTY_NAME_HAS_DATA_BEEN_DOWNLOADED = "hasDataBeenDownloaded";
    var PROPERTY_NAME_HAS_USER_SUBMITTED_RECOMMENDATION = "hasSubmittedRecommendation";
    var PROPERTY_NAME_EXTENSION = "-enabled";

    var navigationStack = [];
    var NAVIGATION_STACK_MAX_LENGTH = 4;

    self.showErrorAlertDialog = function( message ) {
        alert( message );
    };

    self.getUpdatesFromServer = function( controller, image, successCallback, errorCallback ) {
        if ( Ti.Network.online ) {
            self.addDownloadingOverlay( controller, image );
            Alloy.Globals.DatabaseUtil.clearDatabaseData();
            self.setPropertyHasDataBeenDownloaded( false );

            var createTablesSuccessCallback = function() {
                Alloy.Globals.Util.log( `${MODULE_LOGGING_TAG}getUpdatesFromServer: tables successfully created.` );
                var ServerUtil = require( 'utility/ServerUtil' );
                serverUtilInstance = new ServerUtil();

                var serverDataPullSuccessCallback = function() {
                    self.removeDownloadingOverlay( controller );
                    self.setPropertyHasDataBeenDownloaded( true );
                    Alloy.Globals.Util.log( `${MODULE_LOGGING_TAG}createTablesSuccessCallback: data was successfully downloaded.` );

                    if ( _.isFunction( successCallback ) ) {
                        successCallback();
                    }
                };

                var serverDataPullErrorCallback = function() {
                    Alloy.Globals.Util.error( `${MODULE_LOGGING_TAG}createTablesSuccessCallback: data could not be pulled.` );

                    if ( _.isFunction( errorCallback ) ) {
                        errorCallback();
                    }
                };

                serverUtilInstance.performServerDataPull( serverDataPullSuccessCallback, serverDataPullErrorCallback );
            };

            var createTablesErrorCallback = function( err ) {
                Alloy.Globals.Util.error( `${MODULE_LOGGING_TAG}getUpdatesFromServer: an error occurred during table creation.` );
            };

            Alloy.Globals.DatabaseUtil.createTablesInDatabase( createTablesSuccessCallback, createTablesErrorCallback );
        } else {
            Alloy.Globals.Util.warn( `${MODULE_LOGGING_TAG}getUpdatesFromServer: Device offline.` );
            Alloy.Globals.Util.showErrorAlertDialog( L( 'device_offline' ) );
        }
    };

    self.setPropertyDeckEnabled = function( deckProperty, deckEnabled ) {
        var deckPropertyName = deckProperty + PROPERTY_NAME_EXTENSION;
        Ti.App.Properties.setBool( deckPropertyName, _.isBoolean( deckEnabled ) ? deckEnabled : false );
    };

    self.getPropertyDeckEnabled = function( deckProperty ) {
        var deckPropertyName = deckProperty + PROPERTY_NAME_EXTENSION;
        var deckEnabled = Ti.App.Properties.getBool( deckPropertyName, true );
        self.log( `${MODULE_LOGGING_TAG}getPropertyDeckEnabled returning: ${deckEnabled} for ${deckPropertyName}` );
        return deckEnabled;
    };

    self.setPropertyHasSubmittedRecommendation = function( hasSubmittedRecommendation ) {
        Ti.App.Properties.setBool( PROPERTY_NAME_HAS_USER_SUBMITTED_RECOMMENDATION, _.isBoolean( hasSubmittedRecommendation ) ? hasSubmittedRecommendation : false );
    };

    self.getPropertyHasSubmittedRecommendation = function() {
        var hasSubmittedRecommendation = Ti.App.Properties.getBool( PROPERTY_NAME_HAS_USER_SUBMITTED_RECOMMENDATION, false );
        self.log( `${MODULE_LOGGING_TAG}getPropertyHasSubmittedRecommendation returning: ${hasSubmittedRecommendation}` );
        return hasSubmittedRecommendation;
    };

    self.setPropertyHasDataBeenDownloaded = function( hasDataBeenDownloaded ) {
        Ti.App.Properties.setBool( PROPERTY_NAME_HAS_DATA_BEEN_DOWNLOADED, _.isBoolean( hasDataBeenDownloaded ) ? hasDataBeenDownloaded : false );
    };

    self.getPropertyHasDataBeenDownloaded = function() {
        var hasDataBeenDownloaded = Ti.App.Properties.getBool( PROPERTY_NAME_HAS_DATA_BEEN_DOWNLOADED, false );
        self.log( `${MODULE_LOGGING_TAG}getPropertyHasDataBeenDownloaded returning: ${hasDataBeenDownloaded}` );
        return hasDataBeenDownloaded;
    };

    self.addDownloadingOverlay = function( controller, image ) {
        if ( _.isUndefined( image ) ) {
            image = Alloy.Globals.DEFAULT_DOWNLOADING_DATA_IMAGE;
        }

        if ( _.isUndefined( controller.downloading_overlay.downloading_overlay_container ) ) {
            if ( OS_ANDROID ) {
                Ti.UI.Android.hideSoftKeyboard();
            }

            controller.getView().add( controller.downloading_overlay.downloading_overlay_container );
            controller.downloading_overlay.downloading_overlay_container.applyProperties( { zIndex: 4 } );

            controller.downloading_overlay.downloading_overlay_container.add(
                controller.downloading_overlay.downloading_overlay.downloading_image_view
            );
        }

        controller.downloading_overlay.downloading_image_view.image = image;

        controller.downloading_overlay.downloading_overlay_container.show();
        controller.downloading_overlay.downloading_image_view.show();
    };

    self.removeDownloadingOverlay = function( controller ) {
        controller.downloading_overlay.downloading_overlay_container.hide();
        controller.downloading_overlay.downloading_image_view.hide();
    };

    self.widgetCleanupHandler = function( widgetController ) {
        if ( !_.isUndefined( widgetController ) ) {
            widgetController.destroy();
            widgetController.removeListener();
            widgetController.off();
            widgetController.args = null;
            widgetController = null;
        }

        self.log( `${MODULE_LOGGING_TAG}widgetCleanupHandler: cleanup finished` );
    };

    self.isNonEmptyString = function( possibleString ) {
        return ( _.isString( possibleString ) && !_.isEmpty( possibleString ) );
    };

    self.createTextInputDialog = function( title, buttonNames, cancelIndex ) {
        if ( _.isString( title ) && _.isArray( buttonNames ) ) {
            var inputDialog;
            var dialogOptions = {
                title: title,
                buttonNames: buttonNames,
                canceledOnTouchOutside: false
            };

            if ( _.isNumber( cancelIndex ) && !_.isNaN( cancelIndex ) ) {
                dialogOpts.cancel = cancelIndex;
            }

            if ( OS_ANDROID ) {
                var textAreaContainer = Ti.UI.createView( {
                    width: Ti.UI.FILL
                } );

                var textArea = Ti.UI.createTextArea( {
                    width: Ti.UI.FILL,
                    top: 10,
                    value: '',
                    maxLength: -1
                } );
                textAreaContainer.add( textArea );
            } else if ( OS_IOS ) {
                dialogOpts.style = Ti.UI.iOS.AlertDialogStyle.PLAIN_TEXT_INPUT;
            }

            inputDialog = Ti.UI.createAlertDialog( dialogOptions );

            return inputDialog;
        } else {
            self.error( `${MODULE_LOGGING_TAG}createTextInputDialog: missing parameters.` );
        }
    };

    self.getTextFromTextInputDialog = function( clickEvent ) {
        var text = '';

        if ( OS_ANDROID ) {
            text = clickEvent.source.androidView.children[0].value;
        } else if ( OS_IOS ) {
            text = clickEvent.text;
        }

        return text;
    };

    self.navigateToPage = function( navigationInstance, controller ) {
        if ( navigationInstance.getId() !== controller.getView().id ) {
            var navigationContext = navigationInstance.getContext();
            var newController = Alloy.createController( navigationInstance.getId(), navigationContext );
            self.log( `${MODULE_LOGGING_TAG}navigateToPage: opening ${navigationInstance.getId()} and closing ${controller.getView().id}` );

            self.pushNavigationInstanceToNavigationStack( navigationInstance );

            newController.getView().open( { animated: false } );
            controller.getView().close( { animated: false } );
        } else {
            self.warn( `${MODULE_LOGGING_TAG}navigateToPage: could not open ${navigationInstance.getId()}` );
        }
    };

    self.pushNavigationInstanceToNavigationStack = function( navigationInstance ) {
        if ( navigationInstance.isValid() ) {
            navigationStack.push( navigationInstance );

            if ( navigationStack.length > NAVIGATION_STACK_MAX_LENGTH ) {
                navigationStack.shift();
            }
        } else {
            self.error( `${MODULE_LOGGING_TAG}pushNavigationInstanceToNavigationStack instance was not pushed: ${JSON.stringify( navigationInstance )}` );
        }
    };

    self.popLastNavigationInstanceFromStack = function() {
        navigationStack.pop();
    };

    self.getCurrentNavigationInstanceFromNavigationStack = function() {
        var currentNavigationInstance = navigationStack[ navigationStack.length - 1 ];

        if ( _.isUndefined( currentNavigationInstance ) || _.isNull( currentNavigationInstance ) ) {
            var Navigation = require( 'navigation' );
            currentNavigationInstance = new Navigation( { id: Alloy.Globals.PAGE_NAME_INDEX } );

            Navigation = null;
        }

        return currentNavigationInstance;
    };

    function backButtonHandler( controller ) {
        self.log( `${MODULE_LOGGING_TAG}backButtonHandler: back button clicked on page: ${controller.getView().id}` );

        self.popLastNavigationInstanceFromStack();
        var newPage = self.getCurrentNavigationInstanceFromNavigationStack();

        self.navigateToPage( newPage, controller );
    };

    self.initializeView = function( controller ) {
        self.log( `${MODULE_LOGGING_TAG}initializeView: initializing ${controller.PAGE_NAME}` );
        controller.getView().addEventListener( 'androidback', function() {
            backButtonHandler( controller );
        } );

        if ( !_.isUndefined( controller.header_content ) ) {
            controller.headerWidget = Alloy.createWidget( 'header_widget', 'widget', {
                controller: controller
            } );

            controller.header_content.insertAt( {
                view: controller.headerWidget.getView(),
                position: 0
            } );
        }

        controller.getView().orientationModes = [ Ti.UI.PORTRAIT ];

        //This doesn't work as expected
        //if ( _.isFunction( controller.orientationChangeHandler ) ) {
        //    Ti.Gesture.addEventListener( 'orientationchange', controller.orientationChangeHandler );
        //}

        var viewCloseHandler = function( closeEvent ) {
            function removeEventListeners ( view ) {
                if ( !view ) return;

                // remove all event listeners from view
                if ( view._events ) {
                    view._events = {};
                }

                // if this is an alloy controler, remove all event listeners from views
                if ( view.__views ) {
                    for ( const key in view.__views ) {
                        removeEventListeners( view.__views[ key ] );
                    }

                    // remove views from controller
                    view.__views = {};
                }

                // if this view has children, remove event listeners from child views
                if ( view.children && view.children.length ) {
                    for ( let v of view.children ) {
                        removeEventListeners( v );
                    }

                    // remove references to child views
                    view.children = [];
                    view._children = [];
                }
            }

            removeEventListeners( controller );
            controller.destroy();
            controller.removeListener();
            controller.off();
            controller.args = null;
        };

        controller.getView().addEventListener( 'close', viewCloseHandler );
    };

    self.log = function( message ) {
        Ti.API.info( "[INFO] - " + message );
    };

    self.warn = function( message ) {
        Ti.API.warn( "[WARN] - " + message );
    };

    self.error = function( message ) {
        Ti.API.error( "[ERROR] - " + message );
    };

    return self;
}

module.exports = Util;
