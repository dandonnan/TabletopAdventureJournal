let importErrors = [];

/** Import from text data. */
function importFromData() {
    let text = getTextFromInput('txtImportData');

    showImportMessage('');

    importErrors = [];

    if (text === '') {
        showImportMessage(getLocalisedString('IMPORT_EMPTY'));
    }
    else {
        try {
            console.log(text);
            let result = JSON.parse(text);

            let numberOfCampaigns = journalData.Campaigns.length;

            let campaigns = [];
            let quests = [];
            let characters = [];
            let sessions = [];

            for (let i = 0; i < result.length; i++){
                if (result[i].Campaigns !== undefined) {
                    for (let j = 0; j < result[i].Campaigns.length; j++){
                        campaigns.push(result[i].Campaigns[j]);
                    }
                }

                if (result[i].Campaign !== undefined) {
                    campaigns.push(result[i].Campaign);
                }

                if (result[i].Quests !== undefined) {
                    for (let j = 0; j < result[i].Quests.length; j++){
                        quests.push(result[i].Quests[j]);
                    }
                }

                if (result[i].Characters !== undefined) {
                    for (let j = 0; j < result[i].Characters.length; j++){
                        characters.push(result[i].Characters[j]);
                    }
                }

                if (result[i].Sessions !== undefined) {
                    for (let j = 0; j < result[i].Sessions.length; j++){
                        sessions.push(result[i].Sessions[j]);
                    }
                }
            }

            if (journalData.Campaigns.length > 0) {
                importToCurrentCampaign(quests, characters, sessions);
            }
            else {
                if (quests.length > 0) {
                    addToImportErrorLog(getLocalisedString('IMPORT_QUEST_NO_CAMPAIGN'));
                }

                if (characters.length > 0) {
                    addToImportErrorLog(getLocalisedString('IMPORT_CHARACTER_NO_CAMPAIGN'));
                }

                if (sessions.length > 0) {
                    addToImportErrorLog(getLocalisedString('IMPORT_SESSION_NO_CAMPAIGN'));
                }
            }

            importCampaigns(campaigns);

            if (numberOfCampaigns === 0 && journalData.Campaigns.length > 0) {
                journalData.LastCampaign = 0;
                journalData.LastTab = "Summary";
                currentCampaignIndex = 0;

                currentQuestIndex = -1;
                currentCharacterIndex = -1;
                currentSessionIndex = -1;

                let newCampaign = loadCampaignFromStorage(journalData.Campaigns[0]);

                setTextOnInput('txtHeader', newCampaign.Name);

                currentJournalData = newCampaign;

                hideElement('titleNoCampaigns');
                hideElement('popupImport');
                showElement('journal');
                showSummaryTab();
            }

            if (importErrors.length > 0) {
                let errorMessage = '';

                for (let i = 0; i < importErrors.length; i++){
                    errorMessage += importErrors[i] + ' ';
                }

                showImportMessage(errorMessage);
            }
            else {
                hideElement('popupImport');
            }

            saveToStorage();

        } catch (error) {
            console.log(error);
            showImportMessage(getLocalisedString('IMPORT_INVALID'));
        }
    }
}

/**
 * Import Campaigns.
 * @param {Array} campaigns - The Campaigns to import.
 */
function importCampaigns(campaigns) {
    for (let i = 0; i < campaigns.length; i++){
        if (campaigns[i].Name !== undefined && campaigns[i].Name !== null) {
            let name = getNextAvailableCampaignName(campaigns[i].Name);
            let summary = '';
            let quests = [];
            let characters = [];
            let sessions = [];

            if (campaigns[i].Summary !== undefined && campaigns[i].Sessions !== null) {
                summary = campaigns[i].Summary;
            }

            if (campaigns[i].Quests !== undefined && campaigns[i].Quests !== null) {
                for (let j = 0; j < campaigns[i].Quests.length; j++){
                    if (campaigns[i].Quests[j].Name !== undefined && campaigns[i].Quests[j].Name !== null) {
                        let completed = false;
                        let objective = '';
                        let notes = '';

                        if (campaigns[i].Quests[j].Completed !== undefined && campaigns[i].Quests[j].Completed !== null) {
                            completed = campaigns[i].Quests[j].Completed;
                        }

                        if (campaigns[i].Quests[j].Objective !== undefined && campaigns[i].Quests[j].Objective !== null) {
                            objective = campaigns[i].Quests[j].Objective;
                        }

                        if (campaigns[i].Quests[j].Notes !== undefined && campaigns[i].Quests[j].Notes !== null) {
                            notes = campaigns[i].Quests[j].Notes;
                        }

                        quests.push({
                            "Uid": j + 1,
                            "Name": campaigns[i].Quests[j].Name,
                            "Completed": completed,
                            "Objective": objective,
                            "Notes": notes
                        });
                    }
                    else {
                        addToImportErrorLog(getLocalisedString('IMPORT_QUEST_NO_CAMPAIGN'));
                    }
                }
            }

            if (campaigns[i].Characters !== undefined && campaigns[i].Characters !== null) {
                for (let j = 0; j < campaigns[i].Characters.length; j++){
                    if (campaigns[i].Characters[j].Name !== undefined && campaigns[i].Characters[j].Name !== null) {
                        let deceased = false;
                        let partyMember = false;
                        let lastLocation = '';
                        let job = '';
                        let notes = '';
                        
                        if (campaigns[i].Characters[j].Deceased !== undefined && campaigns[i].Characters[j].Deceased !== null) {
                            deceased = campaigns[i].Characters[j].PartyMember;
                        }

                        if (campaigns[i].Characters[j].PartyMember !== undefined && campaigns[i].Characters[j].PartyMember !== null) {
                            partyMember = campaigns[i].Characters[j].PartyMember;
                        }

                        if (campaigns[i].Characters[j].LastLocation !== undefined && campaigns[i].Characters[j].LastLocation !== null) {
                            lastLocation = campaigns[i].Characters[j].LastLocation;
                        }
                        
                        if (campaigns[i].Characters[j].Job !== undefined && campaigns[i].Characters[j].Job !== null) {
                            job = campaigns[i].Characters[j].Job;
                        }

                        if (campaigns[i].Characters[j].Notes !== undefined && campaigns[i].Characters[j].Notes !== null) {
                            notes = campaigns[i].Characters[j].Notes;
                        }

                        characters.push({
                            "Uid": j + 1,
                            "Name": campaigns[i].Characters[j].Name,
                            "LastLocation": lastLocation,
                            "Job": job,
                            "Deceased": deceased,
                            "PartyMember": partyMember,
                            "Notes": notes
                        });
                    }
                    else {
                        addToImportErrorLog(getLocalisedString('IMPORT_CHARACTER_NO_CAMPAIGN'));
                    }
                }
            }

            if (campaigns[i].Sessions !== undefined && campaigns[i].Sessions !== null) {
                for (let j = 0; j < campaigns[i].Sessions.length; j++){
                    if (campaigns[i].Sessions[j].Name !== undefined && campaigns[i].Sessions[j].Name !== null) {
                        let notes = '';

                        if (campaigns[i].Sessions[j].Notes !== undefined && campaigns[i].Sessions[j].Notes !== null) {
                            notes = campaigns[i].Sessions[j].Notes;
                        }

                        sessions.push({
                            "Uid": j + 1,
                            "Name": campaigns[i].Sessions[j].Name,
                            "Notes": notes
                        });
                    }
                    else {
                        addToImportErrorLog(getLocalisedString('IMPORT_SESSION_NO_CAMPAIGN'));
                    }
                }
            }

            let campaign = {
                "Uid": getNextCampaignUid(),
                "Name": name,
                "Filename": getCampaignNameAsFilename(name),
                "Summary": summary,
                "Quests": quests,
                "Characters": characters,
                "Sessions": sessions,
                "LastQuest": -1,
                "LastCharacter": -1,
                "LastSession": -1
            }

            journalData.Campaigns.push(campaign.Filename);

            saveToStorage();
            saveCampaignToStorage(campaign.Filename, campaign);
        }
        else {
            addToImportErrorLog(getLocalisedString('IMPORT_CAMPAIGN_NO_NAME'));
        }
    }
}

/**
 * Get the next available Campaign name (appending with numbers).
 * @param {string} campaignName - The Campaign name.
 * @returns {string} - The next available Campaign name.
 */
function getNextAvailableCampaignName(campaignName) {
    let nextName = false;

    if (doesCampaignAlreadyExist(campaignName) === true) {
        let counter = 1;

        while (nextName === false) {
            if (doesCampaignAlreadyExist(campaignName + counter) === false) {
                nextName = true;
                campaignName = campaignName + counter;
            }

            counter++;
        }
    }

    return campaignName;    
}

/**
 * Get whether a Campaign with the given name already exists.
 * @param {string} campaignName - The Campaign name.
 * @returns {boolean} - Whether a Campaign with that name already exists.
 */
function doesCampaignAlreadyExist(campaignName) {
    let exists = false;

    for (let i = 0; i < journalData.Campaigns.length; i++){
        if (journalData.Campaigns === getCampaignNameAsFilename(campaignName)) {
            exists = true;
            break;
        }
    }

    return exists;
}

/**
 * Import objects to the current campaign.
 * @param {Array} quests - The Quests.
 * @param {Array} characters - The Characters.
 * @param {Array} sessions - The Sessions.
 */
function importToCurrentCampaign(quests, characters, sessions) {
    for (let i = 0; i < quests.length; i++){
        if (quests[i].Name !== undefined && quests[i].Name !== null) {
            createNewQuestFromImport(quests[i]);
        }
        else {
            addToImportErrorLog(getLocalisedString('IMPORT_QUEST_NO_NAME'));
        }
    }

    for (let i = 0; i < characters.length; i++){
        if (characters[i].Name !== undefined && characters[i].Name !== null) {
            createNewCharacterFromImport(characters[i]);
        }
        else {
            addToImportErrorLog(getLocalisedString('IMPORT_CHARACTER_NO_NAME'));
        }
    }

    for (let i = 0; i < sessions.length; i++){
        if (sessions[i].Name !== undefined && sessions[i].Name !== null) {
            createNewSessionFromImport(sessions[i]);
        }
        else {
            addToImportErrorLog(getLocalisedString('IMPORT_SESSION_NO_NAME'));
        }
    }
}

/**
 * Add an error to the import error log.
 * @param {string} error - The error.
 */
function addToImportErrorLog(error) {
    let errorInLog = false;

    for (let i = 0; i < importErrors.length; i++){
        if (importErrors[i] === error) {
            errorInLog = true;
            break;
        }
    }

    if (errorInLog === false) {
        importErrors.push(error);
    }
}