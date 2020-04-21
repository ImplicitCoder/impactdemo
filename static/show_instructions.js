/**
 * Show instructions when Init is called
 * @param {div} Div where instructions should be displayed
 * @param {int} Key the user has to press to skip to nxt screen
 * @param {array} array that contain the instructions in html
 */

var ShowInstructions = (function(){

    var displayText = function(instrDiv, instrContents, j){
        $(instrDiv).empty();
        $(instrDiv).show();
        $(instrDiv).append(instrContents[j]);
    };

    var init = function( instrDiv, instrContents, skipKey){
        var deferred = $.Deferred();
        var i = 0;
        if ( instrContents[0] ) {

            displayText(instrDiv, instrContents, 0);

            document.onkeyup = function(event){    /** Listening for keystrokes **/
                e = event || window.event;
                var key = e.keyCode ? e.keyCode : e.which;

                if (key === skipKey){
                    i++;
                    if (i < instrContents.length){
                        displayText(instrDiv, instrContents, i);
                    } else {
                        document.onkeyup = null;
                        $(instrDiv).empty();
                        $(instrDiv).css("display", "none");

                        deferred.resolve();
                    }
                }

            };
        } else {
            $("#intro_text").css("display", "none");
            deferred.resolve();
        }
        return deferred.promise();
    };

    var clear = function(instrDiv){
        document.onkeyup = null;
        $(instrDiv).empty();
        $(instrDiv).css("display", "none");
    };

    return {
        Init : init,
        Clear: clear
    };
})();
