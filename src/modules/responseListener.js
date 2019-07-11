/********************************************/
/* -- Fingerprint Privacy --                */
/* Date: 2.07.2018                          */
/********************************************/
import createInjectedScript from './injectedScript.js';
import webIdentities from './webIdentities.js';
import publicSuffix from '../utils/publicSuffix.js';
import { getHostname, getOriginUrl } from '../utils/utils.js';

const CONTENT_TYPE = "Content-Type",
      TEXT_HTML = "text/html",
      TEXT_HTML_WITH_CHARSET = TEXT_HTML + "; charset";

export default async function responseListener(details) {
    let originUrl = await getOriginUrl(details);
    let origin = publicSuffix.getDomain(getHostname(originUrl));
    let webidentity = webIdentities.getWebIdentity(origin);
    if (webidentity.enabled && isContentType(details)) {
        let filter = browser.webRequest.filterResponseData(details.requestId);
        let decoder = new TextDecoder(getCharset(details));
        let encoder = new TextEncoder();
        filter.ondata = event => {
            let str = decoder.decode(event.data, { stream: true });
            var script = "\r\n<meta charset='utf-8'>" + createInjectedScript(webidentity);
            var pattern = /(<head[^>]*>)/i;
            str = str.replace(pattern, "$1" + script);
            filter.write(encoder.encode(str));
            filter.disconnect();
        };
    }
}

/*
* Returns whether a content type is 'text/html'.
*/
function isContentType(details) {
    if (getContentTypeValue(details, TEXT_HTML)) {
        return true;
    }
    return false;
}

/*
* Returns a charset from response header 'content-type' if it exits.
*/
function getCharset(details) {
    var charset = "utf-8";
    let contentTypeValue = getContentTypeValue(details, TEXT_HTML_WITH_CHARSET);
    if (contentTypeValue) {
        let index = contentTypeValue.toLowerCase().indexOf("=");
        charset = contentTypeValue.toLowerCase().slice(index + 1);
    }
    return charset;
}

/*
* Returns a value of a response header 'content-type' if it contains of a specific substring.
*/
function getContentTypeValue(details, substring) {
    var value = null;
    let contentType = getResponseHeader(details, CONTENT_TYPE);
    if (contentType !== undefined && contentType.value.toLowerCase().includes(substring.toLowerCase())) {
        value = contentType.value;
    }
    return value;
}

/*
* Returns a response header for a header-name.
*/
function getResponseHeader(details, headername) {
    return details.responseHeaders.find(
        h => h.name.toLowerCase() === headername.toLowerCase()
    );
}
