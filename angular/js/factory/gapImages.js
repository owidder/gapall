'use strict';

angular.module(__global.appName).factory("gapImages", function($http, $q, util) {
    var IMAGE_FOLDER = "../node/images/";
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
                else {
                    console.log("?: " + path);
                }
            }

            return date;
        }

        $http.get(ALL_IMAGES_URL).then(function(data) {
            images = [];
            var lines = data.data.split("\n");
            lines.forEach(function(line) {
                if(line.length > 5) {
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
                }
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
        var url = IMAGE_FOLDER + images[index].filename;
        return url;
    }

    function getPostPathFromIndex(index) {
        return images[index].pathToPage;
    }

    function shuffle() {
        util.shuffleArray(images);
    }

    function sortByDate() {
        function dateToNumber(date) {
            var dateParts = date.split("/");
            var year = dateParts[0];
            var month = dateParts[1];
            var day = dateParts[2];

            var number = (year*1000) + (month*20) + day;

            return number;
        }

        images.sort(function (a, b) {
            var numA = dateToNumber(a.date);
            var numB = dateToNumber(b.date);
            if(numA < numB) {
                return 1;
            }
            else if(numA > numB) {
                return -1;
            }
            else {
                return 0;
            }
        });
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
        sortByDate: sortByDate,
        count: count,
        ready: imagesReadPromise
    }
});