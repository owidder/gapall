'use strict';

var request = require("request");
var Q = require("q");

var constants = require("./util/constants");

function firstLinkToPostOnHomePage($) {
    return $(".entry-title a").attr("href");
}

function firstUrlOfImageOnPostPage($) {
    return $("div.lightbox image").attr("src");
}

module.exports = {
    firstLinkToPostOnHomePage: firstLinkToPostOnHomePage,
    firstUrlOfImageOnPostPage: firstUrlOfImageOnPostPage
};