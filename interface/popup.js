function init(webidentity, detection) {
    if (webidentity !== undefined) {
        document.querySelector("#domain").innerHTML = webidentity.domain;
        initAttributes(detection);
        initThirdParties(webidentity);
        initSocialPlugins(webidentity);
        initWebsiteToggle(webidentity);
    } else {
        // no web identity for this tab
        // e.g. about:blank, about:newtab
        // TODO show message in popup
    }
}

function initAttributes(detection) {
    let attrSpoofedBlocked = 0;
    let length = 0;
    if (detection !== undefined) {
        let table = document.querySelector("#attribute-table");
        let attributes = detection.attributes;
        length = attributes.length;
        for (let attribute of attributes) {
            let checked = attribute.action === "spoof" || attribute.action === "block";
            if (checked) {
                attrSpoofedBlocked++;
            }
            appendToTable(table, attribute.name, checked);
        }
    }
    document.querySelector("#detected-attributes").innerHTML =
        attrSpoofedBlocked + "/" + length;
}

function initThirdParties(webidentity) {
    let thirdparties = webidentity.thirdparties;
    let thirdpartiesBlocked = 0;
    let table = document.querySelector("#third-party-table");
    for (let thirdparty of thirdparties) {
        let checked = thirdparty.blocked;
        if (checked) {
            thirdpartiesBlocked++;
        }
        appendToTable(table, thirdparty.name, checked);
    }
    document.querySelector("#detected-third-parties").innerHTML =
        thirdpartiesBlocked + "/" + thirdparties.length;
}

function appendToTable(table, text, checked) {
    let tr = document.createElement("tr");
    let td1 = document.createElement("td");
    let td2 = document.createElement("td");
    let input = document.createElement("input");
    let div = document.createElement("div");
    td1.style.width = "30px"; // TODO add to css
    input.type = "checkbox";
    input.class = "checkbox";
    input.checked = checked;
    td1.appendChild(input);
    div.class = "label";
    div.innerHTML = text;
    td2.appendChild(div);
    tr.appendChild(td1);
    tr.appendChild(td2);
    table.appendChild(tr);
}

function initSocialPlugins(webidentity) {
    let socialplugins = webidentity.socialplugins;
    let tr = document.querySelector("#social-plugins-tr");
    if (socialplugins.length === 0) {
        let td = document.createElement("td");
        let div = document.createElement("div");
        td.class = "plugins-logo";
        td.style["padding-top"] = "10px"; // TODO add to css
        div.class = "error-message";
        div.innerHTML = "No social plugins detected";
        td.appendChild(div);
        tr.appendChild(td);
    } else {
        for (let socialplugin of socialplugins) {
            let name = socialplugin.name;
            let td = document.createElement("td");
            let img = document.createElement("img");
            let src = "interface/icons/" + name;
            let tooltip = name.charAt(0).toUpperCase() + name.slice(1);
            if (socialplugin.block) {
                src += "-blocked.png";
                tooltip += " blocked - click to allow";
            } else {
                src += "-allowed.png";
                tooltip += " allowed - click to block";
            }
            img.src = browser.extension.getURL(src);
            img.class = "button";
            img.id = name + "button";
            img.tooltiptext = tooltip;
            td.appendChild(img);
            tr.appendChild(td);
        }
    }
}

function initWebsiteToggle(webidentity) {
    let websitetoggle = document.querySelector("#websiteonoffswitch");
    websitetoggle.checked = webidentity.enabled;
    websitetoggle.addEventListener("change", () => {
        browser.tabs.query({currentWindow: true, active: true}).then((tabs) => {
            let tab = tabs[0];
            browser.runtime.sendMessage({
                action: "toggle-website",
                content: {
                    domain: webidentity.domain,
                    enabled: websitetoggle.checked
                }
            }).then(() => {
                browser.tabs.reload(tab.id);
            });
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    browser.tabs.query({currentWindow: true, active: true}).then(tabs => {
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
