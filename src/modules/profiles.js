import { readFile } from '../utils/utils.js';

function readProfiles() {
    let profiles = [],
        dir = "/profiles/",
        paths = [dir + "chrome.json", dir + "firefox.json", dir + "opera.json", dir + "safari.json"];
    for (let path of paths) {
        readFile(path, (file) => profiles.push(JSON.parse(file)));
    }
    return profiles;
}

// export profiles as array
export default readProfiles();
