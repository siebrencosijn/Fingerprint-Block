"use strict";

// test values
var webidentity = {
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9.8; rv:12.3) Gecko/20100101 Firefox/12.3.5",
    acceptEncoding: "gzip, deflate",
    appVersion: "5.0 (Macintosh; Intel Mac OS X 10.9.8; rv:12.3) Gecko/20100101 Firefox/12.3.5"
}

function changeHttpHeaders(e) {
    for (var header of e.requestHeaders) {
        if (header.name.toLowerCase() === "user-agent") {
            header.value = webidentity.userAgent;
        }
        if (header.name.toLowerCase() === "accept-encoding") {
            header.value = webidentity.acceptEncoding;
        }
    }
    return {requestHeaders: e.requestHeaders};
}

function changeJSAttributes(e) {
    browser.tabs.executeScript(e.tabId, {
        runAt: "document_start",
        allFrames: true,
        code: `{
            var script = document.createElement('script');
            script.text = \`{
                navigator.__defineGetter__("userAgent", () => "${webidentity.userAgent}");
                navigator.__defineGetter__("appVersion", () => "${webidentity.appVersion}");
            }\`;
            document.documentElement.appendChild(script);
        }`
    });
}

/*
Add changeHttpHeaders as a listener to onBeforeSendHeaders.
*/
browser.webRequest.onBeforeSendHeaders.addListener(
    changeHttpHeaders,
    {urls: ["<all_urls>"]},
    ["blocking", "requestHeaders"]
);

/*
Add changeJSAttributes as a listener to onCommited.
*/
browser.webNavigation.onCommitted.addListener(changeJSAttributes);
