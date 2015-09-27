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

var allImagesFile;
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
    var pathToNextPage;
    var index = allProcessedPaths.indexOf(pathToPage);
    if(index < allProcessedPaths.length - 1) {
        pathToNextPage = allProcessedPaths[index + 1];
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
        defer.resolve(pathToNextPost);
    }
    else {
        url = gapUtil.urlFromPath(pathToPage);
        reqUtil.readPageDom(url).then(function ($) {
            var src = gapUtil.pathToFirstImageOnPostPage($);
            var title = gapUtil.title($);
            var filename = filenameFromPagePath(pathToPage);
            var filepath = pathToImage(filename);
            pathToNextPost = gapUtil.pathToNextPost($);
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

function readAllProcessedPaths() {
    var defer = Q.defer();

    allProcessedPaths = [];

    var lineReader = new LineReader(ALL_IMAGES_FILENAME);

    lineReader.on("line", function(line) {
        var parts = line.split(ALL_IMAGES_DELIMITER);
        var processedPath = parts[parts.length - 1];

        allProcessedPaths.push(processedPath);
    });

    lineReader.on("end", function() {
        defer.resolve();
    });

    return defer.promise;
}

allImagesFile = fs.openSync(ALL_IMAGES_FILENAME, "r+");

readAllProcessedPaths().then(function() {
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
