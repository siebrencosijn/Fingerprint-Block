/********************************************/
/* -- Fingerprint Privacy --                */
/* Date: 7.07.2019                          */
/********************************************/

import detections from './detections.js';
import { DOM_OBJECTS, ELEMENTS_PREVENTING_FONT_DETECTION, ELEMENTS_PREVENTING_CANVAS_FINGERPRINTING, SPOOF_ATTRIBUTES } from '../utils/constants.js';

const RETURN_UNDEFINED = "return (undefined);";
const SCRIPT_GENERATE_NOISE_FUNCTION= "\r\nfunction generateNoise(canvas) { "
                                        + "var imgData = canvas.getContext('2d').getImageData(0,0, canvas.width, canvas.height); " 
                                        + "for(var i=0;i<imgData.data.length;i+=4){"
                                            + "imgData.data[i+0]=Math.floor(Math.random()*256);"
                                            + "imgData.data[i+1]=Math.floor(Math.random()*256);"
                                            + "imgData.data[i+2]=Math.floor(Math.random()*256);"
                                        + "}"
                                        + "canvas.getContext('2d').putImageData(imgData,0,0);"  
                                    +"};";

export default function createInjectedScript(webidentity) {
    let domain = webidentity.domain;
    let fingerprint = webidentity.fingerprint;
    let detection = detections.getDetection(domain);
    let script = "\r\n<script type='text/javascript'>\r\n"
        + "function detected(domain, name, key, action, data) { "
        + "window.top.postMessage({ "
        + "direction: 'from-page-script', "
        + "message: {domain: domain, name: name, key: key, action: action, data: data} "
        + "}, '*') };"
        + createScriptPreventingObjectFingerprinting(DOM_OBJECTS, domain, detection, fingerprint)
        + createScriptPreventingFontDetection(ELEMENTS_PREVENTING_FONT_DETECTION, domain, detection, fingerprint)
        + createScriptPreventingCanvasFingerprinting(ELEMENTS_PREVENTING_CANVAS_FINGERPRINTING, domain, detection, fingerprint)
        + "\r\n</script>\r\n";
    return script;
}

function createScriptPreventingObjectFingerprinting(domObjects, domain, detection, fingerprint) {
    let script = "";
    for (let domObjectKey in domObjects) {
        let domObject = domObjects[domObjectKey];
        for (let attributeKey in domObject) {
            let attribute = domObject[attributeKey],
                attributeName = attribute.name,
                attributeAction = getAttributeAction(detection, attributeName);
            if (attributeAction !== "allow") {
                let functionBody = "detected('" + domain + "', '" + attributeName + "', '" + attributeKey + "', '" + attributeAction + "', null);";
                let returnStatement = getReturnStatement(attributeAction, attribute.valueType, domObjectKey, attributeKey, fingerprint);    
                if (attribute.accessType.indexOf("objectProperty") != -1) {
                    if(attribute.valueType.indexOf("storageObject") != -1) {
                        script += createScriptStorageObject(attributeKey, attribute.functionNames, functionBody, returnStatement);
                    } else {
                        script += createScriptDefineProperty(domObjectKey, attributeKey, functionBody, returnStatement);
                    }  
                } else if (attribute.accessType.indexOf("prototype") != -1) {
                    script += createScriptPrototypeProperty(domObjectKey, attributeKey, attribute, functionBody, returnStatement);
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

function getReturnStatement(attributeAction, valueType, domObjectKey, attributeKey, fingerprint) {
    let returnStatement = RETURN_UNDEFINED;
    if ( attributeAction.indexOf("spoof") != -1 && !!fingerprint && !!fingerprint[domObjectKey.toLowerCase()]) {
        let fingerprintValue = fingerprint[domObjectKey.toLowerCase()][attributeKey];
        if (valueType === 'number' || fingerprintValue === 'undefined') {
            returnStatement = "return " + fingerprintValue + ";";
        } else {
            returnStatement = "return '" + fingerprintValue + "';";
        }
    } else {
        if (valueType === "array") {
            returnStatement = "return [];"
        }
    }
    return returnStatement;
}

function createScriptStorageObject(attributeKey, functionNames, functionBody, returnStatement) {
    let script = "\r\nfor (var key in " + attributeKey + ") { "
           + createScriptDefineProperty(attributeKey, "key", functionBody, returnStatement) + "}";
    for (let functionName of functionNames) {
        createScriptDefineProperty(attributeKey, functionName, functionBody, returnStatement);
    }
    return script;
}

function createScriptPrototypeProperty(domObjectKey, attributeKey, attribute, functionBody, returnStatement) {
    let script = "";
    if (attribute.accessType.indexOf("prototypeFunction") != -1) {
        for (let functionName of attribute.functionNames) {
            script += "\r\n " + domObjectKey + ".prototype." + functionName + " = function() { " + functionBody + " " + returnStatement + "};";
        }
    } else if (attribute.accessType.indexOf("prototypeProperty") != -1) {
        script += createScriptDefineProperty(domObjectKey + ".prototype", attributeKey, functionBody, returnStatement);
    }
    return script;
}

function createScriptDefineProperty(domObject, propertyName, functionBody, returnStatement) {
    return "\r\nObject.defineProperty(" + domObject + ", '" + propertyName + "', {get: function() {"
        + functionBody + returnStatement + "}, enumerable: true });";
}

function createScriptPreventingFontDetection(domObjects, domain, detection, fingerprint) {
    let attribute, attributeAction, attributeKey, functionBody, returnStatement;
    let script = "";
    let objectKey = Object.keys(domObjects)[0];
    let attributeKeys = Object.keys(domObjects[objectKey]);
    if(!!fingerprint && !! fingerprint.fontData) {
        //height
        attributeKey = attributeKeys[0]
        attribute = domObjects[objectKey][attributeKey];
        attributeAction = getAttributeAction(detection, attribute.name);
        if(attributeAction.indexOf("allow") == -1) {
            functionBody = "detected('" + domain + "', '" + attribute.name + "', '" + attributeKey + "', '" + attributeAction + "', null);"
            returnStatement = "return "+ fingerprint.fontData.defaultHeight +";";
            script += createScriptPrototypeProperty(objectKey, attributeKey, attribute, functionBody, returnStatement);
        }
        //width
        attributeKey = attributeKeys[1]
        attribute = domObjects[objectKey][attributeKey];
        attributeAction = getAttributeAction(detection, attribute.name);
        if(attributeAction.indexOf("allow") == -1) {
            functionBody = "detected('" + domain + "', '" + attribute.name + "', '" + attributeKey + "', '" + attributeAction + "', null);"
            returnStatement = "return "+ fingerprint.fontData.defaultWidth +";";
            script += createScriptPrototypeProperty(objectKey, attributeKey, attribute, functionBody, returnStatement);
        }
    }
    return script;
}

function createScriptPreventingCanvasFingerprinting(domObjects, domain, detection, fingerprint) {
    let script = "";
    let attribute, attributeKey, attributeAction, functionBody, returnStatement, originalFunction;
    let domObjectsKeys = Object.keys(domObjects);
    
    // Functions from canvasRenderingContext2D-object
    let canvasRenderingObjectKey = domObjectsKeys[0];
    let canvasRenderingObject = domObjects[canvasRenderingObjectKey];
    for(attributeKey in canvasRenderingObject) {
        attribute = canvasRenderingObject[attributeKey];
        attributeAction = getAttributeAction(detection, attribute.name);
        if(attributeAction.indexOf("allow") == -1) {
            originalFunction = "var original_"+attributeKey + " = " + canvasRenderingObjectKey + ".prototype." + attributeKey + "; ";
            functionBody = "detected('" + domain + "', '" + attribute.name + "', '" + attributeKey + "', '" + attributeAction + "', null);";
            returnStatement = "original_"+attributeKey + ".apply(this, arguments);";
            script += "\r\n" + originalFunction 
                    + createScriptPrototypeProperty(canvasRenderingObjectKey, attributeKey, attribute, functionBody, returnStatement);
        }  
    }

    // Canvas To Data URL
    let htmlCanvasElementObjectKey = domObjectsKeys[1];
    attributeKey = Object.keys(domObjects[htmlCanvasElementObjectKey])[0];
    attribute = domObjects[htmlCanvasElementObjectKey][attributeKey];
    attributeAction = getAttributeAction(detection, attribute.name);
    if(attributeAction.indexOf("allow") == -1) { 
        originalFunction = "\r\nvar original_"+attributeKey + " = " + htmlCanvasElementObjectKey + ".prototype." + attributeKey + "; ";
        functionBody = createScriptDataToUrlFunctionBody(domain, attribute, attributeKey, attributeAction, fingerprint);
        returnStatement = " return (result);" ;
        script += originalFunction
             + createScriptPrototypeProperty(htmlCanvasElementObjectKey, attributeKey, attribute, functionBody, returnStatement);
        if (!!fingerprint && !!fingerprint.canvasData && fingerprint.canvasData.data == null) {
            script +=SCRIPT_GENERATE_NOISE_FUNCTION;
        }
    }
    return script;
}

function createScriptDataToUrlFunctionBody(domain, attribute, attributeKey, attributeAction, fingerprint) {
    let script;
    if(!!fingerprint) {
        if(!!fingerprint.canvasData && fingerprint.canvasData.data != null) {
            script = " var result = ' " + fingerprint.canvasData.data + " '; "
                + "detected('" + domain + "', '" + attribute.name + "', '" + attributeKey + "', '" + attributeAction + "', null);";
        } else {
            script = " generateNoise(this); var result = original_"+attributeKey+".apply(this, arguments); "
                + "detected('" + domain + "', '" + attribute.name + "', '" + attributeKey + "', '" + attributeAction + "', result);";
        }
    }
    return script;
}