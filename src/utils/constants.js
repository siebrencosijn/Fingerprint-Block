export const BROWSER_PLUGINS = [
    "Flash",
    "Silverlight",
    "VLC",
    "QuickTime",
    "other"
];

export const SOCIAL_PLUGINS = {
    facebook: ["connect.facebook.net/en_US/all.js", "connect.facebook.net/en_US/sdk.js", "facebook.com/plugins/"],
    twitter: ["platform.twitter.com/widgets.js", "platform.twitter.com/widgets/"],
    googleplus: ["apis.google.com/js/platform.js", "apis.google.com/js/plusone.js"],
    linkedin: ["platform.linkedin.com/in.js"],
    tumblr: ["platform.tumblr.com/v1/", "api.tumblr.com/v1/", "api.tumblr.com/v2/"],
    pinterest: ["assets.pinterest.com/js/pinit.js", "assets.pinterest.com/js/pinit_main.js", "assets.pinterest.com/sdk/sdk.js"]
}

export const SPOOF_ATTRIBUTES = [
    "App Code Name",
    "App Name",
    "App version",
    "Language",
    "OS CPU",
    "Platform",
    "Product",
    "User-Agent",
    "Vendor",
    "CPU Class",
    "System Language",
    "User Language",
    "Available Height",
    "Available Width",
    "Color depth",
    "Screen Height",
    "Screen Width",
    "Pixel Depth",
    "Timezone"
];

export const DOM_OBJECTS = {
    navigator: {
        appCodeName: { name: "App Code Name", type: "direct", typeOfValue: "string" },
        appName: { name: "App Name", type: "direct", typeOfValue: "string" },
        appVersion: { name: "App version", type: "direct", typeOfValue: "string" },
        battery: { name: "Battery", type: "direct", typeOfValue: "string" },
        connection: { name: "Connection", type: "misc", typeOfValue: "string" },
        cookieEnabled: { name: "Cookie enabled", type: "direct", typeOfValue: "string" },
        geolocation: { name: "Geolocation", type: "direct", typeOfValue: "string" },
        language: { name: "Language", type: "direct", typeOfValue: "string" },
        mimeTypes: { name: "Mime Types", type: "mimeTypes", typeOfValue: "array" },
        onLine: { name: "Online", type: "direct", typeOfValue: "string" },
        oscpu: { name: "OS CPU", type: "direct", typeOfValue: "string" },
        platform: { name: "Platform", type: "direct", typeOfValue: "string" },
        plugins: { name: "Plugins", type: "plugins", typeOfValue: "array" },
        product: { name: "Product", type: "direct", typeOfValue: "string" },
        userAgent: { name: "User-Agent", type: "direct", typeOfValue: "string" },
        buildID: { name: "BuildID", type: "direct", typeOfValue: "string" },
        doNotTrack: { name: "Do Not Track", type: "direct", typeOfValue: "string" },
        productSub: { name: "Product Subversion", type: "direct", typeOfValue: "string" },
        vendor: { name: "Vendor", type: "direct", typeOfValue: "string" },
        vendorSub: { name: "Vendor Subversion", type: "direct", typeOfValue: "string" },
        mozBattery: { name: "MozBattery", type: "direct", typeOfValue: "string" },
        cpuClass: { name: "CPU Class", type: "direct", typeOfValue: "string" },
        systemLanguage: { name: "System Language", type: "direct", typeOfValue: "string" },
        userLanguage: { name: "User Language", type: "direct", typeOfValue: "string" },
        securityPolicy: { name: "IE Security Policy", type: "direct", typeOfValue: "string" }
    },
    screen: {
        availHeight: { name: "Available Height", type: "direct", typeOfValue: "number" },
        availWidth: { name: "Available Width", type: "direct", typeOfValue: "number" },
        colorDepth: { name: "Color depth", type: "direct", typeOfValue: "number" },
        height: { name: "Screen Height", type: "direct", typeOfValue: "number" },
        width: { name: "Screen Width", type: "direct", typeOfValue: "number" },
        pixelDepth: { name: "Pixel Depth", type: "direct", typeOfValue: "number" }
    },
    date: {
        timezoneOffset: {
            name: "Timezone", type: "prototype", objectName: "Date",
            functionNames: ["getTimezoneOffset"], typeOfValue: "number"
        }
    },
    window: {
        localStorage: {
            name: "DOM Local Storage", type: "storage", objectName: "localStorage",
            functionNames: ["key", "getItem", "setItem", "removeItem"]
        },
        sessionStorage: {
            name: "DOM Session Storage", type: "storage", objectName: "sessionStorage",
            functionNames: ["key", "getItem", "setItem", "removeItem"]
        },
        indexedDB: { name: "IndexedDB", type: "direct" },
        openDatabase: { name: "OpenDatabase", type: "direct" }
    },

    Element: {
        ieUserData: {
            name: "IE userData", type: "prototype", objectName: "Element",
            functionNames: ["addBehavior", "save", "load"]
        }
    }
};

export const ELEMENTS_PREVENTING_FONT_DETECTION = {
    HTMLElement: {
        offsetWidth: {
            name: "Element Offset Width", type: "prototype", objectName: "HTMLElement",
            functionNames: ["offsetWidth"], var: "width"
        },
        offsetHeight: {
            name: "Element Offset Height", type: "prototype", objectName: "HTMLElement",
            functionNames: ["offsetHeight"], var: "height"
        }
    }
}

export const DEFAULT_OPTIONS = {
        notify: true,
        block_tpcookies: true,
        dnt: true,
        remove_etag: false,
        block_social: true,
        block_browser: true
    }
