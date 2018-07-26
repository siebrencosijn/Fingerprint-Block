/*
 * Implemented using the specification and algorithm at https://publicsuffix.org/list/
 */
let publicSuffix = {
    rules: {},
    exceptions: [],

    /*
     * Parse the rules from the public suffix list to objects.
     * The list can be found at https://publicsuffix.org/list/public_suffix_list.dat
     */
    parseList(list) {
        let lines = list.split("\n");
        for (let line of lines) {
            line = line.trim();
            // ignore empty lines and comments
            if (line.length === 0 || line.startsWith("//")) {
                continue;
            }
            // if a rule begins with "!", it is an exception rule
            if (line.startsWith("!")) {
                line = line.slice(1);
                this.exceptions.push(line);
            } else {
                // add rule to rules object
                let labels = line.split(".");
                let prev = this.rules;
                for (let i = labels.length; i-- > 0;) {
                    let label = labels[i];
                    if (prev[label] == null) {
                        prev[label] = i === 0 ? null : {};
                    }
                    prev = prev[label];
                }
            }
        }
    },

    /*
     * Returns the domain for given hostname.
     * The domain is the public suffix plus one additional label.
     * www.example.uk.com
     *             \____/ -> public suffix
     *     \____________/ -> domain
     * \________________/ -> hostname
     */
    getDomain(hostname) {
        let labels = hostname.split(".");
        // try to match exception first
        let rule = this.matchException(hostname);
        if (rule.length === 0) {
            // no exception found, try to match rule
            rule = this.matchLongestRule(labels);
            if (rule.length === 0) {
                // no rule found, use "*" as rule
                rule = ["*"];
            }
        } else {
            // modify exception by removing the leftmost label
            rule.pop();
        }
        let diff = labels.length - rule.length;
        return labels.slice(diff - 1, labels.length).join(".");
    },

    /*
     * Finds the matching exception for given hostname.
     */
    matchException(hostname) {
        for (let exception of this.exceptions) {
            if (hostname.includes(exception)) {
                return exception.split(".");
            }
        }
        return [];
    },

    /*
     * Finds the longest matching rule for given labels.
     */
    matchLongestRule(labels) {
        const wildcard = "*";
        let result = [];
        let prev = this.rules;
        for (let i = labels.length; i-- > 0;) {
            let label = labels[i];
            if (prev === null) {
                // end of rule
                break;
            }
            if (prev.hasOwnProperty(label)) {
                // matching label found
                result.push(label);
                prev = prev[label];
            } else if (prev.hasOwnProperty(wildcard)) {
                // wildcard found
                result.push(wildcard);
                prev = prev[wildcard];
            }
        }
        return result;
    }
};
export default publicSuffix;
