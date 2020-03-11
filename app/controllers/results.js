// Arguments passed into this controller can be accessed via the `$.args` object directly or:
var args = $.args;
$.PAGE_NAME = "results";
var CardUtil = require( 'utility/CardUtil' );
var cardUtilInstance = new CardUtil();
var characterCard = args.character;
var attributeCard = args.attribute;
var randomCard;

function getRandomAttributeCard() {
    var cardId;

    var cardId = cardUtilInstance.generateRandomIdInRangeOfTable(
        Alloy.Globals.JSON_DATA_URLS[ Alloy.Globals.JSON_DATA_URL_KEY_ATTRIBUTES ].databaseTable
    );
    while ( cardId == attributeCard.getId() ) {
        cardId = cardUtilInstance.generateRandomIdInRangeOfTable(
            Alloy.Globals.JSON_DATA_URLS[ Alloy.Globals.JSON_DATA_URL_KEY_ATTRIBUTES ].databaseTable
        );
    }

    var selectStatement = Alloy.Globals.DatabaseUtil.getSelectStatementForDataTypeWhereKeyIsValue(
        Alloy.Globals.JSON_DATA_URLS[ Alloy.Globals.JSON_DATA_URL_KEY_ATTRIBUTES ].databaseTable,
        'id',
        cardId
    );
    return Alloy.Globals.DatabaseUtil.getDataObjectForJSONObject( Alloy.Globals.JSON_DATA_URLS[ Alloy.Globals.JSON_DATA_URL_KEY_ATTRIBUTES ], selectStatement );
};

function performCardLayout( attributeCardObject, parentView ) {
    console.log( JSON.stringify( attributeCardObject ) );
    parentView.children[0].text = attributeCardObject.getName();
    parentView.backgroundColor = attributeCardObject.getColor();
    parentView.children[0].color = attributeCardObject.getTextColor();
}

function updateCards() {
    performCardLayout( characterCard, $.character_card_view );
    performCardLayout( attributeCard, $.chosen_attribute_card_view );
    performCardLayout( randomCard, $.random_attribute_card_view );
}

function init() {
    Alloy.Globals.Util.initializeView( $ );
    console.log( JSON.stringify( characterCard ) );
    console.log( JSON.stringify( attributeCard ) );
    randomCard = getRandomAttributeCard();
    updateCards();

    $.getView().open();
}

init();
