function shareTicket(options) {

    let currentUrl = window.location,
        bodyElement = document.querySelector('body'),
        modalElement = bodyElement.querySelector('.ionbiz-ticket-sharing-modal'),
        modalParagraphElement = null,
        uniqueId;

    if (currentUrl.href.includes('.ionbiz.com')) {
        uniqueId = bodyElement.querySelector('.uniqueId');

        if (uniqueId) {
            let ticketId = bodyElement.querySelector('#TabGeneral_IssueDetailSection_IssueId'),
                ticketTitle = bodyElement.querySelector('#TabGeneral_IssueDetailSection_Name'),
                ticketForm = bodyElement.querySelector('#issueDetailForm'),
                ticketIndex = ticketForm.querySelector('#Id');

            if (ticketId && ticketTitle && ticketForm && ticketIndex) {
                const ticketURL = 'https://' + currentUrl.hostname + '/Issue/Index/' + ticketIndex.value,
                    ticketInfo = ticketId.value + ' ' + ticketTitle.value;

                if (options) {
                    writeToClipboard(getShareFormat(options, ticketURL, ticketInfo));
                } else {
                    chrome.storage.sync.get({ 'options': { URL: true } })
                        .then((result) => {
                            writeToClipboard(getShareFormat(result.options, ticketURL, ticketInfo));
                        })
                        .catch((error) => {
                            displayMessage('The extension could not load the saved user preferences.', 'error');
                        });
                }
            } else {
                displayMessage('The extension could not retrieve the data in the web page.', 'error');
            }
        } else {
            displayMessage('View a ticket detail to use the extension.', 'normal');
        }
    } else {
        displayMessage('Go to an Ionbiz subdomain url (*.ionbiz.com) to use the extension.', 'normal');
    }

    function getShareFormat(options, ticketURL, ticketInfo) {
        if (options.LINK) {
            return [new ClipboardItem({ "text/html": new Blob(["<a target='_blank' href='" + ticketURL + "'>" + ticketInfo + "</a>"], { type: "text/html" }) })];
        } else if (options.TEXT) {
            return [new ClipboardItem({ "text/plain": new Blob([ticketInfo], { type: "text/plain" }) })];
        } else if (options.TEXT_AND_URL) {
            return [new ClipboardItem({ "text/plain": new Blob([ticketInfo + ' (' + ticketURL + ')'], { type: "text/plain" }) })];
        } else {
            return [new ClipboardItem({ "text/plain": new Blob([ticketURL], { type: "text/plain" }) })];
        }
    }

    function displayMessage(message, type) {
        if (modalElement) {
            modalParagraphElement = modalElement.querySelector('p');
        } else {
            modalElement = document.createElement('div');
            modalParagraphElement = document.createElement('p');
        }

        modalElement.setAttribute('class', 'ionbiz-ticket-sharing-modal modal-type--' + type);
        modalParagraphElement.innerHTML = message;
        modalElement.appendChild(modalParagraphElement);
        bodyElement.appendChild(modalElement);
    }

    function writeToClipboard(formattedContent) {
        navigator.clipboard.write(formattedContent).then(function () {
            displayMessage('Ticket info was successfully copied to your clipboard.', 'success');
        }, function (error) {
            displayMessage('The extension could not write ticket info to the clipboard. ' + error, 'error');
        });
    }
}

async function insertContentScript(tab, format, dialog) {
    let options = null;

    if (!tab) {
        [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    }

    if (format) {
        options = {};
        options[format] = true;
    }

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: shareTicket,
        args: [options],
    });

    chrome.scripting.insertCSS({
        target: { tabId: tab.id },
        files: ['message.css']
    });
}

async function insertContentScript(tab, format, isDialog) {
    let options = null;

    if (!tab) {
        [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    }

    if (isDialog) {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: displayMessage,
            args: ['Updated the default ticket sharing format.', 'success'],
        });
    } else {
        if (format) {
            options = {};
            options[format] = true;
        }

        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: shareTicket,
            args: [options],
        });
    }

    chrome.scripting.insertCSS({
        target: { tabId: tab.id },
        files: ['message.css']
    });
}

function displayMessage(message, type) {
    let bodyElement = document.querySelector('body'),
        modalElement = bodyElement.querySelector('.ionbiz-ticket-sharing-modal'),
        modalParagraphElement = null;

    if (modalElement) {
        modalParagraphElement = modalElement.querySelector('p');
    } else {
        modalElement = document.createElement('div');
        modalParagraphElement = document.createElement('p');
    }

    modalElement.setAttribute('class', 'ionbiz-ticket-sharing-modal modal-type--' + type);
    modalParagraphElement.innerHTML = message;
    modalElement.appendChild(modalParagraphElement);
    bodyElement.appendChild(modalElement);
}


chrome.runtime.onInstalled.addListener(({ reason }) => {
    if (reason === 'install') {
        chrome.tabs.create({
            url: "gettingstarted.html"
        });
    }
});

chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.get({ 'options': { URL: true } }).then((result) => {
        chrome.contextMenus.create({
            title: 'Default to ticket URL',
            type: 'radio',
            checked: result.options.URL,
            contexts: ['action'],
            id: 'update_url'
        });

        chrome.contextMenus.create({
            title: 'Default to ticket hyperlink',
            type: 'radio',
            checked: result.options.LINK,
            contexts: ['action'],
            id: 'update_link'
        });

        chrome.contextMenus.create({
            title: 'Default to ticket name',
            type: 'radio',
            checked: result.options.TEXT,
            contexts: ['action'],
            id: 'update_text'
        });

        chrome.contextMenus.create({
            title: 'Default to ticket name and URL',
            type: 'radio',
            checked: result.options.TEXT_AND_URL,
            contexts: ['action'],
            id: 'update_text_and_url'
        });
    });

    chrome.contextMenus.create({
        title: 'Getting started',
        contexts: ['action'],
        id: 'getting_started'
    });

    chrome.contextMenus.create({
        title: 'Configure shortcuts',
        contexts: ['action'],
        id: 'configure_shortcuts'
    });
});

chrome.action.onClicked.addListener((tab) => {
    insertContentScript(tab);
});

chrome.commands.onCommand.addListener((command) => {
    insertContentScript(null, command);
});

chrome.contextMenus.onClicked.addListener(function (info) {
    switch (info.menuItemId) {
        case 'update_text':
            chrome.storage.sync.set({ 'options': { TEXT: true } });
            break;
        case 'update_link':
            chrome.storage.sync.set({ 'options': { LINK: true } });
            break;
        case 'update_text_and_url':
            chrome.storage.sync.set({ 'options': { TEXT_AND_URL: true } });
            break;
        case 'update_url':
            chrome.storage.sync.set({ 'options': { URL: true } });
            break;
        case 'getting_started':
            chrome.tabs.create({
                url: "gettingstarted.html"
            });
            break;
        case 'configure_shortcuts':
            chrome.tabs.create({
                url: "chrome://extensions/shortcuts"
            });
    }

    insertContentScript(null, null, true);
});