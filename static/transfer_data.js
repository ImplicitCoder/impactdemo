var TransferData = (function(){

    var getData = function(filename, isStatic){
        var jqXHR;
        console.log("getting data from : " + filename + " ...");
        if ( isStatic ) {
            jqXHR = $.getJSON(staticRoot + filename);
        } else {
            jqXHR = $.getJSON(filename);
        }
        console.log(jqXHR);
        return jqXHR;
    };

    var getBlockData = function(blocknr){
        return getData('blockdata.json', false)
    };

    return {
        GetData: getData,
        GetBlockData: getBlockData
   };
})();
