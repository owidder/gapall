'use strict';

(function () {
    var app = angular.module(__global.appName, ["ngRoute", "infinite-scroll"]);
    app.config(function ($routeProvider) {
        $routeProvider
            .when("/picgrid", {
                templateUrl: "html/views/picGridView.html",
                controller: "picGridController"
            })
            .otherwise({
                redirectTo: "/picgrid"
            });
    });
})();
