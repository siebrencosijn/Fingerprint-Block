function show(id) {
    let tabId = id + "-tab";
    let panelId = id + "-panel";
    document.querySelectorAll(".tab").forEach(tab => {
        tab.classList.toggle("active", tab.id === tabId);
    });
    document.querySelectorAll(".panel").forEach(panel => {
        panel.classList.toggle("hidden", panel.id !== panelId);
    });
}

document.addEventListener("DOMContentLoaded", showOverview);
document.querySelector("#overview-tab").addEventListener("click", showOverview);
document.querySelector("#webidentities-tab").addEventListener("click", showWebIdentities);
document.querySelector("#options-tab").addEventListener("click", showOptions);
