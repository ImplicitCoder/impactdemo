var PreloadScreens = (function(){

    var preloadIntros = function(dataObj){
        return TransferData.GetData(dataObj.intro, true);
    };

    var execLoadIntro = function(filename, promise){
        var out = TransferData.GetData(filename, true)
            .then(function(data){
               console.log( "Finished loading intro data for " + filename);
               promise.resolve(data);
            });
    };

    var preloadBlockIntros = function(dataObj, groupNr){
        var promises = [];
        var outArray = [];
        var outObj = {};
        var preloadBlockIntrosDeferred = $.Deferred();
        var introArray = dataObj.contents.intros[groupNr];
        for (var i = 0; i < introArray.length; i++) {
            outObj = execLoadIntro(introArray[i], promises[i] = $.Deferred());
        }
        $.when.apply($, promises).done(function(){
            console.log("block intros loaded!");
            var args = [].slice.call(arguments);
            preloadBlockIntrosDeferred.resolve(args);
        });
        return preloadBlockIntrosDeferred;
    };
    var preloadOutros = function(dataObj){
        return TransferData.GetData(dataObj.outro, true);
    };

    var preloadErrorMessages = function(dataObj){
        return TransferData.GetData(dataObj.errorMessages, true);
    };

    // adapt numbering of blocks if aat first (vpt second)
    // standard is aat second (vpt first)

    var adaptIntros = function(intros){
        var str = intros[0][0];
        str = str.replace(/1ste/, '4de');
        intros[0][0] = str;
        str = intros[1][0];
        str = str.replace(/2/, '5');
        intros[1][0] = str;
        str = intros[2][0];
        str = str.replace(/3de/, '6de en laatste');
        intros[2][0] = str;
        return intros;
    };

    var preload = function(dataObj, groupNr){
        var preloadScreensDeferred = $.Deferred();
        var outObj = dataObj;
        $.when(preloadIntros(dataObj), preloadBlockIntros(dataObj, groupNr), preloadOutros(dataObj), preloadErrorMessages(dataObj))
            .then(function(a, b, c, d){
                outObj.intro = a[0].screens;
                outObj.contents.intros = b;
                //if (aatFirst){
                    //outObj.contents.intros = adaptIntros(outObj.contents.intros);
                //}
                outObj.outro = c[0].screens;
                outObj.errorMessages = d[0];
                preloadScreensDeferred.resolve(outObj);
            },function(){ console.log("Hier gaat het fout");});
        return preloadScreensDeferred.promise();
    };

    return {
        Preload : preload,
        AdaptIntros : adaptIntros
    };
})();
