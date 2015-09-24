'use strict';

var Q = require("q");

var gapUtil = require("./util/gapUtil");
var reqUtil = require("./util/reqUtil");

function getPathToFirstPost() {
    var defer = Q.defer();

    reqUtil.readPageDom(gapUtil.urlFromPath("/")).then(function($) {
        var path = gapUtil.pathToFirstPostOnHomePage($);
        defer.resolve(path);
    });

    return defer.promise;
}

function saveImageFromPage(path) {
    var defer = Q.defer();

    function filenameFromSrc(src) {
        var filenameBase = /\/(\d+)\/$/.exec(src);
        var filename = filenameBase + ".jpeg";
        return filename;
    }

    reqUtil.readPageDom(gapUtil.urlFromPath(path)).then(function($) {
        var src = gapUtil.pathToFirstImageOnPostPage($);
        reqUtil.readImage(gapUtil.createUrlToThumbnail(src)).then(function(data) {
            console.log("img received");
        });
        defer.resolve(src);
    });

    return defer.promise;
}

getPathToFirstPost().then(function (path) {
        saveImageFromPage(path);
    },
    function (error) {
        console.error(error);
    });

