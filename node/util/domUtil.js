'use strict';

var Q = require("q");
var cheerio = require("cheerio");

function readPageDom(url) {
    var defer = Q.defer();

    var options = {
        url: url,
        headers: {
            "User-Agent": "request"
        }
    };

    request.get(options, function (error, response) {
        var body = response.body;

        if (error) {
            defer.reject(error);
        } else {
            var $ = cheerio.load(body);
            defer.resolve($);
        }
    });

    return defer.promise;
}

module.exports = {
    readPageDom: readPageDom
};