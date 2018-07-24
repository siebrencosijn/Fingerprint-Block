/* Utility methods */

/*
 * Returns the hostname for a url.
 */
export function getHostname(url) {
    return (new URL(url)).hostname;
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
