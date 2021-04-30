/** Toggle the selections of the export options. */
function toggleExportOptionsSelection(clickEvent) {
    if (clickEvent.target.id === 'chkExportAll') {
        let allSelected = getValueFromCheckbox('chkExportAll');

        if (allSelected === true) {
            setValueOnCheckbox('chkExportQuests', false);
            setValueOnCheckbox('chkExportCharacters', false);
            setValueOnCheckbox('chkExportSessions', false);
        }
    }

    let questSelected = getValueFromCheckbox('chkExportQuests');
    let characterSelected = getValueFromCheckbox('chkExportCharacters');
    let sessionSelected = getValueFromCheckbox('chkExportSessions');

    if (questSelected === false && characterSelected === false && sessionSelected === false) {
        setValueOnCheckbox('chkExportAll', true);
    }
    else {
        setValueOnCheckbox('chkExportAll', false);
    }
}

/** Export the data as JSON. */
function exportAsJson() {
    showElement('txtExportData');

    let dataToExport = '';

    if (getValueFromCheckbox('rdoExportAll') === true) {
        let campaigns = [];

        for (let i = 0; i < journalData.Campaigns.length; i++){
            campaigns.push(getDataToExportForCampaign(loadCampaignFromStorage(journalData.Campaigns[i])));
        }

        let campaignObject = [];

        if (getValueFromCheckbox('chkExportAll') === true) {
            campaignObject.push({
                "Campaigns": campaigns
            });
        }
        else {
            campaignObject = campaigns;
        }

        dataToExport = JSON.stringify(campaignObject, null, ' ');
    }
    else {
        dataToExport = JSON.stringify(getDataToExportForCampaign(currentJournalData), null, ' ');
    }

    setTextOnInput('txtExportData', dataToExport);
}

/** Export the data as text. */
function exportAsText() {
    showElement('txtExportData');

    let dataToExport = [];

    if (getValueFromCheckbox('rdoExportAll') === true) {
        for (let i = 0; i < journalData.Campaigns.length; i++){
            dataToExport.push(getDataToExportForCampaign(loadCampaignFromStorage(journalData.Campaigns[i])));
        }
    }
    else {
        dataToExport.push(getDataToExportForCampaign(currentJournalData));
    }

    setTextOnInput('txtExportData', parseCampaignDataIntoText(dataToExport));
}

/**
 * Gets data to export for a campaign.
 * @param {object} campaign - The campaign.
 * @returns {object} - The data for a campaign.
 */
function getDataToExportForCampaign(campaign) {
    let exportData = {};

    if (getValueFromCheckbox('chkExportAll') === true) {
        let currentCampaign = {
            Name: campaign.Name,
            Summary: campaign.Summary,
            Quests: getQuestsToExport(campaign.Quests),
            Characters: getCharactersToExport(campaign.Characters),
            Sessions: getSessionsToExport(campaign.Sessions)
        };

        exportData = currentCampaign;
    }
    else {
        if (getValueFromCheckbox('chkExportQuests') === true) {
            exportData.Quests = getQuestsToExport(campaign.Quests);
        }

        if (getValueFromCheckbox('chkExportCharacters') === true) {
            exportData.Characters = getCharactersToExport(campaign.Characters);
        }

        if (getValueFromCheckbox('chkExportSessions') === true) {
            exportData.Sessions = getSessionsToExport(campaign.Sessions);
        }
    }

    return exportData;
}

/**
 * Get the Quests to export.
 * @param {Array} quests - A list of Quests to export.
 * @returns 
 */
function getQuestsToExport(quests) {
    let exportQuests = [];

    for (let i = 0; i < quests.length; i++){
        exportQuests.push({
            "Name": quests[i].Name,
            "Completed": quests[i].Completed,
            "Notes": quests[i].Notes,
            "Objective": quests[i].Objective
        });
    }

    return exportQuests;
}

/**
 * Get the Characters to export.
 * @param {Array} characters - A list of Characters to export.
 * @returns {object} - The Characters to export.
 */
function getCharactersToExport(characters) {
    let exportCharacters = [];

    for (let i = 0; i < characters.length; i++){
        exportCharacters.push({
            "Name": characters[i].Name,
            "LastLocation": characters[i].LastLocation,
            "Job": characters[i].Job,
            "Deceased": characters[i].Deceased,
            "PartyMember": characters[i].PartyMember,
            "Notes": characters[i].Notes
        });
    }

    return exportCharacters;
}

/**
 * Get the Sessions to export.
 * @param {Array} sessions - A list of Sessions to export.
 * @returns {object} - The Sessions to export.
 */
function getSessionsToExport(sessions) {
    let exportSessions = [];

    for (let i = 0; i < sessions.length; i++){
        exportSessions.push({
            "Name": sessions[i].Name,
            "Notes": sessions[i].Notes
        })
    }

    return exportSessions;
}

/**
 * Parse the campaign data into text.
 * @param {object} campaignData - The campaign data.
 * @returns {string} - The campaign data as text.
 */
function parseCampaignDataIntoText(campaignData) {

    let text = '';

    let lineSplit = '----------------';

    for (let i = 0; i < campaignData.length; i++){

        if (campaignData[i].Name !== undefined) {
            text += 'Campaign: ' + campaignData[i].Name + '\n\n';
        }

        if (campaignData[i].Summary !== undefined) {
            text += 'Summary\n' + lineSplit + '\n' + campaignData[i].Summary + '\n\n';
        }

        if (campaignData[i].Quests !== undefined && campaignData[i].Quests.length > 0) {
            text += 'Quests\n' + lineSplit + '\n';

            for (let j = 0; j < campaignData[i].Quests.length; j++){
                text += 'Name: ' + campaignData[i].Quests[j].Name + '\nComplete: ' + campaignData[i].Quests[j].Completed + '\nObjective: ' +
                    campaignData[i].Quests[j].Objective + '\nNotes: ' + campaignData[i].Quests[j].Notes + '\n\n\n';
            }

            text += '\n\n';
        }

        if (campaignData[i].Characters !== undefined && campaignData[i].Characters.length > 0) {

            text += 'Characters\n' + lineSplit + '\n';
    
            for (let j = 0; j < campaignData[i].Characters.length; j++){
                let appendage = '';
    
                if (campaignData[i].Characters[j].PartyMember === true) {
                    appendage = '(Party Member) ';
                }
    
                if (campaignData[i].Characters[j].Deceased === true) {
                    appendage += '(Deceased)';
                }
    
                text += 'Name: ' + campaignData[i].Characters[j].Name + appendage + '\nLast Known Location: ' + campaignData[i].Characters[j].LastLocation + 
                    'Job: ' + campaignData[i].Characters[j].Job + '\nNotes: ' + campaignData[i].Characters[j].Notes + '\n\n\n';
            }
    
            text += '\n\n';
        }

        if (campaignData[i].Sessions !== undefined && campaignData[i].Sessions.length > 0) {

            text += 'Sessions\n' + lineSplit + '\n';
    
            for (let j = 0; j < campaignData[i].Sessions.length; j++){
                text += 'Name: ' + campaignData[i].Sessions[j].Name + '\nNotes: ' + campaignData[i].Sessions[j].Notes + '\n\n\n';
            }
        }
    }

    return text;
}