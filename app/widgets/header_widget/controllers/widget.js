var args = $.args || {};
var WIDGET_LOGGING_TAG = "HeaderWidget.";
var controller = ( _.isObject( args.controller ) ) ? args.controller : null;
var pageName = ( _.isObject( controller ) && _.isString( controller.PAGE_NAME ) ) ? controller.PAGE_NAME : '';

function settingsClickHandler( clickEvent ) {
    var Navigation = require( 'navigation' );
    var navigationDataObj = {
        id: Alloy.Globals.PAGE_NAME_SETTINGS,
        context: {}
    };

    var navigationInstance = new Navigation( navigationDataObj );
    Alloy.Globals.Util.navigateToPage( navigationInstance, controller );
};

function homeButtonClickHandler( clickEvent ) {
    var Navigation = require( 'navigation' );
    var navigationDataObj = {
        id: Alloy.Globals.PAGE_NAME_INDEX,
        context: {}
    };

    var navigationInstance = new Navigation( navigationDataObj );
    Alloy.Globals.Util.navigateToPage( navigationInstance, controller );
}

function widgetCleanupHandler() {
    Alloy.Globals.Util.widgetCleanupHandler( controller );
};

function init() {
    $.settings_button.addEventListener( 'click', settingsClickHandler );
    $.home_button.addEventListener( 'click', homeButtonClickHandler );
    $.settings_button.image = Ti.Filesystem.getFile( Ti.Filesystem.resourcesDirectory, 'gear.png' );

    controller.getView().addEventListener( 'close', widgetCleanupHandler );
};

init();
