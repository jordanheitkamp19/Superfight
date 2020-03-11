var CategoryUtil = function() {
    var self = {};
    var MODULE_LOGGING_TAG = "CategoryUtil.";

    self.PROPERTY_DECKS = "decks";
    self.PROPERTY_PRIMARY = "categoryPrimary";
    self.PROPERTY_SECONDARY = "categorySecondary";

    self.getGradientForCategory = function( categoryObject ) {
        var decks = categoryObject[ self.PROPERTY_DECKS ];
        var decksEnabled = self.getEnabledDecksForCategory( decks );
        console.log( 'Decks enabled: ' + decksEnabled.length );

        var yEndPoint = Math.floor( ( decksEnabled.length / decks.length ) * 100 );
        var gradientObject = {
            type: 'linear',
            startPoint: { x:'0%', y:'0%' },
            endPoint: { x:'100%', y:`${yEndPoint}%` },
            colors: [ categoryObject[ self.PROPERTY_PRIMARY ], Alloy.Globals.COLOR_WHITE ]
        };

        return gradientObject;
    };

    self.getEnabledDecksForCategory = function( deckArray ) {
        var enabledDecks = _.filter( deckArray, function( deckInList ) {
            return Alloy.Globals.Util.getPropertyDeckEnabled( deckInList.name );
        } );

        return enabledDecks;
    };

    return self;
};

module.exports = CategoryUtil;
