/********************************************/
/* -- Fingerprint Privacy --                */
/* Date: 5.07.2019                          */
/********************************************/

/**
 * Listens for messages from the injected page script
 *  and send to background
 *  
 */ 
window.addEventListener("message", function (event) {
    if (event.data
            && event.data.direction === "from-page-script") {
        browser.runtime.sendMessage({
            action: "detection",
            content: event.data.message
        });
    }
});

/**
 * Listens for messages from detectionListener
 */
browser.runtime.onMessage.addListener(request => {
    if (request.action.indexOf("notify") != -1 ) {
        let element = document.getElementById("content-script-notification");
        if (element) {
            document.getElementById('notification-message').innerHTML = request.message;
        } else {
            document.body.onload = addElement(request.message, request.domain);
        }
    }
});

/**
 * Adds element to page to notify a user
 */
function addElement(message, domain) {
    var element = document.createElement("div");
    element.setAttribute('id', 'content-script-notification');
    element.style.position = "sticky";
    element.style.width = "75%";
    element.style.backgroundColor = "#f2f2f2";
    element.style.border = "1px solid";
    element.style.boxShadow = "2px 2px 4px 4px #bfbfbf";
    element.style.padding = "5px";
    element.style.top = "6px";
    element.style.left = "13px";
    element.style.zIndex = 21474836454;
    element.style.fontSize = "15px";
    element.style.lineHeight = "normal";
    var messageContainer = document.createElement("div");
    var label = document.createElement("LABEL");
    label.setAttribute('id', 'notification-message');
    label.appendChild(document.createTextNode(message));
    messageContainer.appendChild(label);
    var buttonContainer = document.createElement("div");
    var buttonOK = document.createElement("BUTTON");
    buttonOK.style.fontSize = "15px";
    buttonOK.style.backgroundColor = "#99cfff";
    buttonOK.style.padding = "5px";
    buttonContainer.style.textAlign = "right";
    buttonOK.appendChild(document.createTextNode("Ok"));
    buttonOK.addEventListener("click", function (event) {
        browser.runtime.sendMessage({
            action: "set-detection-notified",
            content: "ok",
            domain: domain
        });
        element.parentNode.removeChild(element);
    });
    buttonContainer.appendChild(buttonOK);
    element.appendChild(messageContainer);
    element.appendChild(buttonContainer);
    document.body.insertBefore(element, document.body.firstChild);
}