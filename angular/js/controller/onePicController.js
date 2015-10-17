'use strict';

angular.module(__global.appName).controller("onePicController", function($scope, $route, $location, $timeout, gapImages, util) {
    var DATE_PARAM = "date";
    var PLAY_PARAM = "play";
    var DURATION_PARAM = "duration";

    var DURATION_CHECK_INTERVAL = 1000;
    var DURATION_FACTOR = 1000;
    var START_DURATION = 30;

    var PLAY_ICON = "play_arrow";
    var STOP_ICON = "stop";

    var PLAY_TITLE = "play";
    var STOP_TITLE = "stop";

    var MODE_PLAY = "play";
    var MODE_STOP = "stop";

    var playStopIcon = PLAY_ICON;
    var playStopTitle = PLAY_TITLE;

    function getMode() {
        var play = $location.search()[PLAY_PARAM];
        if(util.greaterThanZero(play)) {
            return MODE_PLAY;
        }
        else {
            return MODE_STOP;
        }
    }

    function hasDurationChanged() {
        var paramDuration = $location.search()[DURATION_PARAM];
        if($scope.duration > 0 && paramDuration > 0 &&  $scope.duration != paramDuration) {
            setDurationTimer();
            $location.search(DURATION_PARAM, $scope.duration * DURATION_FACTOR);
        }
    }

    function setDurationTimer() {
        $timeout(hasDurationChanged, DURATION_CHECK_INTERVAL);
    }

    function random() {
        $location.search(DATE_PARAM, "");
    }

    function nextInPlay() {
        var play = $location.search()[PLAY_PARAM];
        if(play == 1) {
            setPlayTimer();
            random();
        }
    }

    function playStop() {
        if(playStopIcon == PLAY_ICON) {
            play();
        }
        else {
            stop();
        }
    }

    function setPlayTimer() {
        $timeout(function() {
            nextInPlay();
        }, 30000);
    }

    function play() {
        setPlayTimer();
        $location.search(PLAY_PARAM, 1);
    }

    function stop() {
        $location.search(PLAY_PARAM, 0);
    }

    gapImages.ready.then(function(data) {
        var index = 0;
        var date = $location.search()[DATE_PARAM];
        var play = $location.search()[PLAY_PARAM];
        var paramDuration = $location.search()[DURATION_PARAM];

        if(util.isNotEmpty(date)) {
            index = gapImages.getIndexFromDate(date);
        }
        else {
            index = Math.floor(Math.random() * gapImages.count());
            date = gapImages.getDateFromIndex(index);
            $location.search(DATE_PARAM, date);
        }

        if(util.greaterThanZero(play)) {
            playStopIcon = STOP_ICON;
            playStopTitle = STOP_TITLE;
        }
        else {
            playStopIcon = PLAY_ICON;
            playStopTitle = PLAY_TITLE;
        }

        if(util.greaterThanZero(paramDuration)) {
            $scope.duration = paramDuration;
        }
        else {
            $scope.duration = START_DURATION;
        }

        $scope.index = index;
        $scope.random = random;
        $scope.playStop = playStop;
        $scope.playStopIcon = playStopIcon;
        $scope.playStopTitle = playStopTitle;
        $scope.getMode = getMode;
    });
});