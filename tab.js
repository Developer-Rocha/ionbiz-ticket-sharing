console.log('tab.js');

var currentUrl = window.location.href,
    ticketPageUrl = {
        'ticket_page': '.ionbiz.com/Issue/Index',
        'kanban_page': '.ionbiz.com/IssueKanban/Index'
    };

if (currentUrl.includes(ticketPageUrl.ticket_page) || currentUrl.includes(ticketPageUrl.kanban_page)) {
    const bodyElement = document.querySelector('body'),
        uniqueId = bodyElement.querySelector('.uniqueId');

    if (uniqueId) {
        const ticketId = bodyElement.querySelector('#TabGeneral_IssueDetailSection_IssueId').value,
            ticketTitle = bodyElement.querySelector('#TabGeneral_IssueDetailSection_Name').value,
            ticketIndex = bodyElement.querySelector('#Id').value,
            ticketURL = 'https://' + window.location.hostname + '/Issue/Index/' + ticketIndex,
            ticketInfo = ticketId + ' ' + ticketTitle;

        let formattedContent = '';

        chrome.storage.sync.get(["options"]).then((result) => {
            if (result.options.HTML_LINK) {
                formattedContent = [new ClipboardItem({ "text/html": new Blob(["<a target='_blank' href='" + ticketURL + "'>" + ticketInfo + "</a>"], { type: "text/html" }) })];
            } else if (result.options.URL_AND_TEXT) {
                formattedContent = [new ClipboardItem({ "text/plain": new Blob([ticketInfo + ' ' + ticketURL], { type: "text/plain" }) })];
            } else {
                formattedContent = [new ClipboardItem({ "text/plain": new Blob([ticketURL], { type: "text/plain" }) })];
            }

            navigator.clipboard.write(formattedContent).then(function () {
                window.history.pushState({}, ticketInfo, ticketURL);
            }, function () {
                console.warn('Warning: The extension could not write content to clipboard.');
            });
        });
    } else {
        console.warn('Warning: The extension could not find a unique issue ID.');
    }
}