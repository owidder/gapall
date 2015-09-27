'use strict';

var Q = require("q");
var fs = require("fs");

var sanitize = require("sanitize-filename");
var LineReader = require("line-by-line");


var gapUtil = require("./util/gapUtil");
var reqUtil = require("./util/reqUtil");
var zero = require("./util/zero");

var ALL_IMAGES_DELIMITER = "_#_";
var ALL_IMAGES_FILENAME = "./allImages.txt";

var allProcessedPaths;

function getPathToFirstPost() {
    var defer = Q.defer();

    reqUtil.readPageDom(gapUtil.urlFromPath("/")).then(function ($) {
        var path = gapUtil.pathToFirstPostOnHomePage($);
        defer.resolve(path);
    });

    return defer.promise;
}

function checkForProcessing(pathToPage) {
    var entry = allProcessedPaths[pathToPage];
    var pathToNextPage;
    if(zero.isDefined(entry)) {
        pathToNextPage = entry.pathToNextPage;
    }

    return pathToNextPage;
}

function saveImageFromPage(pathToPage) {
    var defer = Q.defer();
    var url;

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

    var pathToNextPost = checkForProcessing(pathToPage);
    if(zero.isSet(pathToNextPost)) {
        console.log("entry exists");
        defer.resolve(pathToNextPost);
    }
    else {
        url = gapUtil.urlFromPath(pathToPage);
        reqUtil.readPageDom(url).then(function ($) {
            var src = gapUtil.pathToFirstImageOnPostPage($);
            var title = gapUtil.title($);
            var filename = filenameFromPagePath(pathToPage);
            var filepath = pathToImage(filename);
            pathToNextPost = gapUtil.pathToNextPost($, pathToPage);
            fs.appendFile(ALL_IMAGES_FILENAME, createAllImagesLine([src, filename, title, pathToPage, pathToNextPost]), function () {
                if (fs.existsSync(filepath)) {
                    console.log(filepath + " exists");
                    defer.resolve(pathToNextPost);
                }
                else {
                    reqUtil.readAndSaveImage(gapUtil.createUrlToThumbnail(src), filepath).then(function () {
                        console.log(filepath + " written");
                        defer.resolve(pathToNextPost);
                    });
                }
            });
        });
    }

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

function readAllImagesFile() {
    var defer = Q.defer();

    allProcessedPaths = {};

    var lineReader = new LineReader(ALL_IMAGES_FILENAME);

    lineReader.on("line", function(line) {
        var parts = line.split(ALL_IMAGES_DELIMITER);
        var entry = {
            src: parts[0],
            filename: parts[1],
            title: parts[2],
            pathToPage: parts[3],
            pathToNextPage: parts[4]
        };
        allProcessedPaths[entry.pathToPage] = entry;
    });

    lineReader.on("end", function() {
        defer.resolve();
    });

    return defer.promise;
}

readAllImagesFile().then(function() {
    var pathParam, lastPath;

    if (process.argv.length > 2) {
        pathParam = process.argv[2];
        if(pathParam == "l") {
            lastPath = allProcessedPaths[allProcessedPaths.length - 1];
            saveImagesRecursively(lastPath);
        }
        else {
            saveImagesRecursively(pathParam);
        }
    }
    else {
        getPathToFirstPost().then(function (pathToPage) {
                saveImagesRecursively(pathToPage);
            },
            function (error) {
                console.error(error);
            });
    }
});
