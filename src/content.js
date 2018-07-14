// listen for messages from the injected page script
// and send to background
window.addEventListener("message", function(event) {
    if (event.source == window &&
        event.data &&
        event.data.direction === "from-page-script") {
            browser.runtime.sendMessage(event.data.message);
    }
});
