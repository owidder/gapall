'use strict';

angular.module(__global.appName).factory("neo4j", function($http, $q, util) {
    function sendQuery(query, params) {
        var jsonUrl;
        var deferred = $q.defer();

        if(query.indexOf("(m)") > 0) {
            jsonUrl = "./restMock/dependencies.json";
        }
        else {
            jsonUrl = "./restMock/names.json"
        }

        var httpPromise = $http.get(jsonUrl);
        httpPromise.then(function(result) {
            deferred.resolve(result.data.data);
        });

        return deferred.promise;
    }

    return {
        sendQuery: sendQuery
    }
});