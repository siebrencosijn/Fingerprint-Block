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
};

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
        appCodeName:    { name: "App Code Name", accessType: "objectProperty", valueType: "string" },
        appName:        { name: "App Name", accessType: "objectProperty", valueType: "string" },
        appVersion:     { name: "App version", accessType: "objectProperty", valueType: "string" },
        connection:     { name: "Connection", accessType: "misc", valueType: "string" },
        cookieEnabled:  { name: "Cookie enabled", accessType: "objectProperty", valueType: "string" },
        geolocation:    { name: "Geolocation", accessType: "objectProperty", valueType: "string" },
        language:       { name: "Language", accessType: "objectProperty", valueType: "string" },
        mimeTypes:      { name: "Mime Types", accessType: "objectProperty", valueType: "array" },
        onLine:         { name: "Online", accessType: "objectProperty", valueType: "string" },
        oscpu:          { name: "OS CPU", accessType: "objectProperty", valueType: "string" },
        platform:       { name: "Platform", accessType: "objectProperty", valueType: "string" },
        plugins:        { name: "Plugins", accessType: "objectProperty", valueType: "array" },
        product:        { name: "Product", accessType: "objectProperty", valueType: "string" },
        userAgent:      { name: "User-Agent", accessType: "objectProperty", valueType: "string" },
        buildID:        { name: "BuildID", accessType: "objectProperty", valueType: "string" },
        doNotTrack:     { name: "Do Not Track", accessType: "objectProperty", valueType: "string" },
        productSub:     { name: "Product Subversion", accessType: "objectProperty", valueType: "string" },
        vendor:         { name: "Vendor", accessType: "objectProperty", valueType: "string" },
        vendorSub:      { name: "Vendor Subversion", accessType: "objectProperty", valueType: "string" }
    },
    screen: {
        availHeight:{ name: "Available Height", accessType: "objectProperty", valueType: "number" },
        availWidth: { name: "Available Width", accessType: "objectProperty", valueType: "number" },
        colorDepth: { name: "Color depth", accessType: "objectProperty", valueType: "number" },
        height:     { name: "Screen Height", accessType: "objectProperty", valueType: "number" },
        width:      { name: "Screen Width", accessType: "objectProperty", valueType: "number" },
        pixelDepth: { name: "Pixel Depth", accessType: "objectProperty", valueType: "number" }
    },
    Date: {
        timezoneOffset: {
            name: "Timezone", accessType: "prototypeFunction",
            functionNames: ["getTimezoneOffset"], valueType: "number"
        }
    },
    window: {
        localStorage: {
            name: "DOM Local Storage", accessType: "objectProperty", valueType: "storageObject",
            functionNames: ["key", "getItem", "setItem", "removeItem"]
        },
        sessionStorage: {
            name: "DOM Session Storage", accessType: "objectProperty", valueType: "storageObject",
            functionNames: ["key", "getItem", "setItem", "removeItem"]
        },
        WebGLRenderingContext: {
            name: "WebGL Rendering Context", accessType: "objectProperty", valueType: "object"
        }
   }
};

export const ELEMENTS_PREVENTING_FONT_DETECTION = {
    HTMLElement: {
        offsetWidth: {
            name: "Element Offset Width", accessType: "prototypeProperty", valueType: "number"},
        offsetHeight: {
            name: "Element Offset Height", accessType: "prototypeProperty", valueType: "number"}
    }
};

export const ELEMENTS_PREVENTING_CANVAS_FINGERPRINTING = {
    CanvasRenderingContext2D: {
        fillText: {
            name: "Canvas Fill Text", accessType: "prototypeFunction",
            functionNames: ["fillText"], valueType: "undefied"
        },
        strokeText: {
            name: "Canvas Stroke Text", accessType: "prototypeFunction",
            functionNames: ["strokeText"], valueType: "undefied"
        }
    },
    HTMLCanvasElement: {
        toDataURL: {
            name: "Canvas To Data URL", accessType: "prototypeFunction",
            functionNames: ["toDataURL"], valueType: "string"
        }
    }
}

export const DEFAULT_OPTIONS = {
    notify: true,
    dnt: true,
    remove_etag: false,
    block_social: true
};
