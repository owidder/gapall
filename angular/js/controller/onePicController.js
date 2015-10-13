'use strict';

angular.module(__global.appName).controller("onePicController", function($scope, $route, $location, gapImages, util) {
    var DATE_PARAM = "date";

    function reload() {
        $location.search(DATE_PARAM, "");
        $route.reload();
    }

    gapImages.ready.then(function(data) {
        var index = 0;
        var date = $location.search()[DATE_PARAM];

        if(util.isSet(date)) {
            index = gapImages.getIndexFromDate(date);
        }
        else {
            index = Math.floor(Math.random() * gapImages.count());
            date = gapImages.getDateFromIndex(index);
            $location.search(DATE_PARAM, date);
        }

        $scope.index = index;
        $scope.reload = reload;
    });
});