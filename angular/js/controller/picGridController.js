'use strict';

angular.module(__global.appName).controller("picGridController", function ($scope, $http, $q, $routeParams, gapUtil, util) {
    var IMAGE_FOLDER = "../node/images/";

    var INITIAL_NUMBER_OF_IMAGES = 20;
    var NUMBER_OF_IMAGES_TO_LOAD = 10;

    var posts;
    var indices;

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

    gapUtil.readImages().then(function(data) {
        posts = data;

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
