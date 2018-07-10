class Detection {
      
    constructor(domain, attributes, notified, canvas) {
        this.domain = domain;
        this.attributes = attributes;
        this.notified = notified;
        this.canvas = canvas;
    }

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

}
export default Detection;