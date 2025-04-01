/**
 * @description Prepares UI for the data collected from Salesforce and manages it into a Table
 * @param { * } records 
 */
function addCollectedDataToUI(records){
    console.log(records);
    const collectedDataRoot = document.getElementById("collected_data_table_root");
    const priceActionTable = document.getElementById("price_action_table");
    records.forEach(e => {
        console.log(e);
        let newTr = document.createElement("tr");
        newTr.innerHTML = `<td>${e.SBQQ__Rule__r.Name}</td><td>${e.Name}</td><td>${e.SBQQ__Rule__r.SBQQ__Active__c}</td>`;
        priceActionTable.appendChild(newTr);
    });
    collectedDataRoot.classList.remove("hidden");
}
/**
 * @description Disply errors or messages on the UI
 * @param {string} error 
 */
function dataNotFoundOrWrongFieldAPI(error){
    const collectedDataErrorRoot = document.getElementById("collected_data_error_root");
    collectedDataErrorRoot.classList.remove("hidden");
    let errorP = document.createElement("p");
    errorP.innerText = error;
    collectedDataErrorRoot.appendChild(errorP);
}
/**
 * @description restrore display_data_root to the initial innerHTML
 * @param {html} displayIfStoredHTML 
 */
function clearUI(displayIfStoredHTML){
    const dataRootToRestore = document.getElementById("display_data_root");
    dataRootToRestore.innerHTML = displayIfStoredHTML;
}