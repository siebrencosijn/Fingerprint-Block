// display current options in form after DOM content is loaded 
document.addEventListener("DOMContentLoaded", () => {
    browser.runtime.sendMessage({
        action: "get-options"
    }).then(message => {
        let options = message.response;
        document.querySelector("#notify").checked = options.notify;
        document.querySelector("#block_tpcookies").checked = options.block_tpcookies;
        document.querySelector("#dnt").checked = options.dnt;
        document.querySelector("#remove_etag").checked = options.remove_etag;
        document.querySelector("#block_social").checked = options.block_social;
        document.querySelector("#block_browser").checked = options.block_browser;
    });
});

// save selected options after submitting form
document.querySelector("form").addEventListener("submit", (e) => {
    let options = {
        notify: document.querySelector("#notify").checked,
        block_tpcookies: document.querySelector("#block_tpcookies").checked,
        dnt: document.querySelector("#dnt").checked,
        remove_etag: document.querySelector("#remove_etag").checked,
        block_social: document.querySelector("#block_social").checked,
        block_browser: document.querySelector("#block_browser").checked
    };
    browser.runtime.sendMessage({
        action: "set-options",
        content: options
    });
    e.preventDefault();
});
