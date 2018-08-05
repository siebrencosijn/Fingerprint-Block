/*
 * Initializes the dynamic parts of the popup.
 */
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

/*
 * Initializes the attributes table.
 */
function initAttributes(detection) {
    let attrSpoofedBlocked = 0;
    let length = 0;
    if (detection !== undefined) {
        let table = document.querySelector("#attribute-table");
        table.innerHTML = "";
        let attributes = detection.attributes;
        length = attributes.length;
        for (let attribute of attributes) {
            let checked = attribute.action === "spoof" || attribute.action === "block";
            if (checked) {
                attrSpoofedBlocked++;
            }
            let checkbox = document.createElement("input");
            let label = document.createElement("div");
            checkbox.checked = checked;
            checkbox.addEventListener("change", () => {
                sendMessage("toggle-attribute", {
                    domain: detection.domain,
                    attribute: attribute.name,
                    block: checkbox.checked
                });
            });
            label.innerHTML = attribute.name;
            appendToTable(table, checkbox, label);
        }
    }
    document.querySelector("#detected-attributes").innerHTML =
        attrSpoofedBlocked + "/" + length;
}

/*
 * Initializes the third-parties table.
 */
function initThirdParties(webidentity) {
    let thirdparties = webidentity.thirdparties;
    let thirdpartiesBlocked = 0;
    let table = document.querySelector("#third-party-table");
    table.innerHTML = "";
    for (let thirdparty of thirdparties) {
        let checked = thirdparty.block;
        if (checked) {
            thirdpartiesBlocked++;
        }
        let checkbox = document.createElement("input");
        let label = document.createElement("div");
        checkbox.checked = checked;
        checkbox.addEventListener("change", () => {
            sendMessage("toggle-thirdparty", {
                domain: webidentity.domain,
                thirdparty: thirdparty.name,
                block: checkbox.checked
            });
        });
        label.innerHTML = thirdparty.name;
        appendToTable(table, checkbox, label);
    }
    document.querySelector("#detected-third-parties").innerHTML =
        thirdpartiesBlocked + "/" + thirdparties.length;
}

/*
 * Initializes the social-plugin icons.
 */
function initSocialPlugins(webidentity) {
    const PATH = "interface/icons/";
    let socialplugins = webidentity.socialplugins;
    let tr = document.querySelector("#social-plugins-tr");
    tr.innerHTML = "";
    if (socialplugins.length === 0) {
        let td = document.createElement("td");
        let div = document.createElement("div");
        td.className = "plugins-logo";
        td.style["padding-top"] = "10px"; // TODO add to css
        div.className = "error-message";
        div.innerHTML = "No social plugins detected";
        td.appendChild(div);
        tr.appendChild(td);
    } else {
        for (let socialplugin of socialplugins) {
            let td = document.createElement("td"),
                img = document.createElement("img"),
                name = socialplugin.name,
                block = socialplugin.block,
                src = PATH + name + "-blocked.png",
                tooltip = name + " blocked - click to allow",
                alt_src = PATH + name + "-allowed.png",
                alt_tooltip =  name + " allowed - click to block";
            if (!block) {
                // swap variables
                [src, alt_src] = [alt_src, src];
                [tooltip, alt_tooltip] = [alt_tooltip, tooltip];
            }
            img.className = "button";
            img.id = name + "button";
            img.src = browser.extension.getURL(src);
            img.tooltiptext = tooltip;
            img.addEventListener("click", () => {
                img.src = browser.extension.getURL(alt_src);
                img.tooltiptext = alt_tooltip;
                sendMessage("toggle-socialplugin", {
                    domain: webidentity.domain,
                    socialplugin: name,
                    block: !block
                });
            });
            td.appendChild(img);
            tr.appendChild(td);
        }
    }
}

/*
 * Initializes the on/off switch for the current website.
 */
function initWebsiteToggle(webidentity) {
    let websitetoggle = document.querySelector("#websiteonoffswitch");
    websitetoggle.checked = webidentity.enabled;
    websitetoggle.addEventListener("change", () => {
        sendMessage("toggle-website", {
            domain: webidentity.domain,
            enabled: websitetoggle.checked
        });
    });
}

/*
 * Appends a checkbox and label to the table.
 */
function appendToTable(table, checkbox, label) {
    let tr = document.createElement("tr");
    let td1 = document.createElement("td");
    let td2 = document.createElement("td");
    td1.style.width = "30px"; // TODO add to css
    checkbox.type = "checkbox";
    checkbox.className = "checkbox";
    label.className = "label";
    td1.appendChild(checkbox);
    td2.appendChild(label);
    tr.appendChild(td1);
    tr.appendChild(td2);
    table.appendChild(tr);
}

/*
 * Sends a message to the background and
 * reloads the current page and popup.
 */
function sendMessage(action, content) {
    browser.runtime.sendMessage({
        action: action,
        content: content
    }).then(() => {
        browser.tabs.query({currentWindow: true, active: true}).then(tabs => {
            browser.tabs.reload(tabs[0].id);
            load();
        });
    });
}

/*
 * Gets the webidentity and detection for the domain
 * of the current page and calls the init function.
 */
function load() {
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
}

// call load() after DOM content is loaded
document.addEventListener("DOMContentLoaded", load);
// open options page when clicking on the settings wheel
document.querySelector("#settings").addEventListener("click", () => browser.runtime.openOptionsPage());
