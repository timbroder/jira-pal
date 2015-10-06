var fs = require('fs');
var _ = require('underscore');
var _s = require('underscore.string');
var print = require('./core/print');
var settings = require('./data/settings');
var api = require('./core/api');
var commands = require('./core/commands');

// default command is help, and avoids index out of bounds errors
var command = process.argv.length > 2 ? process.argv[2] : settings.defaultCommand;

if (!commands[command]) {
    print.fail(_s.sprintf('Command "%s" not found.', command));
    command = 'help';
}

/*
* Create arguments for commands excluding
* node and the script call
* */
var args = {
    length: process.argv.length - 3
};
for (var i = 3; i < process.argv.length; i++) {
    args[i - 3] = process.argv[i];
}

var runCommand = function() {
    commands[command](args);
};

/*
* Update login with credentials
* */
var updateApi = function(credentials) {
    /*
     * Logged in. Now execute the command they requested
     *
     * Always update the http client with the current credentials
     * */
    api.init(credentials);
    runCommand();
};

// commands can specify to not require login (MUST specify false though)
if (commands[command].requiresLogin !== false) {
    /*
     * Check to see if the credentials module exists, if not
     * create it.
     * */
    if (!fs.existsSync(settings.credentialsFileLocation)) {
        commands.logout();
    }

    var creds = require(settings.credentialsFileLocation.replace(/\.js$/, ''));

    if (creds === null) {
        commands.login().then(function(newCreds) {
            updateApi(newCreds);
        }, _.noop);
    } else {
        updateApi(creds);
    }
} else {
    runCommand();
}
