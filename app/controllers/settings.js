// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var PAGE_LOGGING_TAG = "Settings.";
$.PAGE_NAME = Alloy.Globals.PAGE_NAME_SETTINGS;
var CategoryUtil = require( 'utility/CategoryUtil' );
var categoryUtilInstance = new CategoryUtil();

function categoryButtonClickHandler( clickEvent ) {
    var Navigation = require( 'navigation' );
    //may have to generate cards and add them to navigation object.
    var navigationDataObj = {
        id: Alloy.Globals.PAGE_NAME_CATEGORIES,
        context: {
            categoryText: clickEvent.source.children[0].text
        }
    };

    var navigationInstance = new Navigation( navigationDataObj );
    Alloy.Globals.Util.navigateToPage( navigationInstance, $ );
};

function resetAppDataClickHandler( clickEvent ) {
    var resetDialogClickHandler = function( rdclClickEvent ) {
        if ( rdclClickEvent.index != 1 ) {
            Alloy.Globals.Util.getUpdatesFromServer( $, null, createCategoryButtons, categoryErrorHandler );
        }
    };

    var options = {
        title: L( 'reset_app_data' ),
        message: L( 'reset_data_message' ),
        buttonNames: [ L( 'yes' ), L( 'no' ) ]
    };

    var resetAppDataDialog = Ti.UI.createAlertDialog( options );
    resetAppDataDialog.addEventListener( 'click', resetDialogClickHandler );
    resetAppDataDialog.show();
}

function createCategoryButtons( categories ) {
    console.log( JSON.stringify( categories ) );
    _.each( categories, function( category ) {
        var categoryParentView = Ti.UI.createView( {
            height: 50,
            width: Ti.UI.FILL,
            backgroundGradient: categoryUtilInstance.getGradientForCategory( category )
        } );

        var categoryLabel = Ti.UI.createLabel( {
            height: Ti.UI.SIZE,
            width: Ti.UI.SIZE,
            text: category.getCategoryName(),
            color: category.getSecondaryColor(),
            left: '10%'
        } );
        categoryParentView.add( categoryLabel );

        categoryParentView.addEventListener( 'click', categoryButtonClickHandler );
        //categoryParentView.addEventListener( 'longclick', categoryLongClickHandler );

        $.settings_scroll_view.add( categoryParentView );
    } );
};

function categoryErrorHandler() {
    Alloy.Globals.Util.error( `${PAGE_LOGGING_TAG}categoryErrorHandler read failed.` );
};

function init() {
    Alloy.Globals.Util.initializeView( $ );
    $.version.text = L( 'version_label' ) + Ti.App.version;

    $.reset_data_button.addEventListener( 'click', resetAppDataClickHandler );
    
    var dataObjectArray = Alloy.Globals.DatabaseUtil.getDataObjectArrayForJSONObject(
        Alloy.Globals.JSON_DATA_URLS[ Alloy.Globals.JSON_DATA_URL_KEY_CATEGORIES ],
        null
     );

     createCategoryButtons( dataObjectArray );

     $.getView().open();
};

init();
