'use strict';

var Q = require("q");

var constants = require("./constants");

function createUrlToThumbnail(fullUrl) {
    var thumbnailUrl = fullUrl + "?format=1w";
    return thumbnailUrl;
}

function urlFromPath(path) {
    return constants.HOST + path;
}

function pathToFirstPostOnHomePage($) {
    var path = $(".entry-title a").attr("href");
    return path;
}

function pathToFirstImageOnPostPage($) {
    var path = $("div.lightbox img").attr("src");
    return path;
}

module.exports = {
    pathToFirstPostOnHomePage: pathToFirstPostOnHomePage,
    pathToFirstImageOnPostPage: pathToFirstImageOnPostPage,
    urlFromPath: urlFromPath,
    createUrlToThumbnail: createUrlToThumbnail
};