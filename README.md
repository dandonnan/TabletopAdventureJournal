# Tabletop Adventure Journal

Tabletop Adventure Journal is a browser extension that allows users to take notes of their Tabletop adventure games. Notes are organised into Quests, Characters and Sessions.

## Install Latest Version
The extension is available to install from the official Firefox extension store.

### Firefox
https://addons.mozilla.org/en-US/firefox/addon/tabletop-adventure-journal/

### Chrome
The extension has been removed from the Chrome extension store because Google keep changing their terms and expect developers to spend time
going through old projects and making them comply to the new terms.

## Install Development Version
Clone the repository, or download this project as a zip. Then, from the browser's extensions page, load it as unpacked.

### Chrome
* Enable Developer Mode (top right)
* Click Load Unpacked (top left)
* Navigate to the folder that contains the manifest.json file and select it

Additional changes may have to be made to adhere to changes that Google have made to their terms.

### Firefox
* Click the Cog and then Debug Add-ons
* Load Temporary Add-on
* Navigate to the manifest.json file and select it

## Folder Structure
### locales
Stores the text used for each supported language in their individual language folders.

#### /languageCode/messages.json
An array of Keys and Values defining the text to display in that language. The code looks up the Key and returns the corresponding 'message' - looking up TAB_QUESTS will return Quests when set to English.

Some messages make use of Placeholders. In the case of SESSION_DELETE_CONFIRM, the 'message' defines a placeholder called SESSION_NAME. When the code looks up the Key, it passes through a value to replace this placeholder with.

### images
This folder contains icons for the extension.

### js
Contains all the code that runs the extension. These are loaded through the HTML file.

### root
#### manifest.json
Defines the extension's name, description, version and permissions.

#### popup.html
The HTML page that displays when the extension is visible.

#### style.css
The stylesheet for the the HTML page.
