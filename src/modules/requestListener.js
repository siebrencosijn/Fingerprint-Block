import webIdentities from './webIdentities.js';

export default function requestListener(e) {
    let domain = (new URL(e.url)).hostname;
    let webidentity = webIdentities.getWebIdentity(domain);

    // TODO: Set web identity usage amount and date

    changeRequestHeaders(e.requestHeaders, webidentity);

    // TODO: Get third-parties; Add target domain to third-parties; Block third-parties

    // TODO: Block social plugins

    return {requestHeaders: e.requestHeaders};
}

/*
 * Change HTTP request headers with values from the web identity.
 */
function changeRequestHeaders(headers, webidentity) {
    for (let header of headers) {
        let name = header.name.toLowerCase();
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
}

function blockThirdParties() {
    // TODO
}

function blockSocialPlugins() {
    // TODO
}
