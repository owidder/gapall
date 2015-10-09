'use strict';

angular.module(__global.appName).controller("picGridController", function ($scope, $http, $q, $routeParams, gapImages) {
    var IMAGE_FOLDER = "../node/images/";

    var INITIAL_NUMBER_OF_IMAGES = 20;
    var NUMBER_OF_IMAGES_TO_LOAD = 10;

    var indices;

    function init() {
        indices = [];
        for(var i = 0; i < INITIAL_NUMBER_OF_IMAGES; i++) {
            indices.push(i);
        }
    }

    function loadMore() {
        var lastIndex = indices[indices.length - 1];
        if(lastIndex < gapImages.count() - 1) {
            for (var i = 1; i <= NUMBER_OF_IMAGES_TO_LOAD; i++) {
                if(lastIndex + i < gapImages.count()) {
                    indices.push(lastIndex + i);
                }
            }
        }
    }

    var shuffleSwitch;
    var shuffleIcon;

    gapImages.ready.then(function() {
        if($routeParams.shuffle == 1) {
            shuffleSwitch = 0;
            shuffleIcon = "arrow_forward";
            gapImages.shuffle();
        }
        else {
            shuffleSwitch = 1;
            shuffleIcon = "shuffle";
            gapImages.sortByDate();
        }

        init();

        $scope.shuffleSwitch = shuffleSwitch;
        $scope.shuffleIcon = shuffleIcon;

        $scope.indices = indices;
        $scope.loadMore = loadMore;

        $scope.gapImages = gapImages;
    });
});
