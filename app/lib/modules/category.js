var Category = function( dataObject, jsonDataObject ) {
    var self = {};

    var KEY_ID              = 'id';
    var KEY_CATEGORY        = 'category';
    var KEY_CATEGORY_PRIMARY= 'categoryPrimary';
    var KEY_CATEGORY_SECONDARY = 'categorySecondary';
    var KEY_DECKS           = 'decks';

    var TABLE_NAME = jsonDataObject.databaseTable;
    var COLUMN_NAMES = "( id, 'category', 'categoryPrimary', 'categorySecondary', 'decks' )";
    var INSERT_OR_REPLACE_INTO_TABLE = `INSERT OR REPLACE INTO ${TABLE_NAME} VALUES${COLUMN_NAMES}`;

    self[ KEY_ID ] = ( !!dataObject && _.isNumber( dataObject[ KEY_ID ] ) && !_.isNaN( dataObject[ KEY_ID ] ) ) ?
        dataObject[ KEY_ID ] : null;

    self[ KEY_CATEGORY ] = ( !!dataObject && _.isString( dataObject[ KEY_CATEGORY ] ) ) ? dataObject[ KEY_CATEGORY ] : '';
    self[ KEY_CATEGORY_PRIMARY ] = ( !!dataObject && Alloy.Globals.COLOR_REGEX.test( dataObject[ KEY_CATEGORY_PRIMARY ] ) ) ? dataObject[ KEY_CATEGORY_PRIMARY ] : Alloy.Globals.COLOR_BLACK;
    self[ KEY_CATEGORY_SECONDARY ] = ( !!dataObject && Alloy.Globals.COLOR_REGEX.test( dataObject[ KEY_CATEGORY_SECONDARY ] ) ) ? dataObject[ KEY_CATEGORY_SECONDARY ] : Alloy.Globals.COLOR_WHITE;
    self[ KEY_DECKS ] = ( !!dataObject && _.isArray( dataObject[ KEY_DECKS ] ) ) ? dataObject[ KEY_DECKS ] : [];

    self.getId = function() {
        return self[KEY_ID];
    };
    self.getCategoryName = function() {
        return self[KEY_CATEGORY];
    };
    self.getPrimaryColor = function() {
        return self[KEY_CATEGORY_PRIMARY];
    };
    self.getSecondaryColor = function() {
        return self[KEY_CATEGORY_SECONDARY];
    };
    self.getDecks = function() {
        return self[KEY_DECKS];
    };

    self.getSQLInsertionString = function() {
        var SQLiteUtil = require( './SQLiteUtil.js' );
        var sqlInsertionString = INSERT_OR_REPLACE_INTO_TABLE;
        var categoryObj = {
            id: self.getId(),
            category: self.getCategoryName(),
            categoryPrimary: self.getPrimaryColor(),
            categorySecondary: self.getSecondaryColor()
        };
        categoryObj[ KEY_DECKS ] = JSON.stringify( self.getDecks() );
        categoryObj[ KEY_DECKS ] = SQLiteUtil.getEscapedString( categoryObj[ KEY_DECKS ] );

        sqlInsertionString = sqlInsertionString.replace( 'id', categoryObj.id )
            .replace( 'category', categoryObj.category )
            .replace( 'categoryPrimary', SQLiteUtil.getEscapedString( categoryObj.categoryPrimary ) )
            .replace( 'categorySecondary', SQLiteUtil.getEscapedString( categoryObj.categorySecondary ) )
            .replace( 'decks', categoryObj[ KEY_DECKS ] );

        return sqlInsertionString;
    };

    return self;
};

module.exports = Category;
