// Load web identities
webidentities.loadWebIdentities();

// Add requestListener to onBeforeSendHeaders
browser.webRequest.onBeforeSendHeaders.addListener(
    requestListener,
    {urls: ["<all_urls>"]},
    ["blocking", "requestHeaders"]
);

// Rewrite navigator getters to return values from the web identity.
function changeJSAttributes(e) {
    var domain = (new URL(e.url)).hostname;
    var webidentity = webidentities.fetchWebIdentity(domain);
    browser.tabs.executeScript(e.tabId, {
        runAt: "document_start",
        allFrames: true,
        code: `{
            var script = document.createElement('script');
            script.text = \`{
                navigator.__defineGetter__("userAgent", () => "${webidentity.values.userAgent}");
                navigator.__defineGetter__("appVersion", () => "${webidentity.values.appVersion}");
            }\`;
            document.documentElement.appendChild(script);
        }`
    });
}

// Add changeJSAttributes as a listener to onCommited.
browser.webNavigation.onCommitted.addListener(changeJSAttributes);
