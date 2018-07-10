const DOMObjects = {
    navigator : {name: "Navigator", code: "navigator", properties : {
        appCodeName : {name : "App Code Name", code : "appCodeName", simple: true},
        appName : {name : "App Name", code : "appName", simple: true},
        appVersion : {name : "App version", code : "appVersion", simple: true},
        battery : {name : "Battery", code : "battery", simple: true},
        connection : {name : "Connection", code : "connection"},
        cookieEnabled: {name : "Cookie enabled", code : "cookieEnabled", simple: true},
        geolocation : {name : "Geolocation", code : "geolocation", simple: true},
        language : {name : "Language", code : "language", simple: true},
        mimeTypes : {name : "Mime Types", code : "mimeTypes", simple: false},
        onLine : {name : "Online", code : "onLine", simple: true},
        oscpu : {name : "OS CPU", code : "oscpu", simple: true},
        platform : {name : "Platform", code : "platform", simple: true},
        plugins : {name : "Plugins", code : "plugins", simple: false},
        product : {name : "Product", code : "product", simple: true},
        userAgent : {name : "User-Agent", code : "userAgent", simple: true},
        buildID : {name : "BuildID", code : "buildID", simple: true},
        doNotTrack : {name : "Do Not Track", code : "doNotTrack", simple: true},
        doNotTrack : {name : "Product Subservion", code : "productSub", simple: true},
        vendor : {name : "Vendor", code : "vendor", simple: true},
        vendorSub : {name : "Vendor Subversion", code : "vendorSub", simple: true},
        mozBattery :{name : "MozBattery", code : "mozBattery", simple: true},
        cpuClass : {name : "CPU Class", code : "cpuClass", simple: true},
        systemLanguage : {name : "System Language", code : "systemLanguage", simple: true},
        userLanguage : {name : "User Language", code : "userLanguage", simple: true}
    }},

    screen : {name: "Screen", code: "screen", properties : {
        availHeight : {name : "Availible Height", code : "availHeight", simple: true},
        availWidth : {name : "Availible Width", code : "availWidth", simple: true},
        colorDepth : {name : "Color depth", code : "colorDepth", simple: true},
        height : {name : "Screen Height", code : "height", simple: true},
        width : {name : "Screen Width", code : "width", simple: true},
        pixelDepth : {name : "Pixel Depth", code : "pixelDepth", simple: true}
    }}

    // date : {name : "Date", code : "date", properties : {
    //     timezoneOffset: {name : "Timezone", code : "", simple : false}
    // }}

    // windowObj : { name : "Window", code : "window", properties : {
    //     localStorage: {name : "DOM Local Storage", code : "localStorage", simple: true},
    //     sessionStorage : {name : "DOM Session Storage", code : "sessionStorage", simple: true},
    //     indexedDB : {name : "IndexedDB", code : "indexedDB", simple: true},
    //     openDatabase : {name : "OpenDatabase", code : "openDatabase", simple: true}
    // }
    //}
}

export default DOMObjects;