// Core priming module
// Input: Trial array
// Output: Results array, gamification scores

var IatModule = (function() {
    // internal state variables declared here (new code)

    var keysDown = {};
    var lastEvent;
    var abortSignal = false;

    // utility methods

    $.wait = function(duration) {
        return $.Deferred(function(def) {
            setTimeout(def.resolve, duration);
        });
    };

    Object.size = function(obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    };

    //  runTrial args: correctKey, wrongKey, feedbackDiv, feedbackTxt
    //                 returns accuracy, correctTime, incorrectTime

    var runTrial = function(taskObj, trialData, trialNumber, blockNumber){
        console.log(trialData)
        var trialResults = trialData;
        var corrTime;
        var trialFinished = false;
        var incorrTime = 0;
        var trialTimeoutTimer;
        var pressTimer;
        var trialFinishedDeferred = $.Deferred();
        var allClear;
        var keyTime;
        var keyCount = 0;
        var measuredKey = 0;
        var firstReactTime;
        var lastReactTime;
        var displayTime;
        var firstError = 0;

        var finishTrial = function(){
            clearTimeout(trialTimeoutTimer);
            DisplayModule.HideTrial();
            DisplayModule.HideFeedback();
            document.onkeydown = null;
            document.onkeyup = null;
            keysDown = {};

            trialResults.keystrokes = keyCount;

            trialResults.respondentId = respObj.respondent_code;
            trialResults.taskname = taskObj.name;

            trialResults.taskType = taskObj.taskType;
            trialResults.leftResponseButton = taskObj.left_response_button;
            trialResults.rightResponseButton = taskObj.right_response_button;
            trialResults.responseTimeout = taskObj.response_timeout;
            console.log(taskObj);


            trialResults.blockNumber = blockNumber;
            trialResults.trialNumber = trialNumber;

            trialResults.timestamp = new Date().getTime();


            if (lastReactTime){
                trialResults.rt1 = Math.round(firstReactTime - displayTime);
                trialResults.rt2 = Math.round(lastReactTime - displayTime);
            } else if (firstReactTime) {
                trialResults.rt1 = Math.round(firstReactTime - displayTime);
                if ( firstError === 0 ) {
                    trialResults.rt2 = 0;
                } else {
                    trialResults.rt2 = taskObj.response_timeout;
                }
            } else {
                trialResults.rt1 = taskObj.response_timeout;
                trialResults.rt2 = taskObj.response_timeout;
            }

            // log error and responses
            trialResults.firstError = firstError;

            if (trialData.isMeasurement === "true" ){
                if ( measuredKey === taskObj.left_response_button ){
                    trialResults.measuredKey = "left";
                } else {
                    trialResults.measuredKey = "right";
                }
            console.log("measurement done: ", trialResults.measuredKey);
            } else {
                trialResults.measuredKey = "";
            }

            if (firstReactTime){
                if (trialResults.firstError === 1){
                    if (trialResults.requiredResponse === "right"){
                        trialResults.firstResponse = "left";
                    } else {
                        trialResults.firstResponse = "right";
                    }
                } else {
                    if (trialResults.requiredResponse === "left"){
                        trialResults.firstResponse = "left";
                    } else {
                        trialResults.firstResponse = "right";
                    }
                }

            } else {
                trialResults.firstResponse = "none";
            }

            trialFinishedDeferred.resolve(trialResults);
        };

        var signalLongPress = function(){
            clearTimeout(trialTimeoutTimer);
            trialFinished = true;
            DisplayModule.HideWrongFeedback();
            DisplayModule.HideTrial();
            DisplayModule.ShowFeedback(taskObj.msg_release_key);
        };

        var tooLateAbort = function(){
            DisplayModule.HideTrial();
            DisplayModule.HideWrongFeedback();
            DisplayModule.ShowFeedback(taskObj.msg_too_slow);
            clearTimeout(pressTimer);
            document.onkeyup = null;
            document.onkeydown = function(event){
                if ( event.keyCode === taskObj.right_response_button ) {
                    if (!event.repeat){
                        var continueButtonTimer = setTimeout(signalLongPress, 3000);
                        document.onkeyup = function(event){
                            if ( event.keyCode === taskObj.right_response_button ) {
                                clearTimeout(continueButtonTimer);
                                clearTimeout(trialTimeoutTimer);
                                DisplayModule.HideFeedback();
                                DisplayModule.HideWrongFeedback();
                                finishTrial();
                            }
                        };
                    }
                }
            };
        };


        // Here starts the main shit

        var correctKey, wrongKey;

        if ( trialData.requiredResponse === 'left' ) {
            correctKey = taskObj.left_response_button;
            wrongKey = taskObj.right_response_button;
        } else   {
            correctKey =  taskObj.right_response_button;
            wrongKey = taskObj.left_response_button;
        }



        // Here starts the show


        console.log('trial shown')
            //.then(function(){
                if (performance.now) {
                    displayTime = performance.now();
                } else {
                    displayTime = new Date().getTime();
                }

                if ( Object.size(keysDown) === 0 ){
                    allClear = true;
                }

                clearTimeout(trialTimeoutTimer);
                trialTimeoutTimer = setTimeout(tooLateAbort, taskObj.response_timeout);

                document.onkeydown = function(event){    /** Listening for keystrokes **/
                    e = event || window.event;
                    var key = e.keyCode ? e.keyCode : e.which;
                    if ( (key === correctKey || key === wrongKey) && allClear && !e.repeat){
                        allClear = false;
                        var keyTime;
                        var responseValue;
                        //
                        //console.log("long press started");
                        pressTimer = setTimeout( signalLongPress, 3000);

                        clearTimeout(trialTimeoutTimer);  //NOTE will be restarted after keyUp
                        //console.log('clear timeout trial timeout');

                        keyCount += 1;

                        // log reaction time

                        if (performance.now) {
                            keyTime = performance.now();
                        } else {
                            keyTime = new Date().getTime();
                        }
                        if (firstReactTime){
                            lastReactTime = keyTime;
                        } else {
                            firstReactTime = keyTime;
                        }

                        if (key === correctKey || trialData.isMeasurement === "true" ){
                            console.log("okl");
                            responseValue=1;
                        } else if (key === wrongKey){responseValue=0;}

                        if (trialData.isMeasurement === "true"){
                            measuredKey = key
                        } else {
                            measuredKey = 0
                        }

                        if (responseValue === 1){  /** Correct answer given **/
                            DisplayModule.HideWrongFeedback();  /** if corrected frow wrong answer **/
                            corrTime = keyTime;

                            if ( keyCount == 1 ){
                                firstError = 0;
                                lastError = 0;
                            } else {
                                lastError = 0;
                            }

                            trialFinished = true;

                            DisplayModule.HideTrial();
                            DisplayModule.HideFeedback();

                        } else {     /** if response is INCORRECT, log it, display cross and wait for second guess **/
                            console.log("wrong");
                            if (keyCount == 1){  /** only log first wrong answer **/
                                incorrTime = keyTime;
                            }

                            firstError = 1;

                            allClear = false; //second guess only possible after release of wrong key

                            DisplayModule.ShowWrongFeedback(taskObj.wrong_feedback);
                        }
                    }
                    // Keep track of pressed keys

                    if (lastEvent && lastEvent.keyCode === event.keyCode){
                    } else {
                        lastEvent = event;
                        if ( [correctKey, wrongKey].indexOf(event.keyCode) > -1){ // only log keycodes in array
                            keysDown[event.keyCode] = true;
                        }
                    }

                };

                document.onkeyup = function(event){ //TODO remove this listener after block execution?

                    //console.log("detected keyup");
                    lastEvent = null;
                    if ( [correctKey, wrongKey].indexOf(event.keyCode) > -1){ // only log keycodes in array
                        delete keysDown[event.keyCode];
                    }
                    var keyString = JSON.stringify(keysDown);
                    //console.log(keyString);

                    clearTimeout(trialTimeoutTimer);
                    trialTimeoutTimer = setTimeout(tooLateAbort, taskObj.response_timeout);

                    if ( Object.size(keysDown) === 0 ){
                        console.log("all keys clear");
                        allClear = true;
                    }

                    if (allClear){
                        DisplayModule.HideFeedback();
                        clearTimeout(pressTimer);
                    }

                    if (trialFinished && Object.size(keysDown) === 0){
                        finishTrial();
                    }
                };
            //})

        return trialFinishedDeferred.promise();
    };


    // main routine here:

    var runBlock = function(taskObj, blockData, blockNumber){
        var trials = blockData.trials
        var count = 0;
        var blockResults = [];
        var blockFinishedDeferred = $.Deferred();

        ProgressBar.SetProgress(0);

        var continueBlock = function(){
            trialNumber = count + 1;
            trialFinishedDeferred = function(){
                //function(taskObj, trials[count], trialNumber, blockNr){
                    return DisplayModule.ShowStimulus(taskObj, trials[count]).then(
                            function(){
                            console.log('returning runtrial')
                            return runTrial(taskObj, trials[count], trialNumber, blockNr);
                        })
                }();

            trialFinishedDeferred.then( function(trialResults){
                console.log('contimue with next trial')
                count++;
                blockResults.push(trialResults);

                if ( count < trials.length && !abortSignal ) {
                    $.wait(trials[count].iti).then(continueBlock); //intertrial interval
                    var progress = count / trials.length;
                    ProgressBar.SetProgress(progress);
                    // log keyup to make sure keybd is clear before next trial
                } else {
                    if ( !abortSignal ) {
                        ProgressBar.SetProgress(1);
                    }
                    abortSignal = false;
                    blockFinishedDeferred.resolve(blockResults);
                }
            });
        };

        continueBlock();

        blockFinishedDeferred.then( function(){
            DisplayModule.HideTrial();
        });

        return blockFinishedDeferred.promise();
    };

    // util to abort block for testing purposes
    var abortBlock = function(){
        abortSignal = true;
    };

    return {
        RunBlock : runBlock, //returns promise for finished block
        AbortBlock: abortBlock,
    };

})();

