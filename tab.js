console.log('tab.js');

var currentUrl = window.location.href,
    ticketPageUrl = {
        'ticket_page': '.ionbiz.com/Issue/Index',
        'kanban_page': '.ionbiz.com/IssueKanban/Index'
    };

if (currentUrl.includes(ticketPageUrl.ticket_page) || currentUrl.includes(ticketPageUrl.kanban_page)) {
    var uniqueId = document.getElementsByClassName('uniqueId')[0];

    if (uniqueId) {
        const linkId = document.getElementById('TabGeneral_IssueDetailSection_IssueId').value,
            linkDescription = document.getElementById('TabGeneral_IssueDetailSection_Name').value,
            linkIndex = document.getElementById('Id').value,
            ticketURL = 'https://' + window.location.hostname + '/Issue/Index/' + linkIndex + '/',
            ticketInfo = linkId + ' ' + linkDescription;

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
                console.log("Copied to clipboard successfully!");
                window.history.pushState({}, "New Ticket", "/Issue/Index/" + linkIndex);
            }, function () {
                console.error("Unable to write to clipboard");
            });
        });
    } else {
        console.error('Could not provide a link. Check if you have clicked a ticket.')
    }
} else {
    console.log('you are not on the right page')
}