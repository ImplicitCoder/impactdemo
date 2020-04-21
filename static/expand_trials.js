ExpandTrialsModule = (function(){

    var amendBlockdata = function(block, groupnr){
        block.block.groupnr = groupnr;

        return block;
    }

    var amendTrialdata = function (block, groupnr){
        var trialCount = block.trials.length;

        //get id data from localstorage
        var idData = ReadStorage.GetValues();
        console.log(idData);

        for (var i = 0; i < trialCount; i++){
            //add block level info
            block.trials[i].task = block.block.task
            block.trials[i].group = groupnr
            //add random iti
            block.trials[i].iti =  block.block.min_iti +
                Math.floor(Math.random()*(block.block.max_iti - block.block.min_iti));

            //replace real id data
            block.trials[i].stimulusExpanded = block.trials[i].stimulus
                .replace('firstNamePlaceholder', idData.realId.firstName)
                .replace('lastNamePlaceholder', idData.realId.lastName)
                .replace('studyPlaceholder', idData.realId.study)
                .replace('birthCountryPlaceholder', idData.realId.country)
                .replace('birthdayPlaceholder', idData.realId.birthMonth + ' ' + idData.realId.birthYear)
                .replace('newFirstNamePlaceholder', idData.newId.firstName)
                .replace('newLastNamePlaceholder', idData.newId.lastName)
                .replace('newStudyPlaceholder', idData.newId.study)
                .replace('newBirthCountryPlaceholder', idData.newId.country)
                .replace('newBirthdayPlaceholder', idData.newId.birthMonth + ' ' + idData.newId.birthYear)

        }
        return block
    }

    var expand = function(block, groupnr){
        block = amendBlockdata(block, groupnr);
        block = amendTrialdata(block, groupnr);
        return block;
    }

    return {
        Expand: expand
    };
})();
