import detectionListener from './detectionListener.js';
import webIdentities from './webIdentities.js';
import detections from './detections.js';
import options from './options.js';
import publicSuffix from '../utils/publicSuffix.js';
import { getHostname } from '../utils/utils.js';

const ACTIONS = {
    "detection": detection,
    "get-options": getOptions,
    "set-options": setOptions,
    "get-webidentity-detection": getWebidentityDetection,
    "get-all-webidentities-detections": getWebidentitiesDetections,
    "toggle-attribute": toggleAttribute,
    "toggle-thirdparty": toggleThirdParty,
    "toggle-socialplugin": toggleSocialPlugin,
    "toggle-website": toggleWebsite,
    "notificationButton": notificationButton
};

export default function messageListener(message, sender, sendResponse) {
    ACTIONS[message.action]({
        message: message,
        sender: sender,
        sendResponse: sendResponse
    });
}

function detection(params) {
    detectionListener(params.message.content);
}

function getOptions(params) {
    params.sendResponse({ response: options.getAll() });
}

function setOptions(params) {
    options.setOptions(params.message.content);
}

function getWebidentityDetection(params) {
    let domain = publicSuffix.getDomain(getHostname(params.message.content));
    let webidentity = domain ? webIdentities.getWebIdentity(domain) : undefined;
    let detection = detections.getDetection(domain);
    params.sendResponse({
        response: {
            webidentity: webidentity,
            detection: detection
        }
    });
}

function getWebidentitiesDetections(params) {
    params.sendResponse({
        response: {
            webidentities: webIdentities.webidentities,
            detections: detections.detections
        }
    });
}

function toggleAttribute(params) {
    // TODO
}

function toggleThirdParty(params) {
    let content = params.message.content;
    let webidentity = webIdentities.getWebIdentity(content.domain);
    let thirdparty = webidentity.thirdparties.find(tp => tp.name === content.thirdparty);
    if (thirdparty !== undefined) {
        thirdparty.block = content.block;
    }
}

function toggleSocialPlugin(params) {
    // TODO
}

function toggleWebsite(params) {
    let domain = params.message.content.domain;
    let webidentity = webIdentities.getWebIdentity(domain);
    webidentity.enabled = params.message.content.enabled;
}

function notificationButton(params) {
    if (params.message.content === "keep") {
        detections.getDetection(params.message.domain).notified = true;
    } else if (params.message.content === "allow") {
        let url = browser.extension.getURL("interface/webidentitiesPage.html");
        browser.windows.create({
            url: url,
            type: 'panel',
            height: 400,
            width: 400
        });
        detections.getDetection(params.message.domain).notified = true;
    }
}
