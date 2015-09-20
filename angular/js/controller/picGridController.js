'use strict';

angular.module(__global.appName).controller("picGridController", function($scope, $http, $q) {
     function getLinkToFirstPost() {
         var deferred = $q.defer();

         var getPromise = $http.get("http://geek-and-poke.com/");
         getPromise.then(function(data) {
             console.log(data);
             deferred.resolve("ready");
         });

         return deferred.promise;
     }

    getLinkToFirstPost().then(function(data) {
        console.log(data);
    });
});