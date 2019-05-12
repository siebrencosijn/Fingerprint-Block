// listen for messages from the injected page script
// and send to background
window.addEventListener("message", function (event) {
    if (event.source == window
            && event.data
            && event.data.direction === "from-page-script") {
        browser.runtime.sendMessage({
            action: "detection",
            content: event.data.message
        });
    }
});

browser.runtime.onMessage.addListener(request => {
    if (request.action === "notify") {
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

//TODO: adujst style
function addElement(message, domain) {
    var element = document.createElement("div");
    element.setAttribute('id', 'content-script-notification');
    element.style.position = "absolute";
    element.style.width = "500px";
    element.style.height = "250px";
    element.style.backgroundColor = "powderblue";
    element.style.top = "6px";
    element.style.left = "13px";
    element.style.zIndex = 2199998;
    var label = document.createElement("LABEL");
    label.setAttribute('id', 'notification-message');
    label.appendChild(document.createTextNode(message));
    var buttonKeepBlocking = document.createElement("BUTTON");
    buttonKeepBlocking.appendChild(document.createTextNode("Keep blocking"));
    buttonKeepBlocking.addEventListener("click", function (event) {
        browser.runtime.sendMessage({
            action: "notificationButton",
            content: "keep",
            domain: domain
        });
        element.parentNode.removeChild(element);
    });
    var buttonAllow = document.createElement("BUTTON");
    buttonAllow.appendChild(document.createTextNode("Allow"));
    buttonAllow.addEventListener("click", function (event) {
        browser.runtime.sendMessage({
            action: "notificationButton",
            content: "allow",
            domain: domain
        });
        element.parentNode.removeChild(element);
    });
    element.appendChild(label);
    element.appendChild(buttonKeepBlocking);
    element.appendChild(buttonAllow);
    document.body.appendChild(element);
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