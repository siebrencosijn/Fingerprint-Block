import webIdentities from './modules/webIdentities.js';
import requestListener from './modules/requestListener.js';
import responseListener from './modules/responseListener.js';
import detectionListener from './modules/detectionListener.js';

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

// Adds the communication with content script
browser.runtime.onMessage.addListener(detectionListener);

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
