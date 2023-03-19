console.log('tab.js');

var currentUrl = window.location.href,
    ticketPageUrl = {
        'ticket_page': '.ionbiz.com/Issue/Index',
        'kanban_page': '.ionbiz.com/IssueKanban/Index'
    };

if (currentUrl.includes(ticketPageUrl.ticket_page) || currentUrl.includes(ticketPageUrl.kanban_page)) {
    var uniqueId = document.getElementsByClassName('uniqueId')[0];

    if (uniqueId) {
        const ticketId = document.getElementById('TabGeneral_IssueDetailSection_IssueId').value,
            ticketTitle = document.getElementById('TabGeneral_IssueDetailSection_Name').value,
            ticketIndex = document.getElementById('Id').value,
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
                console.error('Error: Unable to write content to clipboard.');
            });
        });
    } else {
        console.error('Could not provide a link. Check if you have clicked a ticket.')
    }
}