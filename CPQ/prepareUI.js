/**
 * @description Prepares UI for the data collected from Salesforce and manages it into a Table
 * @param { * } records 
 */
function addCollectedDataToUI(records) {
    console.log(records);

    const collectedDataRoot = document.getElementById("collected_data_table_root");
    const priceActionTableBody = document.getElementById("price_action_table_body");

    records.forEach(e => {
        console.log(e);

        let newTr = document.createElement("tr");
        newTr.innerHTML = `<td>${e.SBQQ__Rule__r.Name}</td><td>${e.Name}</td><td>${e.SBQQ__Rule__r.SBQQ__Active__c}</td>`;
        priceActionTableBody.appendChild(newTr);
    });

    collectedDataRoot.classList.remove("hidden");
}

/**
 * @description Display errors or messages on the UI
 * @param {string} error 
 */
function dataNotFoundOrWrongFieldAPI(error) {
    const collectedDataErrorRoot = document.getElementById("collected_data_error_root");
    collectedDataErrorRoot.classList.remove("hidden");

    let errorP = document.createElement("p");
    errorP.innerText = error;
    collectedDataErrorRoot.appendChild(errorP);
}

/**
 * @description Restore display_data_root to the initial innerHTML
 * @param {html} displayIfStoredHTML 
 */
function clearUI(displayIfStoredHTML) {
    const dataRootToRestore = document.getElementById("display_data_root");
    dataRootToRestore.innerHTML = displayIfStoredHTML;
}

function filterQCPAndLoadUI(records, fieldAPI) {
    let toDisplyOnUI = [];

    records.forEach((r) => {
        console.log(r);

        if (r.SBQQ__Code__c.includes(fieldAPI)) {
            toDisplyOnUI.push(r);
        }
    });

    console.log(toDisplyOnUI);

    if (toDisplyOnUI.length > 0) {
        const qcpDataFound = document.getElementById("qcp_data_found");
        qcpDataFound.classList.remove("hidden");

        const qcpList = document.getElementById("qcp_list");
        qcpList.innerHTML = ""; // Clear old inner HTML

        toDisplyOnUI.forEach((item, index) => {
            const separator = index < toDisplyOnUI.length - 1 ? ", " : "";
            const span = document.createElement("span");
            span.innerText = item.Name + separator;
            qcpList.appendChild(span);
        });
    } else {
        const qcpDataNotFound = document.getElementById("qcp_data_notfound");
        qcpDataNotFound.classList.remove("hidden");
    }
}