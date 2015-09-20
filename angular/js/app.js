'use strict';

(function () {
    var app = angular.module(__global.appName, ["ngRoute"]);
    app.config(function ($routeProvider) {
        $routeProvider
            .when("/force", {
                templateUrl: "html/views/componentsView.html",
                controller: "ComponentsController"
            })
            .when("/picgrid", {
                templateUrl: "html/views/picGridView.html",
                controller: "picGridController"
            })
            .otherwise({
                redirectTo: "/picgrid"
            });
    });
})();
