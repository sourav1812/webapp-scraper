chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "show-toast",
        title: "Show Toast!",
        contexts: ["all"]
    });
    console.log("Loaded");
// default message when chrome extension is installed for the first time
    chrome.storage.sync.set({message: "Hello world!"});
});

chrome.contextMenus.onClicked.addListener(({menuItemId}) => {
    if (menuItemId === "show-toast") {
        chrome.storage.sync.get(["message"], ({message}) => {
            console.log("onClicked");
            sendMessage(message);
        });
    }
});

const sendMessage = async (toastMessage) => {
    try {
        const [tab] = await chrome.tabs.query({currentWindow:true, active:true});
        console.log("tab",tab);
        await chrome.tabs.sendMessage(tab.id, {type: 1,toastMessage: toastMessage});
    } catch (error) {
        console.log(error.message);
    }
}