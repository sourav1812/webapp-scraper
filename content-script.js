chrome.runtime.onMessage.addListener(async (req, sender, sendResponse) => {
    if(1 === req.message){
      showToast(req.toastMessage); 
       sendResponse({status: "OK"});
    }
else{
       sendResponse({status: "FAIL", 
        message: "toastMessage not provided"});           
    }
});

const showToast = (message) => {
    //append html element to webpage
     let toastContainer = document.createElement("div");
     toastContainer.innerText = message;
     toastContainer.className = "toast";
     document.body.appendChild(toastContainer);
   
    //remove element after 2 seconds
     setTimeout(()=>{
         document.body.removeChild(toastContainer);
     }, 10000);
 };