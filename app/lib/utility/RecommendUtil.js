var RecommendUtil = function() {
    var self = {};

    var MODULE_LOGGING_TAG = "RecommendUtil.";
    var RECOMMENDATION_CANCEL_INDEX = 1;

    self.createEnterRecommendationDialog = function() {
        var textInputButtonArray = [ L( 'ok' ), L( 'cancel' ) ];
        var textInputDialog = Alloy.Globals.Util.createTextInputDialog( L( 'create_recommendation', textInputButtonArray, RECOMMENDATION_CANCEL_INDEX ) );
        textInputDialog.addEventListener( 'click', textInputDialogClickHandler );
        textInputDialog.show();
    };

    function textInputDialogClickHandler( clickEvent ) {
        if ( clickEvent.index != RECOMMENDATION_CANCEL_INDEX ) {
            var userInput = Alloy.Globals.Util.getTextFromTextInputDialog( clickEvent );

            if ( _.isString( userInput ) && !_.isEmpty( userInput ) ) {
                var ServerUtil = require( 'utility/ServerUtil' );
                var serverUtilInstance = new ServerUtil();
                var url = Alloy.Globals.SERVER_BASE_URL + Alloy.Globals.RECOMMENDATIONS_URL;

                var postSuccessHandler = function() {
                    alert( L( 'post_recommendation_success' ) );
                };

                var postErrorHandler = function() {
                    alert( L( 'server_unavailable' ) );
                }

                serverUtilInstance.postDataObjectToServer( url, postSuccessHandler, postErrorHandler );
            }
        } else {
            Alloy.Globals.Util.log( `${MODULE_LOGGING_TAG}textInputDialogClickHandler: user selected cancel` );
        }
    };

    return self;
};

module.exports = RecommendUtil;
