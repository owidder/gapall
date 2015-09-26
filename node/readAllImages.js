'use strict';

var Q = require("q");
var fs = require("fs");

var sanitize = require("sanitize-filename");

var gapUtil = require("./util/gapUtil");
var reqUtil = require("./util/reqUtil");
var zero = require("./util/zero");

var ALL_IMAGES_DELIMITER = "_#_";

function getPathToFirstPost() {
    var defer = Q.defer();

    reqUtil.readPageDom(gapUtil.urlFromPath("/")).then(function ($) {
        var path = gapUtil.pathToFirstPostOnHomePage($);
        defer.resolve(path);
    });

    return defer.promise;
}

function saveImageFromPage(pathToPage) {
    var defer = Q.defer();

    function filenameFromPagePath(pathToPage) {
        var filenameBase = sanitize(pathToPage);
        var filename = filenameBase + ".jpeg";
        return filename;
    }

    function pathToImage(filename) {
        return "./images/" + filename;
    }

    function createAllImagesLine(fields) {
        return fields.join(ALL_IMAGES_DELIMITER) + "\n";
    }

    var url = gapUtil.urlFromPath(pathToPage);
    reqUtil.readPageDom(url).then(function ($) {
        var src = gapUtil.pathToFirstImageOnPostPage($);
        var title = gapUtil.title($);
        var filename = filenameFromPagePath(pathToPage);
        var filepath = pathToImage(filename);
        var pathToNextPost = gapUtil.pathToNextPost($);
        if (!fs.existsSync(filepath)) {
            reqUtil.readAndSaveImage(gapUtil.createUrlToThumbnail(src), filepath).then(function () {
                fs.write(allImagesFile, createAllImagesLine([src, filename, title, pathToPage]), function () {
                    defer.resolve(pathToNextPost);
                });
            });
        }
        else {
            defer.resolve(pathToNextPost);
        }
    });

    return defer.promise;
}

function saveImagesRecursively(pathToPage) {
    console.log(pathToPage);
    saveImageFromPage(pathToPage).then(function (pathToNextPage) {
        if (zero.isSet(pathToNextPage)) {
            saveImagesRecursively(pathToNextPage);
        }
        else {
            process.exit(0);
        }
    });
}

var allImagesFile = fs.openSync("./allImages.txt", "w");

if (process.argv.length > 2) {
    saveImagesRecursively(process.argv[2]);
}
else {
    getPathToFirstPost().then(function (pathToPage) {
            saveImagesRecursively(pathToPage);
        },
        function (error) {
            console.error(error);
        });
}

