/**
 * Displays a progress bar
 */

var ProgressBar = (function(){
    function setProgress(progress) {
        var getProgressWrapWidth = $('.progress-wrap').width();
        var progressTotal = progress * getProgressWrapWidth;
        $('.progress-bar').css( 'left', progressTotal);
    }
    function showProgressBar() {
        $('.progress-wrap').show();
    }
    function hideProgressBar() {
        $('.progress-wrap').hide();
    }

    return {
        ShowProgressBar : showProgressBar,
        HideProgressBar : hideProgressBar,
        SetProgress : setProgress
    };
})();
