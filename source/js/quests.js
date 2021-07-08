/**
 * Show the Quest tab.
 * @param {MouseEvent} clickEvent - The event that opened the tab.
 */
function showQuestTab(clickEvent) {
    hideAllJournalCards();
    deselectAllTabs();
    clearSearchText();

    journalData.LastTab = "Quest";

    if (currentQuestIndex > -1) {
        showElement('journalQuest');
        setQuest();

        if (clickEvent !== undefined) {
            if ((journalData.AlwaysViewAll === true && clickEvent.shiftKey === false) ||
                (journalData.AlwaysViewAll === false && clickEvent.shiftKey === true)) {
                showViewAllPopup();
            }
        }
        else if (journalData.AlwaysViewAll === true) {
            showViewAllPopup();
        }
    }
    else if (currentJournalData.Quests.length > 0) {
        showViewAllPopup();
    }
    
    showElement('journalSearch');
    setTabSelected('tabQuest', true);

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
        "InProgress": false,
        "Failed": false,
        "Objective": "",
        "Notes": ""
    });

    currentQuestIndex = currentJournalData.Quests.length - 1;
    currentJournalData.LastQuest = currentQuestIndex;
    
    let mouseEvent = {
        shiftKey: null,
    };

    showQuestTab(mouseEvent);
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
    let inProgress = false;
    let failed = false;
    let objective = '';
    let notes = '';

    if (quest.Completed !== undefined && quest.Completed !== null) {
        completed = quest.Completed;
    }

    if (quest.InProgress !== undefined && quest.InProgress !== null) {
        inProgress = quest.InProgress;
    }

    if (quest.Failed !== undefined && quest.Failed !== null) {
        failed = quest.Failed;
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
        "InProgress": inProgress,
        "Failed": failed,
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
        setValueOnCheckbox('chkQuestInProgress', quest.InProgress);
        setValueOnCheckbox('chkQuestFailed', quest.Failed);
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
        InProgress: getValueFromCheckbox('chkQuestInProgress'),
        Failed: getValueFromCheckbox('chkQuestFailed'),
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

/**
 * Updates the current Quest from the checkbox.
 * @param {object} clickEvent - The click event.
 */
function updateQuestFromCheckbox(clickEvent) {
    let id = clickEvent.target.id;
    let checked = clickEvent.target.checked;

    if (checked === true) {
        switch (id) {
            case 'chkQuestComplete':
                setValueOnCheckbox('chkQuestInProgress', false);
                setValueOnCheckbox('chkQuestFailed', false);
                break;
            
            case 'chkQuestInProgress':
                setValueOnCheckbox('chkQuestComplete', false);
                setValueOnCheckbox('chkQuestFailed', false);
                break;
            
            case 'chkQuestFailed':
                setValueOnCheckbox('chkQuestComplete', false);
                setValueOnCheckbox('chkQuestInProgress', false);
                break;
        }
    }

    updateQuest();
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

    if (quests === null || quests.length <= 0) {
        html = getLocalisedString('QUEST_NONE');
        hideElement('btnViewAllAlphabetical');
        hideElement('btnViewAllComplete');
        hideElement('btnViewAllInProgress');
        hideElement('btnViewAllFailed');
    }
    else {
        for (let i = 0; i < quests.length; i++) {
            html += getHtmlForQuestSearchResult(quests[i], i);
        }
    }

    setElementContent('viewAllContainer', html);

    addClickEventToQuestSearchResults(quests);
}

/**
 * Reorder Quests to be alphabetical.
 * @param {boolean} reverseAlphabetical - Whether to order the list in reverse.
 */
function reorderQuestsAlphabetically(reverseAlphabetical) {
    let quests = currentJournalData.Quests;

    let currentQuest = currentJournalData.Quests[currentQuestIndex];

    quests.sort((a, b) => a.Name.localeCompare(b.Name));
    
    if (reverseAlphabetical === true) {
        quests.reverse();
    }

    currentJournalData.Quests = quests;

    getReorderedQuestIndex(currentQuest);
}

/** Reorder Quests by their completed state. */
function reorderQuestsByCompleted() {
    let showIncomplete = false;
    let quests = currentJournalData.Quests;

    let currentQuest = currentJournalData.Quests[currentQuestIndex];

    if (document.getElementById('btnViewAllComplete').innerText === getLocalisedString('FILTER_COMPLETE')) {
        localiseElement('btnViewAllComplete', 'FILTER_INCOMPLETE');
    }
    else {
        showIncomplete = true;
        localiseElement('btnViewAllComplete', 'FILTER_COMPLETE');
    }

    quests.sort((a, b) => b.Completed - a.Completed);

    if (showIncomplete === true) {
        quests.reverse();
    }

    currentJournalData.Quests = quests;

    showViewAllPopup();

    saveToStorage();

    getReorderedQuestIndex(currentQuest);
}

/** Reorder Quests by their failed state. */
function reorderQuestsByFailed() {
    let quests = currentJournalData.Quests;

    let currentQuest = currentJournalData.Quests[currentQuestIndex];

    quests.sort((a, b) => b.Failed - a.Failed);

    currentJournalData.Quests = quests;

    showViewAllPopup();

    saveToStorage();

    getReorderedQuestIndex(currentQuest);
}

/** Reorder Quests by their in progress state. */
function reorderQuestsByInProgress() {
    let quests = currentJournalData.Quests;

    let currentQuest = currentJournalData.Quests[currentQuestIndex];

    quests.sort((a, b) => b.InProgress - a.InProgress);

    currentJournalData.Quests = quests;

    showViewAllPopup();

    saveToStorage();

    getReorderedQuestIndex(currentQuest);
}

/**
 * Get and set the index of the Quest in the reordered list.
 * @param {object} quest - The Quest.
 */
function getReorderedQuestIndex(quest) {
    if (quest !== undefined) {
        for (let i = 0; i < currentJournalData.Quests.length; i++) {
            if (currentJournalData.Quests[i].Uid === quest.Uid) {
                currentQuestIndex = i;
                break;
            }
        }
    }
}

/**
 * Gets the HTML for a Quest search result.
 * @param {object} quest - The Quest.
 * @param {number} index - The index of the Quest.
 * @returns {string} - The HTML for a Quest search result.
 */
function getHtmlForQuestSearchResult(quest, index) {
    let completed = '';

    if (quest.Completed === true) {
        completed = '<div class="searchTag searchTagGreen">' + getLocalisedString('QUEST_COMPLETE') + '</div> ';
    }

    if (quest.InProgress === true) {
        completed = '<div class="searchTag searchTagBlue">' + getLocalisedString('QUEST_IN_PROGRESS') + '</div> ';
    }

    if (quest.Failed === true) {
        completed = '<div class="searchTag searchTagRed">' + getLocalisedString('QUEST_FAILED') + '</div> ';
    }

    return getHtmlForSearchResult('quest', quest.Uid, quest.Name, completed + '<div class="searchExtraDetail">' + quest.Objective + '</div>', index);
}

/**
 * Adds click events to Quest search results.
 * @param {object} quests - A list of Quests.
 */
function addClickEventToQuestSearchResults(quests) {
    if (quests !== null) {
        for (let i = 0; i < quests.length; i++) {
            addClickEventToButton('quest' + quests[i].Uid, loadQuest);
            addClickEventToButton('moveUp' + i, moveQuestUp);
            addClickEventToButton('moveDown' + i, moveQuestDown);
        }
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
    currentJournalData.LastQuest = uid;

    let mouseEvent = {
        shiftKey: null,
    };

    hideElement('popupViewAll');
    showQuestTab(mouseEvent);
}

/**
 * Move a Quest up.
 * @param {object} clickEvent - The click event that triggered the move.
 */
 function moveQuestUp(clickEvent) {
    let index = parseInt(clickEvent.target.id.replace('moveUp', ''));
    
    let currentQuest = currentJournalData.Quests[currentQuestIndex];

    let quest = currentJournalData.Quests[index];
    currentJournalData.Quests.splice(index, 1);
    currentJournalData.Quests.splice(index - 1, 0, quest);

    showViewAllPopup();
    saveToStorage();
    
    getReorderedQuestIndex(currentQuest);
}

/**
 * Move a Quest down.
 * @param {object} clickEvent - The click event that triggered the move.
 */
function moveQuestDown(clickEvent) {
    let index = parseInt(clickEvent.target.id.replace('moveDown', ''));

    let currentQuest = currentJournalData.Quests[currentQuestIndex];

    let quest = currentJournalData.Quests[index];
    currentJournalData.Quests.splice(index, 1);
    currentJournalData.Quests.splice(index + 1, 0, quest);

    showViewAllPopup();
    saveToStorage();

    getReorderedQuestIndex(currentQuest);
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
    let restrictToInProgress = false;
    let restrictToFailed = false;

    for (let i = 0; i < queries.length; i++){
        if (queries[i].toLowerCase() === 'complete') {
            restrictToComplete = true;
            restrictToInProgress = false;
            restrictToFailed = false;
            restrictToIncomplete = false;
        }
        else if (queries[i].toLowerCase() === 'incomplete') {
            restrictToIncomplete = true;
            restrictToComplete = false;
            restrictToInProgress = false;
            restrictToFailed = false;
        }
        else if (queries[i].toLowerCase() === 'inprogress') {
            restrictToInProgress = true;
            restrictToComplete = false;
            restrictToFailed = false;
            restrictToIncomplete = false;
        }
        else if (queries[i].toLowerCase() === 'failed') {
            restrictToFailed = true;
            restrictToInProgress = false;
            restrictToComplete = false;
            restrictToIncomplete = false;
        }
    }

    setElementContent('searchContainer', '');
    hideElement('searchContainer');

    searchTerm = getSearchTermWithoutQuery(searchTerm).toLowerCase();

    let quests = currentJournalData.Quests;

    if (quests !== null) {
        for (let i = 0; i < quests.length; i++) {
            if (quests[i].Name.toLowerCase().indexOf(searchTerm) > -1
                || quests[i].Objective.toLowerCase().indexOf(searchTerm) > -1
                || quests[i].Notes.toLowerCase().indexOf(searchTerm) > -1) {
                if ((restrictToComplete === true && quests[i].Completed === true)
                    || (restrictToIncomplete === true && quests[i].Completed === false && quests[i].Failed == false)
                    || (restrictToInProgress === true && quests[i].InProgress === true)
                    || (restrictToFailed === true && quests[i].Failed === true)
                    || (restrictToComplete === false && restrictToIncomplete === false && restrictToInProgress === false && restrictToFailed === false)) {
                    matchingQuests.push(quests[i]);
                }
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
            html += getHtmlForQuestSearchResult(matchingQuests[i], -1);
        }

        setElementContent('searchContainer', html);

        addClickEventToQuestSearchResults(matchingQuests);

        showElement('searchContainer');
    }
}