import fingerprintGenerator from './fingerprintGenerator.js';
import WebIdentity from '../classes/WebIdentity.js';
import Fingerprint from '../classes/Fingerprint.js';
import db from './database.js';

let webIdentities = {
    webidentities : [],

    /*
     * Retrieve web identities from database.
     */
    loadWebIdentities() {
        db.get(db.DB_STORE_WEBIDENTITIES, (result) => {
            if (result.length > 0) {
                this.webidentities = result;
                for (let wid of this.webidentities) {
                    wid.fingerprint = Fingerprint.from(wid.fingerprint);
                }
            }
        });
    },

    /*
     * Save web identity to database.
     */
    save(webidentity) {
        db.insert(webidentity, db.DB_STORE_WEBIDENTITIES);
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
        let webidentity;
        for (let i = 0; i < this.webidentities.length; i++) {
            webidentity = this.webidentities[i];
            if (webidentity.domain === domain) {
                return webidentity;
            }
        }
        webidentity = new WebIdentity(domain, fingerprintGenerator.generate());
        this.addWebIdentity(webidentity);
        return webidentity;
    },

    /*
     * Add a web identity to the array of web identities.
     */
    addWebIdentity(webidentity) {
        this.webidentities.push(webidentity);
        //determineDefaultHTMLElementDimension(webidentity.domain);
    },

    /*
     * Remove the web identity for the given domain from the array of web identities.
     */
    removeWebIdentity(domain) {
        for (let i = 0; i < this.webidentities.length; i++) {
            let webidentity = this.webidentities[i];
            if (webidentity.domain === domain) {
                this.webidentities.splice(i, 1);
                db.remove(domain, db.DB_STORE_WEBIDENTITIES);
                return;
            }
        }
    },

    /*
     * Remove the oldest web identity and return it.
     */
    removeOldest() {
        let index_oldest = 0;
        let oldest = this.webidentities[index_oldest];
        for (let i = 1; i < this.webidentities.length; i++) {
            let current = this.webidentities[i];
            if (current.last_used < oldest.last_used) {
                index_oldest = i;
                oldest = current;
            }
        }
        this.webidentities.splice(index_oldest, 1);
        return oldest;
    }
};
export default webIdentities;

// function determineDefaultHTMLElementDimension(domain) {
//     console.log("determinedefaulthtmlelementdimension 1");
//     browser.tabs.query({ currentWindow: true, active: true }).then(
//         tabs => {
//             console.log("determinedefaulthtmlelementdimension 2");
//             for (let tab of tabs) {
//                 browser.tabs.sendMessage(
//                     tab.id,
//                     { message: "", action: "determineDefaultHTMLElementDimension", domain: domain }
//                 );
//                 console.log("determinedefaulthtmlelementdimension 3 " + tab.id);
//             }
//         }
//     );
// }
