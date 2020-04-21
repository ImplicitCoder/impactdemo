
/**
 * Preloades images to the dom
 * @param {array} imgArray
 * @return {deferred} preloadDeferred
 */

var PreloadImages = (function(){

    var preloadDeferred = $.Deferred();
    var promises = [];
    var execLoad = function(url, promise){
        var img = new Image();
        img.onload = function(){
            promise.resolve();
        };
        img.src = url;
        preloadDiv = document.getElementById("preloadDiv");
        preloadDiv.appendChild(img);
    };

  var blockSetToImgArray = function(blockData){ //for stimuli

        var outarray = [];

        for (block in blockData){
            for (var trial in blockData[block].trials){
                if (blockData[block].trials[trial]['type'] === 'img'){
                    outarray.push(blockData[block].trials[trial]['stimulus'])   //TODO remove duplicates
                }
            }
          }

        return outarray;
    };

    var preload = function(blockData){
        imgArray = blockSetToImgArray(blockData);

        for (var i = 0; i < imgArray.length; i++) {
            execLoad(imgArray[i], promises[i] = $.Deferred());
        }

        $.when.apply($, promises).done(function(){
            console.log("preload completed");
            preloadDeferred.resolve();
        });

        return preloadDeferred;
    };

    return {
        Preload : preload
    };

})();
