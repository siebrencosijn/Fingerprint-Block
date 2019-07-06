/* Utility methods */

/*
 * Returns the hostname for a url.
 */
export function getHostname(url) {
    return (new URL(url)).hostname;
}

/*
 * Returns the origin URL of a request.
 */
export async function getOriginUrl(details) {
    if (details.parentFrameId === -1) {
        return details.originUrl || details.url;
    } else {
        let tab = await browser.tabs.get(details.tabId);
        return tab.url;
    }
}

/*
 * Returns the contents of a file as a text string.
 */
export function readFile(path, callback) {
    fetch(path, {mode:"same-origin"}).then(function(response) {
        return response.blob();
    }).then(function(blob) {
        let reader = new FileReader();
        reader.addEventListener("loadend", function() {
            callback(this.result);
        });
        reader.readAsText(blob);
    });
}
