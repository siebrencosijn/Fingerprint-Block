class WebIdentity {
    constructor(domain, fingerprint) {
        this.domain = domain;
        this.fingerprint = fingerprint;
        this.thirdparties = [];
        this.socialplugins = [];
        this.browserplugins = [];
        this.usage = {
            amount: 0,
            date: new Date().getTime()
        };
    }

    incrementUsage() {
        this.usage.amount++;
        this.usage.date = new Date().getTime();
    }
}
export default WebIdentity;
