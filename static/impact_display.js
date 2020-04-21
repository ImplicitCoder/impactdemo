var DomElements = (function(){
    // module variables: dom elements to be used

    // cache dom elements
    // TODO elements ID's should be passed as param, not hardcoded
    // ID's can be returned together with DOM elements
    var elements = {
        target : document.getElementById("target"),
        attribute : document.getElementById("attribute"),
        probe : document.getElementById("probe"),
        //rightUpperBottom : document.getElementById("right_upper_bottom"),
        //centered_stimulus : document.getElementById("centered_stimulus"),
        helper : document.getElementById("helper"),
        feedback : document.getElementById("feedback"),
        centeredWideText : $("#centered_wide_text"),
        centeredSmallText : $("#centered_small_text"),
        //preload : document.getElementById("preload"),
    };
    // getters
    var getElements = function(){
        return  elements;
    };
    // return elements to outside world
    return {
        GetElements : getElements
    };
})();

var DisplayModule = (function(){
    //
    // module variables
    var elements = DomElements.GetElements();

    var showLabels = function(blockInfo){
        $(elements.leftUpperTop).html('<p>' + blockInfo.leftUpperLabel + ' </p>')
        $(elements.leftUpperTop).css('color', blockInfo.leftUpperColor);
        $(elements.leftUpperTop).addClass(blockInfo.leftUpperSize);
        $(elements.leftUpperTop).addClass(blockInfo.leftUpperFont);
        $(elements.leftUpperTop).show();

        $(elements.leftUpperBottom).html('<p>' + blockInfo.leftLowerLabel + ' </p>')
        $(elements.leftUpperBottom).css('color', blockInfo.leftLowerColor);
        $(elements.leftUpperBottom).addClass(blockInfo.leftLowerSize);
        $(elements.leftUpperBottom).addClass(blockInfo.leftLowerFont);
        $(elements.leftUpperBottom).show();

        $(elements.rightUpperTop).html('<p>' + blockInfo.rightUpperLabel + ' </p>')
        $(elements.rightUpperTop).css('color', blockInfo.rightUpperColor);
        $(elements.rightUpperTop).addClass(blockInfo.rightUpperSize);
        $(elements.rightUpperTop).addClass(blockInfo.rightUpperFont);
        $(elements.rightUpperTop).show();

        $(elements.rightUpperBottom).html('<p>' + blockInfo.rightLowerLabel + ' </p>')
        $(elements.rightUpperBottom).css('color', blockInfo.rightLowerColor);
        $(elements.rightUpperBottom).addClass(blockInfo.rightLowerSize);
        $(elements.rightUpperBottom).addClass(blockInfo.rightLowerFont);
        $(elements.rightUpperBottom).show();
    }

    var hideLabels = function(){
        $(elements.leftUpperTop).hide();
        $(elements.leftUpperBottom).hide();
        $(elements.rightUpperTop).hide();
        $(elements.rightUpperBottom).hide();
        $(elements.leftUpperTop).removeClass();
        $(elements.leftUpperBottom).removeClass();
        $(elements.rightUpperTop).removeClass();
        $(elements.rightUpperBottom).removeClass();
    }

    // display stimulus and return display datetime
    var showTarget = function(taskObj, trialData){
        console.log(taskObj)
        console.log(trialData)
            $(elements.target).empty();
        if (trialData.type === 'img'){
            $('<img />')
                        .attr('src', "" + trialData.stimulus+ "")         // ADD IMAGE PROPERTIES.
                            //.attr('title', title)
                            //.attr('alt', alt)
                            .height('95%')
                        .appendTo($(elements.target))
        } else {
            $(elements.target).css('color', trialData.color);
            $(elements.target).addClass(trialData.size);
            $(elements.target).addClass(trialData.font);
            $(elements.target).append(trialData.stimulus);
        }
            $(elements.target).show();

        return true
    };

    var showAttribute = function(taskObj, trialData){
        console.log(taskObj)
        console.log(trialData)

        return true
    }

    var showAttributeTarget = function(taskObj, trialData){
        showAttribute(taskObj, trialData);
        showTarget(taskObj, trialData);
    };

    var showProbe = function(taskObj, trialData){
        console.log(taskObj)
        console.log(trialData)

        return true
    }

    var hideTarget = function(){
        $(elements.target).removeClass();
        $(elements.target).empty().hide();
    };

    var hideAttribute = function(){
        $(elements.attribute).removeClass();
        $(elements.attribute).empty().hide();
    };

    var hideAttributeTarget = function(){
        hideAttribute();
        hideTarget();
    };

    var hideProbe = function(){
        $(elements.probe).removeClass();
        $(elements.probe).empty().hide();
    };

    var showFeedback = function(feedbackText){
        elements.centeredSmallText.html(feedbackText);
        $(elements.centeredSmallText).show();
    };

    var hideFeedback = function(){
        elements.centeredSmallText.hide();
    };

    // show feedback (eg cross) on wrong response
    var showWrongFeedback = function(feedback){
        $(elements.feedback).empty();
        $(elements.feedback).append('X');
    };
    var hideWrongFeedback = function(){
        $(elements.feedback).empty();
    };
    var showSpinner = function(){
        document.getElementById("centered_small_text").innerHTML = " <div style='text-align: center;'> <img src='" + staticRoot + "images/spinner.gif' /><p>Loading..  </div>";
        elements.centeredSmallText.show();
    };

    var hideSpinner = function(){
        document.getElementById("centered_small_text").innerHTML = "";
        elements.centeredSmallText.hide();
    };

    return {
        ShowAttributeTarget: showAttributeTarget,
        HideAttributeTarget: hideAttributeTarget,
        ShowProbe: showProbe,
        HideProbe: hideProbe,
        ShowWrongFeedback: showWrongFeedback,
        HideWrongFeedback: hideWrongFeedback,
        ShowSpinner: showSpinner,
        HideSpinner: hideSpinner,
        ShowFeedback: showFeedback,
        HideFeedback: hideFeedback
    };
})();
