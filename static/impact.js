
// ImplicitMeasures.com iods Priming task
//
// version 1.0 october 2018
//
// Copyright Joris Derese
// joris.derese@implicitmeasures.com

$.wait = function(duration) {
    return $.Deferred(function(def) {
        setTimeout(def.resolve, duration);
    });
};





// converts array of objects with identical keys to matrix:
// first row: Array of keys
// next rows: values for all objects
// TODO Guarantee sorting of values is correct

var DataProcessing = (function(){
    var preProcess = function(inObjArray, taskObj){
        outObjArray = inObjArray

        return outObjArray
    }
    var toMatrix = function(inObjArray, taskObj){
        var header = [
            "taskType",
            "taskname",
            "respondentId",
            "blockNumber",
            "compatibility",
            "trialNumber",
            "timestamp",
            "iti",
            "responseTimeout",
            "leftResponseButton",
            "rightResponseButton",
            "stimulus",
            "color",
            "size",
            "font",
            "cat",
            "requiredResponse",
            "rt1",
            "rt2",
            "keystrokes",
            "firstResponse",
            "firstError" ];

        // read header from first object and write to matrix
        inObjArrayProcessed = preProcess(inObjArray, taskObj)

        matrix = [header];
            for (i=0; i< inObjArray.length; i++) {
                matrix[i + 1]=[];
                for (j=0; j < header.length; j++) {
                    matrix[i + 1][j] = inObjArrayProcessed[i][header[j]];
                }
            }
        return matrix;
    };
    return {
        ToMatrix : toMatrix
    };
})();


var BlockSequence = function(){

    var run = function(taskObject, blockData, blockNumber){
        var sequenceDone = $.Deferred();
        var data = {};
        respObj.userSettings = RespondentSettings.GetSettings();

        DisplayModule.ShowSpinner();

       var dummy = function(){

           DisplayModule.HideSpinner();
           ProgressBar.SetProgress(0);

           type = taskObj.iat_type

           screens = taskObject.blockScreens[ blockNumber]

           console.log('screens')
           if (typeof screens !== 'undefined'){
               return ShowInstructions.Init(
                   document.getElementById("centered_wide_text"),
                   screens,
                   taskObj.intro_skip_button
               )
           } else {
               return $.wait(0);
           }
           }()

            .then(
               function(){
                var ftDelay;

                ProgressBar.SetProgress(0);
                ProgressBar.ShowProgressBar();

                if (taskObj.firstTrialDelay){
                    ftDelay = data.block.firstTrialDelay;
                    console.log("first trial delay found in data");
                } else {
                    ftDelay = 1500;
                }

               return $.wait(ftDelay);
            })

            .then(
               function(){
                return  ImpactModule.RunBlock(taskObject, blockData, blockNumber);
               }, logError)

            //.then(
                    //function(blockResults){
                        //DisplayModule.ShowSpinner();
                        //console.log(blockResults)
                        //console.log(DataProcessing.ToMatrix(blockResults, taskObj).join("\n"));
                        //return SubmitResults.Submit(blockResults, blockNumber, respObj, taskObj);
                    //})
            //.then(
                    //function(result){
                        //DisplayModule.HideSpinner();
                        //if(result.status == 1){
                            //console.log('data succesfully returned to server');
                        //} else {
                            //console.log('no data returned to server');
                            //console.log(result.message);
                        //}
                    //}, logError)

            .then(
                    function(){
                        //DScores.Aggregate(data.trials);
                        console.log("sequencedone resolved");
                        sequenceDone.resolve(data.trials);
                    });
            return sequenceDone.promise();
    };

    return {
        Run : run
    };
}();
// END OF MODULES
// MAIN HERE

var logError = function(){
    console.log("error");
    DisplayModule.HideSpinner;
    ShowInstructions.Clear(
               document.getElementById("centered_wide_text")
    );
    DisplayModule.HideSpinner();
    var connError = ['<div style="text-align: center;"><p>It seems like there is a problem with your internet connection.</p><p>Please check if you are still connected to the internet.</p><p>Press space to proceed.</p></div>']
    return ShowInstructions.Init(document.getElementById("centered_wide_text"), connError, 32);

};
var logSuccess = function(){
    console.log("success");
};

window.onload =  function(){

    DisplayModule.ShowSpinner();
    var blockTrials;

    // fetch trial data
    getTrials = function(){
            console.log('getting trials');
            console.log('joeja1');
            return TransferData.GetBlockData()
             
    }()
    // preload images
    .then(
        function(resp){
            console.log('joeja');
            console.log(resp)
            blocksArray = resp
            console.log('starting preload');
            return PreloadImages.Preload(blocksArray);
        })

    // store trial data and show task level instructions
    //.then(
        //function(resp){
            //console.log('finished preload');
            //DisplayModule.HideSpinner();
            //return ShowInstructions.Init(document.getElementById("centered_wide_text"), taskObj.introScreens, taskObj.intro_skip_button);
        //})

    // run blocks sequentially
    .then(
        function(){
            console.log('finished preload');
            DisplayModule.HideSpinner();
            blockNr=0;

            // chain will be: $.wait(0).then(function(prevRes)...return BlockSequence.Run( block1 ))
            //                         .then(function(prevRes)...return BlockSequence.Run( block2 ))
            //                         .etc...
            //                         chain is in itself a promise we return to the next 'then' block

            var chain = blocksArray.reduce(function(previous, blockObj){ //blockObj is the element of blocksArray
                                                                        //blockObj contains the trials and labels for a block
                console.log(previous)
                return previous.then(function(previousResult){
                    blockNr += 1
                    console.log('starting block nr:', blockNr)
                    return BlockSequence.Run(taskObj,blockObj, blockNr)
                })
            }, $.wait(0))  //initial value for reduce should return promise in order to chain a 'then' to it

            return chain
        })

    .then(
        function(){
            return ShowInstructions.Init(document.getElementById("centered_wide_text"), [taskObj.outro_screen], taskObj.intro_skip_button);
         })

    //.then(
        //function(){
            //return TransferData.GetData("completion", false);
         //})

    .then(function(resp){
            //console.log(resp)
            //if ( resp.complete === "1" ) {
        //var url_addition = taskObj.add_exit_respondent_id ? respObj.respondent_code : ''
        //var complete_exit_url = taskObj.exit_url + url_addition
        console.log('redirecting to ', taskObj.exit_url);
        window.location = taskObj.exit_url;
            //} else {
                //return ShowInstructions.Init(document.getElementById("centered__wide_text"),
                    //["The server has not received the necessary data in order to link to Prolific"], 32);
            //}
         });
};

