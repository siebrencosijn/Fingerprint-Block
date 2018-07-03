/********************************************/
/* -- Fingerprint Privacy --                */
/* Author:                                  */
/* Date: 3.07.2018                          */
/********************************************/

import webIdentities from './webIdentities.js';
import detections from './detections.js';

export default function injectedScript(domain) {
    var webIdentity = getWebIdentity(domain);
    if(webIdentity) {
        var fingerprint = getFingerprint(webIdentity);
        var attributes = getAttributes(domain);
    }
    return "<script>console.log('script injected')</script>";
}

/*
* Returns the webIdentities for a domain.
*/
function getWebIdentity(domain) {
    var webIdentity = null;
    try {
        webIdentity = webIdentities.getWebIdentity(domain);
    } catch (e) {}
    
    return webIdentity;
}

/* 
* Returns the fingerprint for a webIdentity.
*/
function getFingerprint(webIdentity) {
    var fingerprint = null;
    try{
        fingerprint = webIdentity.fingerprint;
    } catch (e) {}
    return fingerprint;
}

/*
* Returns the attributes for a domain.
*/
function getAttributes(domain){
    var attributes = null;
    try {
        attributes = detections.getDetection(domain).attributes;
    } catch (e) {}
    return attributes;
}