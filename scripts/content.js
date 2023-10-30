chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if(request.toastMessage){
        if(request.toastMessage === "show") showSideBar()
        else if(request.toastMessage === "remove") removeSideBar()
        sendResponse({status: "OK"});
    }
else{
        removeSideBar();
       sendResponse({status: "FAIL", 
        message: "toastMessage not provided"});           
    }
});

let userVisited = ''
let toastContainer = document.createElement("div");

function findMatchingWordInURL(url) {
    const wordsToMatch = ["in", "company", "connectionOf", "connections","facetConnectionOf", "contact-info"];
    
    // Create a regular expression pattern that matches any of the specified words
    const pattern = new RegExp(`\\b(${wordsToMatch.join('|')})\\b`, 'i');

    // Use the regular expression to search for a match in the URL
    let match = url.match(pattern);

    if(match[0] === 'in'){
        match = url.match("contact-info");
        if(!match){
            match = ["in"]
        }
    }

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
        case "contact-info":
            showUserContacts();
            break;
        case "connectionOf":
        case "connections":
        case "facetConnectionOf":
            setTimeout(()=>{
                showUserConnections();
            },100)
            break;
        default:
            break;
    }
}

function removeMailtoPrefix(email) {
    // Check if the email starts with "mailto:"
    if (email.startsWith("mailto:")) {
      // Remove the "mailto:" prefix
      return email.slice(7);
    }
    // If it doesn't start with "mailto:", return the email as is
    return email;
  }

const connections = [];

const removeSideBar = ()=>{
    console.log("Removed sidebar");
    document.body.removeChild(toastContainer);
}

const showUserProfile = () => {

    console.log("showUserConnections");

    // Get the text inside the <h1> element
    toastContainer.innerHTML='';
    const titleElement = document.querySelector(".pv-text-details__title .text-heading-xlarge");
    const descriptionElement = document.querySelector(".pv-text-details__left-panel .text-body-medium");
    const localtionElement = document.querySelector(".pv-text-details__left-panel span.text-body-small.inline.t-black--light.break-words");

    const title = titleElement.innerHTML || "Not found";
    const desc = descriptionElement.innerHTML || "Not found";
    const location = localtionElement.innerHTML || "Not found";

    console.log("title",title);
    console.log("desc",desc);

    userVisited = title;

    let iframe = document.createElement("iframe");
    toastContainer.innerHTML = `
        <div style="padding: 10px">
            <p><span class='user-detail'>Title: </span> ${title}</p> 
            <p style="margin: 10px 0px;"><span class='user-detail'>Description:</span> ${desc}</p> 
            <p><span class='user-detail'>Location: </span> ${location} </p>
        </div>
    `
    toastContainer.className = "toast";

    // Set attributes for the iframe, such as source (src), width, and height
    iframe.src = "http://localhost:3000/"; // Set the URL you want to display in the iframe
    iframe.title = "W3Schools Free Online Web Tutorials"
    iframe.width = "100%"; // Set the width of the iframe
    iframe.height = "100%"; // Set the height of the iframe
    iframe.style.border = "0px";
    // toastContainer.appendChild(iframe);

     document.body.appendChild(toastContainer);
};

const showUserConnections = () => {

    console.log("showUserConnections");

    const nodeList = document.querySelectorAll(".search-results-container ul.reusable-search__entity-result-list .entity-result__content");

    let userContainer = document.createElement("div");

    let ConnectionHead = document.createElement("div");
    ConnectionHead.innerHTML = `<h4 style="margin: 10px">Connections</h4>`;
    userContainer.appendChild(ConnectionHead);

    for (let i = 0; i < nodeList.length; i++) {
        let userDetails = document.createElement("div");
        const user = nodeList[i].innerText.split('\n');
        userDetails.innerHTML = `<div class='connection-name'>
            <p style="font-size: 20px;">${user[0]}</p>
            <p>${user[5]}</p>
            <p style="font-size: 14px;">${user[6]}</p>
        </div>`;
        userContainer.appendChild(userDetails);
      }

    //   let button = document.createElement("button");
    //   button.innerText = `Add connection list to ${userVisited}`;
    //   button.className = "button-1";
    //   button.role = "button"

      toastContainer.appendChild(userContainer);

     toastContainer.className = "toast";
     document.body.appendChild(toastContainer);
};

const showUserContacts = () => {

    console.log("showUserContacts");

    let userContacts = document.createElement("div");

    let linkedInUrl = document.querySelector(".artdeco-modal__content .ci-vanity-url .pv-contact-info__ci-container a");
    linkedInUrl = linkedInUrl ? linkedInUrl.getAttribute('href') : "Not found"

    let phoneNumber = document.querySelector(".artdeco-modal__content .ci-phone ul li span");
    phoneNumber = phoneNumber ? phoneNumber.innerText : "Not found";

    let email = document.querySelector(".artdeco-modal__content .ci-email .pv-contact-info__ci-container a");
    email = email ? email.getAttribute('href') : "Not found"

    let dob = document.querySelector(".artdeco-modal__content .ci-birthday .pv-contact-info__ci-container span.pv-contact-info__contact-item");
    dob = dob ? dob.innerText : "Not found"

    userContacts.innerHTML = `
        <div style="padding: 10px">
            <p><span class='user-detail'>LinkedIn: </span> ${linkedInUrl}</p> 
            <p style="margin: 10px 0px;"><span class='user-detail'>Email:</span> ${removeMailtoPrefix(email)}</p>
            <p style="margin: 10px 0px;"><span class='user-detail'>Phone: </span> ${phoneNumber}</p> 
            <p><span class='user-detail'>Birthday: </span> ${dob}</p> 
        </div>
    `
    toastContainer.appendChild(userContacts);
    toastContainer.className = "toast";

     document.body.appendChild(toastContainer);
};