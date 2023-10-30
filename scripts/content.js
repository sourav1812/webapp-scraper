chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request.toastMessage){
        if(request.toastMessage === "show") showSideBar()
        else if(request.toastMessage === "remove") removeSideBar()
        sendResponse({status: "OK"});
    }
else{
       sendResponse({status: "FAIL", 
        message: "toastMessage not provided"});           
    }
});

chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
    if("toastMessage" in request){
       if(request.toastMessage === "show") showSideBar()
       else if(request.toastMessage === "remove") removeSideBar()
       sendResponse({status: "OK"});
    }
    else{
       sendResponse({status: "FAIL", 
        message: "toastMessage not provided"});           
    }
});

function findMatchingWordInURL(url) {
    const wordsToMatch = ["in", "company", "connectionOf", "connections"];
    
    // Create a regular expression pattern that matches any of the specified words
    const pattern = new RegExp(`\\b(${wordsToMatch.join('|')})\\b`, 'i');

    // Use the regular expression to search for a match in the URL
    const match = url.match(pattern);

    // If a match is found, return the matched word; otherwise, return a default value
    return match ? match[0] : "No match found";
}

const showSideBar = ()=>{
    const url = window.location.href;
    const TYPE = findMatchingWordInURL(url);
    console.log("TYPE",TYPE);
    switch (TYPE) {
        case "in":
            showUserProfile();
            break;
        case "connectionOf":
        case "connections":
            showUserConnections();
            break;
        default:
            removeSideBar();
            break;
    }
}

let toastContainer = document.createElement("div");
const color = "rgb(228 48 48)"
const connections = [];

const removeSideBar = ()=>{
    console.log("removeSideBar");
    document.body.removeChild(toastContainer);
}

const showUserProfile = () => {
  
    // Get the text inside the <h1> element
    const titleElement = document.querySelector(".pv-text-details__title .text-heading-xlarge");
    const descriptionElement = document.querySelector(".pv-text-details__left-panel .text-body-medium");
    const localtionElement = document.querySelector(".pv-text-details__left-panel span.text-body-small");

    const title = titleElement.innerHTML || "Not found";
    const desc = descriptionElement.innerHTML || "Not found";
    const location = localtionElement.innerHTML || "Not found";

    console.log("title",title);
    console.log("desc",desc);

    let iframe = document.createElement("iframe");
    toastContainer.innerHTML = `
        <div style="padding: 10px">
            <p><span style="color: ${color}">Title: </span> ${title}</p> 
            <p style="margin: 10px 0px;"><span style="color: ${color}">Description:</span> ${desc}</p> 
            <p><span style="color: ${color}">Location: </span> ${location} </p>
        </div>
    `
    toastContainer.className = "toast";

    // Set attributes for the iframe, such as source (src), width, and height
    iframe.src = "http://localhost:3000/"; // Set the URL you want to display in the iframe
    iframe.title = "W3Schools Free Online Web Tutorials"
    iframe.width = "100%"; // Set the width of the iframe
    iframe.height = "100%"; // Set the height of the iframe
    iframe.style.border = "0px";
    toastContainer.appendChild(iframe);

     document.body.appendChild(toastContainer);
};

const showUserConnections = () => {
    const nodeList = document.querySelectorAll(".search-results-container ul.reusable-search__entity-result-list span.entity-result__title-text a.app-aware-link  span[aria-hidden='true']");
    let userContainer = document.createElement("div");
    for (let i = 0; i < nodeList.length; i++) {
        let userDetails = document.createElement("div");
        const userName = nodeList[i].innerText;
        userDetails.innerHTML = `<p><span style="color: ${color}; margin: 10px;">Name: </span> ${userName}</p>`;
        userContainer.appendChild(userDetails);
      }

        toastContainer.appendChild(userContainer);

        toastContainer.className = "toast";
     document.body.appendChild(toastContainer);
};