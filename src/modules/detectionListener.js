import Detection from "../classes/Detection.js";
import detections from "./detections.js";
import SPOOF_ATTRIBUTES from "../constants/SpoofAttributes.js";
import Attribute from "../classes/Attribute.js";

/********************************************/
/* -- Fingerprint Privacy --                */
/* Author:                                  */
/* Date: 5.07.2018                          */
/********************************************/

export default function detectionListener(message) {
    let notify = true;//browser.storage.local.get("fpblock_options").notify;
    if (message) {
        let attribute = message.split(":");
        let detection = detections.getDetection(attribute[0]);
        let canvas = { detected: false, colors: 0, width: 0, height: 0, format: null }
        if (detection == undefined) {
            let attributes = [];
            if (SPOOF_ATTRIBUTES.includes(attribute[1])) {
                attributes.push(new Attribute(attribute[1], "spoof"));
            } else {
                attributes.push(new Attribute(attribute[1], "block"));
            }
            detections.addDetection(new Detection(attribute[0], attributes, false, canvas));
        } else {
            let attributes = detection.attributes;
            if (SPOOF_ATTRIBUTES.includes(attribute[1])) {
                attributes.push(new Attribute(attribute[1], "spoof"));
            } else {
                attributes.push(new Attribute(attribute[1], "block"));
            }
            detection.notified = false;
        }
        if (notify && !detection.notified) {
            notifyDetections(attribute[0]);
            detection.notified = true;
        }
    }
}

function notifyDetections(domain) {
    let attributes = detections.getDetection(domain).attributes;
    let attributesNames = [];
    for (let i = 0; i < attributes.length; i++) {
        attributesNames.push(attributes[i].name);
    }
    let message = "Fingerprint Privacy prevented " + domain + " from reading following attributes: " + attributesNames.join(", ");    
}