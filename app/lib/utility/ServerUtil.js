var ServerUtil = function() {
    var self = {};
    var MODULE_LOGGING_TAG = "ServerUtil.";

    var TIMEOUT_IN_MS = 30 * Alloy.Globals.ONE_SECOND_IN_MILLISECONDS;
    var GENERIC_HTTP_ERROR = "HTTP error";
    var HTTP_CLIENT_ERROR_TIMEOUT = "timeout";
    var HTTP_CLIENT_ERROR_CONNECT_TIMEOUT = "connect timed out";
    var HTTP_STATUS_CODE_BAD_REQUEST = 400;
    var HTTP_STATUS_UNAUTHORIZED = 401;
    var HTTP_STATUS_NOT_FOUND = 404;
    var HTTP_STATUS_SERVER_UNRESPONSIVE = 500;

    self.POST_DATA_TYPE_RECOMMENDATION = "recommendation";

    self.performServerDataPull = function( successCallback, errorCallback ) {
        Alloy.Globals.Util.log( `${MODULE_LOGGING_TAG}performServerDataPull pulling data` );
        var pullStartDateTime = new Date();
        var jsonDataKeyIndex = 0;
        var TEST_FILE_URL_BASE = 'training/';

        var errorOccurred = false;
        var jsonDataKeys = _.keys( Alloy.Globals.JSON_DATA_URLS );
        Alloy.Globals.jsonDataKeysLength = jsonDataKeys.length - 1;

        var jsonIndexDataPullCompleteCallback = function() {
            if ( !errorOccurred ) {
                jsonDataPullCompleteCallback();

                if ( jsonDataKeyIndex < Alloy.Globals.jsonDataKeysLength ) {
                    jsonDataKeyIndex++;
                    _.defer( pullJSONDataAtNextIndex );
                }
            } else {
                Alloy.Globals.Util.error( `${MODULE_LOGGING_TAG}performServerDataPull: error occurred` );

                for ( var i = jsonDataKeyIndex; i < jsonDataKeys.length; i++ ) {
                    jsonDataPullCompleteCallback();
                }
            }
        };

        var jsonDataPullCompleteCallback = _.after( jsonDataKeys.length, function() {
            var currentDateTime = new Date();
            var jsonDataPullCompletionTimeInSeconds = ( currentDateTime - pullStartDateTime ) / Alloy.Globals.ONE_SECOND_IN_MILLISECONDS;
            Alloy.Globals.Util.log( `${MODULE_LOGGING_TAG}performServerDataPull: finished in ${jsonDataPullCompletionTimeInSeconds}` );

            if ( !errorOccurred ) {
                if ( _.isFunction( successCallback ) ) {
                    successCallback();
                }
            } else {
                if ( _.isFunction( errorCallback ) ) {
                    errorCallback();
                }
            }
        } );

        var pullJSONDataAtNextIndex = function() {
            var keyInList = jsonDataKeys[ jsonDataKeyIndex ];
            var jsonObject = Alloy.Globals.JSON_DATA_URLS[ keyInList ];
            var jsonURL = ( Alloy.Globals.isServerSetup && Ti.Network.online ) ?
                `${Alloy.Globals.SERVER_BASE_URL}${jsonObject.url}${Alloy.Globals.FILE_EXTENSION_JSON}` :
                `${TEST_FILE_URL_BASE}${jsonObject.testFileName}${Alloy.Globals.FILE_EXTENSION_JSON}`;

            getDataFromURL(
                jsonURL,
                function( jsonData, httpRequest ) {
                    httpRequest = null;
                    Alloy.Globals.Util.log( `${MODULE_LOGGING_TAG}performServerDataPull: pulled ${jsonData.length} objects of type: ${keyInList}` );

                    if ( jsonData.length > 0 && !_.isEmpty( jsonObject.moduleName ) && !_.isEmpty( jsonObject.databaseTable ) ) {
                        var sqlStrings = [];
                        var module = require( jsonObject.moduleName );

                        var populateSQLStringArray = function( dataObjectArray ) {
                            Alloy.Globals.Util.log( `${MODULE_LOGGING_TAG}performServerDataPull: processing pulled ${jsonObject.name} records` );

                            _.each( dataObjectArray, function( dataObjectInList ) {
                                var moduleInstance = new module( dataObjectInList, jsonObject );

                                if ( !_.isFunction( moduleInstance.isValid ) || moduleInstance.isValid() ) {
                                    sqlStrings.push( moduleInstance.getSQLInsertionString() );
                                }

                                moduleInstance = null;
                            } );
                        };

                        populateSQLStringArray( jsonData );

                        var executeSQLBatchErrorCallback = function( err ) {
                            errorOccurred = true;
                            Alloy.Globals.Util.error( `${MODULE_LOGGING_TAG}performServerDataPull: Failed with error: ${JSON.stringify( err )}` );

                            jsonIndexDataPullCompleteCallback();
                        };

                        var executeSQLBatchSuccessCallback = function() {
                            jsonIndexDataPullCompleteCallback();
                        };

                        Alloy.Globals.DatabaseUtil.executeSQLBatch( sqlStrings, executeSQLBatchSuccessCallback, executeSQLBatchErrorCallback );
                    } else {
                        Alloy.Globals.Util.log( `${MODULE_LOGGING_TAG}performServerDataPull: no results for ${keyInList}` );
                    }

                    jsonData = null;
                },
                function( err ) {
                    errorOccurred = true;
                    Alloy.Globals.Util.error( `${MODULE_LOGGING_TAG}performServerDataPull pulling ${jsonObject.name} with URL: ${jsonURL} Returned ${JSON.stringify( err )}` );
                    jsonIndexDataPullCompleteCallback();
                }
            );
        };

        if ( Ti.Network.online ) {
            Alloy.Globals.Util.log( `${MODULE_LOGGING_TAG}performServerDataPull: pulling data.` );
            pullJSONDataAtNextIndex();
        } else {
            Alloy.Globals.Util.warn( `${MODULE_LOGGING_TAG}performServerDataPull: not pulling data because user is offline.` );
            if ( _.isFunction( errorCallback ) ) {
                errorCallback();
            }
        }
    };

    function getDataFromURL( url, successCallback, errorCallback ) {
        if ( Alloy.Globals.isServerSetup ) {
            var httpRequest = Ti.Network.createHTTPClient( {
                onload: function( e ) {
                    var responseText = this.responseText;
                    var parseErrorOccurred = false;
                    var data;

                    try {
                        data = JSON.parse( responseText );
                    } catch ( err ) {
                        parseErrorOccurred = true;

                        Alloy.Globals.Util.error( `${MODULE_LOGGING_TAG}getDataFromURL: error getting data from url: ${url}` );
                        Alloy.Globals.Util.error( `${MODULE_LOGGING_TAG}getDataFromURL: error with data: ${JSON.stringify( err )}` );
                    }

                    if ( !parseErrorOccurred ) {
                        if ( _.isFunction( successCallback ) ) {
                            successCallback( data, httpRequest );
                        } else {
                            Alloy.Globals.Util.warn( `${MODULE_LOGGING_TAG}getDataFromURL: successCallback is not a function` );
                        }
                    } else {
                        if ( _.isFunction( errorCallback ) ) {
                            errorCallback();
                        } else {
                            Alloy.Globals.Util.warn( `${MODULE_LOGGING_TAG}getDataFromURL: errorCallback is not a function` );
                        }
                    }

                    httpRequest = null;
                },
                onerror: function( e ) {
                    if ( _.isFunction( errorCallback ) ) {
                        errorCallback( e );
                    } else {
                        Alloy.Globals.Util.warn( `${MODULE_LOGGING_TAG}getDataFromURL: errorCallback is not a function` );
                    }
                },
                autoEncodeUrl: ( OS_IOS ) ? null : false,
                timeout: TIMEOUT_IN_MS
            } );

            try {
                httpRequest.open( 'GET', url );
                httpRequest.send();
            } catch ( err ) {
                errorCallback( err );
            }
        } else {
            var testModeError = `${url} returned unreadable data`;

            var testDataFile = Ti.Filesystem.getFile( Ti.Filesystem.resourcesDirectory, url );
            Alloy.Globals.Util.log( `${MODULE_LOGGING_TAG}getDataFromURL: server not set up: pulling from ${testDataFile.nativePath}` );

            if ( testDataFile.exists() && testDataFile.isFile() ) {
                var dataType;

                var testDataBlob = testDataFile.read();
                var testDataObj = JSON.parse( testDataBlob.toString() );

                if ( _.isObject( testDataObj ) ) {
                    successCallback( testDataObj );
                } else {
                    errorCallback( testModeError )
                }
            } else {
                Alloy.Globals.Util.error( `${MODULE_LOGGING_TAG}getDataFromURL: the file does not exist.` );
            }
        }
    };

    self.defaultDataPullErrorHandler = function( err ) {
        var timeoutOccurred = ( _.isString( err.error ) && ( err.error === HTTP_CLIENT_ERROR_TIMEOUT ||
            err.error === HTTP_CLIENT_ERROR_CONNECT_TIMEOUT ) );

        if ( !!err ) {
            var errorString = err.error;

            if ( err.error == GENERIC_HTTP_ERROR ) {
                errorString += ": " + err.code;
            }

            Alloy.Globals.Util.error( `${MODULE_LOGGING_TAG}defaultDataPullErrorHandler: error encountered: ${errorString}` );
        }
    };

    self.postDataObjectToServer = function( url, dataObject, successCallback, errorCallback ) {
        Alloy.Globals.Util.log( `${MODULE_LOGGING_TAG}postDataObjectToServer posting: ${JSON.stringify( dataObject )}` );
        var isValidObject = ( _.isFunction( dataObject.isValidObject ) ) ? dataObject.isValidObject() : true;

        var dataType = '';
        if ( url == Alloy.Globals.RECOMMENDATIONS_URL ) {
            dataType = self.POST_DATA_TYPE_RECOMMENDATION;
        }

        var postCompleteObj = {
            dataType: dataType,
            dataObj: dataObject,
            successCallback: successCallback,
            errorCallback: errorCallback
        };

        var postData = JSON.stringify( dataObject );

        var httpRequest = Ti.Network.createHTTPClient( {
            onload: function( successResponse ) {
                postCompletObj.responseText = this.responseText;
                postOnLoadHandler( successResponse, postCompleteObj );
            },
            onerror: function( failureResponse ) {
                postOnErrorHandler( failureResponse, postCompleteObj );
            },
            autoEncodeUrl: ( OS_IOS ) ? null : false,
            timeout: TIMEOUT_IN_MS
        } );

        if ( Ti.Network.online && isValidObject ) {
            httpRequest.open( 'POST', url );

            httpRequest.setRequestHeader( 'X-Requested-With', 'XMLHttpRequest' );
            httpRequest.setRequestHeader( 'Content-Type', 'application/json; charset=utf-8' );

            if ( Alloy.Globals.isServerSetup ) {
                httpRequest.send( postData );
            } else {
                Alloy.Globals.Util.error( `${MODULE_LOGGING_TAG}postDataObjectToServer: could not post object because the server is not set up.` );
                Alloy.Globals.Util.showErrorAlertDialog( L( 'server_unavailable' ) );
            }
        } else if ( !isValidObject ) {
            Alloy.Globals.Util.warn( `${MODULE_LOGGING_TAG}postDataObjectToServer: invalid object` );
        } else {
            Alloy.Globals.Util.warn( `${MODULE_LOGGING_TAG}postDataObjectToServer: Device offline.` );
            Alloy.Globals.Util.showErrorAlertDialog( L( 'device_offline' ) );
        }
    };

    function postOnLoadHandler( successResponse, postCompleteObj ) {
        var parseErrorOccurred = false;
        var responseDataObject;

        try {
            responseDataObject = JSON.parse( postCompleteObj.responseText );
        } catch ( err ) {
            Alloy.Globals.Util.error( `${MODULE_LOGGING_TAG}postOnLoadHandler: error occurred: ${JSON.stringify( err )}` );
            parseErrorOccurred = true;
        }

        if ( !parseErrorOccurred ) {
            if ( _.isFunction( postCompletObj.successCallback ) ) {
                postCompletObj.successCallback();
            }
        } else {
            if ( _.isFunction( postCompletObj.errorCallback ) ) {
                postCompletObj.errorCallback();
            }
        }
    };

    function postOnErrorHandler( failureResponse, postCompleteObj ) {
        Alloy.Globals.Util.error( `${MODULE_LOGGING_TAG}postOnErrorHandler: error occurred: ${JSON.stringify( failureResponse )}` );

        if ( _.isFunction( postCompletObj.errorCallback ) ) {
            postCompletObj.errorCallback();
        }
    };

    return self;
}

module.exports = ServerUtil;
