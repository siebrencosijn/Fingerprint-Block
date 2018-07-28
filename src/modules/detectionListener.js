import options from "./options.js";
import detections from "./detections.js";
import Detection from "../classes/Detection.js";
import Attribute from "../classes/Attribute.js";

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
    }
}

/*
 * Create a notification to display all detected attributes.
 */
function notifyDetection(detection) {
    let attributeNames = detection.attributes.map(a => a.name);
    let message = "FP-Block prevented " + detection.domain + " from reading the following attributes: " + attributeNames.join(", ");
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
