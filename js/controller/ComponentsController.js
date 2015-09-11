'use strict';

angular.module(__global.appName).controller("ComponentsController", function($scope, $q, screen, components) {

    function getData() {
        var deferred = $q.defer();
        var componentData = {};

        $scope.loading = true;

        var namesPromise = components.names();
        var dependenciesPromise = components.dependencies();

        dependenciesPromise.then(function (rows) {
            componentData.dependencies = rows;
        });

        namesPromise.then(function (rows) {
            componentData.names = rows;
        });

        $q.all([dependenciesPromise, namesPromise]).then(function () {
            $scope.loading = false;

            deferred.resolve(componentData);
        });

        return deferred.promise;
    }

    var dataReadyPromise = getData();
    $scope.dataReadyPromise = dataReadyPromise;
    $scope.width = screen.width();
    $scope.height = screen.height() - 200;
});
