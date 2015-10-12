/*
 * Pull down my stories
 * */
var _s = require('underscore.string');
var _ = require('underscore');
var print = require('../core/print');
var colors = require('colors/safe');
var getIssues = require('../util/issues');
var meQueryOrSearch = require('../util/me-query-or-search');
var api = require('../core/api');

module.exports = function() {
    getIssues(meQueryOrSearch.apply(this, _.toArray(arguments))).then(function(issues) {
        var rows = [];
        _.each(issues, function(issue) {
            rows.push(
                [
                    issue.key,
                    issue.typeColored(),
                    issue.assignee(),
                    colors.green(issue.summary()),
                    issue.status()
                ]);
        });
        print.table([ 'ID', 'Type', 'Assignee', 'Summary', 'Status' ], rows, {
            thin: true,
            colors: ['blue']
        });
    }, function(error) {
        print.log('Failed to make request', error);
        throw error;
    });
};

module.exports.moduleDescription = 'Lists your stories based on your defaultMeStatuses setting. Run init to set this.';