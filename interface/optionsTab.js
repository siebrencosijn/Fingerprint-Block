function initOptions(options) {
    const DEFAULT = "allow_all";
    const REJECT_THIRD_PARTY = "reject_third_party";
    const REJECT_ALL = "reject_all";
    document.querySelector("#subtitle").innerHTML = "Settings";
    // get browser setting for cookies
    browser.privacy.websites.cookieConfig.get({}).then(got => {
        let tpcookies_checkbox = document.querySelector("#block_tpcookies");
        if (got.value.behavior !== REJECT_THIRD_PARTY && got.value.behavior !== REJECT_ALL) {
            tpcookies_checkbox.checked = false;
        } else {
            tpcookies_checkbox.checked = true;
        }
        if ((got.levelOfControl === "controlled_by_this_extension") ||
            (got.levelOfControl === "controllable_by_this_extension")) {
            // add event listener to update browser setting
            tpcookies_checkbox.addEventListener("change", () => {
                browser.privacy.websites.cookieConfig.set({
                    value: {
                        behavior: tpcookies_checkbox.checked ? REJECT_THIRD_PARTY : DEFAULT,
                        nonPersistentCookies: got.value.nonPersistentCookies
                    }
                });
            });
        } else {
            console.log("Unable to set cookieConfig: check browserSettings permission");
        }
    });
    // set other options
    document.querySelector("#notify").checked = options.notify;
    document.querySelector("#dnt").checked = options.dnt;
    document.querySelector("#remove_etag").checked = options.remove_etag;
    document.querySelector("#block_tpcookies").checked = options.block_tpcookies;
    document.querySelector("#block_social").checked = options.block_social;
    // add event listeners to update options
    document.querySelectorAll("#options-list input:not(.browsersetting)").forEach(checkbox => {
        checkbox.addEventListener("change", () => {
            browser.runtime.sendMessage({
                action: "set-options",
                content: {
                    notify: document.querySelector("#notify").checked,
                    dnt: document.querySelector("#dnt").checked,
                    remove_etag: document.querySelector("#remove_etag").checked,
                    block_social: document.querySelector("#block_social").checked
                }
            });
        });
    });
}

function showOptions() {
    browser.runtime.sendMessage({
        action: "get-options"
    }).then(message => {
        initOptions(message.response);
    });
    show("options");
}
