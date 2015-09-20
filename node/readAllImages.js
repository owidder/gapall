'use strict';

var request = require("request");
var Q = require("q");

function getFirstLink() {
    var defer = Q.defer();

    var options = {
        url: "http://geek-and-poke.com",
        headers: {
            "User-Agent": "request"
        }
    };

    request.get(options, function(error, response) {
        if(error) {
            console.log(error);
        } else {
            defer.resolve(response.body);
        }
    });

    return defer.promise;
}

getFirstLink().then(function(result) {
   console.log(result);
});

