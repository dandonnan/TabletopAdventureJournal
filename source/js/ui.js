/** Hide all Journal cards. */
function hideAllJournalCards() {
    hideElement('journalSummary');
    hideElement('journalSearch');
    hideElement('journalQuest');
    hideElement('journalCharacter');
    hideElement('journalSession');
    hideElement('journalCampaigns');
    hideElement('journalAbout');
}

/** Deselect all tabs. */
function deselectAllTabs() {
    setTabSelected('tabSummary', false);
    setTabSelected('tabQuest', false);
    setTabSelected('tabCharacters', false);
    setTabSelected('tabSessions', false);
    setTabSelected('tabCampaigns', false);
    setTabSelected('tabAbout', false);
}

/**
 * Set a tab to be selected.
 * @param {string} elementName - The name of the element.
 * @param {boolean} selected - Whether the tab is selected.
 */
 function setTabSelected(elementName, selected) {

    if (selected === true) {
        if (document.getElementById(elementName).classList.contains('selected') === false) {
            document.getElementById(elementName).classList.add('selected');
        }
    }
    else {
        if (document.getElementById(elementName).classList.contains('selected') === true) {
            document.getElementById(elementName).classList.remove('selected');
        }
    }
}

/**
 * Add a click event to a button.
 * @param {string} buttonName - The name of the button to add the event to.
 * @param {function} clickEvent - The event to trigger when the button is clicked.
 */
function addClickEventToButton(buttonName, clickEvent) {
    document.getElementById(buttonName).addEventListener('click', clickEvent);
}

/**
 * Add a blur event to an input.
 * @param {string} inputName - The name of the input to add the event to.
 * @param {function} blurEvent - The event to trigger when the input is blurred.
 */
function addOnBlurEventToInput(inputName, blurEvent) {
    document.getElementById(inputName).addEventListener('blur', blurEvent);
}

/**
 * Add a key up event to an input.
 * @param {string} inputName - The name of the input to add the event to.
 * @param {function} changeEvent - The event to trigger when a key is released.
 */
function addOnKeyUpEventToInput(inputName, changeEvent) {
    document.getElementById(inputName).addEventListener('keyup', changeEvent);
}

/**
 * Add an event to an element.
 * @param {string} eventName - The name of the event.
 * @param {string} elementName - The name of the element to add the event to.
 * @param {function} eventToTrigger - The event to trigger.
 */
function addEventToElement(eventName, elementName, eventToTrigger) {
    document.getElementById(elementName).addEventListener(eventName, eventToTrigger);
}

/**
 * Show an element.
 * @param {string} elementName - The name of the element to show.
 */
function showElement(elementName) {
    if (document.getElementById(elementName).classList.contains('hidden') === true) {
        document.getElementById(elementName).classList.remove('hidden');
    }
}

/**
 * Hide an element.
 * @param {string} elementName - The name of the element to hide.
 */
function hideElement(elementName) {
    if (document.getElementById(elementName).classList.contains('hidden') === false) {
        document.getElementById(elementName).classList.add('hidden');
    }
}

/**
 * Sets content inside an element.
 * @param {string} elementName - The name of the element.
 * @param {object} content - The HTML content to set in the element.
 */
function setElementContent(elementName, content) {
    clearElementContent(elementName);

    let dom = new DOMParser().parseFromString(content, 'text/html').body;

    while (dom.hasChildNodes()) {
        document.getElementById(elementName).appendChild(dom.firstChild);
    }
}

/**
 * Clears all content inside an element.
 * @param {string} elementName - The name of the element.
 */
function clearElementContent(elementName) {
    let element = document.getElementById(elementName);

    while (element.hasChildNodes()) {
        element.removeChild(element.lastChild);
    }
}

/**
 * Sets placeholder text on an input.
 * @param {string} elementName - The name of the element.
 * @param {string} placeholder - The placeholder to set.
 */
function setPlaceholderOnInput(elementName, placeholder) {
    document.getElementById(elementName).placeholder = placeholder;
}

/**
 * Sets text inside an input box.
 * @param {string} elementName - The name of the input.
 * @param {string} text - The text to set in the input.
 */
function setTextOnInput(elementName, text) {
    document.getElementById(elementName).value = text;
}

/**
 * Gets text from inside an input box.
 * @param {string} elementName - The name of the input.
 * @returns {string} - The text in the input box.
 */
function getTextFromInput(elementName) {
    return document.getElementById(elementName).value;
}

/**
 * Sets the value of a checkbox.
 * @param {string} elementName - The name of the checkbox.
 * @param {boolean} checked - The value to set in the checkbox.
 */
function setValueOnCheckbox(elementName, checked) {
    document.getElementById(elementName).checked = checked;
}

/**
 * Gets the value from a checkbox.
 * @param {string} elementName - The name of the checkbox.
 * @returns {boolean} - The value of the checkbox.
 */
function getValueFromCheckbox(elementName) {
    return document.getElementById(elementName).checked;
}

/** Clear search text. */
function clearSearchText() {
    setTextOnInput('txtSearch', '');
}

/** Show the export popup. */
function showExportPopup() {
    showElement('popupExport');
    hideElement('txtExportData');
    setTextOnInput('txtExportData', '');
}

/** Show the import popup. */
function showImportPopup() {
    showElement('popupImport');
    setTextOnInput('txtImportData', '');
    setTextOnInput('importMessage', '');
}

/** Hide the export popup. */
function hideExportPopup() {
    hideElement('popupExport');
}

/** Hide the import popup. */
function hideImportPopup() {
    hideElement('popupImport');
}

/**
 * Shows a message for the import popup.
 * @param {string} message - The message to show.
 */
function showImportMessage(message) {
    setElementContent('importMessage', message);
}

/** Hide the view all popup. */
function hideViewAllPopup() {
    hideElement('popupViewAll');
}

/** Hide the search popup. */
function hideSearchPopup() {
    hideElement('popupSearch');
    hideElement('searchContainer');
    hideElement('searchMoreCharacters');
    hideElement('searchNoResults');
}

/** Hide the search popup with a delay. */
function hideSearchPopupOnDelay() {
    setTimeout(hideSearchPopup, 100);
}

/** Show the View All popup. */
function showViewAllPopup() {
    let title = '';
    
    showElement('popupViewAll');

    switch (journalData.LastTab) {
        case 'Quest':
            displayAllQuests();
            title = getLocalisedString('TAB_QUESTS');
            break;
        
        case 'Character':
            displayAllCharacters();
            title = getLocalisedString('TAB_CHARACTERS');
            break;
        
        case 'Session':
            displayAllSessions();
            title = getLocalisedString('TAB_SESSIONS');
            break;
        
        case 'Campaign':
            displayAllCampaigns();
            title = getLocalisedString('TAB_CAMPAIGNS');
            break;
    }

    setElementContent('popupViewAllTitle', title);
}

/** Hide the new object popup. */
function hideNewPopup() {
    hideElement('popupNew');
    createNewType = '';
}

/**
 * Show the confirm delete popup.
 * @param {string} title - The title.
 * @param {string} message - The message.
 */
function showDeletePopup(title, message) {
    setElementContent('popupDeleteTitle', title);
    setElementContent('popupDeleteMessage', message);

    showElement('popupConfirmDelete');
}

/** Hide the confirm delete popup. */
function hideDeletePopup() {
    hideElement('popupConfirmDelete');
}

/** Show the create new object popup. */
function showNewCreatePopup() {
    let newType = '';
    let newPlaceholder = '';
    let newTitle = '';

    setTextOnInput('txtPopupNew', '');

    switch (createNewType) {
        case 'CAMPAIGN':
            newType = getLocalisedString('CAMPAIGN_NAME');
            newPlaceholder = getLocalisedString('CAMPAIGN_ENTER_NAME');
            newTitle = getLocalisedString('CAMPAIGN_CREATE');
            break;
        
        case 'QUEST':
            newType = getLocalisedString('QUEST_NAME');
            newPlaceholder = getLocalisedString('QUEST_ENTER_NAME');
            newTitle = getLocalisedString('QUEST_CREATE');
            break;
        
        case 'CHARACTER':
            newType = getLocalisedString('CHARACTER_NAME');
            newPlaceholder = getLocalisedString('CHARACTER_ENTER_NAME');
            newTitle = getLocalisedString('CHARACTER_CREATE');
            break;
        
        case 'SESSION':
            newType = getLocalisedString('SESSION_NAME');
            newPlaceholder = getLocalisedString('SESSION_ENTER_NAME');
            newTitle = getLocalisedString('SESSION_CREATE');
            break;
    }

    setElementContent('txtPopupNew', newType);
    setPlaceholderOnInput('txtPopupNew', newPlaceholder);
    setElementContent('popupNewTitle', newTitle);

    showElement('popupNew');
}

/** Show the summary tab. */
function showSummaryTab() {
    hideAllJournalCards();
    deselectAllTabs();

    setSummary();
    showElement('journalSummary');
    setTabSelected('tabSummary', true);

    journalData.LastTab = "Summary";
    saveToStorage();
}

/** Show the about tab. */
function showAboutTab() {
    hideAllJournalCards();
    deselectAllTabs();

    showElement('journalAbout');
    setTabSelected('tabAbout', true);

    journalData.LastTab = "About";
    saveToStorage();
}

/** Show the import popup when there are no campaigns. */
function showNewImportPopup() {
    showElement('popupImport');
    setTextOnInput('txtImportData', '');
}

/** Show the search query popup. */
function showSearchQueryPopup() {
    showElement('popupSearchQueryGuide');
}

/** Hide the search query popup. */
function hideSearchQueryPopup() {
    hideElement('popupSearchQueryGuide');
}

/**
 * Get HTML for a search result.
 * @param {string} type - The search result object type.
 * @param {number} uid - The uid of the object.
 * @param {string} title - The title of the search result.
 * @param {string} extraContent - Additional content to display.
 * @returns {object} - The html for a search result.
 */
function getHtmlForSearchResult(type, uid, title, extraContent) {
    return '<div id="' + type + uid + '" class="searchWrapper"><div class="title">' + title + '</div><div>' + extraContent + '</div></div>';
}

/** Setup events. */
function setupEvents() {
    addClickEventToButton('btnCreateCampaign', showNewCampaignPopup);
    addClickEventToButton('btnImportCampaign', showNewImportPopup);

    addClickEventToButton('btnPopupNewCancel', hideNewPopup);
    addClickEventToButton('btnPopupNewCreate', createNewObject);

    addClickEventToButton('tabSummary', showSummaryTab);
    addClickEventToButton('tabQuest', showQuestTab);
    addClickEventToButton('tabCharacters', showCharacterTab);
    addClickEventToButton('tabSessions', showSessionTab);
    addClickEventToButton('tabCampaigns', showCampaignsTab);
    addClickEventToButton('tabAbout', showAboutTab);

    addClickEventToButton('btnAddNew', addButtonClick);
    addClickEventToButton('btnViewAll', showViewAllPopup);

    addClickEventToButton('btnDelete', deleteCurrentObject);

    addClickEventToButton('btnCampaignsImport', showImportPopup);
    addClickEventToButton('btnCampaignsExport', showExportPopup);

    addClickEventToButton('btnViewSearchQueries', showSearchQueryPopup);

    addClickEventToButton('btnPopupNewClose', hideNewPopup);
    addClickEventToButton('btnPopupImportClose', hideImportPopup);
    addClickEventToButton('btnPopupExportClose', hideExportPopup);
    addClickEventToButton('btnPopupViewAllClose', hideViewAllPopup);
    addClickEventToButton('btnPopupDeleteClose', hideDeletePopup);
    addClickEventToButton('btnPopupSearchQueryClose', hideSearchQueryPopup);

    addClickEventToButton('btnPopupDeleteCancel', hideDeletePopup);
    addClickEventToButton('btnPopupDeleteConfirm', confirmDelete);

    addClickEventToButton('btnExportAsJson', exportAsJson);
    addClickEventToButton('btnExportAsText', exportAsText);

    addClickEventToButton('chkExportAll', toggleExportOptionsSelection);
    addClickEventToButton('chkExportQuests', toggleExportOptionsSelection);
    addClickEventToButton('chkExportCharacters', toggleExportOptionsSelection);
    addClickEventToButton('chkExportSessions', toggleExportOptionsSelection);

    addClickEventToButton('btnImportAsJson', importFromData);

    addOnBlurEventToInput('txtHeader', updateCampaignName);

    addOnBlurEventToInput('txtSummaryNotes', updateSummary);

    addOnBlurEventToInput('txtQuestName', updateQuest);
    addOnBlurEventToInput('chkQuestComplete', updateQuest);
    addOnBlurEventToInput('txtQuestObjective', updateQuest);
    addOnBlurEventToInput('txtQuestNotes', updateQuest);

    addOnBlurEventToInput('txtCharacterName', updateCharacter);
    addOnBlurEventToInput('txtCharacterLocation', updateCharacter);
    addOnBlurEventToInput('txtCharacterJob', updateCharacter);
    addOnBlurEventToInput('chkCharacterParty', updateCharacter);
    addOnBlurEventToInput('chkCharacterDead', updateCharacter);
    addOnBlurEventToInput('txtCharacterNotes', updateCharacter);

    addOnBlurEventToInput('txtSessionName', updateSession);
    addOnBlurEventToInput('txtSessionNotes', updateSession);

    addOnBlurEventToInput('txtSearch', hideSearchPopupOnDelay);

    addOnKeyUpEventToInput('txtSearch', search);
}