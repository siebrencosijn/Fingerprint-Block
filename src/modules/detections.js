/****************************************************************/
/* -- Fingerprint Privacy --                                    */
/* Author: Christof Ferreira Torres                             */
/* Date: 16.09.2014                                             */ 
/* Update: 27.06.2018                                           */
/****************************************************************/

let detections = {
    detections : [],

    /**
     * Load detections from browser local storage. 
     */
    loadDetections() {
        browser.storage.local.get("detections").then(function(result) {
            if (Object.getOwnPropertyNames(result).length != 0) {
                this.detections = result;
            }
        });
    },
    
    /**
     * Save detections to browser local storage.
     */
    saveDetections() {
       browser.storage.local.set({"detections" : this.detections}); 
    },

    /**
     * Removes detections.
     */
    clearDetections() {
        this.detections = [];
    },


    /**
     * Gets the detection for the given url.
     * @param {*} url 
     */
    getDetection(url){
        var detection = null;
        var index = this.getIndexOfDetection(url);
        if (index != -1) {
            detection = this.detections[index]; 
        }
        return detection;
    },

    /**
     * Adds a detection to the array of detections.
     * @param {*} url 
     * @param {*} attributes 
     * @param {*} notified 
     * @param {*} canvas 
     */
    addDetection(url, attributes, notified, canvas) {
        this.detections.push({url : url, attributes : attributes, notified : notified, canvas : canvas});
    },
    
    /**
     * Removes detection for the given domain from the array of detections.
     * @param {*} url 
     */
    deleteDetection(url) {
        var index = getIndexOfDetection(url);
        if (index != -1) {
            this.detections.slice(index,1);
        }
    },

    /**
     * Gets an attribute with the given name of the detection for the given url.
     * @param {*} url 
     * @param {*} name 
     */
    getAttribute(url, name) {
        var attribute = null;
        var indexOfDetection = this.getIndexOfDetection(url);
        var indexOfAttribute = this.getIndexOfAttribute(indexOfDetection, name);
        if (indexOfAttribute != -1) {
            attribute = this.detections[indexOfDetection].attributes[indexOfAttribute];
        }
        return attribute;
    },

    /**
     * Removes the attribule with the given name from the detection 
     * with the given url from the array of detections.
     * @param {*} url 
     * @param {*} name 
     */
    deleteAttribute(url, name) {
        var indexOfDetection = this.getIndexOfDetection(url);
        var indexOfAttribute = this.getIndexOfAttribute(indexOfDetection, name);
        if (indexOfAttribute != -1) {
            this.detections[indexOfDetection].attributes.splice(indexOfAttribute, 1);
        }
    },

    /**
     * Gets all detections.
     */
    getAllDetections() {
        return this.detections;
    },

    // Hulp functions
    /*
    * Gets the index of the detection for the given url 
    * in the array of detections.
    */
    getIndexOfDetection(url) {
        for (var i = 0; i < this.detections.length; i++) {
            if(this.detections[i].url.indexOf(url) = -1) {
                return i;
            }
        }
        return -1;
    },

    /* 
    * Gets the index of the attribute with the given name 
    * for the detection with the given index
    * in the array of detections.
    */
    getIndexOfAttribute(indexOfDetection, name) {
        for(var i = 0; i < this.detections[indexOfDetection].attributes.length; i++) {
            if(this.detections[indexOfDetection].attributes[i] != -1) {
                return i;
            }
        }
        return -1;
    }
}

export default detections;
