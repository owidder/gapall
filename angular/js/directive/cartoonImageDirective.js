'use strict';

angular.module(__global.appName).directive("cartoonImage", function($timeout, gapImages) {
    function link(scope) {

        function setStyle(style, value, unit) {
            $("#img" + scope.index).css(style, value + unit);
        }

        gapImages.ready.then(function() {
            $timeout(function() {
                scope.url = gapImages.getImageUrlFromIndex(scope.index);
                scope.title = gapImages.getTitleFromIndex(scope.index);
                scope.postUrl = gapImages.getPostPathFromIndex(scope.index);
                scope.date = gapImages.getDateFromIndex(scope.index);
                
                setStyle("max-height", scope.maxHeightVh, "vh");
                setStyle("max-width", scope.maxWidthVw, "vw");
            });
        });
    }

    return {
        link: link,
        scope: {
            index: "@",
            maxWidthVw: "@",
            maxHeightVh: "@"
        },
        restrict: "E",
        templateUrl: "html/templates/cartoonImageTemplate.html"
    }
});