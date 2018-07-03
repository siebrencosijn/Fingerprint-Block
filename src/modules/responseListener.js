/********************************************/
/* -- Fingerprint Privacy --                */
/* Author:                                  */
/* Date: 2.07.2018                          */
/********************************************/
import injectedScript from './injectedScript.js';
import { getHostname } from '../utils/utils.js';

const CONTENT_TYPE = "Content-Type",
      TEXT_HTML = "text/html",
      TEXT_HTML_WITH_CHARSET = TEXT_HTML + "; charset";

export default function responseListener(details) {
    if (isContentType(details)) {
        let filter = browser.webRequest.filterResponseData(details.requestId);
        let decoder = new TextDecoder(getCharset(details));
        let encoder = new TextEncoder();
        filter.ondata = event => {
            let str = decoder.decode(event.data, { stream: true });
            var script = injectedScript( getHostname(details.url));
            var pattern = /(<head[^>]*>)/i;
            str = str.replace(pattern, "$1" + script)
            filter.write(encoder.encode(str));
            filter.disconnect();
        }
    }
    return {};
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
