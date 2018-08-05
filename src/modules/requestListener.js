import webIdentities from './webIdentities.js';
import detections from './detections.js';
import options from './options.js';
import publicSuffix from '../utils/publicSuffix.js';
import { getHostname } from '../utils/utils.js';
import { SOCIAL_PLUGINS } from '../utils/constants.js';

export default async function requestListener(e) {
    let target = publicSuffix.getDomain(getHostname(e.url));
    let tabs = await browser.tabs.query({currentWindow: true, active: true});
    let origin = publicSuffix.getDomain(getHostname(tabs[0].url));
    if (!origin) {
        origin = target;
    }
    let webidentity = webIdentities.getWebIdentity(origin);
    webidentity.incrementUsage();
    if (webidentity.enabled) {
        if (target !== origin && blockThirdParty(target, webidentity.thirdparties)) {
            return {cancel: true};
        }
        if (blockSocialPlugin(e.url, webidentity.socialplugins)) {
            return {cancel: true};
        }
        changeRequestHeaders(e.requestHeaders, webidentity);
    }
    return {requestHeaders: e.requestHeaders};
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
        // Remove ETag headers
        if (options.get("remove_etag") && etags.includes(name)) {
            header.value = "";
        }
    }
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
