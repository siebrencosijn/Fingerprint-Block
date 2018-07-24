import webIdentities from './modules/webIdentities.js';
import requestListener from './modules/requestListener.js';
import responseListener from './modules/responseListener.js';
import detectionListener from './modules/detectionListener.js';
import options from './modules/options.js';
import publicSuffix from './utils/publicSuffix.js';
import { readFile } from './utils/utils.js';

// Parse public suffix list from file
readFile('../data/public_suffix_list.dat', (list) => {
    publicSuffix.parseList(list);
});

// Load options
options.loadOptions();

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
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "detection") {
        detectionListener(message.content);
    } else if (message.action === "get-options") {
        sendResponse({ response: options.getAll() });
    } else if (message.action === "set-options") {
        options.setOptions(message.content);
    }
});

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
