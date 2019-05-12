import Fingerprint from '../classes/Fingerprint.js';
import random from '../utils/random.js';
import profiles from './profiles.js';
import webIdentities from './webIdentities.js';
import FONT_LIST from '../../data/fontList_data.js';

/*
 * Construct a random user agent string for the profile's browser.
 */
function getRandomUserAgent(profile, os, proc, language) {
    switch(profile.browser) {
        case "firefox":
            return firefox(profile, os, proc, language);
        case "opera":
            return opera(profile, os, proc, language);
        case "safari":
            return safari(profile, os, proc, language);
        case "chrome":
            return chrome(profile, os, proc, language);
    }
}

// TODO refactor
/*
 * Construct a random user agent string for Firefox.
 */
function firefox(profile, os, proc, language) {
    let versions = profile.versions,
        major = versions.major,
        firefox_ver = random(major.min, major.max) + getRandomRevision(2, versions.revision),
        gecko_ver = versions.gecko + firefox_ver,
        os_ver = (os === "win") ? "(Windows NT " + nt(profile) + ((proc) ? "; " + proc : "")
        : (os === "mac") ? "(Macintosh; " + proc + " Mac OS X " + osx(profile)
        : "(X11; Linux " + proc;
    return "Mozilla/5.0 " + os_ver + "; rv:" + firefox_ver.slice(0, -2) + ") " + gecko_ver;
}

/*
 * Construct a random user agent string for Opera.
 */
function opera(profile, os, proc, language) {
    let versions = profile.versions,
        presto = versions.presto.major + random(versions.presto.minor.min, versions.presto.minor.max),
        presto2 = random(versions.presto2.major.min, versions.presto2.major.max) + versions.presto2.minor,
        presto_ver = " Presto/" + presto + " Version/" + presto2 + ")",
        os_ver = (os === "win") ? "(Windows NT " + nt(profile) + "; U; " + language + presto_ver
        : (os === "lin") ? "(X11; Linux " + proc + "; U; " + language + presto_ver
        : "(Macintosh; Intel Mac OS X " + osx(profile, "_") + " U; " + language + " Presto/" + presto + " Version/" + presto2 + ")";
    return "Opera/" + random(versions.major.min, versions.major.max) + "." + random(versions.minor.min, versions.minor.max) + " " + os_ver;
}

/*
 * Construct a random user agent string for Safari.
 */
function safari(profile, os, proc, language) {
    let versions = profile.versions,
        applewebkit = versions.applewebkit,
        safari = random(applewebkit.major.min, applewebkit.major.max) + "." + random(applewebkit.minor.min, applewebkit.minor.max) + "." + random(applewebkit.build.min, applewebkit.build.max),
        ver = (random(0, 1) === 0) ? "0." + random(versions.build.min, versions.build.max) : random(versions.minor.min, versions.minor.max),
        os_ver = (os === "mac") ? "(Macintosh; " + proc + " Mac OS X " + osx(profile, "_") + " rv:" + random(2, 6) + ".0; " + language + ") " : "(Windows; U; Windows NT " + nt(profile) + ")";
    return "Mozilla/5.0 " + os_ver + " AppleWebKit/" + safari + " (KHTML, like Gecko) Version/" + random(versions.major.min, versions.major.max) + "." + ver + " Safari/" + safari;
} 

/*
 * Construct a random user agent string for Chrome.
 */
function chrome(profile, os, proc, language) {
    let versions = profile.versions,
        applewebkit = versions.applewebkit,
        safari = random(applewebkit.major.min, applewebkit.major.max) + "." + random(applewebkit.minor.min, applewebkit.minor.max) + "." + random(applewebkit.build.min, applewebkit.build.max),
        os_ver = (os === "mac") ? "(Macintosh; " + proc + " Mac OS X " + osx(profile, "_") + ") "
        : (os === "win") ? "(Windows; U; Windows NT " + nt(profile) + ")"
        : "(X11; Linux " + proc;
    return "Mozilla/5.0 " + os_ver + " AppleWebKit/" + safari + " (KHTML, like Gecko) Chrome/" + [random(versions.major.min, versions.major.max), 0, random(versions.build.min, versions.build.max), 0].join(".") + " Safari/" + safari;
}

/*
 * Return a random NT version.
 */
function nt(profile) {
    let nt = profile.versions.nt,
        major = nt.major,
        minor = nt.minor;
    return random(major.min, major.max) + "." + random(minor.min, minor.max);
}

/*
 * Return a random OSX version.
 */
function osx(profile, delim) {
    let osx = profile.versions.osx,
        major = osx.major,
        minor = osx.minor;
    return [10, random(major.min, major.max), random(minor.min, minor.max)].join(delim || ".");
}

/*
 * Return a random revision for Firefox.
 */
function getRandomRevision(dots, revision) {
    let return_val = "";
    for (let x = 0; x < dots; x++) {
        return_val += "." + random(0, revision);
    }
    return return_val;
}

/*
 * Return a navigator object with random values.
 */

function getRandomNavigatorObject(profile, os, proc, language, useragent) {
    let platform = (os === "win") ? "Win32" : (os === "mac") ? "MacIntel" : "Linux " + proc;
    let cpuClass = (proc.includes("Intel")) ? "x86" : (proc.includes("86")) ? "x86" : (proc.includes("PPC")) ? "PPC" : "Other";
    let appVersion = (profile.browser === "opera") ? useragent : useragent.substring(8, useragent.length);
    return {
        userAgent: useragent,
        appCodeName: profile.appCodeName,
        appName: profile.appName,
        language: language,
        appVersion: appVersion,
        platform: platform,
        oscpu: platform,
        product: profile.product,
        vendor: profile.vendor,
        cpuClass: cpuClass,
        systemLanguage: language,
        userLanguage: language
    };
}

/*
 * Return a screen object with random values.
 */
function getRandomScreenObject(profile) {
    let screenresolution = random(profile.screen.resolutions).split("x");
    let colorDepth = parseInt(random(profile.screen.colorDepth));
    let width = parseInt(screenresolution[0]);
    let height = parseInt(screenresolution[1]);
    return {
        width: width,
        height: height,
        colorDepth: colorDepth,
        availWidth: width,
        availHeight: height - profile.screen.toolbar,
        pixelDepth: colorDepth
    };
}

/*
* Return data for preventing font probibing
*/
function getRandomFontData() {
    let fontData = {defaultWidth: 0, defaultHeight: 0, allowedFonts: []};
    let fontList = getRandomFontList();
    fontList.forEach(fontname => {
        let font = {};
        font.name = fontname;
        font.height = random(1,10);
        font.width = random(1,10);
        fontData.allowedFonts.push(font);
    });
    return fontData;
}

function getRandomFontList() {
    let numberAllowedFonts = random(2, 5);
    let numberFonts = FONT_LIST.length
    let fontList = [];
    let indices = [];
    for (let i = 0; i < numberAllowedFonts; i++) {
        let index = random(0, numberFonts-1);
        while(indices.includes(index)) {
            index = random(0, numberFonts-1);
        }
        indices.push(index);
        fontList.push(FONT_LIST[index]);
    }
    return fontList;
}

/*
 * Check if the fingerprint is not used for another web identity.
 */
function checkUniqueness(generatedFingerprint, webIdentities) {
    for (let i = 0; i < webIdentities.length; i++) {
        if (generatedFingerprint.hash == webIdentities[i].fingerprint.hash) {
            return false;
        }
    }
    return true;
}

let randomFingerprintGenerator = {
    createFingerprint() {
        let profile = random(profiles),
            os = random(profile.os),
            proc = random(profile.procs[os]),
            language = random(profile.languages),
            useragent = getRandomUserAgent(profile, os, proc, language),
            httpObject = { userAgent: useragent, acceptEncoding: profile.http.encoding, acceptLanguage: language },
            navigatorObject = getRandomNavigatorObject(profile, os, proc, language, useragent),
            screenObject = getRandomScreenObject(profile),
            dateObject = { timezoneOffset: random(profile.timezones) },
            fontData = getRandomFontData(),
            canvasData = { data: null };
        return new Fingerprint(httpObject, navigatorObject, screenObject, dateObject, fontData, canvasData);
    },

    generate() {
        // TODO web identity limit
        let generatedFingerprint;
        do {
            generatedFingerprint = this.createFingerprint();
        } while (!checkUniqueness(generatedFingerprint, webIdentities.getWebIdentities()));
        return generatedFingerprint;
    },
};
export default randomFingerprintGenerator;
