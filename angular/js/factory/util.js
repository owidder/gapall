'use strict';

angular.module(__global.appName).factory("util", function() {

    function isDefined(v) {
        if (typeof(v) === 'undefined') {
            return false;
        }

        return true;
    }

    function isSet(v) {
        return (isDefined(v) && v != null);
    }

    return {
        isDefined: isDefined,
        isSet: isSet
    }
});