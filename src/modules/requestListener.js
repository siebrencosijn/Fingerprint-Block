import webIdentities from './webIdentities.js';
import options from './options.js';
import { getHostname } from '../utils/utils.js';

export default function requestListener(e) {
    if (blockSocialPlugin(e.url)) {
        return {cancel: true};
    }
    let target = getHostname(e.url);
    let domain = e.originUrl == null ? target : getHostname(e.originUrl);
    let webidentity = webIdentities.getWebIdentity(domain);
    webidentity.incrementUsage();
    changeRequestHeaders(e.requestHeaders, webidentity);
    // TODO: Get third-parties; Add target domain to third-parties; Block third-parties
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
        if (name === "if-match" || name === "if-none-match" || name === "if-range") {
            header.value = "";
        }
    }
}

function blockSocialPlugin(url) {
    // TODO
    return false;
}
