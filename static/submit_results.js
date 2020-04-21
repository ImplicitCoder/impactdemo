$.wait = function(duration) {
    return $.Deferred(function(def) {
        setTimeout(def.resolve, duration);
    });
};

var SubmitResults = (function(){
    var TIMEOUT_UNIT = 3000 //milisec

    var submit = function(blockResults, blockNumber, respObj, taskObj){
        console.log("sending  to server...");
        console.log("for user " + respObj.respondent_code);
        var data_matrix = DataProcessing.ToMatrix(blockResults, taskObj);
        var dataObj = { csrfmiddlewaretoken : csrfToken,
            respondent_id: JSON.stringify(respObj.respondent_code),
            userscreen : JSON.stringify(respObj.userSettings.screenSettings),
            useros : JSON.stringify(respObj.userSettings.clientSettings),
            blocknumber: blockNumber,
            block: JSON.stringify(taskObj),
            trials: JSON.stringify(data_matrix),
        }
        var submittedDeferred = $.Deferred()
        var jqXHR = $.ajax({
            type : "POST",
            url : "submitResults",
            tryCount: 0,
            retryLimit: 7,
            data : dataObj,
            success: function(data, textStatus, jqXHR){
                if (parseInt(data.status) === 1){
                    submittedDeferred.resolve(data);
                } else {
                    submittedDeferred.reject();
                }
            },
            error: function(data, textStatus, jqXHR){
                this.tryCount++;
                var that = this;
                if (this.tryCount <= this.retryLimit) {
                    $.wait(TIMEOUT_UNIT*this.tryCount).then(function(){//try again
                        console.log('try again', that.tryCount)
                        $.ajax(that);
                    });
                    return;
                }
                console.log('last retry failed')
                submittedDeferred.reject();
            }
        });
        return submittedDeferred
    }

    return {
        Submit: submit, //should return promise?? YES
        //SubmitDScores: submitDScores
    };

})();
