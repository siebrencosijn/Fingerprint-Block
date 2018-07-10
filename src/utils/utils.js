/* Utility methods */

/*
 * Returns the hostname for a url.
 */
export function getHostname(url) {
    return (new URL(url)).hostname;
}
