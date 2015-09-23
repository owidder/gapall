'use strict';

var Q = require("q");

var constants = require("./util/constants");
var gapUtil = require("./util/gapUtil");

function getFirstLink() {
    var defer = Q.defer();

    gapUtil.readPageDom("/").then(function($) {
        var link = gapUtil.firstLinkToPostOnHomePage($);
        defer.resolve(link);
    });

    return defer.promise;
}

function saveImageFromPage(page) {
    gapUtil.readPageDom(page).then(function($) {
        var src = gapUtil.firstUrlOfImageOnPostPage($);
    });
}

getFirstLink().then(function (page) {
        console.log(result);
    },
    function (error) {
        console.error(error);
    });

