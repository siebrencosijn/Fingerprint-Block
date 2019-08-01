import db from './database.js';
import Detection from '../classes/Detection.js';

let detections = {
    detections: [],

    /**
     * Load detections from browser local storage. 
     */
    loadDetections() {
        db.get(db.DB_STORE_DETECTIONS, (result) => {
            if (result.length > 0) {
                this.detections = [];
                for (let detection of result) {
                    this.detections.push(Detection.from(detection));
                }
            }
        });
    },

    /**
     * Save detection to database.
     */
    save(detection) {
        db.insert(detection, db.DB_STORE_DETECTIONS);
    },

    /**
     * Gets the detection for a domain.
     * If the detection for a domain does not exist, returns 'undefined'.
     * @param {*} domain
     * @returns detection 
     */
    getDetection(domain) {
        return this.detections.find(
            h => h.domain.toLowerCase() === domain.toLowerCase()
        );
    },

    /**
     * Returns the index of the detection for a domain.
     * If the detection for a domain does not exist, it returns -1.
     * @param {*} domain 
     */
    getDetectionIndex(domain) {
        return this.detections.findIndex(
            h => h.domain.toLowerCase() === domain.toLowerCase()
        );
    },

    /**
     * Adds a detection to the array of detections.
     * @param {*} detection
     */
    addDetection(detection) {
        this.detections.push(detection);
    },

    /**
     * Removes detection for a domain from the array of detections.
     * @param {*} domain 
     */
    deleteDetection(domain) {
        let index = this.getDetectionIndex(domain);
        if (index != -1) {
            this.detections.splice(index, 1);
            db.remove(domain, db.DB_STORE_DETECTIONS);
        }
    },

    /**
     * Gets all detections.
     * @returns all detections
     */
    getAllDetections() {
        return this.detections;
    }
}
export default detections;
