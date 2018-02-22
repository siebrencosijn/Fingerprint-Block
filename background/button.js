function handleClick () {
    browser.browserAction.setPopup(
      //details https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/browserAction/setPopup
    )  
}

browser.browserAction.onClicked.addListener(handleClick);
