import webIdentities from './webIdentities.js';
import options from './options.js';
import { getHostname } from '../utils/utils.js';
import { SOCIAL_PLUGINS } from '../utils/constants.js';

export default function requestListener(e) {
    let domain = e.originUrl == null ? getHostname(e.url) : getHostname(e.originUrl);
    let webidentity = webIdentities.getWebIdentity(domain);
    webidentity.incrementUsage();
    if (blockSocialPlugin(e.url, webidentity)) {
        return {cancel: true};
    }
    changeRequestHeaders(e.requestHeaders, webidentity);
    // TODO: Get third-parties; Add target domain to third-parties; Block third-parties
    return {requestHeaders: e.requestHeaders};
}

/*
 * Changes HTTP request headers with values from the web identity.
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

/*
 * Returns true if the url hosts a social plugin
 * and should be blocked, false otherwise.
 */
function blockSocialPlugin(url, webidentity) {
    let socialplugins = webidentity.socialplugins;
    for (let plugin in SOCIAL_PLUGINS) {
        if (SOCIAL_PLUGINS[plugin].some(s => url.indexOf(s) !== -1)) {
            if (socialplugins[plugin] === undefined) {
                socialplugins[plugin] = options.get("block_social");
            }
            return socialplugins[plugin];
        }
    }
    return false;
}
