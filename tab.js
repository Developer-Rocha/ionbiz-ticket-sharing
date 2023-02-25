console.log('tab.js');

var currentUrl = window.location.href,
    ticketPageUrl = {
        'ticket_page': '.ionbiz.com/Issue/Index',
        'kanban_page': '.ionbiz.com/IssueKanban/Index'
    };

if (currentUrl.includes(ticketPageUrl.ticket_page) || currentUrl.includes(ticketPageUrl.kanban_page)) {
    var uniqueId = document.getElementsByClassName('uniqueId')[0];
    console.log(document.getElementsByClassName('uniqueId'));

    if (uniqueId) {
        let linkId = document.getElementById('TabGeneral_IssueDetailSection_IssueId').value,
            linkDescription = document.getElementById('TabGeneral_IssueDetailSection_Name').value,
            linkIndex = document.getElementById('Id').value;

        let newLink = linkId + ' ' + linkDescription + ' ' + 'https://' + window.location.hostname + '/Issue/Index/' + linkIndex + ' ';
        var data = [new ClipboardItem({ "text/plain": new Blob([newLink], { type: "text/plain" }) })];
        navigator.clipboard.write(data).then(function () {
            console.log("Copied to clipboard successfully!");
            window.history.pushState({}, "New Ticket", "/Issue/Index/" + linkIndex);
        }, function () {
            console.error("Unable to write to clipboard");
        });

    } else {
        console.error('Could not provide a link. Check if you have clicked a ticket.')
    }
} else {
    console.log('you are not on the right page')
}