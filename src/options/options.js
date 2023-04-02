const URL = 'url',
    TEXT_AND_URL = 'textandurl',
    LINK = 'link',
    formOptions = document.getElementById('options');

formOptions.url.addEventListener('change', function () {
    document.getElementById('example').innerHTML = '<a href="example.ionbiz.com/Issue/Index/1">https://example.ionbiz.com/Issue/Index/1</a>';
});

formOptions.textandurl.addEventListener('change', function () {
    document.getElementById('example').innerHTML = '12345 Ticket name <a href="example.ionbiz.com/Issue/Index/1">https://example.ionbiz.com/Issue/Index/1</a>';
});

formOptions.link.addEventListener('change', function () {
    document.getElementById('example').innerHTML = '<a href="example.ionbiz.com/Issue/Index/1">12345 Ticket name</a>';
});

// Saves options to chrome.storage
function save_options() {
    chrome.storage.sync.set({
        'options': {
            URL: document.getElementById(URL).checked,
            TEXT_AND_URL: document.getElementById(TEXT_AND_URL).checked,
            LINK: document.getElementById(LINK).checked
        }
    }, function () {
        // close window
        window.close();
    });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
    chrome.storage.sync.get(["options"]).then((result) => {
        document.getElementById(URL).checked = result.options.URL
        document.getElementById(TEXT_AND_URL).checked = result.options.TEXT_AND_URL;
        document.getElementById(LINK).checked = result.options.LINK;
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);