'use strict';

var fs = require("fs");
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

function readAndSaveImage(url, filename) {
    var defer = Q.defer();

    var options = createReqOptions(url);

    var req = request(url);
    req.on("response", function(response) {
        var stream = fs.createWriteStream(filename);
        response.on("data", function(chunk) {
            stream.write(chunk);
        }).on("end", function() {
            stream.end();
            defer.resolve(filename + " saved");
        })
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
    readImage: readImage,
    readAndSaveImage: readAndSaveImage
};