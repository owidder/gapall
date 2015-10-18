'use strict';

angular.module(__global.appName).factory("gapImages", function($http, $q, util) {
    var IMAGE_FOLDER = "../node/images/";
    var ALL_IMAGES_DELIMITER = "_#_";
    var ALL_IMAGES_URL = "../node/allImages.txt";

    var images;
    var dateToIndexMap;
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
            dateToIndexMap = {};
            var lines = data.data.split("\n");
            var index = 0;
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
                    dateToIndexMap[date] = index++;
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

    function getIndexFromDate(date) {
        return dateToIndexMap[date] ;
    }

    function shuffle() {
        util.shuffleArray(images);
    }

    function sortByDate() {
        function dateToNumber(date) {
            var dateParts = date.split("/");
            var year = parseInt(dateParts[0]);
            var month = parseInt(dateParts[1]);
            var day = parseInt(dateParts[2]);

            var number = (year*10000) + (month*100) + day;

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
        getIndexFromDate:getIndexFromDate,
        shuffle: shuffle,
        sortByDate: sortByDate,
        count: count,
        ready: imagesReadPromise
    }
});