var Navigation = function( dataObject ) {
    var self = {};

    var KEY_ID = 'id';
    var KEY_CONTEXT = 'context';

    self[ KEY_ID ] = ( !!dataObject && _.isString( dataObject.id ) && !_.isEmpty( dataObject.id ) ) ? dataObject.id : null;

    self[ KEY_CONTEXT ] = ( !!dataObject && _.isObject( dataObject.context ) && !_.isFunction( dataObject.context ) && !_.isArray( dataObject.context ) ) ?
        dataObject.context : {};

    self.getId = function() {
        return self[ KEY_ID ];
    };
    self.getContext = function() {
        return self[ KEY_CONTEXT ];
    };
    self.isValid = function() {
        return !_.isNull( self.getId() );
    };

    return self;
};

module.exports = Navigation;
