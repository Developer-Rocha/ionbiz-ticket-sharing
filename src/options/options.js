const URL = 'url',
    TEXT = 'text',
    TEXT_AND_URL = 'textandurl',
    LINK = 'link',
    formOptions = document.getElementById('options');

function save_options() {
    chrome.storage.sync.set({
        'options': {
            URL: document.getElementById(URL).checked,
            TEXT: document.getElementById(TEXT).checked,
            TEXT_AND_URL: document.getElementById(TEXT_AND_URL).checked,
            LINK: document.getElementById(LINK).checked
        }
    }, function () {
        cancel_options();
    });
}

function cancel_options() {
    window.close();
}

function restore_options() {
    chrome.storage.sync.get({ 'options': { URL: true } }).then((result) => {
        if (result.options.LINK) {
            document.getElementById(LINK).checked = result.options.LINK;
        } else if (result.options.TEXT) {
            document.getElementById(TEXT).checked = result.options.TEXT;
        } else if (result.options.TEXT_AND_URL) {
            document.getElementById(TEXT_AND_URL).checked = result.options.TEXT_AND_URL;
        } else {
            document.getElementById(URL).checked = result.options.URL;
        }
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
document.getElementById('cancel').addEventListener('click',
    cancel_options);