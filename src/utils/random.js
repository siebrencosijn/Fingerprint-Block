function random(a, b) {
    // calling random() with no arguments is identical to random(0, 100)
    a = a || 0;
    b = b || 100;

    if (typeof b === 'number' && typeof a === 'number') {
        //random(int min, int max) returns an integer between min, max
        return (function (min, max)) {
            if (min > max) {
                throw new RangeError('expect min <= max; got min = ' + min + ', max = ' + max);
            }
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }(a, b));
    }

    if (Object.prototype.toString.call(a) === "[object Array]") {
        // returns a random element from array (a), even weighting
        return a[Math.floor(Math.random() * a.length)];
    }

    if (a && typeof a === 'object') {
        // returns a random key from the passed object; keys are weighted by the decimal probability in their value
        return (function (obj) {
            var rand = random(0, 100) / 100,
                min = 0,
                max = 0,
                key,
                return_val;
            for (key in obj) {
                if (obj.hasOwnProperty(key)) {
                    max = obj[key] + min;
                    return_val = key;
                    if (rand >= min && rand <= max) {
                        break;
                    }
                    min = min + obj[key];
                }
            }
        }(a));
    }

    throw new TypeError('Invalid arguments passed to random. (' + (b ? a + ', ' + b : a) + ')');
}
