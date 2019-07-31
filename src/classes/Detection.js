/********************************************/
/* -- Fingerprint Privacy --                */
/* Date: 5.07.2018                          */
/********************************************/
class Detection {
    constructor(domain, notified) {
        this.domain = domain;
        this.notified = notified;
        this.attributes = [];
    }

    /**
     * Adds the attribute to the detection array of attributes.
     * @param {*} attribute to add attribute
     */
    addAttribute(attribute) {
        this.attributes.push(attribute);
    } 

    /**
     * Gets attribute with a name from array of attributes.
     * @param {*} name
     */
    getAttribute(name) {
        return this.attributes.find(
            h => h.name.toLowerCase() === name.toLowerCase()
        );
    }

    /**
     * Returns the index of the attribute with a name.
     * @param {*} name 
     */
    getAttributeIndex(name) {
        return this.attributes.findIndex(
            h => h.name.toLowerCase() === name.toLowerCase()
        );
    }
    
    /**
     * Removes the attribute with a name from the array of attributes. 
     * @param {*} name 
     */
    removeAttribute(name) {
        let index = this.getAttributeIndex(name);
        if(index !== -1) {
            this.attributes.splice(index, 1);
        }
    }

    /**
     * Returns true if the array of attributes contains an attribute
     * with given name, false otherwise
     * @param {*} name
     */
    containsAttribute(name) {
        return this.getAttributeIndex(name) !== -1;
    }

    static from(json) {
        return Object.assign(new Detection(), json);
    }
}
export default Detection;
