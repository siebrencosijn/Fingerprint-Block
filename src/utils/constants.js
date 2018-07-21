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
        appCodeName: { name: "App Code Name", type: "simple" },
        appName: { name: "App Name", type: "simple" },
        appVersion: { name: "App version", type: "simple" },
        battery: { name: "Battery", type: "simple" },
        connection: { name: "Connection", type: "misc" },
        cookieEnabled: { name: "Cookie enabled", type: "simple" },
        geolocation: { name: "Geolocation", type: "simple" },
        language: { name: "Language", type: "simple" },
        mimeTypes: { name: "Mime Types", type: "mimeTypes" },
        onLine: { name: "Online", type: "simple" },
        oscpu: { name: "OS CPU", type: "simple" },
        platform: { name: "Platform", type: "simple" },
        plugins: { name: "Plugins", type: "plugins" },
        product: { name: "Product", type: "simple" },
        userAgent: { name: "User-Agent", type: "simple" },
        buildID: { name: "BuildID", type: "simple" },
        doNotTrack: { name: "Do Not Track", type: "simple" },
        productSub: { name: "Product Subversion", type: "simple" },
        vendor: { name: "Vendor", type: "simple" },
        vendorSub: { name: "Vendor Subversion", type: "simple" },
        mozBattery: { name: "MozBattery", type: "simple" },
        cpuClass: { name: "CPU Class", type: "simple" },
        systemLanguage: { name: "System Language", type: "simple" },
        userLanguage: { name: "User Language", type: "simple" },
        securityPolicy: { name: "IE Security Policy", type: "simple" }
    },
    screen: {
        availHeight: { name: "Available Height", type: "simple" },
        availWidth: { name: "Available Width", type: "simple" },
        colorDepth: { name: "Color depth", type: "simple" },
        height: { name: "Screen Height", type: "simple" },
        width: { name: "Screen Width", type: "simple" },
        pixelDepth: { name: "Pixel Depth", type: "simple" }
    },
    date: {
        timezoneOffset: {
            name: "Timezone", type: "prototype", objectName: "Date",
            functionNames: ["getTimezoneOffset"]
        }
    },
    window: {
        localStorage: { name: "DOM Local Storage", type: "storage" },
        sessionStorage: { name: "DOM Session Storage", type: "storage" },
        indexedDB: { name: "IndexedDB", type: "simple" },
        openDatabase: { name: "OpenDatabase", type: "simple" }
    },

    element: {
        element: {
            name: "IE userData", type: "prototype", objectName: "Element",
            functionNames: ["addBehavior", "save", "load"]
        }
    }


};

export const DEFAULT_OPTIONS = {
    notify: true,
    block_tpcookies: true,
    dnt: true,
    remove_etag: false,
    block_social: true,
    block_browser: true
}
