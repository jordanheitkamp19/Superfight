var DatabaseUtil = function() {
    var self = {};
    var MODULE_LOGGING_TAG = "DatabaseUtil."
    var DATABASE_NAME = "superfight";
    var SQLiteUtil = require( 'modules/SQLiteUtil' );

    var getDatabaseConnection = function() {
        return Ti.Database.open( DATABASE_NAME );
    };

    self.executeSQLBatch = function( sqlStatements, successCallback, errorCallback ) {
        Alloy.Globals.Util.log( "Execute Sql Batch" );
        var db = getDatabaseConnection();

        try {
            db.execute( "BEGIN" );

            _.each( sqlStatements, function( statement ) {
                Alloy.Globals.Util.log( statement );
                db.execute( statement );
            } );

            db.execute( "COMMIT" );
            db.close();

            Alloy.Globals.Util.log( "Starting success callback" );
            if ( _.isFunction( successCallback ) ) {
                successCallback();
            }
        } catch ( err ) {
            Alloy.Globals.Util.error( `${MODULE_LOGGING_TAG}executeSQLBatch: encountered error: ${err}` );

            db.execute( "COMMIT" );
            db.close();

            if ( _.isFunction( errorCallback ) ) {
                errorCallback();
            }
        }
    };

    self.getSelectStatementForDataTypeWhereKeyIsValue = function( table, key, value ) {
        console.log( table );
        console.log( key );
        console.log( value );
        var selectStatement = "";

        if ( _.isString( value ) ) {
            value = "'" + value + "'";
        }

        if ( Alloy.Globals.Util.isNonEmptyString( table ) && Alloy.Globals.Util.isNonEmptyString( key ) && !_.isUndefined( value ) ) {
            selectStatement = "SELECT * FROM key_table WHERE key_key=key_value";

            selectStatement = selectStatement.replace( "key_table", table )
                .replace( "key_key", key )
                .replace( "key_value", value );
        }

        if ( _.isEmpty( selectStatement ) ) {
            Alloy.Globals.Util.error( `${MODULE_LOGGING_TAG}getSelectStatementForDataTypeWhereKeyIsValue: returning empty string` );
        }

        return selectStatement;
    };

    self.getCardSelectStatementWithRemovedDecks = function( selectStatement ) {
        return `${selectStatement} WHERE deck NOT IN (${self.getDisabledDecksArray()})`;
    };

    self.getDisabledDecksArray = function() {
        var disabledDecksArray = [];
        var categories = self.getDataObjectArrayForJSONObject(
            Alloy.Globals.JSON_DATA_URLS[ Alloy.Globals.JSON_DATA_URL_KEY_CATEGORIES ],
            null
        );

        _.each( categories, function( categoryInList ) {
            _.each( categoryInList.getDecks(), function( deckInList ) {
                if ( !Alloy.Globals.Util.getPropertyDeckEnabled( deckInList.name ) ) {
                    disabledDecksArray.push( `'${deckInList.name}'` );
                }
            } );
        } );

        return disabledDecksArray;
    };

    self.getIdsInTable = function( tableName ) {
        var selectStatement = `SELECT id FROM ${tableName}`;
        var cardTableNameArray = [];
        _.each( Alloy.Globals.UNIQUE_JSON_DATA_CARD_TABLES, function( urlInList ) {
            cardTableNameArray.push( Alloy.Globals.JSON_DATA_URLS[ urlInList ].databaseTable );
        } );
        console.log( JSON.stringify( cardTableNameArray ) );
        if ( _.contains( cardTableNameArray, tableName ) ) {
            selectStatement = self.getCardSelectStatementWithRemovedDecks( selectStatement );
        }
        console.log( selectStatement );
        var db = getDatabaseConnection();
        var entries = [];

        try {
            var rows = db.execute( selectStatement );
            if ( rows.rowCount > 0 ) {
                while ( rows.isValidRow() ) {
                    entries.push( rows.fieldByName( 'id' ) );
                    rows.next();
                }
            } else {
                throw `No values were returned for the select statement: ${selectStatement}`;
            }
        } catch ( err ) {
            Alloy.Globals.Util.error( `${MODULE_LOGGING_TAG}getIdsInTable an error occurred: ${JSON.stringify( err )}` );
        } finally {
            db.close();
        }

        return entries;
    };

    self.logAllCharacters = function() {
        var sqlStatement = `SELECT * FROM Characters`;
        var db = getDatabaseConnection();
        try {
            var rows = db.execute( sqlStatement );
            while ( rows.isValidRow() ) {
                var character = {
                    id: Alloy.Globals.Util.getUnescapedString( rows.fieldByName( 'id' ) ),
                    name: Alloy.Globals.Util.getUnescapedString( rows.fieldByName( 'name' ) ),
                    deck: Alloy.Globals.Util.getUnescapedString( rows.fieldByName( 'deck' ) ),
                    bgColor: Alloy.Globals.Util.getUnescapedString( rows.fieldByName( 'bg_color' ) ),
                    textColor: Alloy.Globals.Util.getUnescapedString( rows.fieldByName( 'text_color' ) )
                };
                console.log( JSON.stringify( character ) );
                rows.next();
            };
        } catch ( err ) {
            Alloy.Globals.Util.error( `${MODULE_LOGGING_TAG}logAllCharacters: an error occurred: ${err}` );
        } finally {
            db.close();
        }
    };

    self.getRowCountForTable = function( tableName ) {
        var selectStatement = `SELECT COUNT(*) AS count FROM ${tableName}`;
        var db = getDatabaseConnection();
        var entries = 0;

        try {
            var row = db.execute( selectStatement );
            if ( row.rowCount > 0 ) {
                console.log( JSON.stringify( row ) );
            } else {
                throw `No values were returned for the select statement: ${selectStatement}`;
            }
        } catch ( err ) {
            Alloy.Globals.Util.error( `${MODULE_LOGGING_TAG}getRowCountForTable an error occurred: ${JSON.stringify( err )}` );
        } finally {
            db.close();
        }

        return entries;
    };

    self.createTablesInDatabase = function( successCallback, errorCallback ) {
        var BASE_STATEMENT = `CREATE TABLE IF NOT EXISTS table_name columns`;
        var createStatements = [];
        _.each( Alloy.Globals.UNIQUE_JSON_DATA_CARD_TABLES, function( jsonDataObject ) {
            var createStatement = BASE_STATEMENT.replace( 'table_name', Alloy.Globals.JSON_DATA_URLS[ jsonDataObject ].databaseTable )
                .replace( 'columns', Alloy.Globals.CARD_DATABASE_COLUMNS );
            createStatements.push( createStatement );
        } );
        var categoryStatement = BASE_STATEMENT.replace( 'table_name', Alloy.Globals.JSON_DATA_URLS[ Alloy.Globals.JSON_DATA_URL_KEY_CATEGORIES ].databaseTable )
            .replace( 'columns', '( id, category, categoryPrimary, categorySecondary, decks )' );
        createStatements.push( categoryStatement );
        self.executeSQLBatch( createStatements, successCallback, errorCallback );
    };

    self.clearDatabaseData = function() {
        var db = getDatabaseConnection();

        try {
            db.remove();
            Alloy.Globals.Util.log( `${MODULE_LOGGING_TAG}clearDatabaseData: database removed.` );
        } catch ( err ) {
            Alloy.Globals.Util.log( `${MODULE_LOGGING_TAG}clearDatabaseData: database reset failed with error ${JSON.stringify( err )}` );
            db.close();
        }
    };

    self.getDataObjectForJSONObject = function( jsonDataObject, selectStatement ) {
        if ( _.isObject( jsonDataObject ) && Alloy.Globals.Util.isNonEmptyString( selectStatement ) ) {
            var errorOccurred = false;
            var db = getDatabaseConnection();
            var ObjectModule = require( jsonDataObject.moduleName );
            var newDataObject;

            try {
                var rows = db.execute( selectStatement );
                if ( rows.isValidRow() ) {
                    var dataObject = {};
                    for ( var i = 0; i < rows.fieldCount; i++ ) {
                        var fieldNameForIndex = rows.fieldName( i );
                        dataObject[ fieldNameForIndex ] = rows.fieldByName( fieldNameForIndex );
                    }
                    console.log( JSON.stringify( dataObject ) );

                    SQLiteUtil.parseDataObject( dataObject );
                    newDataObject = new ObjectModule( dataObject, jsonDataObject );
                } else {
                    Alloy.Globals.Util.error( `${MODULE_LOGGING_TAG}getDataObjectForJSONObject: no values returned for statement: ${selectStatement}` );
                }
            } catch ( err ) {
                errorOccurred = true;
                Alloy.Globals.Util.error( `${MODULE_LOGGING_TAG}getDataObjectForJSONObject: error occurred: ${JSON.stringify( err )}` );
            } finally {
                if ( _.isObject( db ) ) {
                    db.close();
                }
                return newDataObject;
            }
        } else {
            Alloy.Globals.Util.warn( `${MODULE_LOGGING_TAG}getDataObjectForJSONObject: invalid parameters: statement = ${selectStatement}` );
        }
    };

    self.getDataObjectArrayForJSONObject = function( jsonDataObject, selectStatement ) {
        if ( _.isObject( jsonDataObject ) ) {
            var dataObjectArray = [];
            var errorOccurred = false;
            var db = getDatabaseConnection();
            var ObjectModule = require( jsonDataObject.moduleName );
            var objectSelectStatement = ( Alloy.Globals.Util.isNonEmptyString( selectStatement ) ) ?
                selectStatement : `SELECT * FROM ${Alloy.Globals.JSON_DATA_URLS[ Alloy.Globals.JSON_DATA_URL_KEY_CATEGORIES ].databaseTable}`;

            try {
                var rows = db.execute( objectSelectStatement );
                while ( rows.isValidRow() ) {
                    var dataObject = {};
                    for ( var i = 0; i < rows.fieldCount; i++ ) {
                        var fieldNameForIndex = rows.fieldName( i );
                        dataObject[ fieldNameForIndex ] = rows.fieldByName( fieldNameForIndex );
                    }

                    SQLiteUtil.parseDataObject( dataObject );
                    var newDataObject = new ObjectModule( dataObject, jsonDataObject );
                    dataObjectArray.push( newDataObject );

                    rows.next();
                }
            } catch ( err ) {
                errorOccurred = true;
                Alloy.Globals.Util.error( `${MODULE_LOGGING_TAG}getDataObjectArrayForJSONObject: error occurred: ${JSON.stringify( err )}` );
                Alloy.Globals.Util.error( `${MODULE_LOGGING_TAG}getDataObjectArrayForJSONObject: no records pulled for statement: ${selectStatement}` );
            } finally {
                if ( _.isObject( db ) ) {
                    db.close();
                }
                return dataObjectArray;
            }
        } else {
            Alloy.Globals.Util.warn( `${MODULE_LOGGING_TAG}getDataObjectForJSONObject: invalid parameters: statement = ${selectStatement}` );
        }
    };

    return self;
}

module.exports = DatabaseUtil;
