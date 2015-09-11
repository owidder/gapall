'use strict';

angular.module(__global.appName).factory("colorutil", function(util) {

    /**
     *
     * @param length 3 - 9
     * @returns {string}
     */
    function colors(length) {
        if(!util.isDefined(length)) {
            length = 9;
        }
        return colorbrewer.Purples[length]
            .concat(colorbrewer.Blues[length])
            .concat(colorbrewer.Greens[length])
            .concat(colorbrewer.Oranges[length])
            .concat(colorbrewer.Reds[length]);
    }

    /**
     *
     * @param domain
     * @param colorLength 3-9 or undefined
     * @returns {*}
     */
    function colorFunction(domain, colorLength) {
        return d3.scale.ordinal().domain(domain).range(colors(colorLength));
    }

    return {
        colors: colors,
        colorFunction: colorFunction
    }
});