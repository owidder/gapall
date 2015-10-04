'use strict';

angular.module(__global.appName).factory("gapImages", function($http, $q, util) {
    var ALL_IMAGES_DELIMITER = "_#_";
    var ALL_IMAGES_URL = "../node/allImages.txt";

    var images;
    var imagesReadPromise;

    function readImages() {
        var deferred = $q.defer();

        function grepDateFromPath(path) {
            var date = "???";

            var regresult = /(\d+\/\d+\/\d+)/.exec(path);

            if(util.isSet(regresult)) {
                date = regresult[1];
            }
            else {
                regresult = /(\d+\/\d+)/.exec(path);
                if(util.isSet(regresult)) {
                    date = regresult[1];
                }
            }

            return date;
        }

        $http.get(ALL_IMAGES_URL).then(function(data) {
            images = [];
            var lines = data.data.split("\n");
            lines.forEach(function(line) {
                var parts = line.split(ALL_IMAGES_DELIMITER);
                var date = grepDateFromPath(parts[3]);

                var post = {
                    src: parts[0],
                    filename: parts[1],
                    title: parts[2],
                    pathToPage: parts[3],
                    pathToNextPage: parts[4],
                    date: date
                };

                images.push(post);
            });

            deferred.resolve();
        });

        imagesReadPromise = deferred.promise;
    }

    function getDateFromIndex(index) {
        return images[index].date;
    }

    function getTitleFromIndex(index) {
        return images[index].title;
    }

    function getImageUrlFromIndex(index) {
        return IMAGE_FOLDER + images[index].filename;
    }

    function getPostPathFromIndex(index) {
        return images[index].pathToPage;
    }

    function shuffle() {
        util.shuffleArray(images);
    }

    function count() {
        return images.length;
    }

    readImages();

    return {
        getDateFromIndex: getDateFromIndex,
        getTitleFromIndex: getTitleFromIndex,
        getImageUrlFromIndex: getImageUrlFromIndex,
        getPostPathFromIndex: getPostPathFromIndex,
        shuffle: shuffle,
        count: count,
        ready: imagesReadPromise
    }
});