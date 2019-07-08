import options from "./options.js";
import detections from "./detections.js";
import Detection from "../classes/Detection.js";
import Attribute from "../classes/Attribute.js";
import webIdentities from './webIdentities.js';
import { ELEMENTS_PREVENTING_CANVAS_FINGERPRINTING } from "../utils/constants.js";

/********************************************/
/* -- Fingerprint Privacy --                */
/* Author:                                  */
/* Date: 5.07.2018                          */
/********************************************/

export default function detectionListener(message) {
    let notify = options.get("notify");
    let domain = message.domain;
    let attributeName = message.name;
    let detection = detections.getDetection(domain);

    if (detection === undefined) {
        detection = new Detection(domain, false);
        detections.addDetection(detection);
    }

    if (!detection.containsAttribute(attributeName)) {
        let attributeAction = message.action;
        let attributeKey = message.key;
        detection.addAttribute(new Attribute(attributeName, attributeKey, attributeAction));
        if(attributeName.indexOf(ELEMENTS_PREVENTING_CANVAS_FINGERPRINTING["HTMLCanvasElement"]["toDataURL"].name) != -1) {
            let webidentity = domain ? webIdentities.getWebIdentity(domain) : undefined;
            let fingerprint = webidentity ? webidentity.fingerprint : undefined;
            if( !!fingerprint && !!fingerprint.canvasData && !!message.data ) {
                fingerprint.canvasData.data = message.data;
            } 
        }
        detection.notified = false;
    }
    if (notify && !detection.notified) {
        notifyDetection(detection);
    }
}

/*
 * Create a notification to display all detected attributes.
 */
function notifyDetection(detection) {
    let attributeNames = detection.attributes.map(a => a.name);
    let message = "<b>FP-Block prevented " + detection.domain + " from reading the following attributes: </b><br></br>" + attributeNames.join(", ");
    browser.tabs.query({ currentWindow: true, active: true }).then(
        tabs => {
            for (let tab of tabs) {
                browser.tabs.sendMessage(
                    tab.id,
                    { message: message, action: "notify", domain: detection.domain }
                );
            }
        }
    );
}