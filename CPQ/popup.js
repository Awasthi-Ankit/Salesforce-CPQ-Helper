(() => {
    let sessionId = '';
    let instanceUrl = '';
    let data = {};
    let fieldAPI = '';
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
        const includeInActive = document.getElementById("include_inactive").checked;
        const searchInQCP = document.getElementById('search_in_qcp').checked;
        findInCPQActions(includeInActive);
        if(searchInQCP && fieldAPI){
            searchInQCPFile();
        }else{
            hideQCPSection();
        }
        
    });
    
    /**
     * @description Utility function to construct Salesforce API URLs
     * @param {string} endpoint - The API endpoint (e.g., '/services/data/v60.0/query/')
     * @param {string} query - The SOQL query string
     * @returns {string} - The full API URL
     */
    function constructSalesforceApiUrl(endpoint, query) {
        return `${instanceUrl}${endpoint}?q=${encodeURIComponent(query)}`;
    }
    
    /**
     * @description Utility function to perform a fetch call with Salesforce API
     * @param {string} apiUrl - The full API URL
     * @returns {Promise<object>} - The JSON response from the API
     * @throws {Error} - Throws an error if the fetch call fails
     */
    async function fetchSalesforceData(apiUrl) {
        try {
            const response = await fetch(apiUrl, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${sessionId}`,
                    "Content-Type": "application/json"
                }
            });
            if (!response.ok) {
                throw new Error(await response.text());
            }
            return await response.json();
        } catch (error) {
            console.error("Error fetching Salesforce data:", error);
            throw error;
        }
    }
    
    /**
     * @description Asynchronus function that fetch possible price actions from connected Saesforce
     * @async Waits for the data response from the SOQL Query sent to Salesforce
     */
    async function findInCPQActions(includeInActive) {
        let query = `SELECT Id,Name,SBQQ__Rule__c,SBQQ__Rule__r.Name,SBQQ__Rule__r.SBQQ__Active__c FROM SBQQ__PriceAction__c WHERE SBQQ__Field__c = '${fieldAPI}'`;
        if (!includeInActive) {
            query += " AND SBQQ__Rule__r.SBQQ__Active__c = true";
        }
        const apiUrl = constructSalesforceApiUrl('/services/data/v60.0/query/', query);
        try {
            data = await fetchSalesforceData(apiUrl);
            if (data.records.length > 0) {
                addCollectedDataToUI(data.records, instanceUrl);
            } else {
                let m = fieldAPI === ""
                    ? 'Field API is empty. Please enter a value.'
                    :'No Price Actions Found On the Field APPI: ' + fieldAPI
                dataNotFoundOrWrongFieldAPI(m);
            }
        } catch (error) {
            dataNotFoundOrWrongFieldAPI(error.message);
        }
    }
    
    async function searchInQCPFile(){
        let query = "SELECT Id,Name,SBQQ__Code__c FROM SBQQ__CustomScript__c";
        const apiUrl = constructSalesforceApiUrl('/services/data/v60.0/query/', query);
        try {
            data = await fetchSalesforceData(apiUrl);
            if (data.records.length > 0) {
                filterQCPAndLoadUI(data.records,fieldAPI, instanceUrl);
            }
        } catch (error) {
            console.error("Error fetching QCP:", error);
        }
    }
})();
