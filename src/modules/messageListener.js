import detectionListener from './detectionListener.js';
import webIdentities from './webIdentities.js';
import detections from './detections.js';
import options from './options.js';
import publicSuffix from '../utils/publicSuffix.js';
import { getHostname } from '../utils/utils.js';

export default function messageListener(message, sender, sendResponse) {
    if (message.action === "detection") {
        detectionListener(message.content);
    } else if (message.action === "get-options") {
        sendResponse({response: options.getAll()});
    } else if (message.action === "set-options") {
        options.setOptions(message.content);
    } else if (message.action === "get-webidentity-detection") {
        let domain = publicSuffix.getDomain(getHostname(message.content));
        let webidentity = domain ? webIdentities.getWebIdentity(domain) : undefined;
        let detection = detections.getDetection(domain);
        sendResponse({
            response: {
                webidentity: webidentity,
                detection: detection
            }
        });
    } else if (message.action === "notificationButton") {
        if(message.content === "keep") {
            detections.getDetection(message.domain).notified = true;
        } else if(message.content === "allow") {
            let url = browser.extension.getURL("interface/options/webidentities.html");
            browser.windows.create({
                url : url,
                type : 'panel',
                height: 400,
                width : 400
            });
            detections.getDetection(message.domain).notified = true;
        }
    }
}
