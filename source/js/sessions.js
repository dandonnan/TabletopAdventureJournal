/**
 * Show the Session tab.
 * @param {MouseEvent} clickEvent - The event that opened the tab.
 */
function showSessionTab(clickEvent) {
    hideAllJournalCards();
    deselectAllTabs();
    clearSearchText();

    journalData.LastTab = "Session";

    if (currentSessionIndex > -1) {
        showElement('journalSession');
        setSession();

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
    else if (currentJournalData.Sessions.length > 0) {
        showViewAllPopup();
    }
    
    showElement('journalSearch');
    setTabSelected('tabSessions', true);

    saveToStorage();
}

/**
 * Create a new Session.
 * @param {string} name - The name of the Session. 
 */
 function createNewSession(name) {
    currentJournalData.Sessions.push({
        "Uid": getNextUid(currentJournalData.Sessions),
        "Name": name,
        "Notes": ""
    });

    currentSessionIndex = currentJournalData.Sessions.length - 1;
    currentJournalData.LastSession = currentSessionIndex;

    let mouseEvent = {
        shiftKey: null,
    };
     
    showSessionTab(mouseEvent);
    showElement('journalSession');
    saveToStorage();

    setSession();
}

/**
 * Create a new Session from an import.
 * @param {object} session - The Session.
 */
 function createNewSessionFromImport(session) {
    let notes = '';

    if (session.Notes !== undefined && session.Notes !== null) {
        notes = session.Notes;
    }

    currentJournalData.Sessions.push({
        "Uid": getNextUid(currentJournalData.Sessions),
        "Name": session.Name,
        "Notes": notes
    });
}

/** Sets the Session card from the saved data for the currently selected session. */
function setSession() {
    let session = currentJournalData.Sessions[currentSessionIndex];

    if (session !== undefined) {
        setTextOnInput('txtSessionName', session.Name);
        setTextOnInput('txtSessionNotes', session.Notes);
    }
}

/**
 * Gets the current Session from the card.
 * @returns {object} - The current Session.
 */
function getSession() {
    let sessionName = getTextFromInput('txtSessionName');

    if (sessionName === "") {
        sessionName = currentJournalData.Sessions[currentSessionIndex].Name;
    }

    return {
        Uid: currentJournalData.Sessions[currentSessionIndex].Uid,
        Name: sessionName,
        Notes: getTextFromInput('txtSessionNotes')
    }
}

/** Updates the current Session from the card. */
function updateSession() {
    let session = getSession();

    currentJournalData.Sessions[currentSessionIndex] = session;

    saveToStorage();
}

/** Deletes the current Session. */
function deleteSession() {
    currentJournalData.Sessions.splice(currentSessionIndex, 1);

    currentSessionIndex = -1;

    currentJournalData.LastSession = currentSessionIndex;

    saveToStorage();
    hideElement('journalSession');
}

/** Displays all Sessions in the view all container. */
function displayAllSessions() {
    let html = '';

    let sessions = currentJournalData.Sessions;

    if (sessions === null || sessions.length <= 0) {
        html = getLocalisedString('SESSION_NONE');
        hideElement('btnViewAllAlphabetical');
    }
    else {
        for (let i = 0; i < sessions.length; i++) {
            html += getHtmlForSessionSearchResult(sessions[i], i);
        }
    }

    setElementContent('viewAllContainer', html);

    addClickEventToSessionSearchResults(sessions);
}

/**
 * Reorder Sessions to be alphabetical.
 * @param {boolean} reverseAlphabetical - Whether to order the list in reverse.
 */
 function reorderSessionsAlphabetically(reverseAlphabetical) {
    let sessions = currentJournalData.Sessions;
    
    let currentSession = currentJournalData.Sessions[currentSessionIndex];
    
    sessions.sort((a, b) => a.Name.localeCompare(b.Name));
    
    if (reverseAlphabetical === true) {
        sessions.reverse();
    }

    currentJournalData.Sessions = sessions;
    
    getReorderedSessionIndex(currentSession);
}

/**
 * Get and set the index of the Session in the reordered list.
 * @param {object} session - The Session.
 */
function getReorderedSessionIndex(session) {
    if (session !== undefined) {
        for (let i = 0; i < currentJournalData.Sessions.length; i++) {
            if (currentJournalData.Sessions[i].Uid === session.Uid) {
                currentSessionIndex = i;
                break;
            }
        }
    }
}

/**
 * Gets the HTML for a Session search result.
 * @param {object} session - The Session.
 * @param {number} index - The index of the session.
 * @returns {object} - The HTML for a Session search result.
 */
function getHtmlForSessionSearchResult(session, index) {
    let extraDetail = '';

    if (session.Notes.trim() !== '') {
        let trimmedNotes = session.Notes.trim().substr(0, 50);

        extraDetail = '<div class="searchExtraDetail">' + trimmedNotes + '...</div>';
    }

    return getHtmlForSearchResult('session', session.Uid, session.Name, extraDetail, index);
}

/**
 * Adds click events to Session search results.
 * @param {object} sessions - A list of Sessions.
 */
function addClickEventToSessionSearchResults(sessions) {
    if (sessions !== null) {
        for (let i = 0; i < sessions.length; i++) {
            addClickEventToButton('session' + sessions[i].Uid, loadSession);
            addClickEventToButton('moveUp' + i, moveSessionUp);
            addClickEventToButton('moveDown' + i, moveSessionDown);
        }
    }
}

/**
 * Loads and displays a Session.
 * @param {object} clickEvent - The click event that triggered the load.
 */
function loadSession(clickEvent) {
    let uid = parseInt(clickEvent.target.parentElement.id.replace('session', ''));

    let index = -1;

    for (let i = 0; i < currentJournalData.Sessions.length; i++){
        if (currentJournalData.Sessions[i].Uid === uid) {
            index = i;
            break;
        }
    }

    currentSessionIndex = index;
    currentJournalData.LastSession = uid;

    let mouseEvent = {
        shiftKey: null,
    };

    hideElement('popupViewAll');
    showSessionTab(mouseEvent);
}

/**
 * Move a Session up.
 * @param {object} clickEvent - The click event that triggered the move.
 */
 function moveSessionUp(clickEvent) {
    let index = parseInt(clickEvent.target.id.replace('moveUp', ''));
     
    let currentSession = currentJournalData.Sessions[currentSessionIndex];

    let session = currentJournalData.Sessions[index];
    currentJournalData.Sessions.splice(index, 1);
    currentJournalData.Sessions.splice(index - 1, 0, session);

    showViewAllPopup();
    saveToStorage();
    
    getReorderedSessionIndex(currentSession);
}

/**
 * Move a Session down.
 * @param {object} clickEvent - The click event that triggered the move.
 */
function moveSessionDown(clickEvent) {
    let index = parseInt(clickEvent.target.id.replace('moveDown', ''));

    let currentSession = currentJournalData.Sessions[currentSessionIndex];

    let session = currentJournalData.Sessions[index];
    currentJournalData.Sessions.splice(index, 1);
    currentJournalData.Sessions.splice(index + 1, 0, session);

    showViewAllPopup();
    saveToStorage();

    getReorderedSessionIndex(currentSession);
}

/**
 * Search Sessions.
 * @param {string} searchTerm - The search term.
 */
 function searchSessions(searchTerm) {
    let matchingSessions = [];

    setElementContent('searchContainer', '');
    hideElement('searchContainer');

    searchTerm = searchTerm.toLowerCase();

    let sessions = currentJournalData.Sessions;
    
    if (sessions !== null){

    for (let i = 0; i < sessions.length; i++){
        if (sessions[i].Name.toLowerCase().indexOf(searchTerm) > -1
            || sessions[i].Notes.toLowerCase().indexOf(searchTerm) > -1) {
                matchingSessions.push(sessions[i]);
        }
        }
    }

    if (matchingSessions.length <= 0) {
        showElement('searchNoResults');
    }
    else {
        hideElement('searchNoResults');

        let html = '';

        for (let i = 0; i < matchingSessions.length; i++){
            html += getHtmlForSessionSearchResult(matchingSessions[i], -1);
        }

        setElementContent('searchContainer', html);

        addClickEventToSessionSearchResults(matchingSessions);

        showElement('searchContainer');
    }
}