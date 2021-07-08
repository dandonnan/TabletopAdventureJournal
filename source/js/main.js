
const storageName = 'journal.tbt';
const currentVersion = 0.731;

const defaultColour = '#c53131';
const defaultColourHighlight = '#731d1d';

let journalData = null;
let currentJournalData = null;

let currentCampaignIndex = -1;
let currentQuestIndex = -1;
let currentCharacterIndex = -1;
let currentSessionIndex = -1;

let createNewType = '';

/** Load the app. */
function appLoad() {
    setupLocalisation();

    loadFromStorage();

    if (journalData.Campaigns.length === 0) {
        showElement('titleNoCampaigns');
    }
    else {
        setFromLastAppState();
    }

    setColoursOnElements();

    setupEvents();
}

/** Set the app up from the last saved state. */
function setFromLastAppState() {

    if (journalData.LastCampaign < 0) {
        journalData.LastCampaign = 0;
    }

    for (let i = 0; i < journalData.Campaigns.length; i++){
        let campaign = loadCampaignFromStorage(journalData.Campaigns[i]);

        if (campaign.Uid === journalData.LastCampaign) {
            currentCampaignIndex = i;
            break;
        }
    }

    currentJournalData = loadCampaignFromStorage(journalData.Campaigns[currentCampaignIndex]);

    currentJournalData = null;

    if (currentJournalData === null) {
        if (journalData.Campaigns.length > 0) {
            currentJournalData = loadCampaignFromStorage(journalData.Campaigns[0]);

            if (currentJournalData !== null) {
                journalData.LastCampaign = currentJournalData.Uid;
            }
        }
    }

    if (currentJournalData !== null) {

        if (currentJournalData.Characters !== null) {
            for (let i = 0; i < currentJournalData.Characters.length; i++) {
                if (currentJournalData.Characters[i].Uid === currentJournalData.LastCharacter) {
                    currentCharacterIndex = i;
                    break;
                }
            }
        }
        else {
            currentJournalData.LastCharacter = -1;
        }

        if (currentJournalData.Quests !== null) {
            for (let i = 0; i < currentJournalData.Quests.length; i++) {
                if (currentJournalData.Quests[i].Uid === currentJournalData.LastQuest) {
                    currentQuestIndex = i;
                    break;
                }
            }
        }
        else {
            currentJournalData.LastQuest = -1;
        }

        if (currentJournalData.Sessions !== null) {
            for (let i = 0; i < currentJournalData.Sessions.length; i++) {
                if (currentJournalData.Sessions[i].Uid === currentJournalData.LastSession) {
                    currentSessionIndex = i;
                    break;
                }
            }
        }
        else {
            currentJournalData.LastSession = -1;
        }
    }

    showElement('journal');
    setTextOnInput('txtHeader', currentJournalData.Name);

    switch (journalData.LastTab) {
        case 'Summary':
            showSummaryTab();
            setSummary();
            break;
        
        case 'Quest':
            showQuestTab();

            if (currentJournalData.LastQuest > -1) {
                setQuest();
                showElement('journalQuest');
            }
            break;
        
        case 'Character':
            showCharacterTab();

            if (currentJournalData.LastCharacter > -1) {
                setCharacter();
                showElement('journalCharacter');
            }
            break;
        
        case 'Session':
            showSessionTab();

            if (currentJournalData.LastSession > -1) {
                setSession();
                showElement('journalSession');
            }
            break;
        
        case 'Campaign':
            showCampaignsTab();
            showElement('journalCampaigns');
            break;
        
        case 'About':
            showAboutTab();
            showElement('journalAbout');
            break;
    }
}

/** Load data from storage. */
function loadFromStorage() {
    let storage = localStorage.getItem(storageName);

    if (storage === null) {
        journalData = getNewJournalData();
    }
    else {
        let savedData = JSON.parse(storage);

        if (savedData.Version === undefined) {
            savedData = upgradeDataFromSingleToSplitFiles(savedData);
        }
        else if (savedData.Version < currentVersion) {
            if (savedData.Version < 0.73) {
                savedData.AlwaysViewAll = false;
            }

            if (savedData.Version < 0.71) {
                savedData.LastCampaign = -1;
                upgradeQuestsWithInProgressAndFailedStates(savedData);
            }

            savedData.Version = currentVersion;
            showUpdatedPopup();
        }

        if (savedData.CustomColour === undefined) {
            savedData.CustomColour = defaultColour;
            savedData.CustomColourHighlighted = defaultColourHighlight;
        }
        
        journalData = savedData;
    }
}

/**
 * Load a campaign from storage based on its file name.
 * @param {string} filename - The file name.
 */
function loadCampaignFromStorage(filename) {
    let campaign = null;

    let storage = localStorage.getItem(storageName + '.' + filename);

    if (storage !== null) {
        campaign = JSON.parse(storage);
    }

    return campaign;
}

/** Save data to storage. */
function saveToStorage() {
    localStorage.setItem(storageName, JSON.stringify(journalData));

    if (currentJournalData !== undefined && currentJournalData !== null) {
        saveCampaignToStorage(currentJournalData.Filename, currentJournalData);
    }
}

/**
 * Save a campaign to storage
 * @param {string} filename - The filename.
 * @param {object} data - The data.
 */
function saveCampaignToStorage(filename, data) {
    localStorage.setItem(storageName + '.' + filename, JSON.stringify(data));
}

/**
 * Upgrade data from a single file to be split into multiple campaign files.
 * @param {object} data - The single file data.
 * @returns {object} - The upgraded data.
 */
function upgradeDataFromSingleToSplitFiles(data) {
    let campaignNames = [];

    for (let i = 0; i < data.Campaigns.length; i++){
        let campaign = data.Campaigns[i];

        if (data.LastCampaign === i) {
            campaign.LastQuest = data.LastQuest;
            campaign.LastCharacter = data.LastCharacter;
            campaign.LastSession = data.LastSession;
        }
        else {
            campaign.LastQuest = -1;
            campaign.LastCharacter = -1;
            campaign.LastSession = - 1;
        }

        campaign.Filename = getCampaignNameAsFilename(campaign.Name);
        saveCampaignToStorage(campaign.Filename, campaign);

        campaignNames.push(campaign.Filename);
    }

    data.Campaigns = campaignNames;
    data.Version = currentVersion;

    upgradeQuestsWithInProgressAndFailedStates(data);

    return data;
}

/**
 * Upgrade data so Quests have In Progress and Failed states.
 * @param {object} savedData - The data.
 */
function upgradeQuestsWithInProgressAndFailedStates(savedData) {
    for (let i = 0; i < savedData.Campaigns.length; i++){
        let campaign = loadCampaignFromStorage(savedData.Campaigns[i]);

        for (let j = 0; j < campaign.Quests.length; j++){
            campaign.Quests[j].InProgress = false;
            campaign.Quests[j].Failed = false;
        }

        saveCampaignToStorage(campaign.Filename, campaign);
    }
}

/**
 * Get the campaign name as a file name.
 * @param {string} text - The string.
 * @returns {string} - The string as a filename.
 */
function getCampaignNameAsFilename(text) {
    let invalidCharacters = [' ', '!', '"', '£', '$', '%', '^', '&', '*', '=', '|',
        '\\', ',', '<', '>', ',', '?', '/', ':', ';', '@', '\'', '#', '~',
        '[', ']', '{', '}'];

    return removeCharactersFromString(text, invalidCharacters).toLowerCase();
}

/**
 * Removes a character from a string.
 * @param {string} text - The base string.
 * @param {string} character - The character to remove.
 * @returns {string} - The string without the character.
 */
function removeCharacterFromString(text, character) {
    while (text.indexOf(character) > -1) {
        text = text.replace(character, '');
    }

    return text;
}

/**
 * Removes characters from a string.
 * @param {string} text - The base string.
 * @param {Array} characters - A list of characters to remove.
 * @returns {string} - The string without the characters.
 */
function removeCharactersFromString(text, characters) {
    for (let i = 0; i < characters.length; i++){
        text = removeCharacterFromString(text, characters[i]);
    }

    return text;
}

/**
* Gets a new journal data object.
* @returns {object} - A journal data object.
*/
function getNewJournalData() {
    return {
        LastCampaign: -1,
        LastTab: "Summary",
        Version: currentVersion,
        CustomColour: defaultColour,
        CustomColourHighlighted: defaultColourHighlight,
        AlwaysViewAll: false,
        Campaigns: []
    }
}

/** Event when the add button is clicked. */
function addButtonClick() {
    switch (journalData.LastTab) {
        case 'Quest':
            createNewType = 'QUEST';
            showNewCreatePopup();
            break;
        
        case 'Character':
            createNewType = 'CHARACTER';
            showNewCreatePopup();
            break;
        
        case 'Session':
            createNewType = 'SESSION';
            showNewCreatePopup();
            break;
        
        case 'Campaign':
            createNewType = 'CAMPAIGN';
            showNewCreatePopup();
            break;
    }
}

/** Create a new object from the new object popup. */
function createNewObject() {
    let name = getTextFromInput('txtPopupNew');

    if (name !== '') {
        switch (createNewType) {
            case 'CAMPAIGN':
                showElement('journal');
                createNewCampaign(name);
                showSummaryTab();
                break;
            
            case 'QUEST':
                createNewQuest(name);
                break;
            
            case 'CHARACTER':
                createNewCharacter(name);
                break;
            
            case 'SESSION':
                createNewSession(name);
                break;
        }

        createNewType = '';

        hideElement('titleNoCampaigns');
        hideElement('popupNew');
    }
}

/** Deletes the current object. */
function deleteCurrentObject() {
    
    switch (journalData.LastTab) {        
        case 'Quest':
            if (currentQuestIndex > -1) {
                deleteQuest();
            }
            break;
        
        case 'Character':
            if (currentCharacterIndex > -1) {
                deleteCharacter();
            }
            break;
        
        case 'Session':            
            if (currentSessionIndex > -1) {
                let sessionName = currentJournalData.Sessions[currentSessionIndex].Name;

                showDeletePopup(getLocalisedString('SESSION_DELETE'), getLocalisedStringWithParameter('SESSION_DELETE_CONFIRM', sessionName));
            }
            break;
        
        case 'Campaign':
            let campaignName = currentJournalData.Name;
            
            showDeletePopup(getLocalisedString('CAMPAIGN_DELETE'), getLocalisedStringWithParameter('CAMPAIGN_DELETE_CONFIRM', campaignName));
            break;
    }
}

/** Confirm that an object should be deleted. */
function confirmDelete() {
    switch (journalData.LastTab) {        
        case 'Quest':
            if (currentQuestIndex > -1) {
                deleteQuest();
            }
            break;
        
        case 'Character':
            if (currentCharacterIndex > -1) {
                deleteCharacter();
            }
            break;
        
        case 'Session':
            if (currentSessionIndex > -1) {
                hideDeletePopup();
                deleteSession();
            }
            break;
        
        case 'Campaign':
            hideDeletePopup();
            deleteCampaign();
            break;
    }
}

/** Sets the Summary card from the saved data. */
function setSummary() {
    setTextOnInput('txtSummaryNotes', currentJournalData.Summary);
}

/**
 * Gets the Summary from the card.
 * @returns {string} - Gets the summary from the card.
 */
function getSummary() {
    return getTextFromInput('txtSummaryNotes');
}

/** Updates the Summary from the card. */
function updateSummary() {
    let summary = getSummary();

    currentJournalData.Summary = summary;

    saveToStorage();
}

/**
 * Get the next uid in a list.
 * @param {object} objectList - A list of objects.
 * @returns {number} - The next uid.
 */
function getNextUid(objectList) {
    let uid = 1;

    if (objectList.length > 0) {
        for (let i = 0; i < objectList.length; i++) {
            if (objectList[i].Uid !== undefined && parseInt(objectList[i].Uid) >= uid) {
                uid = parseInt(objectList[i].Uid) + 1;
            }
        }
    }

    return uid;
}

/** Search. */
function search() {
    let searchTerm = getTextFromInput('txtSearch');

    if (searchTerm.length > 0) {
        showElement('popupSearch');

        if (searchTerm.length < 3) {
            showElement('searchMoreCharacters');
            hideElement('searchContainer');
            hideElement('searchNoResults');
        }
        else {
            hideElement('searchMoreCharacters');

            switch (journalData.LastTab) {                
                case 'Quest':
                    searchQuests(searchTerm);
                    break;
                
                case 'Character':
                    searchCharacters(searchTerm);
                    break;
                
                case 'Session':
                    searchSessions(searchTerm);
                    break;
                
                case 'Campaign':
                    searchCampaigns(searchTerm);
                    break;
            }
        }
    }
    else {
        hideSearchPopup();
    }
}

/**
 * Get the search term without any queries.
 * @param {string} searchTerm - The search term.
 * @returns {string} - The search term without the query.
 */
function getSearchTermWithoutQuery(searchTerm) {
    if (searchTerm.indexOf('&') > -1) {
        searchTerm = searchTerm.substr(0, searchTerm.indexOf('&'));
    }

    return searchTerm;
}

/**
 * Get a list of queries used in a search.
 * @param {string} searchTerm - The search term.
 * @returns {Array} - A list of queries used in the search.
 */
function getSearchQueries(searchTerm) {
    let queries = [];

    if (searchTerm.indexOf('&') > -1) {
        while (searchTerm.indexOf('&') > -1) {
            let index = searchTerm.indexOf('&');

            searchTerm = searchTerm.substr(index + 1);

            index = searchTerm.indexOf('&');

            if (index > -1) {
                let query = searchTerm.substr(0, index);

                queries.push(query);

                searchTerm = searchTerm.substr(index);
            }
            else {
                queries.push(searchTerm);
            }
        }
    }

    return queries;
}

/** Order the contents of the View All popup alphabetically. */
function orderViewAllAlphabetically() {
    let reverse = false;

    if (document.getElementById('btnViewAllAlphabetical').innerText === getLocalisedString('FILTER_ALPHABETICAL')) {
        setElementContent('btnViewAllAlphabetical', getLocalisedString('FILTER_ALPHABETICAL_REVERSE'));
    }
    else {
        reverse = true;
        setElementContent('btnViewAllAlphabetical', getLocalisedString('FILTER_ALPHABETICAL'));
    }

    switch (journalData.LastTab) {
        case 'Quest':
            reorderQuestsAlphabetically(reverse);
            break;
        
        case 'Character':
            reorderCharactersAlphabetically(reverse);
            break;
        
        case 'Session':
            reorderSessionsAlphabetically(reverse);
            break;
        
        case 'Campaign':
            reorderCampaignsAlphabetically(reverse);
            break;
    }

    showViewAllPopup();

    saveToStorage();
}

/** Toggles the view all automatically setting. */
function toggleViewAllAutomatically() {
    journalData.AlwaysViewAll = getValueFromCheckbox('chkViewAllAutomatically');

    saveToStorage();
}

// Load the app
appLoad();