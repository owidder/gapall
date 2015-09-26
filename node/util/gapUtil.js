'use strict';

var Q = require("q");

var constants = require("./constants");
var zero = require("./zero");

function createUrlToThumbnail(fullUrl) {
    var thumbnailUrl = fullUrl + "?format=1w";
    return thumbnailUrl;
}

function urlFromPath(path) {
    return constants.HOST + path;
}

function pathToFirstPostOnHomePage($) {
    var path = $(".entry-title a").attr("href");
    if(!zero.isSet(path)) {
        console.error("could not find path to first post");
        process.exit(-1);
    }
    return path;
}

function title($) {
    var title = $(".entry-title a").text();
    if(!zero.isSet(title)) {
        console.error("could not find title");
        process.exit(-1);
    }
    return title;
}

function pathToFirstImageOnPostPage($) {
    var path = $("div.lightbox img").attr("src");
    if(!zero.isSet(path)) {
        path = $("img.thumb-image").attr("data-src");
    }
    if(!zero.isSet(path)) {
        path = $("div.sqs-block-content img").attr("src")
    }
    if(!zero.isSet(path)) {
        console.error("could not find path to first image");
        process.exit(-1);
    }
    return path;
}

function pathToNextPost($) {
    var pathToNextPost = $("a.next-item").attr("href");
    if(!zero.isSet(pathToNextPost)) {
        console.error("could not find path to next post");
        process.exit(-1);
    }
    return pathToNextPost;
}

module.exports = {
    pathToFirstPostOnHomePage: pathToFirstPostOnHomePage,
    pathToFirstImageOnPostPage: pathToFirstImageOnPostPage,
    urlFromPath: urlFromPath,
    createUrlToThumbnail: createUrlToThumbnail,
    title: title,
    pathToNextPost: pathToNextPost
};