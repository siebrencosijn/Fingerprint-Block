import detections from "./detections.js";
import Detection from "../classes/Detection.js";
import Attribute from "../classes/Attribute.js";

/********************************************/
/* -- Fingerprint Privacy --                */
/* Author:                                  */
/* Date: 5.07.2018                          */
/********************************************/

export default function detectionListener(message) {
    let notify = true; // browser.storage.local.get("fpblock_options").notify;
    let domain = message.domain;
    let attributeName = message.name;
    let detection = detections.getDetection(domain);

    if (detection === undefined) {
        let canvas = { detected: false, colors: 0, width: 0, height: 0, format: null };
        detection = new Detection(domain, canvas, false);
        detections.addDetection(detection);
    }

    if (!detection.containsAttribute(attributeName)) {
        let attributeAction = message.action;
        detection.addAttribute(new Attribute(attributeName, attributeAction));
        detection.notified = false;
    }

    if (notify && !detection.notified) {
        notifyDetection(detection);
        detection.notified = true;
    }
}

function notifyDetection(detection) {
    const id = "detectionNotification";
    let attributeNames = detection.attributes.map(a => a.name);
    let message = "FP-Block prevented " + detection.domain + " from reading the following attributes: " + attributeNames.join(", ");
    let options = {
        "type": "basic",
        "iconUrl": browser.extension.getURL("interface/icons/icon.png"),
        "title": "Notification",
        "message": message
    }
    // browser.notifications.update niet compatibel met firefox
    // tijdelijke oplossing
    browser.notifications.clear(id);
    browser.notifications.create(id, options);
}
