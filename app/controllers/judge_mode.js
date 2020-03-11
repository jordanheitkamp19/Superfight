var CardUtil = require( 'utility/CardUtil' );
var cardUtilInstance = new CardUtil();
$.PAGE_NAME = "judge_mode";
var locationCard;
var challengeCard;

function getLocationCard() {
    var cardId;

    var cardId = cardUtilInstance.generateRandomIdInRangeOfTable(
        Alloy.Globals.JSON_DATA_URLS[ Alloy.Globals.JSON_DATA_URL_KEY_LOCATIONS ].databaseTable
    );

    var selectStatement = Alloy.Globals.DatabaseUtil.getSelectStatementForDataTypeWhereKeyIsValue(
        Alloy.Globals.JSON_DATA_URLS[ Alloy.Globals.JSON_DATA_URL_KEY_LOCATIONS ].databaseTable,
        'id',
        cardId
    );
    return Alloy.Globals.DatabaseUtil.getDataObjectForJSONObject( Alloy.Globals.JSON_DATA_URLS[ Alloy.Globals.JSON_DATA_URL_KEY_LOCATIONS ], selectStatement );
}

function getChallengeCard() {
    var cardId;

    var cardId = cardUtilInstance.generateRandomIdInRangeOfTable(
        Alloy.Globals.JSON_DATA_URLS[ Alloy.Globals.JSON_DATA_URL_KEY_CHALLENGES ].databaseTable
    );

    var selectStatement = Alloy.Globals.DatabaseUtil.getSelectStatementForDataTypeWhereKeyIsValue(
        Alloy.Globals.JSON_DATA_URLS[ Alloy.Globals.JSON_DATA_URL_KEY_CHALLENGES ].databaseTable,
        'id',
        cardId
    );
    return Alloy.Globals.DatabaseUtil.getDataObjectForJSONObject( Alloy.Globals.JSON_DATA_URLS[ Alloy.Globals.JSON_DATA_URL_KEY_CHALLENGES ], selectStatement );
}

function performCardLayout( attributeCardObject, parentView ) {
    console.log( JSON.stringify( attributeCardObject ) );
    parentView.children[0].text = attributeCardObject.getName();
    parentView.backgroundColor = attributeCardObject.getColor();
    parentView.children[0].color = attributeCardObject.getTextColor();
}

function updateCards() {
    performCardLayout( challengeCard, $.challenge_card_view );
    performCardLayout( locationCard, $.location_card_view );
}

function init() {
    Alloy.Globals.Util.initializeView( $ );
    locationCard = getLocationCard();
    challengeCard = getChallengeCard();
    updateCards();

    $.getView().open();
}

init();
