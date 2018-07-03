/********************************************/
/* -- Fingerprint Privacy --                   */
/* Author:                                  */
/* Date: 19-ma-2018                         */
/********************************************/

/*
*   Set popup if an button is clicked.
*/
function handleClick() {
    browser.browserAction.setPopup(
        {popup: "/interface/popup/interface.html" })
}
/*
* Add an listener to an button.
*/
browser.browserAction.onClicked.addListener(handleClick);