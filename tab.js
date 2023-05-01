var currentUrl = window.location.href,
    ticketPageUrl = {
        'ticket_page': '.ionbiz.com',
        'kanban_page': '.ionbiz.com'
    },
    elementDiv,
    bodyElement = document.querySelector('body'),
    elementParagraph = null,
    elementDiv = bodyElement.querySelector('.ionbiz-ticket-sharing-modal'),
    uniqueId;

if (!elementDiv) {
    elementDiv = document.createElement('div');
    elementDiv.setAttribute('class', 'ionbiz-ticket-sharing-modal');
    elementParagraph = document.createElement('p');
} else {
    elementParagraph = elementDiv.querySelector('p');
}

if (currentUrl.includes(ticketPageUrl.ticket_page) || currentUrl.includes(ticketPageUrl.kanban_page)) {
    uniqueId = bodyElement.querySelector('.uniqueId');

    if (uniqueId) {
        let ticketId = bodyElement.querySelector('#TabGeneral_IssueDetailSection_IssueId'),
            ticketTitle = bodyElement.querySelector('#TabGeneral_IssueDetailSection_Name'),
            ticketIndex = bodyElement.querySelector('#Id');

        if (ticketId && ticketTitle && ticketIndex) {
            let formattedContent = '';
            const ticketURL = 'https://' + window.location.hostname + '/Issue/Index/' + ticketIndex.value,
                ticketInfo = ticketId.value + ' ' + ticketTitle.value;

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
                        elementParagraph.innerHTML = 'Ticket info was successfully copied to your clipboard.';
                    }, function (error) {
                        elementParagraph.innerHTML = 'The extension could not write ticket info to the clipboard.', error;
                    });
                })
                .catch((error) => {
                    elementParagraph.innerHTML = 'The extension could not load the saved user preferences.';
                });
        } else {
            elementParagraph.innerHTML = 'The extension could not retrieve the data in the web page.';
        }
    } else {
        elementParagraph.innerHTML = 'View a ticket detail to use the extension.';
    }
} else {
    elementParagraph.innerHTML = 'Go to an Ionbiz subdomain url (*.ionbiz.com) to use the extension.';
}

elementDiv.appendChild(elementParagraph);
bodyElement.appendChild(elementDiv);