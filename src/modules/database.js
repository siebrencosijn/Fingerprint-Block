let db = {
    instance: {},

    upgrade(e) {
        let _db = e.target.result;
        let store1 = _db.createObjectStore(db.DB_STORE_FINGERPRINTS, {keyPath: "id"});
        let store2 = _db.createObjectStore(db.DB_STORE_WEBIDENTITIES, {keyPath: "domain"});
        let store3 = _db.createObjectStore(db.DB_STORE_DETECTIONS, {keyPath: "domain"});
    },

    error(e) {
        console.error("db:", e.target.errorCode);
    },

    open(callback) {
        let request = indexedDB.open(db.DB_NAME);
        request.onerror = db.error;
        request.onupgradeneeded = db.upgrade;
        request.onsuccess = e => {
            db.instance = request.result;
            db.instance.onerror = db.error;
            callback();
        };
    },

    getObjectStore(store_name, mode) {
        let transaction = db.instance.transaction([store_name], mode);
        return transaction.objectStore(store_name);
    },

    get(store_name, callback) {
        db.open(() => {
            let store = db.getObjectStore(store_name, db.R);
            let request = store.getAll();
            request.onsuccess = e => {
                callback(e.target.result);
            };
        });
    },

    insert(item, store_name) {
        db.open(() => {
            let store = db.getObjectStore(store_name, db.RW);
            store.put(item);
        });
    },

    remove(key, store_name) {
        db.open(() => {
            let store = db.getObjectStore(store_name, db.RW);
            store.delete(key);
        });
    },

    clear() {
        db.open(() => {
            db.getObjectStore(db.DB_STORE_FINGERPRINTS, db.RW).clear();
            db.getObjectStore(db.DB_STORE_WEBIDENTITIES, db.RW).clear();
            db.getObjectStore(db.DB_STORE_DETECTIONS, db.RW).clear();
        });
    }
}

Object.defineProperty(db, "DB_NAME", {
    value: "fpblock-db",
    writable: false
});

Object.defineProperty(db, "DB_STORE_FINGERPRINTS", {
    value: "fingerprints",
    writable: false
});

Object.defineProperty(db, "DB_STORE_WEBIDENTITIES", {
    value: "webidentities",
    writable: false
});

Object.defineProperty(db, "DB_STORE_DETECTIONS", {
    value: "detections",
    writable: false
});

Object.defineProperty(db, "R", {
    value: "readonly",
    writable: false
});

Object.defineProperty(db, "RW", {
    value: "readwrite",
    writable: false
});

export default db;
