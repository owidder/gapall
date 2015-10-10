'use strict';

angular.module(__global.appName).directive("cartoonImage", function($timeout, gapImages, util) {
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

                if(util.isSet(scope.maxHeightVh)) {
                    setStyle("max-height", scope.maxHeightVh, "vh");
                }
                else {
                    setStyle("max-height", 100, "%");
                }

                if(util.isSet(scope.maxWidthVw)) {
                    setStyle("max-width", scope.maxWidthVw, "vw");
                }
                else {
                    setStyle("max-width", 100, "%");
                }
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