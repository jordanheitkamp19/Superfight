var Recommendation = function( message ) {
    var self = {};

    var KEY_MESSAGE = "msg";

    self[ KEY_MESSAGE ] = ( _.isString( message ) ) ? message : '';

    self.getMessage = function() {
        return self[ KEY_MESSAGE ];
    };

    self.isValidObject = function() {
        return !_.isEmpty( self.getMessage() );
    }

    return self;
};

module.exports = Recommendation;
