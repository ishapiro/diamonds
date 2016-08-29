// Format the query and sent it to DialogTech
function sendCurlRequest(my_query) {
  var response;
  var options = {
    "method": "get",
    "muteHttpExceptions": false
  };

  try {
    response = UrlFetchApp.fetch(my_query, options);
  } catch (err) {
      Browser.msgBox("Google UrlFetch error. Please reduce the number of days to retrieve per query in the advanced options configuration section. " +
      "As a rule of thumb set this value to retrieve no more than 10,000 calls per query.  So if you receive 1,000 calls per day an optimal value would be 10 days.");
    return "failed";
  }

  // IMS August 28 2016
  // Cleaned up this section in response to a code review
  var dtStatusXML = response.getContentText();

  // Check to see if this is a CSV or an XML file
  if (dtStatusXML == "<?xml") {

    // If we get back XML from DT then an error has occurred
    // Parse it and return the error
    var dtStatus = XmlService.parse(dtStatusXML);
    var dtStatusText = dtStatus.getRootElement().getChild("result").getValue();
    return dtStatusText;                      
    
  } else {
    
    // If the returned value is not XML than assume it is a CSV file 
    return response.getContentText();         // This is a CSV which is not XML so return it
  }
}

// Check Username, Password and API key options

function checkLoginCredential() {

  // Get the configuration data from the Google script properties
  var userProperties = PropertiesService.getUserProperties();
  var configurationData = userProperties.getProperties();
  
  // If the user defines an API key it overrides the username and password

  var apiKey = configurationData.APIKey;
  if ((typeof apiKey === 'undefined') || (apiKey.length == 0)) {
    var username = configurationData.UserName;
    var password = configurationData.Password;
    var apiKey = getApiKey(username, password);
  } else {
  
    // Verify that the API key provided is valid by calling the DT get building block
    
    var my_query = 'https://secure.dialogtech.com/ibp_api.php?api_key=' +
                    apiKey + '&action=general.buildingblockids';
    var curlStatus = sendCurlRequest(my_query);
    if (curlStatus == "failed") {
      Browser.msgBox("Invalid API Key Provided (" + apiKey + "). If an API key is provided it overides the username/password.  Please verify configuration.");
      addSplashScreen();
      focusOnSplashScreen();
      return "failed";
    }
  }

  if ((apiKey == "INVALID ACCOUNT") || (apiKey == 'failed')) {
    var userPassMsg = 'Invalid Username: ' + username + 
                      ' or Password: ' + password +
                      '\\n\\nIf an API key is provided it will override the Username and Password. If no API Key is provided the Username & Password are verified before proceeding.';
                    
    Browser.msgBox( userPassMsg);
    
    // Do not continue execution
    addSplashScreen();
    focusOnSplashScreen();
    return "failed";
  }
  
  // Replace the API key in the configuration object (this is not the property)
  MyConfigurationData.apiKey = apiKey;
  return "success";
}

// Retrieve an APIkey from Dialogtech
function getApiKey(username, password) {

  var urlSafePassword = escape(password);
  var myQuery = "https://secure.dialogtech.com/ibp_api.php?action=general.login&username=" +
    username + "&password=" + urlSafePassword;

  var options = {
    "method": "get",
    "muteHttpExceptions": false
  };
  
  var fetchResponse;

  try {
    fetchResponse = UrlFetchApp.fetch(myQuery, options);
  } catch (err) {
    Browser.msgBox("Error validating user. " + myQuery);
    return 'failed';
  }

  var apiXML = fetchResponse.getContentText();
  var apiKeyObject = XmlService.parse(apiXML);
  var apiKey = apiKeyObject.getRootElement().getChild("result").getValue();

  return apiKey;
}

// Convert csv data to array and format for insertion into spreadsheet

function formatTableData(results) {
  var rows = [];
  
  myToast('Converting CSV data into array', 'Diagnostic Data', 3);
  try {
    rows = Utilities.parseCsv(results);
  }
  catch(err) {
    return "failed";
  }
  
  myToast('Array convertion complete', 'Diagnostic Data', 3);  
  return rows;
}


