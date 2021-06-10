const backgroundColour = 'backgroundColour';
const highlightColour = 'highlightColour';

let currentChoice = backgroundColour;

const customisableColours = [
    // Red
    '#731d1d', '#c53131', '#eb6d6d',
    // Pink
    '#e31fad', '#ff75d9', '#ffc0ee',
    // Purple
    '#6a13cc', '#9350df', '#bb95e5',
    // Dark Blue
    '#0501e9', '#615fe3', '#918fff',
    // Light Blue
    '#00b6e3', '#22d3ff', '#b5f0ff',
    // Dark Green
    '#00782e', '#0fa046', '#95d7ae',
    // Yellow
    '#e1bf00', '#fde247', '#fcde9b',
    // Orange
    '#e16d00', '#fd9f47', '#ffb876',
];

/** Set custom colours on all adjustable elements. */
function setColoursOnElements() {
    setColourOnElement('tabButton', true);
    setColourOnElement('tabBar', false);
    setColourOnElement('baseButton', true);
    setColourOnElement('popupTitle', false);
    setColourOnElement('closeButton', true);

    document.getElementById('btnEditBackgroundColour').style.background = journalData.CustomColour;
    document.getElementById('btnEditHighlightColour').style.background = journalData.CustomColourHighlighted;

    document.getElementById('titleBarBackgroundColour').style.background = journalData.CustomColourHighlighted;
    document.getElementById('titleBarForegroundColour').style.background = journalData.CustomColour;

    let elements = document.getElementsByClassName('selected');

    if (elements.length > 0) {
        elements[0].style.background = journalData.CustomColourHighlighted;
    }
}

/**
 * Set custom colours on an element.
 * @param {string} elementName - The name of the element.
 * @param {boolean} highlightOnHover - Whether to highlight the element when hovered.
 */
function setColourOnElement(elementName, highlightOnHover) {
    let elements = document.getElementsByClassName(elementName);

    for (let i = 0; i < elements.length; i++){
        elements[i].style.background = journalData.CustomColour;

        if (highlightOnHover === true && elements[i].classList.contains('selected') === false) {
            addOnMouseEnterEventToElement(elements[i].id, applyHoverColour);
            addOnMouseLeaveEventToInput(elements[i].id, removeHoverColour);
        }
    }
}

/**
 * Applies a hover colour to an element.
 * @param {object} mouseEvent - The mouse event that has been triggered.
 */
function applyHoverColour(mouseEvent) {
    if (mouseEvent !== undefined) {
        mouseEvent.target.style.background = journalData.CustomColourHighlighted;
    }
}

/**
 * Removes the hover colour from an element.
 * @param {object} mouseEvent - The mouse event that has been triggered.
 */
function removeHoverColour(mouseEvent) {
    if (mouseEvent !== undefined) {
        mouseEvent.target.style.background = journalData.CustomColour;
    }
}

/** Revert custom colours to the defaults. */
function revertColoursToDefault() {
    journalData.CustomColour = defaultColour;
    journalData.CustomColourHighlighted = defaultColourHighlight;

    saveToStorage();

    setColoursOnElements();
}

/** Show the edit colour popup. */
function showEditColourPopup() {
    showElement('popupEditColour');
}

/** Hide the edit colour popup. */
function hideEditColourPopup() {
    hideElement('popupEditColour');
}

function showColourChoicesForBackground() {
    showColourChoicesPopup(backgroundColour);

    currentChoice = backgroundColour;

    setTextOnInput('txtColourCode', journalData.CustomColour);
}

function showColourChoicesForHighlight() {
    showColourChoicesPopup(highlightColour);

    currentChoice = highlightColour;

    setTextOnInput('txtColourCode', journalData.CustomColourHighlighted);
}

function showColourChoicesPopup(choice) {
    showElement('popupColourChooser');

    injectColourChooser('colourSelectorChoices', choice);
}

function hideColourChoicesPopup() {
    hideElement('popupColourChooser');
}

/**
 * Inject the colour chooser into an element.
 * @param {string} elementName - The name of the element.
 * @param {string} id - The id of the parent.
 */
function injectColourChooser(elementName, id) {
    let html = '';

    for (let i = 0; i < customisableColours.length; i += 3){
        html += '<div id="' + id + customisableColours[i].substr(1) + '" class="colourSelector" style="background: ' + customisableColours[i] + ';"></div>';
    }

    html += '<br>';

    for (let i = 1; i < customisableColours.length; i += 3){
        html += '<div id="' + id + customisableColours[i].substr(1) + '" class="colourSelector" style="background: ' + customisableColours[i] + ';"></div>';
    }

    html += '<br>';

    for (let i = 2; i < customisableColours.length; i += 3){
        html += '<div id="' + id + customisableColours[i].substr(1) + '" class="colourSelector" style="background: ' + customisableColours[i] + ';"></div>';
    }

    setElementContent(elementName, html);

    for (let i = 0; i < customisableColours.length; i++){
        let elementName = id + customisableColours[i].substr(1);

        addClickEventToButton(elementName, onColourClicked);
        addOnMouseEnterEventToElement(elementName, updatePreviewColour);
        addOnMouseLeaveEventToInput(elementName, revertPreviewColour);
    }
}

function onColourClicked(clickEvent) {
    let targetName = clickEvent.target.id;

    if (targetName.indexOf(backgroundColour) > -1) {
        targetName = targetName.substr(backgroundColour.length);

        journalData.CustomColour = '#' + targetName;
        saveToStorage();

        setColoursOnElements();

        setTextOnInput('txtColourCode', journalData.CustomColour);
    }
    else if (targetName.indexOf(highlightColour) > -1) {
        targetName = targetName.substr(highlightColour.length);

        journalData.CustomColourHighlighted = '#' + targetName;
        saveToStorage();

        setColoursOnElements();

        setTextOnInput('txtColourCode', journalData.CustomColourHighlighted);
    }
}

/**
 * Update the preview colour.
 * @param {object} mouseEvent - The mouse event.
 */
function updatePreviewColour(mouseEvent) {
    let targetName = mouseEvent.target.id;

    let previewElement = document.getElementById('colourSelectorPreview');

    if (targetName.indexOf(backgroundColour) > -1) {
        targetName = targetName.substr(backgroundColour.length);

        previewElement.style.background = '#' + targetName;
    }
    else if (targetName.indexOf(highlightColour) > -1) {
        targetName = targetName.substr(highlightColour.length);

        previewElement.style.background = '#' + targetName;
    }
}

/**
 * Revert the preview colour.
 * @param {object} mouseEvent - The mouse event.
 */
function revertPreviewColour(mouseEvent) {
    let targetName = mouseEvent.target.id;

    let previewElement = document.getElementById('colourSelectorPreview');

    if (targetName.indexOf(backgroundColour) > -1) {
        previewElement.style.background = journalData.CustomColour;
    }
    else if (targetName.indexOf(highlightColour) > -1) {
        previewElement.style.background = journalData.CustomColourHighlighted;
    }
}

/** Change the colour from the input. */
function changeColourFromInput() {
    let code = getTextFromInput('txtColourCode');

    if (code.indexOf('#') < 0) {
        code = '#' + code;
    }

    if (checkColourCodeIsValid(code) === true) {
        let previewElement = document.getElementById('colourSelectorPreview');

        previewElement.style.background = code;

        if (currentChoice === backgroundColour) {
            journalData.CustomColour = code;
            saveToStorage();
            setColoursOnElements();
        }
        else if (currentChoice === highlightColour) {
            journalData.CustomColourHighlighted = code;
            saveToStorage();
            setColoursOnElements();
        }
    }
}

/**
 * Check whether the colour code is valid.
 * @param {string} code - The colour code.
 * @returns {boolean} - Whether the code is valid.
 */
function checkColourCodeIsValid(code) {
    let valid = true;

    let invalidCharacters = [' ', '!', '"', '£', '$', '%', '^', '&', '*', '=', '|',
        '\\', ',', '<', '>', ',', '?', '/', ':', ';', '@', '\'', '~',
        '[', ']', '{', '}', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p',
        'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    
    for (let i = 0; i < invalidCharacters.length; i++){
        if (code.toLowerCase().indexOf(invalidCharacters[i]) > -1) {
            valid = false;
            break;
        }
    }

    if (valid === true) {
        if (code.length < 2 || code.length > 9) {
            valid = false;
        }
    }

    return valid;
}