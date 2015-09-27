'use strict';

var Q = require("q");

var constants = require("./constants");
var zero = require("./zero");

function createDownloadUrlForImage(url) {
    var downloadUrl = url + "?format=200w";
    return downloadUrl;
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

var pathToNextPostExemptions = [
    {
        from: "/geekandpoke/2008/7/17/the-history-of-the-telephone-part-1.html",
        to: "/geekandpoke/2008/7/16/spooky-twitter.html"
    }
];

function checkForPathToNextPostExemption(currentPath) {
    var thePathToNextPost;

    pathToNextPostExemptions.forEach(function(exemption) {
        if(currentPath == exemption.from) {
            thePathToNextPost = exemption.to;
        }
    });

    return thePathToNextPost;
}

function pathToNextPost($, currentPath) {
    var thePathToNextPost = checkForPathToNextPostExemption(currentPath);

    if(!zero.isSet(thePathToNextPost)) {
        thePathToNextPost = $("a.next-item").attr("href");
        if(!zero.isSet(thePathToNextPost)) {
            console.error("could not find path to next post");
            process.exit(-1);
        }
    }

    return thePathToNextPost;
}

module.exports = {
    pathToFirstPostOnHomePage: pathToFirstPostOnHomePage,
    pathToFirstImageOnPostPage: pathToFirstImageOnPostPage,
    urlFromPath: urlFromPath,
    createUrlToThumbnail: createDownloadUrlForImage,
    title: title,
    pathToNextPost: pathToNextPost
};