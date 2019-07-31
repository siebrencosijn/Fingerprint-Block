import webIdentities from './webIdentities.js';
import detections from './detections.js';
import options from './options.js';
import publicSuffix from '../utils/publicSuffix.js';
import { getHostname, getOriginUrl } from '../utils/utils.js';
import { SOCIAL_PLUGINS } from '../utils/constants.js';

export default async function requestListener(details) {
    let originUrl = await getOriginUrl(details);
    let origin = publicSuffix.getDomain(getHostname(originUrl));
    let target = publicSuffix.getDomain(getHostname(details.url));
    let webidentity = webIdentities.getWebIdentity(origin);
    if (webidentity.enabled) {
        if (target !== origin && blockThirdParty(target, webidentity.thirdparties)) {
            return {cancel: true};
        }
        if (blockSocialPlugin(details.url, webidentity.socialplugins)) {
            return {cancel: true};
        }
        changeRequestHeaders(details.requestHeaders, webidentity);
    }
    webidentity.last_used = new Date().getTime();
    webIdentities.save(webidentity);
    return {requestHeaders: details.requestHeaders};
}

/*
 * Changes HTTP request headers with values from the web identity.
 */
function changeRequestHeaders(headers, webidentity) {
    const etags = ["if-match", "if-none-match", "if-range"];
    let http = webidentity.fingerprint.http;
    let allow_ua = false;
    let detection = detections.getDetection(webidentity.domain);
    if (detection !== undefined) {
        let ua = detection.getAttribute("user-agent");
        if (ua !== undefined) {
            allow_ua = ua.action === "allow";
        }
    }
    for (let header of headers) {
        let name = header.name.toLowerCase();
        if (name === "user-agent" && !allow_ua) {
            header.value = http.userAgent;
        }
        if (name === "accept-encoding") {
            header.value = http.acceptEncoding;
        }
        if (name === "accept-language") {
            header.value = http.acceptLanguage;
        }
        // remove etag headers
        if (options.get("remove_etag") && etags.includes(name)) {
            header.value = "";
        }
    }
    // send dnt header
    if (options.get("dnt")) {
        let dnt = headers.find(h => h.name.toLowerCase() === "dnt");
        if (dnt !== undefined) {
            dnt.value = "1";
        } else {
            headers.push({name: "DNT", value: "1"});
        }
    }
    // sort headers based on order
    let order = http.order.map(h => h.toLowerCase());
    headers.sort((h1, h2) => {
        let h1_index = order.indexOf(h1.name.toLowerCase());
        let h2_index = order.indexOf(h2.name.toLowerCase());
        if (h1_index < 0 && h2_index < 0) {
            return 0;
        }
        if (h1_index < 0) {
            return 1;
        }
        if (h2_index < 0) {
            return -1;
        }
        return h1_index - h2_index;
    });
}

/*
 * Returns true if the url hosts a social plugin
 * and should be blocked, false otherwise.
 */
function blockSocialPlugin(url, socialplugins) {
    for (let pKey in SOCIAL_PLUGINS) {
        if (SOCIAL_PLUGINS[pKey].some(pUrl => url.indexOf(pUrl) !== -1)) {
            let socialplugin = socialplugins.find(sp => sp.name === pKey);
            if (socialplugin === undefined) {
                socialplugin = {name: pKey, block: options.get("block_social")};
                socialplugins.push(socialplugin);
            }
            return socialplugin.block;
        }
    }
    return false;
}

/*
 * Returns true if the 3rd party should be blocked
 * or false if the 3rd party is allowed.
 */
function blockThirdParty(url, thirdparties) {
    let thirdparty = thirdparties.find(tp => tp.name === url);
    if (thirdparty === undefined) {
        thirdparty = {name: url, block: false};
        thirdparties.push(thirdparty);
    }
    return thirdparty.block;
}
