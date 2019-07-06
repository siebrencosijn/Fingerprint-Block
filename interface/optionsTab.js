function initOptions(options) {
    document.querySelector("#subtitle").innerHTML = "Settings";
    // set current options
    document.querySelector("#notify").checked = options.notify;
    document.querySelector("#dnt").checked = options.dnt;
    document.querySelector("#remove_etag").checked = options.remove_etag;
    document.querySelector("#block_tpcookies").checked = options.block_tpcookies;
    document.querySelector("#block_social").checked = options.block_social;
    // add event listeners to update options
    document.querySelectorAll("#options-list input").forEach(checkbox => {
        checkbox.addEventListener("change", () => {
            browser.runtime.sendMessage({
                action: "set-options",
                content: {
                    notify: document.querySelector("#notify").checked,
                    block_tpcookies: document.querySelector("#block_tpcookies").checked,
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
