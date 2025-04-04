let sessionId = '';
let instanceUrl = '';
let data = {};
let fieldAPI = '';
let objectAPI = '';
const findInCPQActionUse = document.getElementById('find_in_CPQ_action_use');
const storeInitialDisplayDataRootHTML = document.getElementById("display_data_root").innerHTML; // store inner html to go back to initial state when needed to reset the UI.

/**
 * @description Get all the data required from chrom tab and cookies
 */
chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs.length === 0) return;
    let url = new URL(tabs[0].url);
    let domain = url.hostname.includes(".force.com") ? url.hostname.replace(".lightning.force.com", ".my.salesforce.com") : url.hostname;
    instanceUrl = `https://${domain}`;
    chrome.cookies.get({ url: `https://${domain}`, name: 'sid' }, function (cookie) {
        if (cookie) {
            sessionId = cookie.value;
        } else {
            console.error("Session ID not found.");
        }
    });
});

/**
 * @description Listen to the user button click for finding price actions
 */
findInCPQActionUse.addEventListener('click', function () {
    clearUI(storeInitialDisplayDataRootHTML);
    fieldAPI = document.getElementById("find_a_field_input_id").value.trim();
    includeInActive = document.getElementById("include_inactive").checked;
    searchInQCP = document.getElementById('search_in_qcp').checked;
    if(fieldAPI){
        findInCPQActions(includeInActive);
    }else{
        console.error('Please add a field API to search with');
    }
    if(searchInQCP){
        searchInQCPFile();
    }
});

/**
 * @description Asynchronus function that fetch possible price actions from connected Saesforce
 * @async Waits for the data response from the SOQL Query sent to Salesforce
 */
async function findInCPQActions(includeInActive) {
    let query = encodeURIComponent("SELECT Id,Name,SBQQ__Rule__r.Name,SBQQ__Rule__r.SBQQ__Active__c from SBQQ__PriceAction__c WHERE SBQQ__Field__c =" + "'" +fieldAPI+"'");
    if(!includeInActive){
        query += " AND SBQQ__Rule__r.SBQQ__Active__c = true"
    }
    const apiUrl = `${instanceUrl}/services/data/v60.0/query/?q=${query}`;
    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${sessionId}`,
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) {
            dataNotFoundOrWrongFieldAPI(response.text());
            throw new Error(await response.text());
        }
        data = await response.json();
        if (data.records.length > 0) {
            console.log("Price Action Name:", data.records[0].Name);
            addCollectedDataToUI(data.records);
        } else {
            let m = 'No Price Actions Found On This Field';
            dataNotFoundOrWrongFieldAPI(m);
        }
    } catch (error) {
        console.error("Error fetching price actions:", error);
    }
}

async function searchInQCPFile(){
    let query = encodeURIComponent("SELECT Id,Name,SBQQ__Code__c FROM SBQQ__CustomScript__c");
    const apiUrl = `${instanceUrl}/services/data/v60.0/query/?q=${query}`;
    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${sessionId}`,
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) {
            dataNotFoundOrWrongFieldAPI(response.text());
            throw new Error(await response.text());
        }
        data = await response.json();
        if (data.records.length > 0) {
            console.log("QCP Name:", data.records[0].Name);
            filterQCPAndLoadUI(data.records,fieldAPI);
        }
    } catch (error) {
        console.error("Error fetching QCP:", error);
    }

}
