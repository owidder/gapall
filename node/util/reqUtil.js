'use strict';

var Q = require("q");
var cheerio = require("cheerio");
var request = require("request");

function createReqOptions(url) {
    return {
        url: url,
        headers: {
            "User-Agent": "request"
        }
    };
}

function readImage(url) {
    var defer = Q.defer();

    var options = createReqOptions(url);

    request.get(options, function (error, response) {
        if (error) {
            defer.reject(error);
        } else {
            defer.resolve(response);
        }
    });

    return defer.promise;
}

function readPageDom(url) {
    var defer = Q.defer();

    var options = createReqOptions(url);

    request.get(options, function (error, response) {
        if (error) {
            defer.reject(error);
        } else {
            var body = response.body;
            var $ = cheerio.load(body);
            defer.resolve($);
        }
    });

    return defer.promise;
}

module.exports = {
    readPageDom: readPageDom,
    readImage: readImage
};