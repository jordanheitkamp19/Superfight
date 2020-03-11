// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
var categoryText = args.categoryText;

function createCategoryButtons( category ) {
    _.each( category.decks, function( deck ) {
        var isDeckEnabled = Alloy.Globals.Util.getPropertyDeckEnabled( deck.name );

        var deckParentView = Ti.UI.createView( {
            height: 50,
            width: Ti.UI.FILL,
            backgroundColor: deck.backgroundColor,
            layout: 'horizontal'
        } );

        var deckEnabledColor = ( isDeckEnabled ) ? Alloy.Globals.COLOR_GREEN : Alloy.Globals.COLOR_RED;
        var deckEnabledView = Ti.UI.createView( {
            height: Ti.UI.SIZE,
            width: '20%',
            backgroundColor: deckEnabledColor,
            right: 0
        } );

        var deckLabel = Ti.UI.createLabel( {
            height: Ti.UI.SIZE,
            width: Ti.UI.SIZE,
            text: deck.name,
            color: deck.textColor,
            left: '10%'
        } );
        deckParentView.add( deckLabel );
        deckParentView.add( deckEnabledView );

        deckParentView.addEventListener( 'click', deckClickHandler );

        $.category_scroll_view.add( deckParentView );
    } );
};

function deckClickHandler( clickEvent ) {
    if ( _.isArray( clickEvent.source.children ) && !_.isEmpty( clickEvent.source.children ) ) {
        Alloy.Globals.Util.setPropertyDeckEnabled( clickEvent.source.children[0].text, !Alloy.Globals.Util.getPropertyDeckEnabled( clickEvent.source.children[0].text ) );
    } else {
        Alloy.Globals.Util.setPropertyDeckEnabled( clickEvent.source.text, !Alloy.Globals.Util.getPropertyDeckEnabled( clickEvent.source.text ) );
    }

    updateDecks();
}

function updateDecks() {
    $.category_scroll_view.removeAllChildren();
    var categorySelectStatement = Alloy.Globals.DatabaseUtil.getSelectStatementForDataTypeWhereKeyIsValue(
        Alloy.Globals.JSON_DATA_URLS[ Alloy.Globals.JSON_DATA_URL_KEY_CATEGORIES ].databaseTable,
        'category',
        categoryText
    );

    var category = Alloy.Globals.DatabaseUtil.getDataObjectForJSONObject( Alloy.Globals.JSON_DATA_URLS[ Alloy.Globals.JSON_DATA_URL_KEY_CATEGORIES ], categorySelectStatement );

    createCategoryButtons( category );
}

function init() {
    Alloy.Globals.Util.initializeView( $ );
    console.log( categoryText );
    updateDecks();

    $.getView().open();
};

init();
