function init(webidentity, detection) {
    document.querySelector("#domain").innerHTML = webidentity.domain;
    initAttributes(detection.attributes);
    initThirdParties(webidentity.thirdparties);
    initSocialPlugins(webidentity.socialplugins);
    initBrowserPlugins(webidentity.browserplugins);
}

function initAttributes(attributes) {
    let attrSpoofedBlocked = 0;
    let table = document.querySelector("#attribute-table");
    for (let attribute of attributes) {
        if (attribute.action === "spoof" || attribute.action === "block") {
            attrSpoofedBlocked++;
        }
        let tr = document.createElement("tr");
        let td1 = document.createElement("td");
        let td2 = document.createElement("td");
        let input = document.createElement("input");
        let div = document.createElement("div");
        td1.style.width = "30px";
        input.type = "checkbox";
        input.class = "attribute-checkbox";
        input.checked = attribute.action === "spoof" || attribute.action === "block";
        td1.appendChild(input);
        div.class = "attribute-label";
        div.innerHTML = attribute.name;
        td2.appendChild(div);
        tr.appendChild(td1);
        tr.appendChild(td2);
        table.appendChild(tr);
    }
    document.querySelector("#detected-attributes").innerHTML =
        attrSpoofedBlocked + "/" + attributes.length;
}

function initThirdParties(thirdparties) {
    let thirdpartiesBlocked = 0;
    let table = document.querySelector("#third-party-table");
    for (let thirdparty of thirdparties) {
        if (thirdparty.blocked === true) {
            thirdpartiesBlocked++;
        }
        let tr = document.createElement("tr");
        let td1 = document.createElement("td");
        let td2 = document.createElement("td");
        let input = document.createElement("input");
        let div = document.createElement("div");
        td1.style.width = "30px";
        input.type = "checkbox";
        input.class = "third-party-checkbox";
        input.checked = thirdparty.blocked;
        td1.appendChild(input);
        div.class = "third-party-label";
        div.innerHTML = thirdparty.name;
        td2.appendChild(div);
        tr.appendChild(td1);
        tr.appendChild(td2);
        table.appendChild(tr);
    }
    document.querySelector("#detected-third-parties").innerHTML =
        thirdpartiesBlocked + "/" + thirdparties.length;
}

function initSocialPlugins(socialplugins) {
    // TODO
}

function initBrowserPlugins(browserplugins) {
    // TODO
}

document.addEventListener("DOMContentLoaded", () => {
    browser.tabs.query({currentWindow: true, active: true}).then((tabs) => {
        let url = tabs[0].url;
        browser.runtime.sendMessage({
            action: "get-webidentity-detection",
            content: url
        }).then(message => {
            let webidentity = message.response.webidentity;
            let detection = message.response.detection;
            init(webidentity, detection);
        });
    });
});

document.querySelector("#settings").addEventListener("click", () => browser.runtime.openOptionsPage());
