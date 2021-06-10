let browserObject;

/** Setup the localisation. */
function setupLocalisation() {
    browserObject = chrome;

    if (chrome === undefined) {
        browserObject = browser;
    }

    localiseStaticHtml();
}

/** Localise static HTML content. */
function localiseStaticHtml() {
    localiseElement('titleHeader', 'APP_NAME');
    localiseElement('titleGetStarted', 'CAMPAIGN_NONE');
    localiseElement('btnCreateCampaign', 'CAMPAIGN_CREATE');
    localiseElement('btnImportCampaign', 'CAMPAIGN_IMPORT');

    localiseInputPlaceholder('txtHeader', 'CAMPAIGN_NAME');

    localiseElement('tabSummaryText', 'TAB_SUMMARY');
    localiseElement('tabQuestText', 'TAB_QUESTS');
    localiseElement('tabCharactersText', 'TAB_CHARACTERS');
    localiseElement('tabSessionsText', 'TAB_SESSIONS');
    localiseElement('tabCampaignsText', 'TAB_CAMPAIGNS');
    localiseElement('tabAboutText', 'TAB_ABOUT');

    localiseInputPlaceholder('txtSearch', 'SEARCH');

    localiseElement('btnViewAll', 'BUTTON_VIEW_ALL');
    localiseElement('btnAddNew', 'BUTTON_NEW');
    localiseElement('btnDelete', 'BUTTON_DELETE');

    localiseElement('btnViewAllAlphabetical', 'FILTER_ALPHABETICAL');
    localiseElement('btnViewAllComplete', 'FILTER_COMPLETE');
    localiseElement('btnViewAllParty', 'FILTER_PARTY');
    localiseElement('btnViewAllDeceased', 'FILTER_DEAD');
    localiseElement('btnViewAllLocation', 'FILTER_LOCATION_ALPHABETICAL');

    localiseInputPlaceholder('txtSummaryNotes', 'TAB_SUMMARY');

    localiseInputPlaceholder('txtQuestName', 'QUEST_NAME');
    localiseElement('txtQuestComplete', 'QUEST_COMPLETE');
    localiseInputPlaceholder('txtQuestObjective', 'QUEST_OBJECTIVE');
    localiseInputPlaceholder('txtQuestNotes', 'QUEST_NOTES');

    localiseInputPlaceholder('txtCharacterName', 'CHARACTER_NAME');
    localiseInputPlaceholder('txtCharacterLocation', 'CHARACTER_LOCATION');
    localiseInputPlaceholder('txtCharacterJob', 'CHARACTER_JOB');
    localiseElement('txtCharacterParty', 'CHARACTER_PARTY_MEMBER');
    localiseElement('txtCharacterDead', 'CHARACTER_DECEASED');
    localiseInputPlaceholder('txtCharacterNotes', 'CHARACTER_NOTES');

    localiseInputPlaceholder('txtSessionName', 'SESSION_NAME');
    localiseInputPlaceholder('txtSessionNotes', 'SESSION_NOTES');

    localiseElement('campaignInfo', 'CAMPAIGN_IMPORT_EXPORT_INFO');
    localiseElement('btnCampaignsImport', 'CAMPAIGN_IMPORT');
    localiseElement('btnCampaignsExport', 'CAMPAIGN_EXPORT');

    localiseElement('searchMoreCharacters', 'SEARCH_REFINE');
    localiseElement('searchNoResults', 'SEARCH_NO_RESULTS');

    localiseElement('btnPopupNewCancel', 'BUTTON_CANCEL');
    localiseElement('btnPopupNewCreate', 'BUTTON_CREATE');

    localiseElement('popupImportTitle', 'TITLE_IMPORT');
    localiseElement('btnImportAsJson', 'IMPORT_FROM_JSON');

    localiseElement('popupExportTitle', 'TITLE_EXPORT');
    localiseElement('btnExportAsJson', 'EXPORT_AS_JSON');
    localiseElement('btnExportAsText', 'EXPORT_AS_TEXT');

    localiseElement('txtExportAllCampaigns', 'EXPORT_ALL_CAMPAIGNS');
    localiseElement('txtExportThis', 'EXPORT_THIS_CAMPAIGN');

    localiseElement('txtExportAll', 'EXPORT_EVERYTHING');
    localiseElement('txtExportQuests', 'TAB_QUESTS');
    localiseElement('txtExportCharacters', 'TAB_CHARACTERS');
    localiseElement('txtExportSessions', 'TAB_SESSIONS');

    localiseElement('btnPopupDeleteCancel', 'BUTTON_CANCEL');
    localiseElement('btnPopupDeleteConfirm', 'BUTTON_DELETE');

    localiseElement('popupEditColourTitle', 'BUTTON_EDIT_COLOURS');
    localiseElement('colourSelectorBackground', 'COLOUR_BACKGROUND');
    localiseElement('colourSelectorHighlight', 'COLOUR_HIGHLIGHT');
    localiseElement('btnRevertColour', 'COLOUR_REVERT');

    localiseElement('colourChooserPreview', 'COLOUR_PREVIEW');
    localiseElement('btnCloseColourChooser', 'COLOUR_OK');
    localiseInputPlaceholder('txtColourCode', 'COLOUR_ENTER_CODE');

    localiseElement('btnVersionHistory', 'VERSION_LOG');

    localiseElement('popupVersionHistoryTitle', 'VERSION_LOG');

    localiseElement('updatedTitle', 'APP_UPDATED');
    localiseElement('updatedHaveFun', 'UPDATE_HAPPY_ADVENTURE');
    localiseElement('btnCloseUpdated', 'BUTTON_OK');
}

/**
 * Localises an element.
 * @param {string} elementName - The name of the element.
 * @param {string} stringId - The id of the string.
 */
function localiseElement(elementName, stringId) {
    setElementContent(elementName, getLocalisedString(stringId));
}

/**
 * Localises an input's placeholder.
 * @param {string} elementName - The name of the element.
 * @param {string} stringId - The id of the string.
 */
function localiseInputPlaceholder(elementName, stringId) {
    document.getElementById(elementName).placeholder = getLocalisedString(stringId);
}

/**
 * Get a localised string.
 * @param {string} id - The id of the string.
 * @returns {string} - The localised string.
 */
 function getLocalisedString(id) {
    return browserObject.i18n.getMessage(id);
}

/**
 * Get a localised string with a parameter passed through.
 * @param {string} id - The id of the string.
 * @param {string} parameter - The parameter to put in the string.
 * @returns {string} - The localised string.
 */
function getLocalisedStringWithParameter(id, parameter) {
    return browserObject.i18n.getMessage(id, parameter);
}