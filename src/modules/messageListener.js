/********************************************/
/* -- Fingerprint Privacy --                */
/* Date: 5.07.2019                          */
/********************************************/

import detectionListener from './detectionListener.js';
import webIdentities from './webIdentities.js';
import detections from './detections.js';
import options from './options.js';
import fingerprintGenerator from './fingerprintGenerator.js';
import publicSuffix from '../utils/publicSuffix.js';
import { getHostname } from '../utils/utils.js';
import { SPOOF_ATTRIBUTES } from '../utils/constants.js';

const ACTIONS = {
    "detection": detection,
    "get-options": getOptions,
    "set-options": setOptions,
    "get-webidentities": getWebidentities,
    "delete-webidentities": deleteWebidentities,
    "get-webidentity-detection": getWebidentityDetection,
    "toggle-attribute": toggleAttribute,
    "toggle-thirdparty": toggleThirdParty,
    "toggle-socialplugin": toggleSocialPlugin,
    "toggle-website": toggleWebsite,
    "set-detection-notified": setDetectionNotified
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
    params.sendResponse({response: options.getAll()});
}

function setOptions(params) {
    options.setOptions(params.message.content);
}

function getWebidentities(params) {
    params.sendResponse({response: webIdentities.webidentities});
}

function deleteWebidentities(params) {
    let domains = params.message.content;
    for (let domain of domains) {
        let tree = fingerprintGenerator.tree;
        let fingerprint = webIdentities.getWebIdentity(domain).fingerprint;
        let id = fingerprint.id;
        let value = fingerprint.key;
        let weight = fingerprint.weight;
        detections.deleteDetection(domain);
        webIdentities.removeWebIdentity(domain);
        fingerprintGenerator.free(id);
        tree.insert(id, value, weight);
    }
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

function toggleAttribute(params) {
    let content = params.message.content;
    let detection = detections.getDetection(content.domain);
    let attribute = detection.getAttribute(content.attribute);
    if (attribute !== undefined) {
        if (content.block) {
            if (SPOOF_ATTRIBUTES.includes(attribute.name)) {
                attribute.action = "spoof";
            } else {
                attribute.action = "block";
            }
        } else {
            attribute.action = "allow";
        }
    }
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
    let content = params.message.content;
    let webidentity = webIdentities.getWebIdentity(content.domain);
    let socialplugin = webidentity.socialplugins.find(sp => sp.name === content.socialplugin);
    if (socialplugin !== undefined) {
        socialplugin.block = content.block;
    }
}

function toggleWebsite(params) {
    let content = params.message.content;
    let webidentity = webIdentities.getWebIdentity(content.domain);
    webidentity.enabled = content.enabled;
}

function setDetectionNotified(params) {
    if (params.message.content === "ok") {
        detections.getDetection(params.message.domain).notified = true;
    }
}