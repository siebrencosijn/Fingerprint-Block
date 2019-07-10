/**
 * Initializes the dynamic parts of the pop-up.
 *
 * @param {WebIdentity} webidentity - The web identity for this domain.
 * @param {Detection} detection - The detection for this domain.
 */
function initOverview(webidentity, detection) {
    if (webidentity !== undefined) {
        document.querySelector("#subtitle").innerHTML = webidentity.domain;
        initSocialPlugins(webidentity);
        initAttributes(detection);
        initThirdParties(webidentity);
        initWebsiteToggle(webidentity);
    } else {
        // no web identity for this tab
        // e.g. about:blank, about:newtab
        document.querySelector("#subtitle").innerHTML = "Overview";
    }
}

/**
 * Initializes the attributes table.
 *
 * @param {Detection} detection - The detection for this domain.
 */
function initAttributes(detection) {
    let attrSpoofedBlocked = 0;
    let length = 0;
    if (detection !== undefined) {
        let ul = document.querySelector("#attribute-list");
        ul.innerHTML = "";
        let attributes = detection.attributes;
        length = attributes.length;
        for (let attribute of attributes) {
            let blocked = attribute.action === "spoof" || attribute.action === "block";
            if (blocked) {
                attrSpoofedBlocked++;
            }
            let li = document.createElement("li");
            let label = document.createElement("label");
            let input = document.createElement("input");
            label.className = "browser-style checkbox-label";
            input.type = "checkbox";
            input.checked = !blocked;
            input.addEventListener("change", () => {
                sendMessage("toggle-attribute", {
                    domain: detection.domain,
                    attribute: attribute.name,
                    block: !input.checked
                });
            });
            label.appendChild(input);
            label.appendChild(document.createTextNode(attribute.name));
            li.appendChild(label);
            ul.appendChild(li);
        }
    }
    document.querySelector("#detected-attributes").innerHTML =
        attrSpoofedBlocked + "/" + length;
}

/**
 * Initializes the third-parties table.
 *
 * @param {WebIdentity} webidentity - The web identity for this domain.
 */
function initThirdParties(webidentity) {
    let thirdparties = webidentity.thirdparties;
    let thirdpartiesBlocked = 0;
    let ul = document.querySelector("#third-party-list");
    ul.innerHTML = "";
    for (let thirdparty of thirdparties) {
        let blocked = thirdparty.block;
        if (blocked) {
            thirdpartiesBlocked++;
        }
        let li = document.createElement("li");
        let label = document.createElement("label");
        let input = document.createElement("input");
        label.className = "browser-style checkbox-label";
        input.type = "checkbox";
        input.checked = !blocked;
        input.addEventListener("change", () => {
            sendMessage("toggle-thirdparty", {
                domain: webidentity.domain,
                thirdparty: thirdparty.name,
                block: !input.checked
            });
        });
        label.appendChild(input);
        label.appendChild(document.createTextNode(thirdparty.name));
        li.appendChild(label);
        ul.appendChild(li);
    }
    document.querySelector("#detected-third-parties").innerHTML =
        thirdpartiesBlocked + "/" + thirdparties.length;
}

/**
 * Initializes the social-plugin icons.
 *
 * @param {WebIdentity} webidentity - The web identity for this domain.
 */
function initSocialPlugins(webidentity) {
    const PATH = "interface/icons/";
    let socialplugins = webidentity.socialplugins;
    if (socialplugins.length > 0) {
        let div = document.querySelector("#social-plugins-list");
        div.innerHTML = "";
        for (let socialplugin of socialplugins) {
            let input = document.createElement("input"),
                name = socialplugin.name,
                block = socialplugin.block,
                src = PATH + name + "-blocked.png",
                tooltip = "click to allow " + name,
                alt_src = PATH + name + "-allowed.png",
                alt_tooltip = "click to block " + name;
            if (!block) {
                [src, alt_src] = [alt_src, src];
                [tooltip, alt_tooltip] = [alt_tooltip, tooltip];
            }
            input.type = "image";
            input.src = browser.extension.getURL(src);
            input.title = tooltip;
            input.addEventListener("click", () => {
                input.src = browser.extension.getURL(alt_src);
                input.title = alt_tooltip;
                sendMessage("toggle-socialplugin", {
                    domain: webidentity.domain,
                    socialplugin: name,
                    block: !block
                });
            });
            div.appendChild(input);
        }
    }
}

/**
 * Initializes the on/off switch for the current website.
 *
 * @param {WebIdentity} webidentity - The web identity for this domain.
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

/**
 * Sends a message to the background and
 * reloads the current page and popup.
 *
 * @param {string} action - Key of the message action.
 * @param {*} content - Content of the message.
 */
function sendMessage(action, content) {
    browser.runtime.sendMessage({
        action: action,
        content: content
    }).then(() => {
        browser.tabs.query({currentWindow: true, active: true}).then(tabs => {
            browser.tabs.reload(tabs[0].id);
            showOverview();
        });
    });
}

/**
 * Gets the webidentity and detection for the domain
 * of the current page and calls the init function.
 */
function showOverview() {
    browser.tabs.query({currentWindow: true, active: true}).then(tabs => {
        let url = tabs[0].url;
        browser.runtime.sendMessage({
            action: "get-webidentity-detection",
            content: url
        }).then(message => {
            let webidentity = message.response.webidentity;
            let detection = message.response.detection;
            initOverview(webidentity, detection);
        });
    });
    show("overview");
}
