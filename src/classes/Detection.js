class Detection {
    constructor(url, attributes, notified, canvas) {
        this.url = url;
        this.attributes = attributes;
        this.notified = notified;
        this.canvas = canvas;
    }

    /**
     * Gets attribute with the given name from array of attributes.
     * @param {*} name
     */
    getAttribute(name) {
        var attribute = null;
        var indexOfAttribute = getIndexOfAttribute(name);
        if (indexOfAttribute != -1) {
             attribute = this.detections[indexOfDetection].attributes[indexOfAttribute];
        }
        return attribute;
    }

}
export default Detection;

// Hulp functions
/*
* Gets the index of the attribute with the given name from array of attributes.
* in the array of detections.
*/
function getIndexOfAttribute(name) {
    for(var i = 0; i < this.attributes.length; i++) {
        if(this.attributes[i].name.indexOf(name) != -1) {
            return i;
        }
    }
    return -1;
}