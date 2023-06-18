const URL = 'url',
    TEXT = 'text',
    TEXT_AND_URL = 'textandurl',
    LINK = 'link',
    formOptions = document.getElementById('options');

// formOptions.url.addEventListener('change', function () {
//     document.getElementById('example').innerHTML = 'Displays the ticket url. <br>';
// });

// formOptions.text.addEventListener('change', function () {
//     document.getElementById('example').innerHTML = 'Displays the ticket info which includes a ticket ID and description. <br>12345 Ticket name';
// });

// formOptions.textandurl.addEventListener('change', function () {
//     document.getElementById('example').innerHTML = 'Displays the ticket URL and info (customised). <br>12345 Ticket name <a href="example.ionbiz.com/Issue/Index/1">https://example.ionbiz.com/Issue/Index/1</a>';
// });

// formOptions.link.addEventListener('change', function () {
//     document.getElementById('example').innerHTML = 'Displays the ticket info through an HTML link. <br><a href="example.ionbiz.com/Issue/Index/1">12345 Ticket name</a>';
// });

function save_options() {
    chrome.storage.sync.set({
        'options': {
            URL: document.getElementById(URL).checked,
            TEXT: document.getElementById(TEXT).checked,
            TEXT_AND_URL: document.getElementById(TEXT_AND_URL).checked,
            LINK: document.getElementById(LINK).checked
        }
    }, function () {
        window.close();
    });
}

function cancel_options() {
    window.close();
}

function restore_options() {
    chrome.storage.sync.get({ 'options': { URL: true } }).then((result) => {
        if (result.options.LINK) {
            document.getElementById(LINK).checked = result.options.LINK;
            document.getElementById('example').innerHTML = 'Displays the ticket url. <br><a href="example.ionbiz.com/Issue/Index/1">12345 Ticket name</a>';
        } else if (result.options.TEXT) {
            document.getElementById(TEXT).checked = result.options.TEXT;
            document.getElementById('example').innerHTML = 'Displays the ticket info which includes a ticket ID and description. <br>12345 Ticket name';
        } else if (result.options.TEXT_AND_URL) {
            document.getElementById(TEXT_AND_URL).checked = result.options.TEXT_AND_URL;
            document.getElementById('example').innerHTML = 'Displays the ticket info through an HTML link. <br>12345 Ticket name <a href="example.ionbiz.com/Issue/Index/1">https://example.ionbiz.com/Issue/Index/1</a>';
        } else {
            document.getElementById(URL).checked = result.options.URL;
            document.getElementById('example').innerHTML = 'Displays the ticket URL and info (customised). <br><a href="example.ionbiz.com/Issue/Index/1">https://example.ionbiz.com/Issue/Index/1</a>';
        }
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);
document.getElementById('cancel').addEventListener('click',
    cancel_options);