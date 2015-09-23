'use strict';

var Q = require("q");

function pathToFirstPostOnHomePage($) {
    return $(".entry-title a").attr("href");
}

function pathToFirstImageOnPostPage($) {
    return $("div.lightbox img").attr("src");
}

module.exports = {
    pathToFirstPostOnHomePage: pathToFirstPostOnHomePage,
    pathToFirstImageOnPostPage: pathToFirstImageOnPostPage
};