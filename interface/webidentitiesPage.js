function init(webidentities, detections) {
    let table = document.querySelector("#table_webidentities");
    for (let webidentity of webidentities) {
        try {
            let tableBodyWebidentity = document.createElement("tbody");
            let tr = document.createElement("tr");
            let td0 = document.createElement("td");
            td0.colSpan = 3;
            let button = document.createElement("button");
            button.innerHTML = '<img src="/interface/icons/collapsed.png" /> ' + webidentity.domain;
            button.addEventListener("click", toggleAttributes);
            td0.appendChild(button);
            tr.appendChild(td0);
            tableBodyWebidentity.appendChild(tr);
            table.appendChild(tableBodyWebidentity);
            let tableBodyAttributes = document.createElement("tbody");
            tableBodyAttributes.setAttribute("class", "attributes");
            let detection = getDetection(detections, webidentity.domain);
            for (let attribute of detection.attributes) {
                let tr = document.createElement("tr");
                let td0 = document.createElement("td");
                let td1 = document.createElement("td");
                let td2 = document.createElement("td");

                td0.innerHTML = attribute.name;
                td1.innerHTML = getAttributeValue(webidentity, attribute.key);
                td2.innerHTML = getImageAttributeAction(attribute.action);

                tr.appendChild(td0);
                tr.appendChild(td1);
                tr.appendChild(td2);
                tableBodyAttributes.appendChild(tr);
            }

            table.appendChild(tableBodyAttributes);
        } catch (e) {
            console.log("iets misgegaan");
            console.log(e.message);
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    browser.tabs.query({ currentWindow: true, active: true }).then((tabs) => {
        browser.runtime.sendMessage({
            action: "get-all-webidentities-detections"
        }).then(message => {
            let webidentities = message.response.webidentities;
            let detections = message.response.detections;
            init(webidentities, detections);
        });
    });
});

function toggleAttributes() {
    this.classList.toggle("active");
    let content = this.parentElement.parentElement.nextElementSibling;
    if (content.style.display === "block") {
        content.style.display = "none";
    } else {
        content.style.display = "block";
    }
}

function getDetection(detections, domain) {
    return detections.find(
        h => h.domain.toLowerCase() === domain.toLowerCase()
    );
}

function getAttributeValue(webidentity, attributeKey) {
    for (let key in webidentity.fingerprint) {
        if (webidentity.fingerprint[key][attributeKey]) {
            return webidentity.fingerprint[key][attributeKey];
        }
    }
}

function getImageAttributeAction(action) {
    let image = "";
    if (action === "block") {
        image = '<img src="/interface/icons/block.png" />';
    } else if (action === "spoof") {
        image = '<img src="/interface/icons/spoof.png" />';
    } else if (action === "allow") {
        image = '<img src="/interface/icons/allow.png" />';
    }
    return image + action.charAt(0).toUpperCase() + action.slice(1);
}

