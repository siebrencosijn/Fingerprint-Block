var useragent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.131 Safari/537.36";
var accept = "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8";
var acceptencoding = "gzip,deflate,sdch";

/*
Change the user-agent, accept and accept-encoding HTTP headers.
*/
function changeHttpHeaders(e) {
    for (var header of e.requestHeaders) {
        if (header.name.toLowerCase() === "user-agent") {
            header.value = useragent;
        }
        if (header.name.toLowerCase() === "accept") {
            header.value = accept;
        }
        if (header.name.toLowerCase() === "accept-encoding") {
            header.value = acceptencoding;
        }
    }
    return {requestHeaders: e.requestHeaders};
}

/*
Add changeHttpHeaders as a listener to onBeforeSendHeaders.
*/
browser.webRequest.onBeforeSendHeaders.addListener(
    changeHttpHeaders,
    {urls: ["<all_urls>"]},
    ["blocking", "requestHeaders"]
);
