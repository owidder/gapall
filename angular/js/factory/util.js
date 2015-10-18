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

    function isNotEmpty(v) {
        return isSet(v) && v.length > 0;
    }

    /**
     * from: http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
     * thanks to: http://stackoverflow.com/users/310500/laurens-holst
     * Randomize array element order in-place.
     * Using Durstenfeld shuffle algorithm.
     */
    function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    function greaterThanZero(v) {
        return isSet(v) && parseInt(v) > 0;
    }

    /**
     * see http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
     * @returns {string}
     */
    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    return {
        isDefined: isDefined,
        isSet: isSet,
        isNotEmpty: isNotEmpty,
        shuffleArray: shuffleArray,
        greaterThanZero: greaterThanZero,
        guid: guid
    }
});