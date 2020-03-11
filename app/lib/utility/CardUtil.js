var CardUtil = function() {
    var self = {};

    var MODULE_LOGGING_TAG = "CardUtil.";

    self.generateRandomIdInRangeOfTable = function( tableName ) {
        var entriesInTable = Alloy.Globals.DatabaseUtil.getIdsInTable( tableName );
        var randomId = 0;

        if ( entriesInTable.length > 0 ) {
            while ( randomId == 0 ) {
                randomId = Math.floor( Math.random() * entriesInTable.length );
            }
        } else {
            Alloy.Globals.Util.warn( `${MODULE_LOGGING_TAG}generateRandomNumberInRangeOfTable ${tableName} is empty.` );
        }

        return randomId;
    };

    return self;
};

module.exports = CardUtil;
