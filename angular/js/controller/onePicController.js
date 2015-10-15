'use strict';

angular.module(__global.appName).controller("onePicController", function($scope, $route, $location, $timeout, gapImages, util) {
    var DATE_PARAM = "date";
    var PLAY_PARAM = "play";

    var PLAY_ICON = "play_arrow";
    var STOP_ICON = "stop";

    var PLAY_TITLE = "play";
    var STOP_TITLE = "stop";

    var playPromise;
    var playStopIcon = PLAY_ICON;
    var playStopTitle = PLAY_TITLE;

    function random() {
        $location.search(DATE_PARAM, "");
        $route.reload();
    }

    function playStop() {
        if(playStopIcon == PLAY_ICON) {
            playStopIcon = STOP_ICON;
            playStopTitle = STOP_TITLE;
            play();
        }
        else {
            playStopIcon = PLAY_ICON;
            playStopTitle = PLAY_TITLE;
            stop();
        }
    }

    function play() {
        $location.search(PLAY_PARAM, 1);
        $route.reload();
    }

    function stop() {
        if(util.isSet(playPromise)) {
            $timeout.cancel(playPromise);
        }
        $location.search(PLAY_PARAM, 0);
    }

    gapImages.ready.then(function(data) {
        var index = 0;
        var date = $location.search()[DATE_PARAM];
        var play = $location.search()[PLAY_PARAM];

        if(util.isNotEmpty(date)) {
            index = gapImages.getIndexFromDate(date);
        }
        else {
            index = Math.floor(Math.random() * gapImages.count());
            date = gapImages.getDateFromIndex(index);
            $location.search(DATE_PARAM, date);
        }

        if(play == 1) {
            playPromise = $timeout(function() {
                playPromise = undefined;
                random();
            }, 10000);
        }
        else {
            playStopIcon = "play_arrow";
        }

        $scope.index = index;
        $scope.random = random;
        $scope.playStop = playStop;
        $scope.playStopIcon = playStopIcon;
        $scope.playStopTitle = playStopTitle;
    });
});