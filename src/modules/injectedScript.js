/********************************************/
/* -- Fingerprint Privacy --                */
/* Author:                                  */
/* Date: 3.07.2018                          */
/********************************************/

import detections from './detections.js';
import { DOM_OBJECTS, ELEMENTS_PREVENTING_FONT_DETECTION, SPOOF_ATTRIBUTES } from '../utils/constants.js';

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
        + createScript(DOM_OBJECTS, domain, detection, fingerprint)
        + createScriptPrevetingFontDetection(ELEMENTS_PREVENTING_FONT_DETECTION, domain, detection, fingerprint)
        + "\r\n</script>\r\n";
    return script;
}

function createScript(domObjects, domain, detection, fingerprint) {
    let script = "";
    for (let domObjectKey in domObjects) {
        let domObject = domObjects[domObjectKey];
        for (let attributeKey in domObject) {
            let attribute = domObject[attributeKey],
                attributeName = attribute.name,
                attributeAction = getAttributeAction(detection, attributeName);
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
                        returnValue = "return " + domObjects[domObjectKey][attributeKey].var + ";";
                    } else if (attributeAction === "spoof" && fingerprint) {
                        let fingerprintValue = fingerprint[domObjectKey][attributeKey];
                        if (attribute.typeOfValue === 'number' || fingerprintValue === 'undefined') {
                            returnValue = "return " + fingerprintValue + ";";
                        } else {
                            returnValue = "return '" + fingerprintValue + "';";
                        }
                    }
                    script += createScriptPrototype(attribute, callDetected, returnValue);
                } else if (attribute.type === "array") {
                    let returnValue = "return [];"
                    script += createScriptDefineGetter(domObjectKey, attributeKey, callDetected, returnValue);
                }
            }
        }
    }
    return script;
}

function getAttributeAction(detection, attributeName) {
    let attributeAction = "block";
    if (detection !== undefined && detection.containsAttribute(attributeName)) {
        attributeAction = detection.getAttribute(attributeName).action;
    } else if (SPOOF_ATTRIBUTES.includes(attributeName)) {
        attributeAction = "spoof";
    }
    return attributeAction;
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

function createScriptPrevetingFontDetection(domObjects, domain, detection, fingerprint) {
    let script = "";
    script += "\r\nvar width=0; var height=0;"
        + "\r\ndocument.addEventListener('DOMContentLoaded', () => {"
        + "var h = document.getElementsByTagName('BODY')[0];"
        + "var d = document.createElement('DIV');"
        + "var s = document.createElement('SPAN');"
        + "d.appendChild(s);"
        + "d.style.fontFamily = 'sans';"
        + "s.style.fontFamily = 'sans';"
        + "s.style.fontSize = '72px';"
        + "s.style.backgroundColor = 'white';"
        + "s.style.color = 'white';"
        + "s.innerHTML = 'mmmmmmmmmmlil';"
        + "h.appendChild(d);"
        + "width = s.offsetWidth;"
        + "height = s.offsetHeight;"
        + "h.removeChild(d);"
        + "});";
    script += createScript(domObjects, domain, detection, fingerprint);
    return script;
}
