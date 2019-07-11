import { DEFAULT_OPTIONS } from '../utils/constants.js';

let options = {
    options: {},

    /*
     * Loads options from local storage or uses
     * default options if no options are stored. 
     */
    loadOptions() {
        browser.storage.local.get("options").then(res => {
            if (Object.getOwnPropertyNames(res).length != 0) {
                this.options = res.options;
            } else {
                this.options = DEFAULT_OPTIONS;
            }
        });
    },

    /*
     * Updates options and saves the new options to local storage.
     */
    setOptions(o) {
        this.options = o;
        browser.storage.local.set({options: this.options});
    },

    /*
     * Returns the value of the option with given name.
     */
    get(name) {
        return this.options[name];
    },

    /*
     * Returns an object containing all options. 
     */
    getAll() {
        return this.options;
    }
}
export default options;
