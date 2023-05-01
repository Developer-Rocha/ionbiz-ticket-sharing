chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['tab.js']
    });

    chrome.scripting.insertCSS({
        target: { tabId: tab.id },
        files: ['message.css']
    });
});