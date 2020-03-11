//SQLiteUtil.js
exports.getEscapedString = function( stringToEscape ) {
    var escapedString = stringToEscape
        .replace( /&/g, "&amp;" )
        .replace( /[$]/g, "&dollar;")
        .replace( /\r?\n/g, "&#10;" )
        .replace( /'/g, "&#39;" )
        .replace( /\\/g, "&#92;" )
        .replace( /"/g, "&quot;" )
        .replace( /[$]/g, "&dollar;");

    return escapedString;
}

exports.getUnescapedString = function( stringToUnescape ) {
    var unescapedString = stringToUnescape
        .replace( /&#10;/g, "?" )
        .replace( /&#39;/g, "'" )
        .replace( /&#92;/g, "\\" )
        .replace( /&quot;/g, '"')
        .replace( /&dollar;/g, "$" )
        .replace( /&amp;/g, "&" );

    return unescapedString;
}

exports.parseDataObject = function( dataObject ) {
    if ( _.isObject( dataObject ) ) {
        _.each( _.keys( dataObject ), function( keyInList ) {
            var keyValue = dataObject[ keyInList ];

            if ( _.isString( keyValue ) ) {
                var newKeyValue;

                newKeyValue = exports.getUnescapedString( keyValue );

                if ( keyInList == 'decks' ) {
                    newKeyValue = JSON.parse( newKeyValue );
                }

                if ( ( keyValue == 'true' || keyValue == 'false' ) ) {
                    newKeyValue = ( keyValue == 'true' );
                }

                dataObject[ keyInList ] = newKeyValue;
            }
        } );
    }
};

module.exports = exports;
