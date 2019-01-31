import Tree from '../classes/Tree.js';
import { readFile } from '../utils/utils.js';

let fingerprintGenerator = {
    /**
     * Load the data from browser local storage,
     * or call initialize if this is the first run.
     */
    async load() {
        let first = false;
        await browser.storage.local.get("fingerprints").then(function(result) {
            if (Object.getOwnPropertyNames(result).length != 0) {
                this.fingerprints = result;
            } else {
                first = true;
            }
        });
        await browser.storage.local.get("tree").then(function(result) {
            if (Object.getOwnPropertyNames(result).length != 0) {
                this.tree = result;
            } else {
                first = true;
            }
        });
        if (first) {
            this.initialize();
        }
    },

    /**
     * Save the data to browser local storage.
     */
    save() {
        browser.storage.local.set({"fingerprints": this.fingerprints});
        browser.storage.local.set({"tree": this.tree});
    },

    /**
     * Initialize the data needed to generate fingerprints.
     */
    initialize() {
        const path = "/fingerprints/fingerprints.json";
        readFile(path, (file) => {
            this.fingerprints = JSON.parse(file);
            this.tree = new Tree();
            for (let i = 0; i < this.fingerprints.length; i++) {
                this.tree.insert(this.fingerprints[i].index,
                                 this.fingerprints[i].weight);
            }
            this.save();
        });
    },

    /**
     * Return a random unused fingerprint.
     * @return {Object} The fingerprint.
     */
    generate() {
        let index = this.tree.random();
        return this.fingerprints[index];
    }
};
export default fingerprintGenerator;
