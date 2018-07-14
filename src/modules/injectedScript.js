/********************************************/
/* -- Fingerprint Privacy --                */
/* Author:                                  */
/* Date: 3.07.2018                          */
/********************************************/

import webIdentities from './webIdentities.js';
import detections from './detections.js';
import { DOMOBJECTS, SPOOF_ATTRIBUTES } from '../utils/constants.js';

export default function injectedScript(domain) {
    let fingerprint = webIdentities.getWebIdentity(domain).fingerprint;
    let detection = detections.getDetection(domain);
    let script = "\r\n<script type='text/javascript'>\r\n"
        + "function detected(domain, name, action) { "
            + "window.postMessage({ "
                + "direction: 'from-page-script', "
                + "message: {domain: domain, name: name, action: action} "
            + "}, '*'); "
        + "}"
        + createScript(domain, detection, fingerprint)
        + "\r\n</script>\r\n";
    return script;
}

function createScript(domain, detection, fingerprint) {
    let script = "";
    for (let domObjectKey in DOMOBJECTS) {
        let domObject = DOMOBJECTS[domObjectKey];
        for (let attributeKey in domObject) {
            let attribute = domObject[attributeKey],
                attributeName = attribute.name,
                attributeAction;
            if (detection !== undefined && detection.containsAttribute(attributeName)) {
                attributeAction = detection.getAttribute(attributeName).action;
            } else {
                attributeAction = SPOOF_ATTRIBUTES.includes(attributeName) ? "spoof" : "block";
            }
            if (attribute.simple) {
                if (attributeAction !== "allow") {
                    script += "\r\n" + domObjectKey + ".__defineGetter__('" + attributeKey + "', function() { "
                        + "detected('" + domain + "', '" + attributeName + "', '" + attributeAction + "'); ";
                    if (attributeAction === "spoof") {
                        let attributeValue = fingerprint[domObjectKey][attributeKey];
                        script += "return '" + attributeValue + "';";
                    } else {
                        script += "return undefined;";
                    }
                    script += " });";
                }
            }
        }
    }
    // TODO tijdelijk, betere oplossing zoeken
    script += "\r\nDate.prototype.getTimezoneOffset = function() { return " + fingerprint.date.timezoneOffset + "; };";
    return script;
}
