// listens to message of eventListener from a page.
window.addEventListener("message", function(event) {
    if (event.source == window &&
        event.data &&
        event.data.direction == "from-page-script") {
            browser.runtime.sendMessage(event.data.message);
    }
});
