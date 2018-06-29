/*
 * Save options using browser.storage.local.
 */
function saveOptions(e) {
    browser.storage.local.set({
        fpblock_options: {
            notify: document.querySelector("#notify").checked,
            block_thirdparty: document.querySelector("#block_thirdparty").checked,
            dnt: document.querySelector("#dnt").checked,
            remove_etag: document.querySelector("#remove_etag").checked,
            block_social: document.querySelector("#block_social").checked,
            block_browser: document.querySelector("#block_browser").checked
        }
    });
    e.preventDefault();
}

/*
 * Update UI with options retrieved from storage (or default options).
 */
function restoreOptions(options) {
    if (Object.keys(options).length === 0) {
        // no options set, using defaults
        options = default_options;
    } else {
        options = options.fpblock_options;
    }
    document.querySelector("#notify").checked = options.notify,
    document.querySelector("#block_thirdparty").checked = options.block_thirdparty,
    document.querySelector("#dnt").checked = options.dnt,
    document.querySelector("#remove_etag").checked = options.remove_etag,
    document.querySelector("#block_social").checked = options.block_social,
    document.querySelector("#block_browser").checked = options.block_browser
}

let default_options = {
    notify: true,
    block_thirdparty: true,
    dnt: true,
    remove_etag: false,
    block_social: true,
    block_browser: true
}

browser.storage.local.get("fpblock_options").then(restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
