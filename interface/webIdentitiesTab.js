function initWebIdentities(webidentities) {
    document.querySelector("#subtitle").innerHTML = "Web Identities";
    let table = document.querySelector("#webidentities-table");
    let tbody = document.createElement("tbody");
    for (let webidentity of webidentities) {
        let tr = document.createElement("tr");
        let td = document.createElement("td");
        let text = document.createTextNode(webidentity.domain);
        tr.addEventListener("click", () => tr.classList.toggle("selected"));
        td.appendChild(text);
        tr.appendChild(td);
        tbody.appendChild(tr);
    }
    table.replaceChild(tbody, table.getElementsByTagName("tbody")[0]);
    document.querySelector("#webidentity-search").addEventListener("input", search);
    document.querySelector("#select-button").addEventListener("click", selectAll);
    document.querySelector("#clear-button").addEventListener("click", clearSelection);
    document.querySelector("#delete-button").addEventListener("click", deleteSelected);
}

function search() {
    let value = document.querySelector("#webidentity-search").value;
    let table = document.querySelector("#webidentities-table");
    let rows = table.getElementsByTagName("tr");
    if (value.length > 0) {
        for (let row of rows) {
            let domain = row.getElementsByTagName("td")[0].textContent;
            row.classList.toggle("hidden", !domain.includes(value));
        }
    } else {
        for (let row of rows) {
            row.classList.remove("hidden");
        }  
    }
}

function selectAll() {
    let table = document.querySelector("#webidentities-table");
    let rows = table.getElementsByTagName("tr");
    for (let row of rows) {
        if (!row.classList.contains("hidden")) {
            row.classList.add("selected");
        }
    }
}

function clearSelection() {
    let table = document.querySelector("#webidentities-table");
    let rows = table.getElementsByTagName("tr");
    for (let row of rows) {
        row.classList.remove("selected");
    }
}

function deleteSelected() {
    let selected = document.querySelectorAll("#webidentities-table tr.selected");
    let deleted = [];
    for (let row of selected) {
        deleted.push(row.getElementsByTagName("td")[0].textContent);
        row.remove();
    }
    browser.runtime.sendMessage({
        action: "delete-webidentities",
        content: deleted
    });
}

function showWebIdentities() {
    browser.runtime.sendMessage({
        action: "get-webidentities"
    }).then(message => {
        initWebIdentities(message.response);
    });
    show("webidentities");
}
