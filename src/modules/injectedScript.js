/********************************************/
/* -- Fingerprint Privacy --                */
/* Author:                                  */
/* Date: 3.07.2018                          */
/********************************************/

import webIdentities from './webIdentities.js';
import detections from './detections.js';
import Detection from '../classes/Detection.js'
import DOMObjects from '../constants/DOMObjects.js';
import SPOOF_ATTRIBUTES from '../constants/SpoofAttributes.js';
//import Attribute from '../classes/Attribute.js';

export default function injectedScript(domain) {
    let script = "";
    let webIdentity = getWebIdentity(domain);
    if (webIdentity) {
        let fingerprint = getFingerprint(webIdentity);
        let detection;
        try {
            detection = detections.getDetection(domain);
        } catch (e) {
            detection = null;
        }

        script += "\r\n<script type=\"text/javascript\">";
        script += "\r\n/* FingerPrint-Block (C) developed by Christof Torres 2014 - 2015. */";
        
        // adds eventListener for DetectionEvent
        script += "\r\ndocument.addEventListener('DetectionEvent', function(event) {"
            + "window.postMessage({ "
            + "   direction: \"from-page-script\", "
            + "   message: event.target.getAttribute('attribute') "
            + "}, \"*\");"
            + "} ,"
            + "false, true); ";
        // adds scriptcode for adding events DetectionEvent 
        //           and defineGetter functions for attributes 
        script += createScript(domain, detection, fingerprint);
        script += "\r\n</script>\r\n";
        

    }
    return script;
}

function createScript(domain, detection, fingerprint) {
    let script = "";
    for (let domObjectKey in DOMObjects) {
        for (let propertyKey in DOMObjects[domObjectKey].properties) {
            let property = DOMObjects[domObjectKey].properties[propertyKey];
            let attributeAction;
            try {
                attributeAction = detection.getAttribute(property.name).action;
            } catch (e) {
                attributeAction = null;
            }
            if (property.simple) {
                if (attributeAction != "allow") {
                    script += "\r\n"+domObjectKey+".__defineGetter__('" + property.code + "', function(){"
                        + "var element = document.createElement('DetectionDataElement'); "
                        + "element.setAttribute('attribute', '" + domain + ":" + property.name + "'); "
                        + "document.documentElement.appendChild(element); "
                        + "var event =  new Event('DetectionEvent', {'bubbles':true, 'cancelable':false}); "
                        + "element.dispatchEvent(event);";
                    if (attributeAction == "spoof" && fingerprint != null) {
                        let obj = fingerprint[domObjectKey];
                        script += " return('" + obj[propertyKey] + "');";
                    } else {
                        script += " return(undefined);";
                    }
                    script += " });"
                }
            }
        }
    }
    return script;
}



/*
* Returns the webIdentities for a domain.
*/
function getWebIdentity(domain) {
    let webIdentity = null;
    try {
        webIdentity = webIdentities.getWebIdentity(domain);
    } catch (e) { }

    return webIdentity;
}

/* 
* Returns the fingerprint for a webIdentity.
*/
function getFingerprint(webIdentity) {
    let fingerprint = null;
    try {
        fingerprint = webIdentity.fingerprint;
    } catch (e) { }
    return fingerprint;
}

/*
* Returns the attributes for a domain.
*/
function getAttributes(domain) {
    let attributes = null;
    try {
        attributes = detections.getDetection(domain).attributes;
    } catch (e) { }
    return attributes;
}