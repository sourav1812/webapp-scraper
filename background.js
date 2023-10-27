chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "show-toast",
        title: "Scrape data",
        contexts: ["all"]
    });
// default message when chrome extension is installed for the first time
    chrome.storage.sync.set({active: false});
});

chrome.browserAction.onClicked.addListener(tab => { 
    sendMessage(tab.id);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log("URL: ",changeInfo);
    chrome.storage.sync.get(["active"], ({active}) => {
        if(active){
            if (changeInfo.status === "complete") {
                const toastMessage = "show";
              // URL has changed, do something with the new URL
              chrome.tabs.sendMessage(tabId, {
                toastMessage
            });
            }  
        }
    });
  });

chrome.contextMenus.onClicked.addListener(({menuItemId}) => {
    if (menuItemId === "show-toast") {
        chrome.storage.sync.get(["active"], ({message}) => {
            chrome.tabs.query({currentWindow:true, active:true}, (tabs) => {
                const tab = tabs[0];
                sendMessage(tab.id)
            });
        });
    }
});


const sendMessage = (tabId) => {
    chrome.storage.sync.get(["active"], ({active}) => {
        if(!active){
            chrome.storage.sync.set({active: true});
            const toastMessage = "show";
            chrome.tabs.sendMessage(tabId, {
                toastMessage
            });
        }else{
            console.log("REMOVE");
            chrome.storage.sync.set({active: false});
            const toastMessage = "remove";
            chrome.tabs.sendMessage(tabId, {
                toastMessage
            });
        }
    });
}