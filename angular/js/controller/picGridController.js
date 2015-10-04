'use strict';

angular.module(__global.appName).controller("picGridController", function ($scope, $http, $q, $routeParams, util) {
    var ALL_IMAGES_DELIMITER = "_#_";
    var ALL_IMAGES_URL = "../node/allImages.txt";
    var IMAGE_FOLDER = "../node/images/";

    var INITIAL_NUMBER_OF_IMAGES = 20;
    var NUMBER_OF_IMAGES_TO_LOAD = 10;

    var posts;
    var indices;

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
            posts = [];
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

                posts.push(post);
            });

            deferred.resolve();
        });

        return deferred.promise;
    }

    function getDateFromIndex(index) {
        return posts[index].date;
    }

    function getTitleFromIndex(index) {
        return posts[index].title;
    }

    function getImageUrlFromIndex(index) {
        return IMAGE_FOLDER + posts[index].filename;
    }

    function getPostPathFromIndex(index) {
        return posts[index].pathToPage;
    }

    function init() {
        indices = [];
        for(var i = 0; i < INITIAL_NUMBER_OF_IMAGES; i++) {
            indices.push(i);
        }
    }

    function loadMore() {
        var lastIndex = indices[indices.length - 1];
        if(lastIndex < posts.length - 1) {
            for (var i = 1; i <= NUMBER_OF_IMAGES_TO_LOAD; i++) {
                if(lastIndex + i < posts.length) {
                    indices.push(lastIndex + i);
                }
            }
        }
    }

    var shuffleSwitch = 1;
    var shuffleIcon = "shuffle";

    readImages().then(function() {
        if($routeParams.shuffle == 1) {
            shuffleSwitch = 0;
            shuffleIcon = "arrow_forward";
            util.shuffleArray(posts);
        }

        init();

        $scope.shuffleSwitch = shuffleSwitch;
        $scope.shuffleIcon = shuffleIcon;

        $scope.indices = indices;
        $scope.loadMore = loadMore;

        $scope.getImageUrlFromIndex = getImageUrlFromIndex;
        $scope.getPostPathFromIndex = getPostPathFromIndex;
        $scope.getTitleFromIndex = getTitleFromIndex;
        $scope.getDateFromIndex = getDateFromIndex;
    });
});
