import murmurhash3_32_gc from '../utils/murmurhash.js';

class Fingerprint {
    constructor(http, navigator, screen, date) {
        this.http = http;
        this.navigator = navigator;
        this.screen = screen;
        this.date = date;
        this.hash = this._generateHash();
    };

    _generateHash() {
        /*
        // Group 0 - Browser
        let group0 = this.userAgent + "###" + 
                     this.navigator.appCodeName + "###" + 
                     this.navigator.appName + "###" + 
                     this.navigator.appVersion  + "###" + 
                     this.navigator.product  + "###" + 
                     this.navigator.vendor  + "###" + 
                     this.acceptEncoding;
        */
        // Group 1 - OS & CPU
        let group1 = this.navigator.platform + "###" +
                     this.navigator.oscpu  + "###" + 
                     this.navigator.cpuClass;
        // Group 2 - Screen Resolution
        let group2 = this.screen.width + "###" + 
                     this.screen.height + "###" + 
                     this.screen.colorDepth + "###" + 
                     this.screen.availWidth  + "###" + 
                     this.screen.availHeight + "###" + 
                     this.screen.pixelDepth;
        // Group 3 - Timezone
        let group3 = this.date.timezoneOffset;
        // Group 4 - Language
        let group4 = this.navigator.language + "###" + 
                     this.navigator.systemLanguage + "###" + 
                     this.navigator.userLanguage;
        // Return the two hashes for Group 0 and Group 1 until Group 4
        return murmurhash3_32_gc(group1 + "###" + group2 + "###" + group3 + "###" + group4, 31);
    }
}
export default Fingerprint;
