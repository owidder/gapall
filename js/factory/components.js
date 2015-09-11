'use strict';

angular.module(__global.appName).factory("components", function ($q, neo4j) {
    var _STANDARD_WHERE_CLAUSE = function(nodeAlias) {
        return nodeAlias + ".bcShortName <> 'TI' and " +
            nodeAlias + ".bcShortName <> '?' ";
    };

    function dependencies() {
        var query = "match (n)-[r {credibility:100}]->(m) where "
            + _STANDARD_WHERE_CLAUSE("n")
            + "and m.bcShortName <> n.bcShortName "
            + "return n.bcShortName, m.bcShortName, count(r)";

        var neoPromise = neo4j.sendQuery(query);
        var deferred = $q.defer();

        neoPromise.then(function (rows) {
            var dependencies = [];
            rows.forEach(function (row) {
                dependencies.push({
                    from: row[0],
                    to: row[1],
                    count: row[2]
                })
            });
            deferred.resolve(dependencies);
        });

        return deferred.promise;
    }

    function names() {
        var query = "match (n) where "
            + _STANDARD_WHERE_CLAUSE("n")
            + "return distinct n.bcShortName";

        var neoPromise = neo4j.sendQuery(query);
        var deferred = $q.defer();

        neoPromise.then(function (rows) {
            var names = [];
            rows.forEach(function (row) {
                names.push(row[0]);
            });
            deferred.resolve(names);
        });

        return deferred.promise;
    }

    return {
        dependencies: dependencies,
        names: names
    };
});