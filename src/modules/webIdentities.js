var webIdentities = (function () {
    var webidentities = [];

    /*
     * Load web identities from browser local storage.
     */
    var loadWebIdentities = function() {
        browser.storage.local.get("webidentities").then(function(result) {
            if (Object.getOwnPropertyNames(result).length != 0) {
                webidentities = result;
            }
        });
    };

    /*
     * Save web identities to browser local storage.
     */
    var saveWebIdentities = function() {
        browser.storage.local.set({"webidentities": webidentities});
    };

    /*
     * Clear all web identities saved in browser local storage.
     */
    var clearWebIdentities = function() {
        browser.storage.local.remove("webidentities");
    };

    /*
     * Return all web identities.
     */
    var getWebIdentities = function() {
        return webidentities;
    };

    /*
     * Return (or create) the web identity for the given domain.
     */
    var fetchWebIdentity = function(domain) {
        var webidentity;
        for (var i = 0; i < webidentities.length; i++) {
            webidentity = webidentities[i];
            if (webidentity.domain === domain) {
                return webidentity;
            }
        }
        webidentity = {domain: domain};
        webidentity.values = randomFingerprintGenerator.generate();
        webidentities.push(webidentity);
        return webidentity;
    };

    /*
     * Remove the web identity for the given domain from the array of web identities.
     */
    var removeWebIdentity = function(domain) {
        for (var i = 0; i < webidentities.length; i++) {
            var webidentity = webidentities[i];
            if (webidentity.domain === domain) {
                webidentities.splice(i, 1);
                return;
            }
        }
    };

    return {
        loadWebIdentities: loadWebIdentities,
        saveWebIdentities: saveWebIdentities,
        clearWebIdentities: clearWebIdentities,
        getWebIdentities: getWebIdentities,
        fetchWebIdentity: fetchWebIdentity,
        removeWebIdentity: removeWebIdentity
    };
})();
