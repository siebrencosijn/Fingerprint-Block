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

// Change the Referrer-Policy of HTTP responses
browser.webRequest.onHeadersReceived.addListener(e => {
    const NAME = "Referrer-Policy";
    const VALUE = "same-origin";
    let header = e.responseHeaders.find(h => h.name.toLowerCase() === NAME.toLowerCase());
    if (header !== undefined) {
        header.value = VALUE;
    } else {
        e.responseHeaders.push({name: NAME, value: VALUE});
    }
    return {responseHeaders: e.responseHeaders};
}, {urls: ["<all_urls>"]}, ["blocking", "responseHeaders"]);

// Adds responseListener to onBeforeRequest
browser.webRequest.onHeadersReceived.addListener(
    responseListener,
    {urls: ["<all_urls>"]},
    ["blocking","responseHeaders"]
);

// Adds the communication with content script
browser.runtime.onMessage.addListener(detectionListener);

// Rewrite navigator getters to return values from the web identity.
//function changeJSAttributes(e) {
//    var domain = (new URL(e.url)).hostname;
//    var webidentity = webIdentities.getWebIdentity(domain);
//    browser.tabs.executeScript(e.tabId, {
//        runAt: "document_start",
//        allFrames: true,
//        code: `{
//            var script = document.createElement('script');
//            script.text = \`{
//                navigator.__defineGetter__("userAgent", () => "${webidentity.values.userAgent}");
//                navigator.__defineGetter__("appVersion", () => "${webidentity.values.appVersion}");
//            }\`;
//            document.documentElement.appendChild(script);
//        }`
//    });
//}

// Add changeJSAttributes as a listener to onCommited.
//browser.webNavigation.onCommitted.addListener(changeJSAttributes);

// TODO: save web identities to storage when extension stops running
