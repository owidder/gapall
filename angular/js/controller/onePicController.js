'use strict';

angular.module(__global.appName).controller("onePicController", function(gapUtil) {

    var posts;

    gapUtil.readImages().then(function(data) {
        posts = data;
    });
});