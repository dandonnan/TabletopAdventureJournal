/** Show the Character tab. */
function showCharacterTab() {
    hideAllJournalCards();
    deselectAllTabs();
    clearSearchText();

    if (currentCharacterIndex > -1) {
        showElement('journalCharacter');
        setCharacter();
    }
    
    showElement('journalSearch');
    setTabSelected('tabCharacters', true);

    journalData.LastTab = "Character";
    saveToStorage();
}

/**
 * Create a new Character.
 * @param {string} name - The name of the Character.
 */
 function createNewCharacter(name) {
    currentJournalData.Characters.push({
        "Uid": getNextUid(currentJournalData.Characters),
        "Name": name,
        "LastLocation": "",
        "Job": "",
        "Deceased": false,
        "PartyMember": false,
        "Notes": ""
    });

    currentCharacterIndex = currentJournalData.Characters.length - 1;
    currentJournalData.LastCharacter = currentCharacterIndex;

    showCharacterTab();
    showElement('journalCharacter');
    saveToStorage();

    setCharacter();
}

/**
 * Create a new Character from an import.
 * @param {object} character - The Character.
 */
 function createNewCharacterFromImport(character) {
    let deceased = false;
    let partyMember = false;
    let lastLocation = '';
    let job = '';
    let notes = '';
     
    if (character.Deceased !== undefined && character.Deceased !== null) {
        deceased = character.PartyMember;
    }

    if (character.PartyMember !== undefined && character.PartyMember !== null) {
        partyMember = character.PartyMember;
    }

    if (character.LastLocation !== undefined && character.LastLocation !== null) {
        lastLocation = character.LastLocation;
    }
     
    if (character.Job !== undefined && character.Job !== null) {
        job = character.Job;
    }

    if (character.Notes !== undefined && character.Notes !== null) {
        notes = character.Notes;
    }

    currentJournalData.Characters.push({
        "Uid": getNextUid(currentJournalData.Characters),
        "Name": character.Name,
        "LastLocation": lastLocation,
        "Job": job,
        "Deceased": deceased,
        "PartyMember": partyMember,
        "Notes": notes
    });
}

/** Sets the Character card from the saved data for the currently selected Character. */
function setCharacter() {
    let character = currentJournalData.Characters[currentCharacterIndex];

    if (character !== undefined) {
        setTextOnInput('txtCharacterName', character.Name);
        setTextOnInput('txtCharacterLocation', character.LastLocation);
        setTextOnInput('txtCharacterJob', character.Job);
        setValueOnCheckbox('chkCharacterParty', character.PartyMember);
        setValueOnCheckbox('chkCharacterDead', character.Deceased);
        setTextOnInput('txtCharacterNotes', character.Notes);
    }
}

/**
 * Gets the current Character from the card.
 * @returns {object} - The current Character.
 */
function getCharacter() {
    let characterName = getTextFromInput('txtCharacterName');

    if (characterName === "") {
        characterName = currentJournalData.Characters[currentCharacterIndex].Name;
    }

    return {
        Uid: currentJournalData.Characters[currentCharacterIndex].Uid,
        Name: characterName,
        LastLocation: getTextFromInput('txtCharacterLocation'),
        Job: getTextFromInput('txtCharacterJob'),
        PartyMember: getValueFromCheckbox('chkCharacterParty'),
        Deceased: getValueFromCheckbox('chkCharacterDead'),
        Notes: getTextFromInput('txtCharacterNotes')
    }
}

/** Updates the current Character from the card. */
function updateCharacter() {
    let character = getCharacter();

    currentJournalData.Characters[currentCharacterIndex] = character;

    saveToStorage();
}

/** Deletes the current Character. */
function deleteCharacter() {
    currentJournalData.Characters.splice(currentCharacterIndex, 1);

    currentCharacterIndex = -1;

    currentJournalData.LastCharacter = currentCharacterIndex;

    saveToStorage();
    hideElement('journalCharacter');
}

/** Displays all Characters in the view all container. */
function displayAllCharacters() {
    let html = '';

    let characters = currentJournalData.Characters;

    if (characters === null || characters.length <= 0) {
        html = getLocalisedString('CHARACTER_NONE');
        hideElement('btnViewAllAlphabetical');
        hideElement('btnViewAllParty');
        hideElement('btnViewAllDeceased');
        hideElement('btnViewAllLocation');
    }
    else {
        for (let i = 0; i < characters.length; i++) {
            html += getHtmlForCharacterSearchResult(characters[i], i);
        }
    }

    setElementContent('viewAllContainer', html);

    addClickEventToCharacterSearchResults(characters);
}

/**
 * Reorder Characters to be alphabetical.
 * @param {boolean} reverseAlphabetical - Whether to order the list in reverse.
 */
 function reorderCharactersAlphabetically(reverseAlphabetical) {
    let characters = currentJournalData.Characters;
    
    let currentCharacter = currentJournalData.Characters[currentCharacterIndex];
    
    characters.sort((a, b) => a.Name.localeCompare(b.Name));
    
    if (reverseAlphabetical === true) {
        characters.reverse();
    }

    currentJournalData.Characters = characters;
    
    getReorderedCharacterIndex(currentCharacter);
}

/** Reorder Characters based on if they are a party member. */
function reorderCharactersByParty() {
    let showNonParty = false;
    let characters = currentJournalData.Characters;

    let currentCharacter = currentJournalData.Characters[currentCharacterIndex];

    if (document.getElementById('btnViewAllParty').innerText === getLocalisedString('FILTER_PARTY')) {
        localiseElement('btnViewAllParty', 'FILTER_NON_PARTY');
    }
    else {
        showNonParty = true;
        localiseElement('btnViewAllParty', 'FILTER_PARTY');
    }

    characters.sort((a, b) => b.PartyMember - a.PartyMember);

    if (showNonParty === true) {
        characters.reverse();
    }

    currentJournalData.Characters = characters;

    showViewAllPopup();

    saveToStorage();

    getReorderedCharacterIndex(currentCharacter);
}

/** Reorder Characters based on if they are dead. */
function reorderCharactersByDead() {
    let showAlive = false;
    let characters = currentJournalData.Characters;

    let currentCharacter = currentJournalData.Characters[currentCharacterIndex];

    if (document.getElementById('btnViewAllDeceased').innerText === getLocalisedString('FILTER_DEAD')) {
        localiseElement('btnViewAllDeceased', 'FILTER_ALIVE');
    }
    else {
        showAlive = true;
        localiseElement('btnViewAllDeceased', 'FILTER_DEAD');
    }

    characters.sort((a, b) => b.Deceased - a.Deceased);

    if (showAlive === true) {
        characters.reverse();
    }

    currentJournalData.Characters = characters;

    showViewAllPopup();

    saveToStorage();

    getReorderedCharacterIndex(currentCharacter);
}

/** Reorder Characters based on their location. */
function reorderCharactersByLocation() {
    let reverse = false;
    let characters = currentJournalData.Characters;

    let currentCharacter = currentJournalData.Characters[currentCharacterIndex];

    if (document.getElementById('btnViewAllLocation').innerText === getLocalisedString('FILTER_LOCATION_ALPHABETICAL')) {
        localiseElement('btnViewAllLocation', 'FILTER_LOCATION_ALPHABETICAL_REVERSE');
    }
    else {
        reverse = true;
        localiseElement('btnViewAllLocation', 'FILTER_LOCATION_ALPHABETICAL');
    }

    characters.sort((a, b) => a.LastLocation.localeCompare(b.LastLocation));

    if (reverse === true) {
        characters.reverse();
    }

    currentJournalData.Characters = characters;

    showViewAllPopup();

    saveToStorage();

    getReorderedCharacterIndex(currentCharacter);
}

/**
 * Get and set the index of the Character in the reordered list.
 * @param {object} character - The Character.
 */
function getReorderedCharacterIndex(character) {
    if (character !== undefined) {
        for (let i = 0; i < currentJournalData.Characters.length; i++) {
            if (currentJournalData.Characters[i].Uid === character.Uid) {
                currentCharacterIndex = i;
                break;
            }
        }
    }
}

/**
 * Gets the HTML for a Character search result.
 * @param {object} characters - The Character.
 * @param {number} index - The index of the Character.
 * @returns {string} - The HTML for a Character search result.
 */
function getHtmlForCharacterSearchResult(character, index) {
    let dead = '';
    let party = '';

    if (character.Deceased === true) {
        dead = '<div class="searchTag searchTagRed">' + getLocalisedString('CHARACTER_DECEASED') + '</div> ';
    }

    if (character.PartyMember === true) {
        party = '<div class="searchTag searchTagBlue">' + getLocalisedString('CHARACTER_PARTY') + '</div> ';
    }

    return getHtmlForSearchResult('character', character.Uid, character.Name, party + dead + '<div class="searchExtraDetail">' + character.LastLocation + '</div>', index);
}

/**
 * Adds click events to Character search results.
 * @param {object} characters - A list of Characters.
 */
 function addClickEventToCharacterSearchResults(characters) {
     if (characters !== null) {
         for (let i = 0; i < characters.length; i++) {
             addClickEventToButton('character' + characters[i].Uid, loadCharacter);
             addClickEventToButton('moveUp' + i, moveCharacterUp);
             addClickEventToButton('moveDown' + i, moveCharacterDown);
         }
     }
}

/**
 * Loads and displays a Character.
 * @param {object} clickEvent - The click event that triggered the load.
 */
function loadCharacter(clickEvent) {
    let uid = parseInt(clickEvent.target.parentElement.id.replace('character', ''));

    let index = -1;

    for (let i = 0; i < currentJournalData.Characters.length; i++){
        if (currentJournalData.Characters[i].Uid === uid) {
            index = i;
            break;
        }
    }

    currentCharacterIndex = index;
    currentJournalData.LastCharacter = uid;

    hideElement('popupViewAll');
    showCharacterTab();
}

/**
 * Move a Character up.
 * @param {object} clickEvent - The click event that triggered the move.
 */
function moveCharacterUp(clickEvent) {
    let index = parseInt(clickEvent.target.id.replace('moveUp', ''));

    let currentCharacter = currentJournalData.Characters[currentCharacterIndex];

    let character = currentJournalData.Characters[index];
    currentJournalData.Characters.splice(index, 1);
    currentJournalData.Characters.splice(index - 1, 0, character);

    showViewAllPopup();
    saveToStorage();

    getReorderedCharacterIndex(currentCharacter);
}

/**
 * Move a Character down.
 * @param {object} clickEvent - The click event that triggered the move.
 */
function moveCharacterDown(clickEvent) {
    let index = parseInt(clickEvent.target.id.replace('moveDown', ''));

    let currentCharacter = currentJournalData.Characters[currentCharacterIndex];

    let character = currentJournalData.Characters[index];
    currentJournalData.Characters.splice(index, 1);
    currentJournalData.Characters.splice(index + 1, 0, character);

    showViewAllPopup();
    saveToStorage();

    getReorderedCharacterIndex(currentCharacter);
}

/**
 * Search Characters.
 * @param {string} searchTerm - The search term.
 */
 function searchCharacters(searchTerm) {
    let matchingCharacters = [];
    
    let queries = getSearchQueries(searchTerm);

    let restrictToParty= false;
    let restrictToNonParty = false;
    let restrictToDead = false;
    let restrictToAlive = false;

    for (let i = 0; i < queries.length; i++){
        if (queries[i].toLowerCase() === 'party') {
            restrictToParty = true;
            restrictToNonParty = false;
        }
        else if (queries[i].toLowerCase() === 'nonparty') {
            restrictToNonParty = true;
            restrictToParty = false;
        }

        if (queries[i].toLowerCase() === 'dead') {
            restrictToDead = true;
            restrictToAlive = false;
        }
        else if (queries[i].toLowerCase() === 'alive') {
            restrictToAlive = true;
            restrictToDead = false;
        }
    }

    setElementContent('searchContainer', '');
    hideElement('searchContainer');

    searchTerm = getSearchTermWithoutQuery(searchTerm).toLowerCase();

    let characters = currentJournalData.Characters;
    
     if (characters !== null) {

         for (let i = 0; i < characters.length; i++) {
             if (characters[i].Name.toLowerCase().indexOf(searchTerm) > -1
                 || characters[i].LastLocation.toLowerCase().indexOf(searchTerm) > -1
                 || characters[i].Job.toLowerCase().indexOf(searchTerm) > -1
                 || characters[i].Notes.toLowerCase().indexOf(searchTerm) > -1) {
            
                 if ((restrictToParty === true && characters[i].PartyMember === true)
                     || (restrictToNonParty === true && characters[i].PartyMember === false)
                     || (restrictToDead === true && characters[i].Deceased === true)
                     || (restrictToAlive === true && characters[i].Deceased === false)
                     || (restrictToParty === false && restrictToNonParty === false &&
                         restrictToDead === false && restrictToAlive === false)) {
                     matchingCharacters.push(characters[i]);
                 }
             }
         }
     }

    if (matchingCharacters.length <= 0) {
        showElement('searchNoResults');
    }
    else {
        hideElement('searchNoResults');

        let html = '';

        for (let i = 0; i < matchingCharacters.length; i++){
            html += getHtmlForCharacterSearchResult(matchingCharacters[i], -1);
        }

        setElementContent('searchContainer', html);

        addClickEventToCharacterSearchResults(matchingCharacters);

        showElement('searchContainer');
    }
}