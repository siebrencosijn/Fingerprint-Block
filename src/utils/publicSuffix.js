/*
 * Implemented using the specification and algorithm at https://publicsuffix.org/list/
 */
let publicSuffix = {
    rules: {},
    exceptions: {},

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
            let type = this.rules;
            // if a rule begins with "!", it is an exception rule
            if (line.startsWith("!")) {
                line = line.slice(1);
                type = this.exceptions;
            }
            // add rule to object
            let labels = line.split(".");
            let prev = type;
            for (let i = labels.length; i-- > 0;) {
                let label = labels[i];
                if (prev[label] == null) {
                    prev[label] = i === 0 ? null : {};
                }
                prev = prev[label];
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
        // look for exception first
        let rule = this.longestMatchingRule(this.exceptions, labels);
        if (rule.length === 0) {
            // no exception found, use normal rule
            rule = this.longestMatchingRule(this.rules, labels);
            if (rule.length === 0) {
                // no rule found, using full hostname
                return hostname;
            }
        }
        let diff = labels.length - rule.length;
        let domain = labels.slice(diff - 1, labels.length);
        return domain.join(".");
    },

    /*
     * Finds the longest matching rule for given labels.
     */
    longestMatchingRule(rules, labels) {
        const wildcard = "*";
        let result = [];
        let prev = rules;
        for (let i = labels.length; i-- > 0;) {
            let label = labels[i];
            if (prev[label] != null) {
                // matching label found
                result.push(label);
                prev = prev[label];
            } else if (prev[wildcard] != null) {
                // wildcard found
                result.push(wildcard);
                prev = prev[wildcard];
            } else {
                // no match found, stop search
                break;
            }
        }
        return result;
    }
};
export default publicSuffix;
