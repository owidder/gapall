'use strict';

(function () {
    var app = angular.module(__global.appName, ["ngRoute", "infinite-scroll"]);
    app.config(function ($routeProvider) {
        $routeProvider
            .when("/picgrid", {
                templateUrl: "html/views/picGridView.html",
                controller: "picGridController"
            })
            .when("/onepic", {
                templateUrl: "html/views/onePicView.html",
                controller: "onePicController"
            })
            .otherwise({
                redirectTo: "/picgrid"
            });
    });
})();
