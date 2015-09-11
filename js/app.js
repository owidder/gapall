'use strict';

(function() {
    var app = angular.module("d3Demo", ["ngRoute"]);
    app.config(function($routeProvider) {
        $routeProvider
            .when("/force", {
                templateUrl: "html/views/componentsView.html",
                controller: "ComponentsController"
            })
            .otherwise({
                redirectTo: '/force'
            });
    });
})();
