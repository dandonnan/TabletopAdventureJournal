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
            document.getElementById(elementName).removeEventListener('mouseenter', applyHoverColour);
            document.getElementById(elementName).removeEventListener('mouseleave', removeHoverColour);
            document.getElementById(elementName).style.background = journalData.CustomColourHighlighted;
        }
    }
    else {
        if (document.getElementById(elementName).classList.contains('selected') === true) {
            document.getElementById(elementName).classList.remove('selected');
            addOnMouseEnterEventToElement(elementName, applyHoverColour);
            addOnMouseLeaveEventToInput(elementName, removeHoverColour);
            document.getElementById(elementName).style.background = journalData.CustomColour;
        }
     }
}

/**
 * Add a click event to a button.
 * @param {string} buttonName - The name of the button to add the event to.
 * @param {function} clickEvent - The event to trigger when the button is clicked.
 */
function addClickEventToButton(buttonName, clickEvent) {
    if (document.getElementById(buttonName) !== null) {
        document.getElementById(buttonName).addEventListener('click', clickEvent);
    }
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
 * Add a mouse enter event to an element.
 * @param {string} elementName - The name of the element to add the event to.
 * @param {function} changeEvent - The event to trigger when the mouse enters the element.
 */
function addOnMouseEnterEventToElement(elementName, mouseEvent) {
    document.getElementById(elementName).addEventListener('mouseenter', mouseEvent);
}

/**
 * Add a mouse leave event to an element.
 * @param {string} elementName - The name of the element to add the event to.
 * @param {function} changeEvent - The event to trigger when the mouse leaves the element.
 */
function addOnMouseLeaveEventToInput(elementName, mouseEvent) {
    document.getElementById(elementName).addEventListener('mouseleave', mouseEvent);
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

    localiseElement('btnViewAllAlphabetical', 'FILTER_ALPHABETICAL');
    localiseElement('btnViewAllComplete', 'FILTER_COMPLETE');
    localiseElement('btnViewAllParty', 'FILTER_PARTY');
    localiseElement('btnViewAllDeceased', 'FILTER_DEAD');
    localiseElement('btnViewAllLocation', 'FILTER_LOCATION_ALPHABETICAL');
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
    showElement('btnViewAllAlphabetical');
    hideElement('btnViewAllComplete');
    hideElement('btnViewAllInProgress');
    hideElement('btnViewAllFailed');
    hideElement('btnViewAllParty');
    hideElement('btnViewAllDeceased');
    hideElement('btnViewAllLocation');

    switch (journalData.LastTab) {
        case 'Quest':
            showElement('btnViewAllComplete');
            showElement('btnViewAllInProgress');
            showElement('btnViewAllFailed');
            displayAllQuests();
            title = getLocalisedString('TAB_QUESTS');
            break;
        
        case 'Character':
            showElement('btnViewAllParty');
            showElement('btnViewAllDeceased');
            showElement('btnViewAllLocation');
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

/** Show the app updated popup. */
function showUpdatedPopup() {
    showElement('popupUpdate');

    let latestVersion = getLocalisedString('VERSION_LOG_v0_7_2');

    latestVersion = latestVersion.substr(latestVersion.indexOf('\n') + 1);

    while (latestVersion.indexOf('\n') > -1) {
        latestVersion = latestVersion.replace('\n', '<br>');
    }

    setElementContent('updatedInfo', latestVersion);
}

/** Hide the app updated popup. */
function hideUpdatePopup() {
    hideElement('popupUpdate');
}

/** Show the version history popup. */
function showVersionHistoryPopup() {
    let history = [
        'VERSION_LOG_v0_7_2',
        'VERSION_LOG_v0_7_1',
        'VERSION_LOG_v0_7',
        'VERSION_LOG_v0_6_1',
        'VERSION_LOG_v0_6',
        'VERSION_LOG_v0_5',
        'VERSION_LOG_v0_2',
        'VERSION_LOG_v0_1'
    ];

    let html = '';

    for (let i = 0; i < history.length; i++){
        let lines = getLocalisedString(history[i]);

        let lineBreakIndex = lines.indexOf('\n');

        if (lineBreakIndex === -1) {
            html += '<h2>' + lines + '</h2>';
        }
        else {
            html += '<h2>' + lines.substr(0, lineBreakIndex) + '</h2>';

            lines = lines.substr(lineBreakIndex + 1);
        }

        while (lineBreakIndex > -1) {
            lineBreakIndex = lines.indexOf('\n');

            if (lineBreakIndex === -1) {
                html += lines;
            }
            else {
                html += lines.substr(0, lineBreakIndex) + '<br>';

                lines = lines.substr(lineBreakIndex + 1);
            }
        }
    }

    showElement('popupVersionHistory');
    setElementContent('versionHistoryLog', html);
}

/** Hide the version history popup. */
function hideVersionHistoryPopup() {
    hideElement('popupVersionHistory');
}

/**
 * Get HTML for a search result.
 * @param {string} type - The search result object type.
 * @param {number} uid - The uid of the object.
 * @param {string} title - The title of the search result.
 * @param {string} extraContent - Additional content to display.
 * @param {number} index - The index of the object.
 * @returns {object} - The html for a search result.
 */
function getHtmlForSearchResult(type, uid, title, extraContent, index) {
    let movementControls = '';
    let withArrows = '';

    if (index > -1) {
        withArrows = ' withArrows';

        if (index > 0) {
            movementControls = '<div id="moveUp' + index + '" class="moveArrow arrowUp">/\\</div>';
        }

        if (index < getFinalIndexForType(type)) {
            movementControls += '<div id="moveDown' + index + '" class="moveArrow arrowDown">\\/</div>';
        }
    }

    return '<div id="' + type + uid + '" class="searchWrapper' + withArrows + '"><div class="title">' + title + '</div>' + extraContent + '</div>' + movementControls;
}

/**
 * 
 * @param {string} type - The type of object.
 * @returns {number} - The final index of the type.
 */
function getFinalIndexForType(type) {
    let index = -1;

    switch (type) {
        case 'campaign':
            index = journalData.Campaigns.length - 1;
            break;
        
        case 'character':
            index = currentJournalData.Characters.length - 1;
            break;
        
        case 'quest':
            index = currentJournalData.Quests.length - 1;
            break;
        
        case 'session':
            index = currentJournalData.Sessions.length - 1;
            break;
    }

    return index;
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

    addClickEventToButton('titleBarColourEdit', showEditColourPopup);

    addClickEventToButton('btnAddNew', addButtonClick);
    addClickEventToButton('btnViewAll', showViewAllPopup);

    addClickEventToButton('btnDelete', deleteCurrentObject);

    addClickEventToButton('btnCampaignsImport', showImportPopup);
    addClickEventToButton('btnCampaignsExport', showExportPopup);

    addClickEventToButton('btnViewSearchQueries', showSearchQueryPopup);
    addClickEventToButton('btnVersionHistory', showVersionHistoryPopup);

    addClickEventToButton('chkQuestComplete', updateQuestFromCheckbox);
    addClickEventToButton('chkQuestInProgress', updateQuestFromCheckbox);
    addClickEventToButton('chkQuestFailed', updateQuestFromCheckbox);

    addClickEventToButton('btnViewAllAlphabetical', orderViewAllAlphabetically);
    addClickEventToButton('btnViewAllComplete', reorderQuestsByCompleted);
    addClickEventToButton('btnViewAllInProgress', reorderQuestsByInProgress);
    addClickEventToButton('btnViewAllFailed', reorderQuestsByFailed);
    addClickEventToButton('btnViewAllParty', reorderCharactersByParty);
    addClickEventToButton('btnViewAllDeceased', reorderCharactersByDead);
    addClickEventToButton('btnViewAllLocation', reorderCharactersByLocation);

    addClickEventToButton('btnPopupNewClose', hideNewPopup);
    addClickEventToButton('btnPopupImportClose', hideImportPopup);
    addClickEventToButton('btnPopupExportClose', hideExportPopup);
    addClickEventToButton('btnPopupViewAllClose', hideViewAllPopup);
    addClickEventToButton('btnPopupDeleteClose', hideDeletePopup);
    addClickEventToButton('btnPopupSearchQueryClose', hideSearchQueryPopup);
    addClickEventToButton('btnPopupEditColourClose', hideEditColourPopup);

    addClickEventToButton('btnPopupDeleteCancel', hideDeletePopup);
    addClickEventToButton('btnPopupDeleteConfirm', confirmDelete);

    addClickEventToButton('btnExportAsJson', exportAsJson);
    addClickEventToButton('btnExportAsText', exportAsText);

    addClickEventToButton('chkExportAll', toggleExportOptionsSelection);
    addClickEventToButton('chkExportQuests', toggleExportOptionsSelection);
    addClickEventToButton('chkExportCharacters', toggleExportOptionsSelection);
    addClickEventToButton('chkExportSessions', toggleExportOptionsSelection);

    addClickEventToButton('btnImportAsJson', importFromData);

    addClickEventToButton('btnEditBackgroundColour', showColourChoicesForBackground);
    addClickEventToButton('btnEditHighlightColour', showColourChoicesForHighlight);
    addClickEventToButton('btnRevertColour', revertColoursToDefault);
    addClickEventToButton('btnCloseColourChooser', hideColourChoicesPopup);

    addClickEventToButton('btnCloseUpdated', hideUpdatePopup);
    
    addClickEventToButton('btnPopupVersionHistoryClose', hideVersionHistoryPopup);

    addOnBlurEventToInput('txtHeader', updateCampaignName);

    addOnBlurEventToInput('txtSummaryNotes', updateSummary);

    addOnBlurEventToInput('txtQuestName', updateQuest);
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

    addOnKeyUpEventToInput('txtColourCode', changeColourFromInput);
}