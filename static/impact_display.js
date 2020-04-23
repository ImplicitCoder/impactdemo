var DomElements = (function(){
    // module variables: dom elements to be used

    // cache dom elements
    // TODO elements ID's should be passed as param, not hardcoded
    // ID's can be returned together with DOM elements
    var elements = {
        target : document.getElementById("target"),
        attribute : document.getElementById("attribute"),
        box: document.getElementById("box"),
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

    // display stimulus and return display datetime
    var showTarget = function(taskObj, trialData){
        console.log(taskObj)
        console.log(trialData)
        console.log($(elements.target))
            $(elements.target).empty();
        if (trialData.type === 'img'){
            $('<img />')
                        .attr('src', "" + trialData.target+ "")         // ADD IMAGE PROPERTIES.
                            //.attr('title', title)
                            //.attr('alt', alt)
                            .height('95%')
                        .appendTo($(elements.target))
        } else {
            $(elements.target).css('color', trialData.color);
            $(elements.target).addClass(trialData.size);
            $(elements.target).addClass(trialData.font);
            $(elements.target).append(trialData.target);
        }
            $(elements.target).show();

        return true
    };

    var showAttribute = function(taskObj, trialData){
            $(elements.attribute).empty();
        if (trialData.type === 'img'){
            $('<img />')
                        .attr('src', "" + trialData.target+ "")         // ADD IMAGE PROPERTIES.
                            //.attr('title', title)
                            //.attr('alt', alt)
                            .height('95%')
                        .appendTo($(elements.attribute))
        } else {
            $(elements.attribute).css('color', trialData.color);
            $(elements.attribute).addClass(trialData.size);
            $(elements.attribute).addClass(trialData.font);
            $(elements.attribute).append(trialData.attribute);
        }
            $(elements.attribute).show();

        return true
    }

    var showAttributeTarget = function(taskObj, trialData){
        showAttribute(taskObj, trialData);
        showTarget(taskObj, trialData);
        $(elements.box).show();
    };

    var showProbe = function(taskObj, trialData){
        console.log("showing probe")
        console.log(trialData.probe)
        $(elements.probe).css('color', trialData.probeColor);
        $(elements.probe).addClass(trialData.probeSize);
        $(elements.probe).addClass(trialData.probeFont);
        $(elements.probe).append(trialData.probe);
        $(elements.probe).show();

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
        $(elements.box).hide();
    };

    var hideProbe = function(){
        $(elements.probe).removeClass();
        $(elements.probe).empty().hide();
    };

    var hideTrial = function(){
        hideAttributeTarget();
        hideProbe();
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
        HideTrial: hideTrial,
        ShowWrongFeedback: showWrongFeedback,
        HideWrongFeedback: hideWrongFeedback,
        ShowSpinner: showSpinner,
        HideSpinner: hideSpinner,
        ShowFeedback: showFeedback,
        HideFeedback: hideFeedback
    };
})();
