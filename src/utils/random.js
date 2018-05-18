/*
   This random fingerprint generator is based on Jeffrey Mealo random user-agent
   generator version 0.0.6 which is under the MIT license.
   Author: Jeffrey Mealo
   E-mail: jeffreymealo@gmail.com
   Web   : http://www.jeffreymealo.com
   URL   : https://github.com/jmealo/random-ua.js.git
*/

/*
   This generator was updated to generate random fingerprints based on a particular random profile.
   Author: Christof Ferreira Torres
   E-mail: christof.ferreira.001@student.uni.lu
*/

export function random(a, b) {
    // calling random() with no arguments is identical to random(0, 100)
    a = a || 0;
    b = b || 100;

    if (typeof b === 'number' && typeof a === 'number') {
        //random(int min, int max) returns an integer between min, max
        return (function(min, max) {
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
        return (function(obj) {
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

            return return_val;
        }(a));
    }

    throw new TypeError('Invalid arguments passed to random. (' + (b ? a + ', ' + b : a) + ')');
}
