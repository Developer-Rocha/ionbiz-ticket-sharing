// Saves options to chrome.storage
function save_options() {
    var domain = document.getElementById('domain').value;
    var autoCopy = document.getElementById('auto-copy').checked;
    chrome.storage.sync.set({
        domain: domain,
        autoCopy: autoCopy
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
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get({
        domain: 'domain',
        autoCopy: true
    }, function (items) {
        document.getElementById('domain').value = items.domain;
        document.getElementById('auto-copy').checked = items.autoCopy;
    });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);