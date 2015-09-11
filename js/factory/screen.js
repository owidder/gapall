'use strict';

angular.module(__global.appName).factory("screen", function() {
    function width() {
        return $(window).width();
    }

    function height() {
        return $(window).height();
    }
    return {
        width: width,
        height: height
    }
});
