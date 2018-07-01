function readFile(path, callback) {
    fetch(path, {mode:"same-origin"}).then(function(response) {
        return response.blob();
    }).then(function(blob) {
        let reader = new FileReader();
        reader.addEventListener("loadend", function() {
            callback(this.result);
        });
        reader.readAsText(blob);
    });
}

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
