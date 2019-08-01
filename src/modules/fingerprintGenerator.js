import webIdentities from './webIdentities.js';
import detections from './detections.js';
import Tree from '../classes/Tree.js';
import Fingerprint from '../classes/Fingerprint.js';
import DATA from '../../data/browser_data.js';
import db from './database.js';

let fingerprintGenerator = {
    /**
     * Load the data from browser local storage,
     * or call initialize if this is the first run.
     */
    load() {
        db.get(db.DB_STORE_FINGERPRINTS, (result) => {
            let used = [];
            result.forEach(fp => {
                used.push(fp.id);
            });
            this.init(used);
        });
    },

    use(id) {
        db.insert({id: id}, db.DB_STORE_FINGERPRINTS);
    },

    free(id) {
        db.remove(id, db.DB_STORE_FINGERPRINTS);
    },

    /**
     * Return a random unused fingerprint.
     * @return {Object} The fingerprint.
     */
    generate() {
        let r = this.tree.random();
        if (r === null) {
            let oldest = webIdentities.removeOldest();
            detections.deleteDetection(oldest.domain);
            return oldest.fingerprint;
        }
        let fontData = {defaultWidth: 64, defaultHeight: 100};
        let canvasData = { data: null };
        this.use(r.id);
        return new Fingerprint(r.id, r.value, r.weight, fontData, canvasData);
    },

    /**
     * Initialize the data needed to generate fingerprints.
     */
    init(used) {
        let fps = [];
        this._init_browser_attr(fps);
        let h = Math.ceil(Math.log2(fps.length + 1)) - 1;
        let s = Math.pow(2, h + 1) - 1;
        this.tree = new Tree(s);
        for (let i = 0; i < fps.length; i++) {
            if (!used.includes(i)) {
                this.tree.insert(i, fps[i].v, fps[i].w);
            }
        }
    },

    _init_browser_attr(fps) {
        for (let i0 = 0; i0 < DATA.browsers.length; i0++) {
            let browser = DATA.browsers[i0];
            for (let i1 = 0; i1 < browser.os.length; i1++) {
                let os = browser.os[i1];
                for (let i2 = 0; i2 < browser.versions.length; i2++) {
                    let version = browser.versions[i2];
                    let w = browser.weight * os.weight * version.weight;
                    if (version.patches != null) {
                        for (let i3 = 0; i3 < version.patches.length; i3++) {
                            for (let i4 = 0; i4 < version.patches[i3].numbers.length; i4++) {
                                this._init_other_attr(fps, i0, i1, i2, i3, i4, w);
                            }
                        }
                    } else {
                        this._init_other_attr(fps, i0, i1, i2, -1, -1, w);
                    }
                }
            }
        }
    },

    _init_other_attr(fps, i0, i1, i2, i3, i4, w) {
        for (let i5 = 0; i5 < DATA.screen.resolutions.length; i5++) {
            for (let i6 = 0; i6 < DATA.languages.length; i6++) {
                for (let i7 = 0; i7 < DATA.timezones.length; i7++) {
                    fps.push({
                        v: [i0, i1, i2, i3, i4, i5, i6, i7],
                        w: w * DATA.screen.resolutions[i5].weight
                    });
                }
            }
        }
    }
};
export default fingerprintGenerator;
