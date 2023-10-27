const onHandleSubmit = () => {
    const newMessage = document.getElementById("message").value;
    chrome.storage.sync.set({message: newMessage}, () => {
        console.log("Finished Setting!");
    });
}

const setupHandlers = () => {
    const submitButton = document.getElementById("submit");
    submitButton.onclick = onHandleSubmit;
}

chrome.storage.sync.get(["message"], ({message}) => {
    const messageInput = document.getElementById("message");
    messageInput.value = message;
    setupHandlers();
});