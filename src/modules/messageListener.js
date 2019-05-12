import detectionListener from './detectionListener.js';
import webIdentities from './webIdentities.js';
import detections from './detections.js';
import options from './options.js';
import publicSuffix from '../utils/publicSuffix.js';
import { getHostname } from '../utils/utils.js';
import { SPOOF_ATTRIBUTES } from '../utils/constants.js';

import random from '../utils/random.js';

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
    "notificationButton": notificationButton,
    "setDimentionOfHTMLElement" : setDimentionOfHTMLElement
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

function setDimentionOfHTMLElement(params) {
    let dimension = params.message.content;
    let domain = params.message.domain;
    let webidentity = domain ? webIdentities.getWebIdentity(domain) : undefined;
    let fingerprint = webidentity ? webidentity.fingerprint : undefined;
    if(!!fingerprint && !!fingerprint.fontData) {
        fingerprint.fontData.defaultHeight = dimension.height; 
        fingerprint.fontData.defaultWidth = dimension.width;
        fingerprint.fontData.allowedFonts.forEach(font => {
            font.height = dimension.height + random(1, 10);
            font.width = dimension.width + random(1,10);
        });       
    }
}