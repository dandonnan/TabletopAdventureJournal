/** Show the Campaigns tab. */
function showCampaignsTab() {
    hideAllJournalCards();
    deselectAllTabs();
    clearSearchText();

    showElement('journalCampaigns');
    showElement('journalSearch');
    setTabSelected('tabCampaigns', true);

    journalData.LastTab = "Campaign";
    saveToStorage();
}

/** Show the new Campaign popup. */
function showNewCampaignPopup() {
    createNewType = 'CAMPAIGN';
    showNewCreatePopup();
}

/**
 * Create a new Campaign.
 * @param {string} name - The name of the Campaign.
 */
 function createNewCampaign(name) {
    let newCampaign = {
        "Uid": getNextCampaignUid(),
        "Name": name,
        "Filename": getCampaignNameAsFilename(name),
        "Summary": "",
        "Quests": [],
        "Characters": [],
        "Sessions": []
    };
     
    currentJournalData = newCampaign;
     
    journalData.Campaigns.push(newCampaign.Filename);

    currentCampaignIndex = journalData.Campaigns.length - 1;
    journalData.LastCampaign = currentCampaignIndex;
    journalData.LastTab = "Summary";

    currentJournalData.LastQuest = -1;
    currentJournalData.LastCharacter = -1;
    currentJournalData.LastSession = -1;

    currentQuestIndex = -1;
    currentCharacterIndex = -1;
    currentSessionIndex = -1;

    setTextOnInput('txtHeader', name);
    saveToStorage();
}

/**
 * Get the next campaign uid.
 * @returns {number} - The next uid.
 */
function getNextCampaignUid() {
    let uid = 0;

    for (let i = 0; i < journalData.Campaigns.length; i++){
        let campaign = loadCampaignFromStorage(journalData.Campaigns[i]);

        if (uid <= campaign.Uid) {
            uid = campaign.Uid + 1;
        }
    }

    return uid;
}

/** Sets the Campaign Name from the saved data. */
function setCampaignName() {
    setTextOnInput('txtHeader', currentJournalData.Name);
}

/**
 * Gets the Campaign Name from the card.
 * @returns {string} - Gets the Campaign Name from the card.
 */
function getCampaignName() {
    return getTextFromInput('txtHeader');
}

/** Update the Campaign from the card. */
function updateCampaignName() {
    let name = getCampaignName();

    currentJournalData.Name = name;

    saveToStorage();
}

/** Deletes a Campaign. */
function deleteCampaign() {
    journalData.Campaigns.splice(currentCampaignIndex, 1);

    currentCampaignIndex = -1;

    journalData.LastCampaign = -1;

    saveToStorage();
    hideElement('journalCampaigns');

    localStorage.removeItem(storageName + '.' + currentJournalData.Filename);

    currentJournalData = null;

    if (journalData.Campaigns.length <= 0) {
        hideElement('journal');
        showElement('titleNoCampaigns');
    }
    else {
        hideElement('btnPopupViewAllClose');
        showViewAllPopup();
    }
}

/** Display all Campaigns in the view all container. */
function displayAllCampaigns() {
    let html = '';

    let campaigns = journalData.Campaigns;

    if (campaigns.length <= 0) {
        html = 'You haven\'t set up any Campaigns.';
        hideElement('btnViewAllAlphabetical');
    }
    else {
        for (let i = 0; i < campaigns.length; i++){
            let campaign = loadCampaignFromStorage(campaigns[i])

            html += getHtmlForCampaignSearchResult(campaign, i);
        }
    }

    setElementContent('viewAllContainer', html);

    for (let i = 0; i < campaigns.length; i++){
        let campaign = loadCampaignFromStorage(campaigns[i]);
        addClickEventToButton('campaign' + campaign.Uid, loadCampaign);
        addClickEventToButton('moveUp' + i, moveCampaignUp);
        addClickEventToButton('moveDown' + i, moveCampaignDown);
    }
}

/**
 * Reorder Campaigns to be alphabetical.
 * @param {boolean} reverseAlphabetical - Whether to order the list in reverse.
 */
 function reorderCampaignsAlphabetically(reverseAlphabetical) {
    let campaigns = journalData.Campaigns;
    
    let currentCampaignName = journalData.Campaigns[currentCampaignIndex];
    
    campaigns.sort((a, b) => a.localeCompare(b));
    
    if (reverseAlphabetical === true) {
        campaigns.reverse();
    }

    journalData.Campaigns = campaigns;
    
    getReorderedCampaignIndex(currentCampaignName);
}

/**
 * Get and set the index of the Campaign in the reordered list.
 * @param {object} campaignName - The Campaign file name.
 */
 function getReorderedCampaignIndex(campaignName) {
    for (let i = 0; i < journalData.Campaigns.length; i++){
        if (journalData.Campaigns[i] === campaignName) {
            currentCampaignIndex = i;
            break;
        }
    }
}

/**
 * Gets the HTML for a Campaign search result.
 * @param {object} campaign - The Campaign.
 * @param {number} index - The index of the Campaign.
 * @returns {string} - The HTML for a Campaign search result.
 */
function getHtmlForCampaignSearchResult(campaign, index) {
    return getHtmlForSearchResult('campaign', campaign.Uid, campaign.Name, '', index);
}

/**
 * Adds click events to Campaign search results.
 * @param {object} campaigns - A list of Campaigns.
 */
 function addClickEventToCampaignSearchResults(campaigns) {
    for (let i = 0; i < campaigns.length; i++){
        addClickEventToButton('campaign' + campaigns[i].Uid, loadCampaign);
    }
}

/**
 * Loads and displays a Campaign.
 * @param {object} clickEvent - The click event that triggered the load
 */
function loadCampaign(clickEvent) {
    let uid = parseInt(clickEvent.target.parentElement.id.replace('campaign', ''));

    let hasChanged = true;

    let index = -1;

    for (let i = 0; i < journalData.Campaigns.length; i++){
        let campaign = loadCampaignFromStorage(journalData.Campaigns[i]);

        if (campaign.Uid === uid) {
            index = i;
            break;
        }
    }

    if (index !== currentCampaignIndex) {
        hasChanged = false;
    }

    currentCampaignIndex = index;

    currentJournalData = loadCampaignFromStorage(journalData.Campaigns[currentCampaignIndex]);

    journalData.LastCampaign = currentJournalData.Uid;

    setTextOnInput('txtHeader', currentJournalData.Name);

    if (hasChanged === false) {
        currentJournalData.LastQuest = -1;
        currentJournalData.LastCharacter = -1;
        currentJournalData.LastSession = -1;

        currentQuestIndex = -1;
        currentCharacterIndex = -1;
        currentSessionIndex = -1;
    }

    hideElement('popupViewAll');
    showCampaignsTab();
    showElement('btnPopupViewAllClose');
}

/**
 * Move a Campaign up.
 * @param {object} clickEvent - The click event that triggered the move.
 */
 function moveCampaignUp(clickEvent) {
    let index = parseInt(clickEvent.target.id.replace('moveUp', ''));
    
    let currentCampaignName = journalData.Campaigns[currentCampaignIndex];

    let campaign = journalData.Campaigns[index];
    journalData.Campaigns.splice(index, 1);
    journalData.Campaigns.splice(index - 1, 0, campaign);

    showViewAllPopup();
    saveToStorage();
    
    getReorderedCampaignIndex(currentCampaignName);
}

/**
 * Move a Campaign down.
 * @param {object} clickEvent - The click event that triggered the move.
 */
function moveCampaignDown(clickEvent) {
    let index = parseInt(clickEvent.target.id.replace('moveDown', ''));

    let currentCampaignName = journalData.Campaigns[currentCampaignIndex];

    let campaign = journalData.Campaigns[index];
    journalData.Campaigns.splice(index, 1);
    journalData.Campaigns.splice(index + 1, 0, campaign);

    showViewAllPopup();
    saveToStorage();

    getReorderedCampaignIndex(currentCampaignName);
}

/**
 * Search Sessions.
 * @param {string} searchTerm - The search term.
 */
 function searchCampaigns(searchTerm) {
    let matchingCampaigns = [];

    setElementContent('searchContainer', '');
    hideElement('searchContainer');

    searchTerm = searchTerm.toLowerCase();

    let campaigns = journalData.Campaigns;
    
     if (campaigns !== null) {

         for (let i = 0; i < campaigns.length; i++) {
             let campaign = loadCampaignFromStorage(campaigns[i]);

             if (campaign.Name.toLowerCase().indexOf(searchTerm) > -1) {
                 matchingCampaigns.push(campaign);
             }
         }
     }

    if (matchingCampaigns.length <= 0) {
        showElement('searchNoResults');
    }
    else {
        hideElement('searchNoResults');

        let html = '';

        for (let i = 0; i < matchingCampaigns.length; i++){
            html += getHtmlForCampaignSearchResult(matchingCampaigns[i], -1);
        }

        setElementContent('searchContainer', html);

        addClickEventToCampaignSearchResults(matchingCampaigns);

        showElement('searchContainer');
    }
}