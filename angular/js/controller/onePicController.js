'use strict';

angular.module(__global.appName).controller("onePicController", function($scope, $route, gapImages) {

    function reload() {
        $route.reload();
    }

    gapImages.ready.then(function(data) {
        var index = Math.floor(Math.random() * gapImages.count());

        $scope.index = index;
        $scope.reload = reload;
    });
});