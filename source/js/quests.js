/** Show the Quest tab. */
function showQuestTab() {
    hideAllJournalCards();
    deselectAllTabs();
    clearSearchText();

    if (currentQuestIndex > -1) {
        showElement('journalQuest');
        setQuest();
    }
    
    showElement('journalSearch');
    setTabSelected('tabQuest', true);

    journalData.LastTab = "Quest";
    saveToStorage();
}

/**
 * Create a new Quest.
 * @param {string} name - The name of the Quest.
 */
 function createNewQuest(name) {
    currentJournalData.Quests.push({
        "Uid": getNextUid(currentJournalData.Quests),
        "Name": name,
        "Completed": false,
        "Objective": "",
        "Notes": ""
    });

    currentQuestIndex = currentJournalData.Quests.length - 1;
    currentJournalData.LastQuest = currentQuestIndex;

    showQuestTab();
    showElement('journalQuest');
    saveToStorage();

    setQuest();
}

/**
 * Create a new Quest from an import.
 * @param {object} quest - The Quest.
 */
function createNewQuestFromImport(quest) {
    let completed = false;
    let objective = '';
    let notes = '';

    if (quest.Completed !== undefined && quest.Completed !== null) {
        completed = quest.Completed;
    }

    if (quest.Objective !== undefined && quest.Objective !== null) {
        objective = quest.Objective;
    }

    if (quest.Notes !== undefined && quest.Notes !== null) {
        notes = quest.Notes;
    }

    currentJournalData.Quests.push({
        "Uid": getNextUid(currentJournalData.Quests),
        "Name": quest.Name,
        "Completed": completed,
        "Objective": objective,
        "Notes": notes
    });
}

/** Sets the Quest card from the saved data for the currently selected quest. */
function setQuest() {
    let quest = currentJournalData.Quests[currentQuestIndex];

    if (quest !== undefined) {
        setTextOnInput('txtQuestName', quest.Name);
        setValueOnCheckbox('chkQuestComplete', quest.Completed);
        setTextOnInput('txtQuestObjective', quest.Objective);
        setTextOnInput('txtQuestNotes', quest.Notes);
    }
}

/**
 * Gets the current Quest from the card.
 * @returns {object} - The current Quest.
 */
function getQuest() {
    let questName = getTextFromInput('txtQuestName');

    if (questName === "") {
        questName = currentJournalData.Quests[currentQuestIndex].Name;
    }

    return {
        Uid: currentJournalData.Quests[currentQuestIndex].Uid,
        Name: questName,
        Completed: getValueFromCheckbox('chkQuestComplete'),
        Objective: getTextFromInput('txtQuestObjective'),
        Notes: getTextFromInput('txtQuestNotes')
    }
}

/** Updates the current Quest from the card. */
function updateQuest() {
    let quest = getQuest();

    currentJournalData.Quests[currentQuestIndex] = quest;

    saveToStorage();
}

/** Deletes the current Quest. */
function deleteQuest() {
    currentJournalData.Quests.splice(currentQuestIndex, 1);

    currentQuestIndex = -1;

    currentJournalData.LastQuest = currentQuestIndex;

    saveToStorage();
    hideElement('journalQuest');
}

/** Display all Quests in the view all container. */
function displayAllQuests() {
    let html = '';

    let quests = currentJournalData.Quests;

    if (quests.length <= 0) {
        html = getLocalisedString('QUEST_NONE');
    }
    else {
        for (let i = 0; i < quests.length; i++) {
            html += getHtmlForQuestSearchResult(quests[i]);
        }
    }

    setElementContent('viewAllContainer', html);

    addClickEventToQuestSearchResults(quests);
}

/**
 * Gets the HTML for a Quest search result.
 * @param {object} quest - The Quest.
 * @returns {string} - The HTML for a Quest search result.
 */
function getHtmlForQuestSearchResult(quest) {
    let completed = '';

    if (quest.Completed === true) {
        completed = '(Complete) '
    }

    return getHtmlForSearchResult('quest', quest.Uid, quest.Name, completed + quest.Objective);
}

/**
 * Adds click events to Quest search results.
 * @param {object} quests - A list of Quests.
 */
function addClickEventToQuestSearchResults(quests) {
    for (let i = 0; i < quests.length; i++){
        addClickEventToButton('quest' + quests[i].Uid, loadQuest);
    }
}

/**
 * Loads and displays a Quest.
 * @param {object} clickEvent - The click event that triggered the Quest to load.
 */
function loadQuest(clickEvent) {
    let uid = parseInt(clickEvent.target.parentElement.id.replace('quest', ''));

    let index = -1;

    for (let i = 0; i < currentJournalData.Quests.length; i++){
        if (currentJournalData.Quests[i].Uid === uid) {
            index = i;
            break;
        }
    }

    currentQuestIndex = index;
    currentJournalData.LastQuest = index;

    hideElement('popupViewAll');
    showQuestTab();
}

/**
 * Search Quests.
 * @param {string} searchTerm - The search term.
 */
function searchQuests(searchTerm) {
    let matchingQuests = [];

    let queries = getSearchQueries(searchTerm);

    let restrictToComplete = false;
    let restrictToIncomplete = false;

    for (let i = 0; i < queries.length; i++){
        if (queries[i].toLowerCase() === 'complete') {
            restrictToComplete = true;
            restrictToIncomplete = false;
        }
        else if (queries[i].toLowerCase() === 'incomplete') {
            restrictToIncomplete = true;
            restrictToComplete = false;
        }
    }

    setElementContent('searchContainer', '');
    hideElement('searchContainer');

    searchTerm = getSearchTermWithoutQuery(searchTerm).toLowerCase();

    let quests = currentJournalData.Quests;

    for (let i = 0; i < quests.length; i++){
        if (quests[i].Name.toLowerCase().indexOf(searchTerm) > -1
            || quests[i].Objective.toLowerCase().indexOf(searchTerm) > -1
            || quests[i].Notes.toLowerCase().indexOf(searchTerm) > -1) {
            if ((restrictToComplete === true && quests[i].Completed === true)
                || (restrictToIncomplete === true && quests[i].Completed === false)
                || (restrictToComplete === false && restrictToIncomplete === false)) {
                matchingQuests.push(quests[i]);
            }
        }
    }

    if (matchingQuests.length <= 0) {
        showElement('searchNoResults');
    }
    else {
        hideElement('searchNoResults');

        let html = '';

        for (let i = 0; i < matchingQuests.length; i++){
            html += getHtmlForQuestSearchResult(matchingQuests[i]);
        }

        setElementContent('searchContainer', html);

        addClickEventToQuestSearchResults(matchingQuests);

        showElement('searchContainer');
    }
}