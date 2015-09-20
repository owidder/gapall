'use strict';

angular.module(__global.appName).factory("util", function() {
    function isDefined(v) {
        return (typeof(v) !== 'undefined');
    }

    function makeAccessorFunction(attributeName) {
        return function(obj) {
            return obj[attributeName];
        }
    }

    return {
        isDefined: isDefined,
        makeAccessorFunction: makeAccessorFunction
    }
});