$.PAGE_NAME = Alloy.Globals.PAGE_NAME_INDEX;
var PAGE_LOGGING_TAG = "index.";
var args = $.args;

function init() {
    if ( !Alloy.Globals.Util.getPropertyHasDataBeenDownloaded() ) {
        Alloy.Globals.Util.getUpdatesFromServer( $, Alloy.Globals.DEFAULT_DOWNLOADING_DATA_IMAGE );
    } else {
        Alloy.Globals.Util.log( "Database is already initialized so not pulling data." );
    }

    Alloy.Globals.Util.initializeView( $ );

    $.play_mode_view.addEventListener( 'click', playGameClickHandler );
    $.judge_mode_view.addEventListener( 'click', judgeGameClickHandler );
    $.play_game_image_view.image = Ti.Filesystem.getFile( Ti.Filesystem.resourcesDirectory, 'hud.jpg' );
    $.judge_game_image_view.image = Ti.Filesystem.getFile( Ti.Filesystem.resourcesDirectory, 'zombies.jpg' );

    $.getView().open();
};

function playGameClickHandler( clickEvent ) {
    var Navigation = require( 'navigation' );
    //may have to generate cards and add them to navigation object.
    var navigationDataObj = {
        id: Alloy.Globals.PAGE_NAME_PLAY_GAME,
        context: {}
    };

    var navigationInstance = new Navigation( navigationDataObj );
    Alloy.Globals.Util.navigateToPage( navigationInstance, $ );
};

function judgeGameClickHandler( clickEvent ) {
    var Navigation = require( 'navigation' );
    var navigationDataObj = {
        id: Alloy.Globals.PAGE_NAME_JUDGE_GAME,
        context: {}
    };

    var navigationInstance = new Navigation( navigationDataObj );
    Alloy.Globals.Util.navigateToPage( navigationInstance, $ );
};

init();
