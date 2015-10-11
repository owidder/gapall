'use strict';

angular.module(__global.appName).controller("onePicController", function($scope, $route, $location, gapImages) {
    var INDEX_PARAM = "index";

    function reload() {
        $location.search(INDEX_PARAM, "");
        $route.reload();
    }

    gapImages.ready.then(function(data) {
        var index = parseInt($location.search()[INDEX_PARAM]);
        if(!(index > 0)) {
            index = Math.floor(Math.random() * gapImages.count());
            $location.search("index", index);
        }

        $scope.index = index;
        $scope.reload = reload;
    });
});