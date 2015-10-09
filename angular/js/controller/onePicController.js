'use strict';

angular.module(__global.appName).controller("onePicController", function($scope, gapImages) {

    gapImages.ready.then(function(data) {
        var index = Math.floor(Math.random() * gapImages.count);
        $scope.url = gapImages.getImageUrlFromIndex(index);
        $scope.title = gapImages.getTitleFromIndex(index);
    });
});