'use strict';

angular.module(__global.appName).controller("picGridController", function ($scope, $http, $q) {
    var ALL_IMAGES_DELIMITER = "_#_";
    var ALL_IMAGES_URL = "../node/allImages.txt";
    var IMAGE_FOLDER = "../node/images/";

    var posts;

    function readImages() {
        var deferred = $q.defer();

        $http.get(ALL_IMAGES_URL).then(function(data) {
            posts = [];
            var lines = data.data.split("\n");
            lines.forEach(function(line) {
                var parts = line.split(ALL_IMAGES_DELIMITER);
                var post = {
                    src: parts[0],
                    filename: parts[1],
                    title: parts[2],
                    pathToPage: parts[3],
                    pathToNextPage: parts[4]
                };

                posts.push(post);
            });

            deferred.resolve();
        });

        return deferred.promise;
    }

    function getImageUrlFromIndex(index) {
        return IMAGE_FOLDER + posts[index].filename;
    }

    function getPostPathFromIndex(index) {
        return posts[index].pathToPage;
    }

    readImages().then(function() {
        $scope.images = [];
        for(var i = 0; i < 50; i++) {
            $scope.images.push(i);
        }
        $scope.loadMore = function () {
            var last = $scope.images[$scope.images.length - 1];
            if(last < posts.length - 1) {
                for (var i = 1; i <= 8; i++) {
                    if(last + i < posts.length) {
                        $scope.images.push(last + i);
                    }
                }
            }
        };

        $scope.getImageUrlFromIndex = getImageUrlFromIndex;
        $scope.getPostPathFromIndex = getPostPathFromIndex;
    });
});
