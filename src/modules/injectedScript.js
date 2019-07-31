/********************************************/
/* -- Fingerprint Privacy --                */
/* Date: 7.07.2019                          */
/********************************************/
import detections from './detections.js';
import { DOM_OBJECTS, ELEMENTS_PREVENTING_FONT_DETECTION, ELEMENTS_PREVENTING_CANVAS_FINGERPRINTING, SPOOF_ATTRIBUTES } from '../utils/constants.js';

const RETURN_UNDEFINED = "return (undefined);";
const SCRIPT_DETECTED_FUNCTION = "function detected(domain, name, key, action, data) { "
                                    + "window.top.postMessage({ "
                                        + "direction: 'from-page-script', "
                                        + "message: {domain: domain, name: name, key: key, action: action, data: data} "
                                + "}, '*') };";
const SCRIPT_REMOVE_INJECTED_SCRIPT = "\r\nvar thisScriptElement = document.getElementById('fpblock-script');" 
                                    +"thisScriptElement.parentNode.removeChild(thisScriptElement);";

const SCRIPT_GENERATE_NOISE_FUNCTION= "\r\nfunction generateNoise(canvas) { "
                                        + "var imgData = canvas.getContext('2d').getImageData(0,0, canvas.width, canvas.height); " 
                                        + "for(var i=0;i<imgData.data.length;i+=4){"
                                            + "imgData.data[i+0]=Math.floor(Math.random()*256);"
                                            + "imgData.data[i+1]=Math.floor(Math.random()*256);"
                                            + "imgData.data[i+2]=Math.floor(Math.random()*256);"
                                        + "}"
                                        + "canvas.getContext('2d').putImageData(imgData,0,0);"  
                                    +"};";

/**
 * Creates the script that will be injected in the response from a web site.
 * @param {*} webidentity webidentity for the web site
 */                                    
export default function createInjectedScript(webidentity) {
    let domain = webidentity.domain;
    let fingerprint = webidentity.fingerprint;
    let detection = detections.getDetection(domain);
    let script = "\r\n<script id='fpblock-script' type='text/javascript'>\r\n"
        + SCRIPT_DETECTED_FUNCTION
        + createScriptPreventingStandard(DOM_OBJECTS, domain, detection, fingerprint)
        + createScriptPreventingFontDetection(ELEMENTS_PREVENTING_FONT_DETECTION, domain, detection, fingerprint)
        + createScriptPreventingCanvasFingerprinting(ELEMENTS_PREVENTING_CANVAS_FINGERPRINTING, domain, detection, fingerprint);
    // Remove this script 
    script += SCRIPT_REMOVE_INJECTED_SCRIPT;
    script +="\r\n</script>\r\n";
    return script;
}

/**
 * Creates a script code for the prevention against fingerprinting on the standard manner.
 * @param {*} domObjects objects of web browser with properties that should be spoofed/blocked
 * @param {*} domain domain
 * @param {*} detection detection for the domain
 * @param {*} fingerprint fingerprint for domain
 */
function createScriptPreventingStandard(domObjects, domain, detection, fingerprint) {
    let script = "";
    for (let domObjectKey in domObjects) {
        let domObject = domObjects[domObjectKey];
        for (let attributeKey in domObject) {
            let attribute = domObject[attributeKey],
                attributeName = attribute.name,
                attributeAction = getAttributeAction(detection, attributeName);
            if (attributeAction !== "allow") {
                let scriptDetected = "detected('" + domain + "', '" + attributeName + "', '" + attributeKey + "', '" + attributeAction + "', null);";
                let returnStatement = getReturnStatement(attributeAction, attribute.valueType, domObjectKey, attributeKey, fingerprint);    
                if (attribute.accessType.indexOf("objectProperty") != -1) {
                    if(attribute.valueType.indexOf("storageObject") != -1) {
                        script += createScriptStorageObject(attributeKey, attribute.functionNames, scriptDetected, returnStatement);
                    } else {
                        script += createScriptDefineProperty(domObjectKey, attributeKey, scriptDetected, returnStatement);
                    }  
                } else if (attribute.accessType.indexOf("prototype") != -1) {
                    script += createScriptPrototypeProperty(domObjectKey, attributeKey, attribute, scriptDetected, returnStatement);
                }
            }
        }
    }
    return script;
}

/**
 * Gets the action for the attribute with the given name saved in detection.
 * @param {*} detection detection
 * @param {*} attributeName the name of attribute
 */
function getAttributeAction(detection, attributeName) {
    let attributeAction = "block";
    if (detection !== undefined && detection.containsAttribute(attributeName)) {
        attributeAction = detection.getAttribute(attributeName).action;
    } else if (SPOOF_ATTRIBUTES.includes(attributeName)) {
        attributeAction = "spoof";
    }
    return attributeAction;
}

/**
 * Gets return statement for getter-function based on the value of attribute in the fingerprint.
 * @param {*} attributeAction the action for the attribute
 * @param {*} valueType the type of an attribute's value in an object of a web browser
 * @param {*} domObjectKey the key of an object of a web browser
 * @param {*} attributeKey the key of the attribute
 * @param {*} fingerprint the fingerprint
 */
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

/**
 * Creates script code for a storage object of a web browser.
 * @param {*} attributeKey the key of attribute
 * @param {*} functionNames the names of function in a storage object
 * @param {*} scriptDetected the script code that calls function detected
 * @param {*} returnStatement the return statement for getter-function of the attribute
 */
function createScriptStorageObject(attributeKey, functionNames, scriptDetected, returnStatement) {
    let script = "\r\nfor (var key in " + attributeKey + ") { "
           + createScriptDefineProperty(attributeKey, "key", scriptDetected, returnStatement) + "}";
    for (let functionName of functionNames) {
        createScriptDefineProperty(attributeKey, functionName, scriptDetected, returnStatement);
    }
    return script;
}

/**
 * Creates script code for the property/function accessed though the prototype of a object of a web browser.
 * @param {*} domObjectKey the key of an object of a web browser
 * @param {*} attributeKey the key of the attribute
 * @param {*} attribute the attribute-object
 * @param {*} scriptDetected the script code that calls function detected
 * @param {*} returnStatement the return statement for getter-function of the attribute
 */
function createScriptPrototypeProperty(domObjectKey, attributeKey, attribute, scriptDetected, returnStatement) {
    let script = "";
    if (attribute.accessType.indexOf("prototypeFunction") != -1) {
        for (let functionName of attribute.functionNames) {
            script += "\r\n " + domObjectKey + ".prototype." + functionName + " = function() { " + scriptDetected + " " + returnStatement + "};";
        }
    } else if (attribute.accessType.indexOf("prototypeProperty") != -1) {
        script += createScriptDefineProperty(domObjectKey + ".prototype", attributeKey, scriptDetected, returnStatement);
    }
    return script;
}

/**
 * Creates the script code that overwrites a property.
 * @param {*} domObjectName the name of an object of a web browser
 * @param {*} propertyName the name of a property
 * @param {*} scriptDetected the script code that calls function detected
 * @param {*} returnStatement the return statement for getter-function of the property
 */
function createScriptDefineProperty(domObjectName, propertyName, scriptDetected, returnStatement) {
    return "\r\nObject.defineProperty(" + domObjectName + ", '" + propertyName + "', {get: function() {"
        + scriptDetected + returnStatement + "}, enumerable: true });";
}

/**
 *  * Creates a script code for the prevention against font fingerprinting.
 * @param {*} domObjects objects of web browser with properties that should be spoofed/blocked
 * @param {*} domain domain
 * @param {*} detection detection for the domain
 * @param {*} fingerprint fingerprint for domain
 */
function createScriptPreventingFontDetection(domObjects, domain, detection, fingerprint) {
    let attribute, attributeAction, attributeKey, scriptDetected, returnStatement;
    let script = "";
    let objectKey = Object.keys(domObjects)[0];
    let attributeKeys = Object.keys(domObjects[objectKey]);
    if(!!fingerprint && !! fingerprint.fontData) {
        script += "var isHeightDetected = false; var isWidthDetected = false";
        //height
        attributeKey = attributeKeys[0]
        attribute = domObjects[objectKey][attributeKey];
        attributeAction = getAttributeAction(detection, attribute.name);
        if(attributeAction.indexOf("allow") == -1) {
            scriptDetected = "if (!isHeightDetected) {"
                        +"detected('" + domain + "', '" + attribute.name + "', '" + attributeKey + "', '" + attributeAction + "', null); "
                        +"isHeightDetected = true;}";
            returnStatement = "return "+ fingerprint.fontData.defaultHeight +";";
            script += createScriptPrototypeProperty(objectKey, attributeKey, attribute, scriptDetected, returnStatement);
        }
        //width
        attributeKey = attributeKeys[1]
        attribute = domObjects[objectKey][attributeKey];
        attributeAction = getAttributeAction(detection, attribute.name);
        if(attributeAction.indexOf("allow") == -1) {
            scriptDetected = "if (!isWidthDetected) {"
                            +"detected('" + domain + "', '" + attribute.name + "', '" + attributeKey + "', '" + attributeAction + "', null);"
                            +"isWidthDetected = true;}";
            returnStatement = "return "+ fingerprint.fontData.defaultWidth +";";
            script += createScriptPrototypeProperty(objectKey, attributeKey, attribute, scriptDetected, returnStatement);
        }
    }
    return script;
}

/**
 * Creates a script code for the prevention against cancas fingerprinting.
 * @param {*} domObjects the objects of a web browser with properties that should be spoofed/blocked
 * @param {*} domain the domain
 * @param {*} detection the detection for the domain
 * @param {*} fingerprint the fingerprint for domain
 */
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

/**
 * Creates the script code that overwrites the method dataToUrl().
 * @param {*} domain the domain
 * @param {*} attribute the attribute
 * @param {*} attributeKey the key of the attribute
 * @param {*} attributeAction the action of attribute
 * @param {*} fingerprint the fingerprint
 */
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