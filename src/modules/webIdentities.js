import randomFingerprintGenerator from './randomFingerprintGenerator.js';
import WebIdentity from '../classes/WebIdentity.js';

let webIdentities = {
    webidentities : [],

    /*
     * Load web identities from browser local storage.
     */
    loadWebIdentities() {
        browser.storage.local.get("webidentities").then(function(result) {
            if (Object.getOwnPropertyNames(result).length != 0) {
                this.webidentities = result;
            }
        });
    },

    /*
     * Save web identities to browser local storage.
     */
    saveWebIdentities() {
        browser.storage.local.set({"webidentities": this.webidentities});
    },

    /*
     * Clear all web identities saved in browser local storage.
     */
    clearWebIdentities() {
        browser.storage.local.remove("webidentities");
    },

    /*
     * Return all web identities.
     */
    getWebIdentities() {
        return this.webidentities;
    },

    /*
     * Return the web identity for the given domain or creates a new web identity if not found.
     */
    getWebIdentity(domain) {
        for (let i = 0; i < this.webidentities.length; i++) {
            let webidentity = this.webidentities[i];
            if (webidentity.domain === domain) {
                return webidentity;
            }
        }
        return new WebIdentity(domain, randomFingerprintGenerator.generate());
    },

    /*
     * Add a web identity to the array of web identities.
     */
    addWebIdentity(webidentity) {
        this.webidentities.push(webidentity)
    },

    /*
     * Remove the web identity for the given domain from the array of web identities.
     */
    removeWebIdentity(domain) {
        for (let i = 0; i < this.webidentities.length; i++) {
            let webidentity = this.webidentities[i];
            if (webidentity.domain === domain) {
                this.webidentities.splice(i, 1);
                return;
            }
        }
    }
}
export default webIdentities;
