/**
 * @description Prepares the UI by populating a table with data collected from Salesforce.
 *              It dynamically creates table rows and appends them to the table body.
 * @param {Array} records - Array of record objects fetched from Salesforce.
 *                          Each record is expected to have the following structure:
 */
function addCollectedDataToUI(records) {
    const collectedDataRoot = document.getElementById("collected_data_table_root"); // Root element for the table
    const priceActionTableBody = document.getElementById("price_action_table_body"); // Table body to append rows

    records.forEach(e => {
        let recordLink = generateRecordLink(e);
        let newTr = document.createElement("tr"); // Create a new table row
        newTr.innerHTML = `<td>${e.SBQQ__Rule__r.Name}</td>
                           <td><a href="${recordLink}" target="_blank">${e.Name}</a></td>
                           <td>${e.SBQQ__Rule__r.SBQQ__Active__c}</td>`;
        priceActionTableBody.appendChild(newTr); // Append the row to the table body
    });

    collectedDataRoot.classList.remove("hidden"); // Make the table visible
}

/**
 * @description Displays an error message on the UI when data is not found or an invalid field API is provided.
 * @param {string} error - The error message to display.
 */
function dataNotFoundOrWrongFieldAPI(error) {
    const collectedDataErrorRoot = document.getElementById("collected_data_error_root"); // Root element for error messages
    collectedDataErrorRoot.classList.remove("hidden"); // Make the error section visible

    let errorP = document.createElement("h1"); // Create a paragraph element for the error message
    errorP.innerText = error; // Set the error message text
    collectedDataErrorRoot.appendChild(errorP); // Append the error message to the error section
}

/**
 * @description Restores the UI to its initial state by resetting the innerHTML of a specific element.
 * @param {string} displayIfStoredHTML - The initial HTML content to restore.
 */
function clearUI(displayIfStoredHTML) {
    const dataRootToRestore = document.getElementById("display_data_root"); // Element to restore
    dataRootToRestore.innerHTML = displayIfStoredHTML; // Reset the innerHTML to the initial state
}

/**
 * @description Filters records based on a specific field API value and updates the UI accordingly.
 *              Displays a list of matching records or a message if no matches are found.
 * @param {Array} records - Array of record objects to filter.
 *                          Each record is expected to have the following structure:
 * @param {string} fieldAPI - The field API value to filter records by.
 */
function filterQCPAndLoadUI(records, fieldAPI) {
    let toDisplyOnUI = []; // Array to store matching records

    records.forEach((r) => {
        if (r.SBQQ__Code__c.includes(fieldAPI)) { // Check if the field API value is present in the record
            toDisplyOnUI.push(r); // Add matching record to the array
        }
    });

    if (toDisplyOnUI.length > 0) {
        const qcpList = document.getElementById("qcp_list"); // Element to display the list of matching records
        qcpList.innerHTML = ""; // Clear old inner HTML
        toDisplyOnUI.forEach((item, index) => {
            let recordLink = generateRecordLink(item);
            const separator = index < toDisplyOnUI.length - 1 ? ", " : "";
            const span = document.createElement("span");
            span.innerText = item.Name + separator;
            span.innerHTML = `<a href="${recordLink}" target="_blank">${item.Name}</a>` + separator;
            qcpList.appendChild(span);
        });
        const qcpDataFound = document.getElementById("qcp_data_found");
        qcpDataFound.classList.remove("hidden");
        hideQCPDataNotFound();
    } else {
        const qcpDataNotFound = document.getElementById("qcp_data_notfound");
        qcpDataNotFound.classList.remove("hidden");
        hideQCPDataFound()
    }
}
function hideQCPSection(){
    hideQCPDataNotFound();
    hideQCPDataFound()
}
function hideQCPDataNotFound(){
    const qcpDataNotFound = document.getElementById("qcp_data_notfound");
    qcpDataNotFound.classList.add("hidden");
}
function hideQCPDataFound(){
    const qcpDataFound = document.getElementById("qcp_data_found");
    qcpDataFound.classList.add("hidden");
}

// Generate a link for the record
function generateRecordLink(e) {
    let recordLink = `${instanceUrl}/${e.attributes.url.substring(e.attributes.url.lastIndexOf("/") + 1)}`; // Create a new anchor element
    return recordLink;
}