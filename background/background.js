// Test values
var values1 = {
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9.8; rv:12.3) Gecko/20100101 Firefox/12.3.5",
        acceptEncoding: "gzip, deflate",
        appVersion: "5.0 (Macintosh; Intel Mac OS X 10.9.8; rv:12.3) Gecko/20100101 Firefox/12.3.5"
};

var values2 = {
        userAgent: "Mozilla/5.0 (X11; Linux x86_64; rv:59.0) Gecko/20100101 Firefox/59.0",
        acceptEncoding: "gzip, deflate, br",
        appVersion: "5.0 (X11)"
};

// Test functie, later vervangen
function fetchWebIdentity(url) {
    var domain = (new URL(url)).hostname;
    var webidentity = webidentities.getWebIdentity(domain);
    if (webidentity === null) {
        webidentity = {domain: domain};
        if (Math.floor(Math.random() * 2) == 0) {
            webidentity.values = values1;
        } else {
            webidentity.values = values2;
        }
        webidentities.addWebIdentity(webidentity);
    }
    return webidentity;
}

// Load web identities
webidentities.loadWebIdentities();

/*
Rewrite HTTP request headers with values from the web identity.
*/
function changeHttpHeaders(e) {
    var webidentity = fetchWebIdentity(e.url);
    for (var header of e.requestHeaders) {
        if (header.name.toLowerCase() === "user-agent") {
            header.value = webidentity.values.userAgent;
        }
        if (header.name.toLowerCase() === "accept-encoding") {
            header.value = webidentity.values.acceptEncoding;
        }
    }
    return {requestHeaders: e.requestHeaders};
}

/*
Rewrite navigator getters to return values from the web identity.
*/
function changeJSAttributes(e) {
    var webidentity = fetchWebIdentity(e.url);
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
