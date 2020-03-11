var Card = function( dataObject, jsonDataObject ) {
    var self = {};

    var KEY_ID          = 'id';
    var KEY_NAME        = 'name';
    var KEY_DECK        = 'deck';
    var KEY_COLOR       = 'color';
    var KEY_TEXT_COLOR  = 'textColor';

    var TABLE_NAME = jsonDataObject.databaseTable;
    var COLUMN_NAMES = "( id, 'name', 'deck', 'color', 'textColor' )";
    var INSERT_OR_REPLACE_INTO_TABLE = `INSERT OR REPLACE INTO ${TABLE_NAME} VALUES${COLUMN_NAMES}`;

    self[ KEY_ID ] = ( !!dataObject && _.isNumber( dataObject[ KEY_ID ] ) && !_.isNaN( dataObject[ KEY_ID ] ) ) ?
        dataObject[ KEY_ID ] : null;

    self[ KEY_NAME ] = ( !!dataObject && _.isString( dataObject[ KEY_NAME ] ) ) ? dataObject[ KEY_NAME ] : '';
    self[ KEY_DECK ] = ( !!dataObject && _.isString( dataObject[ KEY_DECK ] ) ) ? dataObject[ KEY_DECK ] : '';
    self[ KEY_COLOR ] = ( !!dataObject && Alloy.Globals.COLOR_REGEX.test( dataObject[ KEY_COLOR ] ) ) ? dataObject[ KEY_COLOR ] : Alloy.Globals.COLOR_BLACK;
    self[ KEY_TEXT_COLOR ] = ( !!dataObject && Alloy.Globals.COLOR_REGEX.test( dataObject[ KEY_TEXT_COLOR ] ) ) ? dataObject[ KEY_TEXT_COLOR ] : Alloy.Globals.COLOR_WHITE;

    self.getId = function() {
        return self[KEY_ID];
    };
    self.getName = function() {
        return self[KEY_NAME];
    };
    self.getDeck = function() {
        return self[KEY_DECK];
    };
    self.getColor = function() {
        return self[KEY_COLOR];
    };
    self.getTextColor = function() {
        return self[KEY_TEXT_COLOR];
    };

    self.getSQLInsertionString = function() {
        var SQLiteUtil = require( './SQLiteUtil.js' );
        var sqlInsertionString = INSERT_OR_REPLACE_INTO_TABLE;
        var cardObj = {
            id: self.getId(),
            name: self.getName(),
            deck: self.getDeck(),
            color: self.getColor(),
            textColor: self.getTextColor()
        };

        sqlInsertionString = sqlInsertionString.replace( 'id', cardObj.id )
            .replace( 'name', SQLiteUtil.getEscapedString( cardObj.name ) )
            .replace( 'deck', cardObj.deck )
            .replace( 'color', SQLiteUtil.getEscapedString( cardObj.color ) )
            .replace( 'textColor', SQLiteUtil.getEscapedString( cardObj.textColor ) );

        return sqlInsertionString;
    };

    return self;
};

module.exports = Card;
