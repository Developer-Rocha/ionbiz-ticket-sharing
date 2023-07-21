function shareTicket(args) {

    var currentUrl = window.location,
        bodyElement = document.querySelector('body'),
        modalElement = bodyElement.querySelector('.ionbiz-ticket-sharing-modal'),
        modalParagraphElement = null,
        uniqueId;

    if (currentUrl.href.includes('.ionbiz.com')) {
        uniqueId = bodyElement.querySelector('.uniqueId');

        if (uniqueId) {
            let ticketId = bodyElement.querySelector('#TabGeneral_IssueDetailSection_IssueId'),
                ticketTitle = bodyElement.querySelector('#TabGeneral_IssueDetailSection_Name'),
                ticketIndex = bodyElement.querySelector('#Id');

            if (ticketId && ticketTitle && ticketIndex) {
                let formattedContent = '';
                const ticketURL = 'https://' + currentUrl.hostname + '/Issue/Index/' + ticketIndex.value,
                    ticketInfo = ticketId.value + ' ' + ticketTitle.value;

                if (args) {
                    if (args == 'share_ticket_info_html_link') {
                        formattedContent = [new ClipboardItem({ "text/html": new Blob(["<a target='_blank' href='" + ticketURL + "'>" + ticketInfo + "</a>"], { type: "text/html" }) })];
                    } else if (args == 'share_ticket_info') {
                        formattedContent = [new ClipboardItem({ "text/plain": new Blob([ticketInfo], { type: "text/plain" }) })];
                    } else if (args == 'share_ticket_info_and_url') {
                        formattedContent = [new ClipboardItem({ "text/plain": new Blob([ticketInfo + ' ' + ticketURL], { type: "text/plain" }) })];
                    } else {
                        formattedContent = [new ClipboardItem({ "text/plain": new Blob([ticketURL], { type: "text/plain" }) })];
                    }

                    navigator.clipboard.write(formattedContent).then(function () {
                        window.history.pushState({}, ticketInfo, ticketURL);
                        displayMessage('Ticket info was successfully copied to your clipboard.', 'success');
                    }, function (error) {
                        displayMessage('The extension could not write ticket info to the clipboard. ' + error, 'error');
                    });

                } else {
                    chrome.storage.sync.get({ 'options': { URL: true } })
                        .then((result) => {
                            if (result.options.LINK) {
                                formattedContent = [new ClipboardItem({ "text/html": new Blob(["<a target='_blank' href='" + ticketURL + "'>" + ticketInfo + "</a>"], { type: "text/html" }) })];
                            } else if (result.options.TEXT) {
                                formattedContent = [new ClipboardItem({ "text/plain": new Blob([ticketInfo], { type: "text/plain" }) })];
                            } else if (result.options.TEXT_AND_URL) {
                                formattedContent = [new ClipboardItem({ "text/plain": new Blob([ticketInfo + ' ' + ticketURL], { type: "text/plain" }) })];
                            } else {
                                formattedContent = [new ClipboardItem({ "text/plain": new Blob([ticketURL], { type: "text/plain" }) })];
                            }

                            navigator.clipboard.write(formattedContent).then(function () {
                                window.history.pushState({}, ticketInfo, ticketURL);
                                displayMessage('Ticket info was successfully copied to your clipboard.', 'success');
                            }, function (error) {
                                displayMessage('The extension could not write ticket info to the clipboard. ' + error, 'error');
                            });
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
}

chrome.action.onClicked.addListener((tab) => {
    console.log('use action');

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: shareTicket,
    });

    chrome.scripting.insertCSS({
        target: { tabId: tab.id },
        files: ['message.css']
    });
});

async function getCurrentTab(command) {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tab] = await chrome.tabs.query(queryOptions);

    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: shareTicket,
        args: [command],
    });

    chrome.scripting.insertCSS({
        target: { tabId: tab.id },
        files: ['message.css']
    })
}

chrome.commands.onCommand.addListener((command) => {
    const response = getCurrentTab(command);
});