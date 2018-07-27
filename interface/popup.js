function init(webidentity, detection) {
    document.querySelector("#domain").innerHTML = webidentity.domain;
    // TODO
}

document.addEventListener("DOMContentLoaded", () => {
    browser.tabs.query({currentWindow: true, active: true}).then((tabs) => {
        let url = tabs[0].url;
        browser.runtime.sendMessage({
            action: "get-webidentity-detection",
            content: url
        }).then(message => {
            let webidentity = message.response.webidentity;
            let detection = message.response.detection;
            init(webidentity, detection);
        });
    });
});

document.querySelector("#settings").addEventListener("click", () => browser.runtime.openOptionsPage());
