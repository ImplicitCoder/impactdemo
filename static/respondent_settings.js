/**
 * get respondent browser and screen settings to be sent back to server
 * requires platform.js see bestiejs on github
 */

var RespondentSettings = (function(){

    var detectDisplaySettings = function(){

        var windowHeight, windowWidth, screenHeight, screenWidth, screenString;

        windowHeight = $(window).height();
        windowWidth = $(window).width();
        screenHeight = screen.height;
        screenWidth = screen.width;

        screenString = "ScreenSize: " + screenWidth + "x" + screenHeight +
                      ", WindowSize: " + windowWidth + "x" + windowHeight;

        return screenString;
    };

    var detectClientSettings = function(){
        return platform.description;
    };

    var getSettings = function(){
        return {
            screenSettings : detectDisplaySettings(),
            clientSettings : detectClientSettings()
        };
    };

    return {
        GetSettings : getSettings,
    };
})();
