import webIdentities from './webIdentities.js';

export default function requestListener(e) {
    let origin = hostname(e.originUrl);
    let target = hostname(e.url);
    let webidentity = webIdentities.getWebIdentity(origin);
    webidentity.incrementUsage();
    changeRequestHeaders(e.requestHeaders, webidentity);
    // TODO: Get third-parties; Add target domain to third-parties; Block third-parties
    // TODO: Block social plugins
    return {requestHeaders: e.requestHeaders};
}

/*
 * Change HTTP request headers with values from the web identity.
 */
function changeRequestHeaders(headers, webidentity) {
    let http = webidentity.fingerprint.http;
    for (let header of headers) {
        let name = header.name.toLowerCase();
        if (name === "user-agent") {
            header.value = http.userAgent;
        }
        if (name === "accept-encoding") {
            header.value = http.acceptEncoding;
        }
        if (name === "accept-language") {
            header.value = http.acceptLanguage;
        }
        // Remove ETag headers
        //if (name === "if-match" || name === "if-none-match" || name === "if-range") {
            //console.log(name + ": " + header.value);
            //header.value = "";
            //console.log(name + ": " + header.value);
        //}
    }
}

function blockThirdParties() {
    // TODO
}

function blockSocialPlugins() {
    // TODO
}

/*
 * Returns the hostname for a url.
 */
function hostname(url) {
    return (new URL(url)).hostname;
}
