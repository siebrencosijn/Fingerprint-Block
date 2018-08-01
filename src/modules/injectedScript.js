/********************************************/
/* -- Fingerprint Privacy --                */
/* Author:                                  */
/* Date: 3.07.2018                          */
/********************************************/

import detections from './detections.js';
import { DOM_OBJECTS, SPOOF_ATTRIBUTES } from '../utils/constants.js';

const RETURN_UNDEFINED = "return (undefined);";

export default function injectedScript(webidentity) {
    let domain = webidentity.domain;
    let fingerprint = webidentity.fingerprint;
    let detection = detections.getDetection(domain);
    let script = "\r\n<script type='text/javascript'>\r\n"
        + "function detected(domain, name, key, action) { "
        + "window.postMessage({ "
        + "direction: 'from-page-script', "
        + "message: {domain: domain, name: name, key: key, action: action} "
        + "}, '*') };"
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
                let callDetected = "detected('" + domain + "', '" + attributeName + "', '" + attributeKey + "', '" + attributeAction + "');";
                let returnValue = RETURN_UNDEFINED;
                if (attribute.type === "direct") {
                    if (attributeAction === "spoof" && fingerprint) {
                        let fingerpintValue = fingerprint[domObjectKey][attributeKey];
                        if (attribute.typeOfValue === "number" || fingerpintValue === 'undefined') {
                            returnValue = "return " + fingerpintValue + ";";
                        } else {
                            returnValue = "return '" + fingerpintValue + "';";
                        }
                    }
                    script += createScriptDefineGetter(domObjectKey, attributeKey, callDetected, returnValue);
                } else if (attribute.type === "storage") {
                    script += createScriptStorage(attribute, callDetected, RETURN_UNDEFINED);
                    script += createScriptDefineGetter(domObjectKey, attributeKey, callDetected, RETURN_UNDEFINED);
                } else if (attribute.type === "prototype") {
                    let returnValue = RETURN_UNDEFINED;
                    if (domObjectKey === "HTMLElement") {
                        returnValue = "return " + DOM_OBJECTS[domObjectKey][attributeKey].var + ";";
                    } else if (attributeAction === "spoof" && fingerprint) {
                        let fingerprintValue = fingerprint[domObjectKey][attributeKey];
                        if (attribute.typeOfValue === 'number' || fingerprintValue === 'undefined') {
                            returnValue = "return " + fingerprintValue + ";";
                        } else {
                            returnValue = "return '" + fingerprintValue + "';";
                        }
                    }
                    script += createScriptPrototype(attribute, callDetected, returnValue);
                } else if (attribute.type === "plugins" || attribute.type === "mimeTypes") {
                    let returnValue = "return [];"
                    script += createScriptDefineGetter(domObjectKey, attributeKey, callDetected, returnValue);
                }
            }
        }
    }
    script += createScriptPrevetingFontDetection();
    return script;
}

function createScriptStorage(domObject, callDetected, returnValue) {
    let functionsNames = domObject.functionNames;
    let script = "\r\nfor (var key in " + domObject.objectName + ") { "
        + domObject.objectName + ".__defineGetter__(key, function() { "
        + callDetected + " "
        + returnValue + " }); }";
    for (let functionName of functionsNames) {
        script += createScriptDefineGetter(domObject.objectName, functionName, callDetected, returnValue);
    }
    return script;
}

function createScriptPrototype(attribute, callDetected, returnValue) {
    let script = "";
    for (let functionName of attribute.functionNames) {
        if (attribute.name === "Timezone") {
            script += "\r\n " + attribute.objectName + ".prototype." + functionName + " = function() { " + callDetected + " " + returnValue + "};";
        } else {
            script += createScriptDefineGetter(attribute.objectName + ".prototype", functionName, callDetected, returnValue);
        }

    }
    return script;
}

function createScriptDefineGetter(domObject, propertyName, callDetected, returnValue) {
    return "\r\nObject.defineProperty(" + domObject + ", '" + propertyName + "', {get: function() {"
        + callDetected + returnValue + "} });";
}

function createScriptPrevetingFontDetection() {
    let script = "";
    return script;
}
