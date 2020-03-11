var Util = require( 'utility/Util' );
Alloy.Globals.Util = new Util();
var DatabaseUtil = require( 'utility/DatabaseUtil' );
Alloy.Globals.DatabaseUtil = new DatabaseUtil();

Alloy.Globals.JSON_DATA_URL_KEY_CHARACTERS  = "characters";
Alloy.Globals.JSON_DATA_URL_KEY_ATTRIBUTES  = "attributes";
Alloy.Globals.JSON_DATA_URL_KEY_LOCATIONS   = "locations";
Alloy.Globals.JSON_DATA_URL_KEY_CHALLENGES  = "challenges";
Alloy.Globals.JSON_DATA_URL_KEY_CATEGORIES  = "categories";

Alloy.Globals.SERVER_BASE_URL = "https://jordanheitkamp19.github.io/Decks/";
Alloy.Globals.DECK_NAME_ORIGINAL = "base";
Alloy.Globals.DEFAULT_DOWNLOADING_DATA_IMAGE = "";
Alloy.Globals.FILE_EXTENSION_JSON = '.json';

Alloy.Globals.JSON_DATA_URLS = {};
Alloy.Globals.JSON_DATA_URLS[ Alloy.Globals.JSON_DATA_URL_KEY_CHARACTERS ] = {
    name: "characters",
    url: "Characters",
    moduleName: "modules/card.js",
    databaseTable: "Characters",
    backgroundColor: Alloy.Globals.COLOR_WHITE,
    textColor: Alloy.Globals.COLOR_BLACK,
    testFileName: 'characters'
};

Alloy.Globals.JSON_DATA_URLS[ Alloy.Globals.JSON_DATA_URL_KEY_ATTRIBUTES ] = {
    name: "attributes",
    url: "Attributes",
    moduleName: "modules/card.js",
    databaseTable: "Attributes",
    backgroundColor: Alloy.Globals.COLOR_BLACK,
    textColor: Alloy.Globals.COLOR_WHITE,
    testFileName: 'attributes'
};

Alloy.Globals.JSON_DATA_URLS[ Alloy.Globals.JSON_DATA_URL_KEY_LOCATIONS ] = {
    name: "locations",
    url: "Locations",
    moduleName: "modules/card.js",
    databaseTable: "Locations",
    backgroundColor: Alloy.Globals.COLOR_BLUE,
    textColor: Alloy.Globals.COLOR_WHITE,
    testFileName: 'locations'
};

Alloy.Globals.JSON_DATA_URLS[ Alloy.Globals.JSON_DATA_URL_KEY_CHALLENGES ] = {
    name: "challenges",
    url: "Challenges",
    moduleName: "modules/card.js",
    databaseTable: "Challenges",
    backgroundColor: Alloy.Globals.COLOR_YELLOW,
    textColor: Alloy.Globals.COLOR_BLACK,
    testFileName: 'challenges'
};

Alloy.Globals.JSON_DATA_URLS[ Alloy.Globals.JSON_DATA_URL_KEY_CATEGORIES ] = {
    name: "categories",
    url: "Categories",
    moduleName: "modules/category.js",
    databaseTable: "Categories",
    testFileName: 'categories'
};

Alloy.Globals.UNIQUE_JSON_DATA_CARD_TABLES = [
    Alloy.Globals.JSON_DATA_URL_KEY_CHARACTERS,
    Alloy.Globals.JSON_DATA_URL_KEY_ATTRIBUTES,
    Alloy.Globals.JSON_DATA_URL_KEY_LOCATIONS,
    Alloy.Globals.JSON_DATA_URL_KEY_CHALLENGES
];

Alloy.Globals.CARD_DATABASE_COLUMNS = "( id, name, deck, color, textColor )";
Alloy.Globals.RECOMMENDATIONS_URL = "recommendations";

Ti.App.addEventListener( 'uncaughtException', function( err ) {
    Alloy.Globals.Util.error( `UNCAUGHT EXCEPTION - ${JSON.stringify( err )}` );
} );

Alloy.Globals.ONE_SECOND_IN_MILLISECONDS = 1000;
Alloy.Globals.NEW_LINE_CHARACTER = "\n";
Alloy.Globals.COLOR_REGEX = new RegExp( /^#([0-9a-fA-F]{6})$/ );

Alloy.Globals.jsonDataKeysLength = 0;
Alloy.Globals.isServerSetup = true;

Alloy.Globals.TEXT_SIZE_SMALL = '20sp';
Alloy.Globals.TEXT_SIZE_MEDIUM = '24sp';
Alloy.Globals.TEXT_SIZE_LARGE = '28sp';

Alloy.Globals.COLOR_BLACK = '#000000';
Alloy.Globals.COLOR_BLUE = '#0000ff';
Alloy.Globals.COLOR_CLEAR = '#00ffffff'
Alloy.Globals.COLOR_CLEAR_DARK_BLUE = '#990000bb';
Alloy.Globals.COLOR_CLEAR_LIGHT_BLUE = '#664444ff';
Alloy.Globals.COLOR_CLEAR_GRAY = '#88777777';
Alloy.Globals.COLOR_CLEAR_WHITE = '#88ffffff';
Alloy.Globals.COLOR_DARK_GRAY = '#444444'
Alloy.Globals.COLOR_GRAY = '#777777';
Alloy.Globals.COLOR_GREEN = '#00ff00';
Alloy.Globals.COLOR_RED = '#cc0000';
Alloy.Globals.COLOR_WHITE = '#ffffff';
Alloy.Globals.COLOR_YELLOW = '#ffff66';

Alloy.Globals.GRADIENT_LIGHT_BLUE_TO_BLUE = {
    type: 'linear',
    startPoint: { x: '35%', y: '0%' },
    endPoint: { x: '70%', y: '100%' },
    colors: [ Alloy.Globals.COLOR_CLEAR_LIGHT_BLUE, Alloy.Globals.COLOR_BLUE ]
};
Alloy.Globals.GRADIENT_BLACK_TO_GRAY = {
    type: 'linear',
    startPoint: { x: '33%', y: '0%' },
    endPoint: { x: '67%', y: '100%' },
    colors: [ Alloy.Globals.COLOR_BLACK, Alloy.Globals.COLOR_GRAY ]
};
Alloy.Globals.GRADIENT_CLEAR_DARK_BLUE_TO_CLEAR_LIGHT_BLUE = {
    type: 'linear',
    startPoint: { x: '0%', y: '0%' },
    endPoint: { x: '100%', y: '100%' },
    colors: [ Alloy.Globals.COLOR_CLEAR_DARK_BLUE, Alloy.Globals.COLOR_CLEAR_LIGHT_BLUE ]
};
Alloy.Globals.GRADIENT_WHITE_TO_CLEAR_WHITE = {
    linear: 'linear',
    startPoint: { x: '33%', y: '100%' },
    endPoint: { x: '67%', y: '0%' },
    colors: [ Alloy.Globals.COLOR_WHITE, Alloy.Globals.COLOR_CLEAR_WHITE ]
};
Alloy.Globals.GRADIENT_BLUE_TO_GRAY = {
    type: 'linear',
    startPoint: { x: '0%', y: '0%' },
    endPoint: { x: '100%', y: '100%' },
    colors: [ Alloy.Globals.COLOR_BLUE, Alloy.Globals.COLOR_GRAY ]
};

Alloy.Globals.PAGE_NAME_INDEX = "index";
Alloy.Globals.PAGE_NAME_SETTINGS = "settings";
Alloy.Globals.PAGE_NAME_PLAY_GAME = "play_game";
Alloy.Globals.PAGE_NAME_JUDGE_GAME = "judge_mode";
Alloy.Globals.PAGE_NAME_RESULTS = "results";
Alloy.Globals.PAGE_NAME_CATEGORIES = "categories";
