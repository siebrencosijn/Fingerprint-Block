import webIdentities from './webIdentities.js';
import { getHostname } from '../utils/utils.js';

export default function requestListener(e) {
    let target = getHostname(e.url);
    let origin = e.originUrl == null ? target : getHostname(e.originUrl);
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
