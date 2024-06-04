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

function insertDefaultDescription(options) {

    // Define the default texts for description.
    const descriptions = {
        DESCRIPTION_1: `
            Beste [naam],<br><br>
            [omschrijving_probleem]<br><br>
            [omschrijving_oplossing]<br><br>
            Je kan de aanpassingen via de volgende URL testen op de {staging/productie} omgeving: {url}.<br><br>
            Geef gerust een seintje na testing wanneer we dit mogen deployen naar productie.<br><br>
            Aarzel niet om ons te contacteren indien er nog vragen zijn.<br><br>
            Met vriendelijke groeten,<br>[naam]
        `,
        TEMPLATE_BUGS: `
            Beste [naam],<br><br>
            We hebben een fix voorzien die hier gevalideerd kan worden: [link naar expliciete url]<br>
            Je kan dit testen door<br>
                • [stappenplan]<br>
                • [rol waarmee getest moet worden]<br>
            De oorzaak van dit probleem komt voort uit [genuanceerde reden]<br>
            [screenshot met eventuele voor en na om de oplossing te verduidelijken]<br><br>
            Alvast bedankt voor de feedback.<br><br>
            Met vriendelijke groeten,<br>[naam]<br><br>
            [Intern: Hoe is het opgelost? (bv. Deze patch gebruikt, deze module geupdatet …)]
        `,
        TEMPLATE_ESTIMATION_CHANGES: `
            Beste [naam],<br><br>
            We hebben je vraag bekeken en stellen het volgende voor:<br>
                • [Beschrijving van wat er gaat aangepast worden]<br>
                • [Workflow beschrijven hoe het juist gaat werken]<br>
                • [FE: Eventueel een screenshot van de aanpassing]<br>
                • [assumpties (Impact op andere delen van website? Wat niet in scope zit? Op welke rollen dat dit van toepassing is)]<br>
            We schatten dit in op [uren/dagen] werk.<br><br>
            Graag je goedkeuring dat we dit zo mogen uitvoeren.<br>
            Alvast bedankt.<br><br>
            Met vriendelijke groeten,<br>[naam]<br><br>
            [Devnote: welke modules gaan gebruikt worden, welke file moet er aangepast worden.]
        `,
        TEMPLATE_DELIVERY_CHANGES: `
            Beste [naam],<br><br>
            We hebben de gevraagde aanpassing doorgevoerd, die hier gevalideerd kan worden: [link naar expliciete url]<br>
            Je kan dit testen door<br>
                • [stappenplan (uitleg hoe er getest moet worden, bv hoe geraak ik er in het menu)]<br>
                • [Moeten er andere functionaliteiten getest worden?]<br>
                • [rol waarmee getest moet worden]<br>
                • [eventueel een voorbeeld geven]<br><br>
            Alvast bedankt voor de feedback.<br><br>
            Met vriendelijke groeten,<br>[naam]
        `,
        TEMPLATE_QUARTERLY_UPDATES: `
            Beste [naam],<br><br>
            We hebben voor verschillende modules een (security) update doorgevoerd. Dit kan gevalideerd worden op de staging omgeving: [url].<br>
            Hieronder vind je een lijst met de modules die een update hebben ontvangen met een korte beschrijving van de functionaliteit en hoe deze kan worden getest.<br><br>
                • [Paragraaf versie 2.X.: Deze module zorgt ervoor dat je verschillende content elementen kan toevoegen aan een pagina. Dit kan je testen via …<br>
                • Rabbit hole: Deze module zorgt ervoor dat bepaalde pagina’s voor gebruikers niet toegankelijk zijn.<br>
                • Module X. Deze module …. Dit kan je niet echt testen, aangezien dit onderliggend is.]<br>
            [Link naar algemene uitleg om Drupal core etc te kunnen testen.]<br><br>
            We voorzien dit over 2 weken naar de productie omgeving te deployen. Gelieve in tussentijd de nodige testen op staging door te voeren zodat dit probleemloos kan verlopen.<br><br>
            Alvast bedankt.<br><br>
            Met vriendelijke groeten,<br>[naam]
        `
    };

    const descriptionElement = document.getElementById('TabGeneral_IssueDescriptionSection_Description');
    const replyHTML = descriptions[options.descriptionType];

    if (descriptionElement) {
        try {
            descriptionElement.insertAdjacentHTML('beforeend', replyHTML);
            displayMessage('Successfully inserted reply.', 'success');
        } catch (error) {
            displayMessage(error, 'error');
        }
    } else {
        displayMessage('Could not find the description element to insert the reply.', 'error');
    }
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

        const funcToExecute = format === 'USE_DEFAULT_DESCRIPTION' ? insertDefaultDescription : shareTicket;

        if (format === 'USE_DEFAULT_DESCRIPTION') {
            chrome.storage.sync.get({ descriptionType: 'DESCRIPTION_1' }, (result) => {
                options.descriptionType = result.descriptionType;

                chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    func: funcToExecute,
                    args: [options],
                });
            });
        } else {
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: funcToExecute,
                args: [options],
            });
        }
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
            url: "docs/index.html"
        });
    }

    chrome.storage.sync.get({ 'options': { URL: true }, descriptionType: 'DESCRIPTION_1' }).then((result) => {
        chrome.contextMenus.create({
            title: 'Set to ticket URL',
            type: 'radio',
            checked: result.options.URL,
            contexts: ['action'],
            id: 'update_url'
        });

        chrome.contextMenus.create({
            title: 'Set to ticket hyperlink',
            type: 'radio',
            checked: result.options.LINK,
            contexts: ['action'],
            id: 'update_link'
        });

        chrome.contextMenus.create({
            title: 'Set to ticket name and URL',
            type: 'radio',
            checked: result.options.TEXT_AND_URL,
            contexts: ['action'],
            id: 'update_text_and_url'
        });

        chrome.contextMenus.create({
            title: 'Descriptions',
            contexts: ['action'],
            id: 'descriptions'
        });

        chrome.contextMenus.create({
            parentId: 'descriptions',
            title: 'Use Description 1',
            type: 'radio',
            checked: result.descriptionType === 'DESCRIPTION_1',
            contexts: ['action'],
            id: 'description_1'
        });

        chrome.contextMenus.create({
            parentId: 'descriptions',
            title: 'Use Bugs Template',
            type: 'radio',
            checked: result.descriptionType === 'TEMPLATE_BUGS',
            contexts: ['action'],
            id: 'template_bugs'
        });

        chrome.contextMenus.create({
            parentId: 'descriptions',
            title: 'Use Estimation Changes Template',
            type: 'radio',
            checked: result.descriptionType === 'TEMPLATE_ESTIMATION_CHANGES',
            contexts: ['action'],
            id: 'template_estimation_changes'
        });

        chrome.contextMenus.create({
            parentId: 'descriptions',
            title: 'Use Delivery Changes Template',
            type: 'radio',
            checked: result.descriptionType === 'TEMPLATE_DELIVERY_CHANGES',
            contexts: ['action'],
            id: 'template_delivery_changes'
        });

        chrome.contextMenus.create({
            parentId: 'descriptions',
            title: 'Use Quarterly Updates Template',
            type: 'radio',
            checked: result.descriptionType === 'TEMPLATE_QUARTERLY_UPDATES',
            contexts: ['action'],
            id: 'template_quarterly_updates'
        });

        chrome.contextMenus.create({
            parentId: 'descriptions',
            title: 'Insert Default Description',
            contexts: ['action'],
            id: 'insert_default_description'
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
});

chrome.action.onClicked.addListener((tab) => {
    insertContentScript(tab);
});

chrome.commands.onCommand.addListener((command) => {
    insertContentScript(null, command);
});

chrome.contextMenus.onClicked.addListener(function (info) {
    switch (info.menuItemId) {
        case 'update_link':
            chrome.storage.sync.set({ 'options': { LINK: true } });
            break;
        case 'update_text_and_url':
            chrome.storage.sync.set({ 'options': { TEXT_AND_URL: true } });
            break;
        case 'update_url':
            chrome.storage.sync.set({ 'options': { URL: true } });
            break;
        case 'insert_default_description':
            insertContentScript(null, 'USE_DEFAULT_DESCRIPTION');
            break;
        case 'description_1':
            chrome.storage.sync.set({ descriptionType: 'DESCRIPTION_1' });
            break;
        case 'template_bugs':
            chrome.storage.sync.set({ descriptionType: 'TEMPLATE_BUGS' });
            break;
        case 'template_estimation_changes':
            chrome.storage.sync.set({ descriptionType: 'TEMPLATE_ESTIMATION_CHANGES' });
            break;
        case 'template_delivery_changes':
            chrome.storage.sync.set({ descriptionType: 'TEMPLATE_DELIVERY_CHANGES' });
            break;
        case 'template_quarterly_updates':
            chrome.storage.sync.set({ descriptionType: 'TEMPLATE_QUARTERLY_UPDATES' });
            break;
        case 'getting_started':
            chrome.tabs.create({
                url: "docs/index.html"
            });
            break;
        case 'configure_shortcuts':
            chrome.tabs.create({
                url: "chrome://extensions/shortcuts"
            });
    }

    insertContentScript(null, null, true);
});
