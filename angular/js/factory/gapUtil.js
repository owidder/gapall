'use strict';

angular.module(__global.appName).factory("gapUtil", function($http, $q, util) {
    var ALL_IMAGES_DELIMITER = "_#_";
    var ALL_IMAGES_URL = "../node/allImages.txt";

    function readImages() {
        var deferred = $q.defer();

        function grepDateFromPath(path) {
            var date = "???";

            var regresult = /(\d+\/\d+\/\d+)/.exec(path);

            if(util.isSet(regresult)) {
                date = regresult[1];
            }
            else {
                regresult = /(\d+\/\d+)/.exec(path);
                if(util.isSet(regresult)) {
                    date = regresult[1];
                }
            }

            return date;
        }

        $http.get(ALL_IMAGES_URL).then(function(data) {
            var posts = [];
            var lines = data.data.split("\n");
            lines.forEach(function(line) {
                var parts = line.split(ALL_IMAGES_DELIMITER);
                var date = grepDateFromPath(parts[3]);

                var post = {
                    src: parts[0],
                    filename: parts[1],
                    title: parts[2],
                    pathToPage: parts[3],
                    pathToNextPage: parts[4],
                    date: date
                };

                posts.push(post);
            });

            deferred.resolve(posts);
        });

        return deferred.promise;
    }

    return {
        readImages: readImages
    }
});