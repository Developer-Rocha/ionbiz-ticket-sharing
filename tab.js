var currentUrl = window.location.href,
    ticketPageUrl = {
        'ticket_page': '.ionbiz.com/Issue/Index',
        'kanban_page': '.ionbiz.com/IssueKanban/Index'
    };

if (currentUrl.includes(ticketPageUrl.ticket_page) || currentUrl.includes(ticketPageUrl.kanban_page)) {
    const bodyElement = document.querySelector('body'),
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
                    }, function (error) {
                        console.warn('Warning: The Ionbiz Ticket Sharing extension could not write content to the clipboard.', error);
                    });
                })
                .catch((error) => {
                    console.error('Error: The Ionbiz Ticket Sharing extension could not load the storage settings.');
                });
        } else {
            console.warn('Warning: The Ionbiz Ticket Sharing extension could not find the ticket details.');
        }
    } else {
        console.warn('Warning: The Ionbiz Ticket Sharing extension could not find a unique issue ID. Tip: View a ticket section.');
    }
} else {
    console.warn('Warning: Please go to a Ionbiz subdomain url (*.ionbiz.com) to use the The Ionbiz Ticket Sharing extension.');
}