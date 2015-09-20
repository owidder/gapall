'use strict';

angular.module(__global.appName).factory("mathutil", function() {

    function maxOfObjects(list, attributeName) {
        var maxValue = -Number.MAX_VALUE;
        list.forEach(function(el) {
            var currentValue = el[attributeName];
            if(currentValue > maxValue) {
                maxValue = currentValue;
            }
        });

        return maxValue;
    }

    function minOfObjects(list, attributeName) {
        var minValue = Number.MAX_VALUE;
        list.forEach(function(el) {
            var currentValue = el[attributeName];
            if(currentValue < minValue) {
                minValue = currentValue;
            }
        });

        return minValue;
    }

    function transform(current, lower, upper, newLower, newUpper) {
        var norm = (current - lower) / (upper - lower);
        var newCurrent = newLower + (norm * (newUpper - newLower));

        return newCurrent;
    }

    function sortedAttributeArray(listOfObjects, attributeName) {
        var attributeArray = listOfObjects.map(function(element) {
            return element[attributeName];
        });
        return attributeArray.sort();
    }

    return {
        maxOfObjects: maxOfObjects,
        minOfObjects: minOfObjects,
        transform: transform
    }
});

