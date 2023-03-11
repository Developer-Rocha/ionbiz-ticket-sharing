var PLAIN_URL = 'plain-link';
var URL_AND_TEXT = 'plain-link-and-text';
var HTML_LINK = 'html-link';

// Saves options to chrome.storage
function save_options() {
    chrome.storage.sync.set({
        'options': {
            PLAIN_URL: document.getElementById(PLAIN_URL).checked,
            URL_AND_TEXT: document.getElementById(URL_AND_TEXT).checked,
            HTML_LINK: document.getElementById(HTML_LINK).checked
        }
    }, function () {
        // Update status to let user know options were saved.
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function () {
            status.textContent = '';
        }, 750);
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    chrome.storage.sync.get(["options"]).then((result) => {
        document.getElementById(PLAIN_URL).checked = result.options.PLAIN_URL
        document.getElementById(URL_AND_TEXT).checked = result.options.URL_AND_TEXT;
        document.getElementById(HTML_LINK).checked = result.options.HTML_LINK;
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);