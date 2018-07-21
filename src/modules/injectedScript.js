/********************************************/
/* -- Fingerprint Privacy --                */
/* Author:                                  */
/* Date: 3.07.2018                          */
/********************************************/

import webIdentities from './webIdentities.js';
import detections from './detections.js';
import { DOM_OBJECTS, SPOOF_ATTRIBUTES } from '../utils/constants.js';

const RETURN_UNDEFIEND = "return (undefined);";

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
    for (let domObjectKey in DOM_OBJECTS) {
        let domObject = DOM_OBJECTS[domObjectKey];
        for (let attributeKey in domObject) {
            let attribute = domObject[attributeKey],
                attributeName = attribute.name,
                attributeAction;
            if (detection !== undefined && detection.containsAttribute(attributeName)) {
                attributeAction = detection.getAttribute(attributeName).action;
            } else {
                attributeAction = SPOOF_ATTRIBUTES.includes(attributeName) ? "spoof" : "block";
            }
            if (attributeAction !== "allow") {
                let callDetected = "detected('" + domain + "', '" + attributeName + "', '" + attributeAction + "');"
                if (attribute.type === "simple") {
                    let returnValue = RETURN_UNDEFIEND;
                    if (attributeAction === "spoof" && fingerprint) {
                        returnValue = "return '" + fingerprint[domObjectKey][attributeKey] + "';"
                    }
                    script += createScriptDefineGetter(domObjectKey, attributeKey, callDetected, returnValue);
                } else if (attribute.type === "storage") {
                    script += createScriptStorage(attributeKey, callDetected, RETURN_UNDEFIEND);
                    script += createScriptDefineGetter(domObjectKey, attributeKey, callDetected, RETURN_UNDEFIEND);
                } else if (attribute.type === "prototype") {
                    let returnValue = RETURN_UNDEFIEND;
                    if (attributeAction === "spoof" && fingerprint) {
                        returnValue = "return '" + fingerprint[domObjectKey][attributeKey] + "';"
                    }
                    script += createScriptPrototype(attribute, callDetected, returnValue);
                }
            }
        }
    }
    return script;
}

function createScriptStorage(domObject, callDetected, returnValue) {
    let attributeKeys = ["key", "getItem", "setItem", "removeItem"];
    let script = "\r\nfor (var key in " + domObject + ") { "
        + domObject + ".__defineGetter__(key, function() { "
        + callDetected + " "
        + returnValue + " }); }";
    for (let attributeKey of attributeKeys) {
        script += createScriptDefineGetter(domObject, attributeKey, callDetected, returnValue);
    }
    return script;
}

function createScriptPrototype(attribute, callDetected, returnValue) {
    let script = "";
    for (let functionName of attribute.functionNames) {
        script += "\r\n\ " + attribute.objectName + ".prototype." + functionName + " = function() {"
            + callDetected
            + returnValue + " };";
    }
    return script;
}

function createScriptDefineGetter(domObject, attributeKey, callDetected, returnValue) {
    return "\r\n" + domObject + ".__defineGetter__('" + attributeKey + "', function() { "
        + callDetected + " "
        + returnValue + " });";
}