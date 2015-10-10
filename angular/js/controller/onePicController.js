'use strict';

angular.module(__global.appName).controller("onePicController", function($scope, $route, gapImages) {

    function reload() {
        $route.reload();
    }

    gapImages.ready.then(function(data) {
        var index = Math.floor(Math.random() * gapImages.count());
        $scope.url = gapImages.getImageUrlFromIndex(index);
        $scope.title = gapImages.getTitleFromIndex(index);
        $scope.postUrl = gapImages.getPostPathFromIndex(index);
        $scope.date = gapImages.getDateFromIndex(index);
        $scope.reload = reload;
    });
});