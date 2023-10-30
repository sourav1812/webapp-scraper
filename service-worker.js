chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "show-toast",
        title: "Scrape data",
        contexts: ["all"]
    });
// default message when chrome extension is installed for the first time
    chrome.storage.sync.set({active: false});
});

chrome.action.onClicked.addListener((tab) => { 
    sendMessage(tab.id);
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log("URL: ",changeInfo);
    chrome.storage.sync.get(["active"], async ({active}) => {
        if(active){
            if (changeInfo.status === "complete") {
                const toastMessage = "show";
                // URL has changed, do something with the new URL
                const response = await chrome.tabs.sendMessage(tabId, {
                    toastMessage
                });
                console.log("response ",response);
            }  
        }
    });
  });

chrome.contextMenus.onClicked.addListener(({menuItemId}) => {
    if (menuItemId === "show-toast") {
        chrome.storage.sync.get(["active"], async ({message}) => {
            const [tab] = await chrome.tabs.query({currentWindow:true, active:true});
            sendMessage(tab.id)
        });
    }
});


const sendMessage = (tabId) => {
    chrome.storage.sync.get(["active"], async ({active}) => {
        if(!active){
            chrome.storage.sync.set({active: true});
            const toastMessage = "show";
            const response = await chrome.tabs.sendMessage(tabId, {
                toastMessage
            });
            console.log("response",response);
        }else{
            console.log("REMOVE");
            chrome.storage.sync.set({active: false});
            const toastMessage = "remove";
            const response = await chrome.tabs.sendMessage(tabId, {
                toastMessage
            });
            console.log("response",response);
        }
    });
}