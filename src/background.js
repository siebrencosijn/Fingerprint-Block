import webIdentities from './modules/webIdentities.js';
import requestListener from './modules/requestListener.js';
import responseListener from './modules/responseListener.js';
import messageListener  from './modules/messageListener.js';
import options from './modules/options.js';
import fingerprintGenerator from './modules/fingerprintGenerator.js';
import publicSuffix from './utils/publicSuffix.js';
import { readFile } from './utils/utils.js';

// Parse public suffix list from file
readFile('../data/public_suffix_list.dat', (list) => {
    publicSuffix.parseList(list);
});

// Load options
options.loadOptions();

// Load fingerprint generator
fingerprintGenerator.load();

// Load web identities
webIdentities.loadWebIdentities();

// Add requestListener to onBeforeSendHeaders
browser.webRequest.onBeforeSendHeaders.addListener(
    requestListener,
    {urls: ["<all_urls>"]},
    ["blocking", "requestHeaders"]
);

// Add responseListener to onBeforeRequest
browser.webRequest.onHeadersReceived.addListener(
    responseListener,
    {urls: ["<all_urls>"]},
    ["blocking","responseHeaders"]
);

// Handle communication with content script and user interface
browser.runtime.onMessage.addListener(messageListener);

// TODO move to responseListener?
// Change the Referrer-Policy of HTTP responses
//browser.webRequest.onHeadersReceived.addListener(e => {
//    const NAME = "Referrer-Policy";
//    const VALUE = "same-origin";
//    let header = e.responseHeaders.find(h => h.name.toLowerCase() === NAME.toLowerCase());
//    if (header !== undefined) {
//        header.value = VALUE;
//    } else {
//        e.responseHeaders.push({name: NAME, value: VALUE});
//    }
//    return {responseHeaders: e.responseHeaders};
//}, {urls: ["<all_urls>"]}, ["blocking", "responseHeaders"]);

// TODO save web identities and detections when extension stops running
