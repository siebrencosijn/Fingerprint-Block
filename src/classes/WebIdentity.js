class WebIdentity {
    constructor(domain, fingerprint) {
        this.enabled = true;
        this.domain = domain;
        this.fingerprint = fingerprint;
        this.thirdparties = [];
        this.socialplugins = [];
        this.last_used = new Date().getTime();
    }
}
export default WebIdentity;
