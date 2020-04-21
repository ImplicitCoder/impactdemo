/*
 * load the data that describe a task
 */

var TaskData = (function(){
    var load = function(file){
        console.log("getting task data..", file);
        var jqXHR = $.getJSON(staticRoot + file);
        return jqXHR;
    };
    // return to outside world
    return {
        Load : load
   };
})();
