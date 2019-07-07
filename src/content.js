// listen for messages from the injected page script
// and send to background
window.addEventListener("message", function (event) {
    if (//event.source == window
            event.data
            && event.data.direction === "from-page-script") {
        browser.runtime.sendMessage({
            action: "detection",
            content: event.data.message
        });
    }
});

browser.runtime.onMessage.addListener(request => {
    if (request.action.indexOf("notify") != -1 ) {
        let element = document.getElementById("content-script-notification");
        let label = document.getElementById('notification-message');
        if (element) {
            label.innerHTML = request.message;
        } else {
            document.body.onload = addElement(request.message, request.domain);
        }
    } 
    else if (request.action.indexOf("determineDefaultHTMLElementDimension") != -1) {
        var dimention = getDimentionOfHTMLElement();
        
        browser.runtime.sendMessage({
            action: "setDimentionOfHTMLElement",
            content: dimention,
            domain: request.domain
        });
    }
});

function addElement(message, domain) {
    var element = document.createElement("div");
    element.setAttribute('id', 'content-script-notification');
    element.style.position = "relative";
    element.style.width = "75%";
    element.style.backgroundColor = "#f2f2f2";
    element.style.border = "1px solid";
    element.style.boxShadow = "2px 2px 4px 4px #bfbfbf";
    element.style.padding = "5px";
    element.style.top = "6px";
    element.style.left = "13px";
    element.style.zIndex = 2199998;
    element.style.fontSize = "15px";
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
            action: "notificationButton",
            content: "ok",
            domain: domain
        });
        element.parentNode.removeChild(element);
    });
    buttonContainer.appendChild(buttonOK);
    element.appendChild(messageContainer);
    element.appendChild(buttonContainer);
    document.body.insertBefore(element, document.body.firstChild)
    //document.body.appendChild(element);
}

function getDimentionOfHTMLElement() {
    var width=0; var height=0;
    var h = document.getElementsByTagName('BODY')[0];
    var d = document.createElement('DIV');
    var s = document.createElement('SPAN');
    d.appendChild(s);
    d.style.fontFamily = 'sans';
    s.style.fontFamily = 'sans';
    s.style.fontSize = '72px';
    s.style.backgroundColor = 'white';
    s.style.color = 'white';
    s.innerHTML = 'mmmmmmmmmmlil';
    h.appendChild(d);
    width = s.offsetWidth;
    height = s.offsetHeight;
    h.removeChild(d);
    return {width: width, height: height}
}