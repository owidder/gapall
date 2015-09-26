'use strict';

var Q = require("q");
var fs = require("fs");

var gapUtil = require("./util/gapUtil");
var reqUtil = require("./util/reqUtil");
var zero = require("./util/zero");

var ALL_IMAGES_DELIMITER = "_#_";

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
        var filenameBase = /^.*\/(\d+)\/$/.exec(src)[1];
        var filename = filenameBase + ".jpeg";
        return filename;
    }

    function pathToImage(filename) {
        return "./images/" + filename;
    }

    function createAllImagesLine(fields) {
        return fields.join(ALL_IMAGES_DELIMITER) + "\n";
    }

    var url = gapUtil.urlFromPath(path);
    reqUtil.readPageDom(url).then(function($) {
        var src = gapUtil.pathToFirstImageOnPostPage($);
        var filename = filenameFromSrc(src);
        var filepath = pathToImage(filename);
        reqUtil.readAndSaveImage(gapUtil.createUrlToThumbnail(src), filepath).then(function() {
            var title = gapUtil.title($);
            var pathToNextPost = gapUtil.pathToNextPost($);
            fs.write(allImagesFile, createAllImagesLine([src, filename, title, path]), function() {
                defer.resolve(pathToNextPost);
            });
        });
    });

    return defer.promise;
}

function saveImagesRecursively(path) {
    saveImageFromPage(path).then(function(nextPath) {
        if(zero.isSet(nextPath)) {
            saveImagesRecursively(nextPath);
        }
        else {
            process.exit(0);
        }
    });
}

var allImagesFile = fs.openSync("./allImages.txt", "w");

getPathToFirstPost().then(function (path) {
        saveImagesRecursively(path);
    },
    function (error) {
        console.error(error);
    });
