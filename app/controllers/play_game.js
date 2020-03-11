// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
$.PAGE_NAME = "play_game";
var PAGE_LOGGING_TAG = "PlayGame.";
var Navigation = require( 'navigation' );
var CardUtil = require( 'utility/CardUtil' );
var cardUtilInstance = new CardUtil();
var REQUIRED_NUMBER_OF_CARDS = 3;
var navigationArguments = {};
var characterCardObjects = [];
var attributeCardObjects = [];

function getCharacterCards() {
    var cardIdArray = [];

    for ( var i = 0; i < REQUIRED_NUMBER_OF_CARDS; i++ ) {
        var cardId = cardUtilInstance.generateRandomIdInRangeOfTable(
            Alloy.Globals.JSON_DATA_URLS[ Alloy.Globals.JSON_DATA_URL_KEY_CHARACTERS ].databaseTable
        );
        while ( _.contains( cardIdArray, cardId ) ) {
            cardId = cardUtilInstance.generateRandomIdInRangeOfTable(
                Alloy.Globals.JSON_DATA_URLS[ Alloy.Globals.JSON_DATA_URL_KEY_CHARACTERS ].databaseTable
            );
        }
        cardIdArray.push( cardId );
    }

    return cardIdArray;
};

function getAttributeCards() {
    var cardIdArray = [];

    for ( var i = 0; i < REQUIRED_NUMBER_OF_CARDS; i++ ) {
        var cardId = cardUtilInstance.generateRandomIdInRangeOfTable(
            Alloy.Globals.JSON_DATA_URLS[ Alloy.Globals.JSON_DATA_URL_KEY_ATTRIBUTES ].databaseTable
        );
        while ( _.contains( cardIdArray, cardId ) ) {
            cardId = cardUtilInstance.generateRandomIdInRangeOfTable(
                Alloy.Globals.JSON_DATA_URLS[ Alloy.Globals.JSON_DATA_URL_KEY_ATTRIBUTES ].databaseTable
            );
        }
        cardIdArray.push( cardId );
    }

    return cardIdArray;
};

function characterCardClickHandler( clickEvent ) {
    console.log( clickEvent.source.apiName );
    _.each( $.character_cards_view.children, function( viewChild ) {
        $.removeClass( viewChild, "selected-card-view" );
        $.addClass( viewChild, "unselected-character-card-view" );
        var viewCard = _.find( characterCardObjects, function( characterCard ) {
            return characterCard.name == clickEvent.source.children[0].text;
        } );
        viewChild.backgroundColor = viewCard.getColor();
        viewChild.color = viewCard.getTextColor();
    } );

    $.removeClass( clickEvent.source, "unselected-character-card-view" );
    $.addClass( clickEvent.source, "selected-card-view" );
    navigationArguments.selectedCharacterCard = _.find( characterCardObjects, function( characterCard ) {
        console.log( characterCard.name + ' == ' + clickEvent.source.children[0].text );
        return characterCard.name == clickEvent.source.children[0].text;
    } );
    clickEvent.source.backgroundColor = navigationArguments.selectedCharacterCard.getColor();
    clickEvent.source.children[0].color = navigationArguments.selectedCharacterCard.getTextColor();
};

function attributeCardClickHandler( clickEvent ) {
    _.each( $.attribute_cards_view.children, function( viewChild ) {
        $.removeClass( viewChild, "selected-card-view" );
        $.addClass( viewChild, "unselected-attribute-card-view" );
        var viewCard = _.find( attributeCardObjects, function( attributeCard ) {
            return attributeCard.name == clickEvent.source.children[0].text;
        } );
        viewChild.backgroundColor = viewCard.getColor();
        viewChild.color = viewCard.getTextColor();
    } );

    $.removeClass( clickEvent.source, "unselected-attribute-card-view" );
    $.addClass( clickEvent.source, "selected-card-view" );
    navigationArguments.selectedAttributeCard = _.find( attributeCardObjects, function( attributeCard ) {
        return attributeCard.name == clickEvent.source.children[0].text;
    } );
    clickEvent.source.backgroundColor = navigationArguments.selectedAttributeCard.getColor();
    clickEvent.source.children[0].color = navigationArguments.selectedAttributeCard.getTextColor();
};

function setViewOptions( view, viewIndex, cardObject ) {
    var attributeView = view.children[ viewIndex ];
    attributeView.backgroundColor = cardObject.getColor();
    var label = attributeView.children[0];
    label.text = cardObject.name;
    label.color = cardObject.getTextColor();
};

function submitButtonClickHandler( clickEvent ) {
    if ( _.isObject( navigationArguments.selectedCharacterCard ) && _.isObject( navigationArguments.selectedAttributeCard ) ) {
        var navigationArgs = {
            id: Alloy.Globals.PAGE_NAME_RESULTS,
            context: {
                character: navigationArguments.selectedCharacterCard,
                attribute: navigationArguments.selectedAttributeCard
            }
        }

        var navigationInstance = new Navigation( navigationArgs );
        Alloy.Globals.Util.navigateToPage( navigationInstance, $ );
    } else if ( !_.isObject( navigationArguments.selectedCharacterCard ) && !_.isObject( navigationArguments.selectedAttributeCard ) ) {
        Alloy.Globals.Util.warn( `${PAGE_LOGGING_TAG}submitButtonClickHandler neither card was selected` );
        alert( L( 'please_select_character' ) );
    } else if ( !_.isObject( navigationArguments.selectedCharacterCard ) ) {
        Alloy.Globals.Util.warn( `${PAGE_LOGGING_TAG}submitButtonClickHandler a character card was not selected.` );
        alert( L( 'please_select_character' ) );
    } else {
        Alloy.Globals.Util.warn( `${PAGE_LOGGING_TAG}submitButtonClickHandler an attribute card was not selected.` );
        alert( L( 'please_select_attribute' ) );
    }
};

function init() {
    Alloy.Globals.Util.initializeView( $ );

    var characterCards = getCharacterCards();
    var attributeCards = getAttributeCards();

    for ( var i = 0; i < characterCards.length; i++ ) {
        var selectStatement = Alloy.Globals.DatabaseUtil.getSelectStatementForDataTypeWhereKeyIsValue(
            Alloy.Globals.JSON_DATA_URLS[ Alloy.Globals.JSON_DATA_URL_KEY_CHARACTERS ].databaseTable,
            'id',
            characterCards[ i ]
        );
        var cardObject = Alloy.Globals.DatabaseUtil.getDataObjectForJSONObject( Alloy.Globals.JSON_DATA_URLS[ Alloy.Globals.JSON_DATA_URL_KEY_CHARACTERS ], selectStatement );

        characterCardObjects.push( cardObject );
        setViewOptions( $.character_cards_view, i, cardObject );
    }

    for ( var i = 0; i < characterCards.length; i++ ) {
        var selectStatement = Alloy.Globals.DatabaseUtil.getSelectStatementForDataTypeWhereKeyIsValue(
            Alloy.Globals.JSON_DATA_URLS[ Alloy.Globals.JSON_DATA_URL_KEY_ATTRIBUTES ].databaseTable,
            'id',
            attributeCards[ i ]
        );
        var cardObject = Alloy.Globals.DatabaseUtil.getDataObjectForJSONObject( Alloy.Globals.JSON_DATA_URLS[ Alloy.Globals.JSON_DATA_URL_KEY_ATTRIBUTES ], selectStatement );

        attributeCardObjects.push( cardObject );
        setViewOptions( $.attribute_cards_view, i, cardObject );
    }

    _.each( $.character_cards_view.children, function( characterChild ) {
        characterChild.addEventListener( 'click', characterCardClickHandler );
    } );
    _.each( $.attribute_cards_view.children, function( attributeChild ) {
        attributeChild.addEventListener( 'click', attributeCardClickHandler );
    } );
    $.submit_button.addEventListener( 'click', submitButtonClickHandler );

    $.getView().open();
};

init();
