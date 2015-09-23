'use strict';

var Q = require("q");

var constants = require("./util/constants");
var gapUtil = require("./util/gapUtil");
var domUtil = require("./util/domUtil");

function getPathToFirstPost() {
    var defer = Q.defer();

    domUtil.readPageDom(constants.HOST).then(function($) {
        var path = gapUtil.pathToFirstPostOnHomePage($);
        defer.resolve(path);
    });

    return defer.promise;
}

function saveImageFromPage(path) {
    var defer = Q.defer();

    domUtil.readPageDom(path).then(function($) {
        var src = gapUtil.pathToFirstImageOnPostPage($);
        defer.resolve(src);
    });

    return defer.promise;
}

getPathToFirstPost().then(function (path) {
        saveImageFromPage(constants.HOST + path);
    },
    function (error) {
        console.error(error);
    });

