var requestListener = (function() {
    /*
     * Change HTTP request headers with values from the web identity.
     */
    var changeRequestHeaders = function(headers, webidentity) {
        for (var header of headers) {
            var name = header.name.toLowerCase();
            if (name === "user-agent") {
                header.value = webidentity.values.userAgent;
            }
            if (name === "accept-encoding") {
                header.value = webidentity.values.acceptEncoding;
            }
            if (name === "accept-language") {
                header.value = webidentity.values.language;
            }
            // Remove ETag headers
            //if (name === "if-match" || name === "if-none-match" || name === "if-range") {
                //console.log(name + ": " + header.value);
                //header.value = "";
                //console.log(name + ": " + header.value);
            //}
        }
    };

    var blockThirdParties = function() {

    };

    var blockSocialPlugins = function() {

    };

    return function(e) {
        var domain = (new URL(e.url)).hostname;
        var webidentity = webidentities.fetchWebIdentity(domain);

        // TODO: Set web identity usage amount and date

        changeRequestHeaders(e.requestHeaders, webidentity);

        // TODO: Get third-parties; Add target domain to third-parties; Block third-parties

        // TODO: Block social plugins

        return {requestHeaders: e.requestHeaders};
    };
})();
