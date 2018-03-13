var webidentities = (function () {
    var webidentities = [];

    /*
    Load web identities from browser local storage.
    */
    var loadWebIdentities = function() {
        browser.storage.local.get("webidentities").then(function(result) {
            if (Object.getOwnPropertyNames(result).length != 0) {
                webidentities = result;
            }
        });
    };

    /*
    Save web identities to browser local storage.
    */
    var saveWebIdentities = function() {
        browser.storage.local.set({"webidentities": webidentities});
    };

    /*
    Clear all web identities saved in browser local storage.
    */
    var clearWebIdentities = function() {
        browser.storage.local.remove("webidentities");
    };

    /*
    Return all web identities.
    */
    var getWebIdentities = function() {
        return webidentities;
    };

    /*
    Return the web identity for the given domain or null if no web identity is found.
    */
    var getWebIdentity = function(domain) {
        for (var i = 0; i < webidentities.length; i++) {
            var webidentity = webidentities[i];
            if (webidentity.domain === domain) {
                return webidentity;
            }
        }
        return null;
    };

    /*
    Add a web identity to the array of web identities.
    */
    var addWebIdentity = function(webidentity) {
        webidentities.push(webidentity);
        saveWebIdentities();
    };

    /*
    Remove the web identity for the given domain from the array of web identities.
    */
    var removeWebIdentity = function(domain) {
        for (var i = 0; i < webidentities.length; i++) {
            var webidentity = webidentities[i];
            if (webidentity.domain === domain) {
                webidentities.splice(i, 1);
                return;
            }
        }
    }

    return {
        loadWebIdentities: loadWebIdentities,
        clearWebIdentities: clearWebIdentities,
        getWebIdentities: getWebIdentities,
        getWebIdentity: getWebIdentity,
        addWebIdentity: addWebIdentity,
        removeWebIdentity: removeWebIdentity
    }
})();
