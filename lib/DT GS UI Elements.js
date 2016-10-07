/*****************************************************************************************************
*
* User Interface Elements
*
* Requires sideBarForm.html which must be a captive files in the sheets script environment.
*
*/

// Install a new menu when opening a new spreadsheet with this code included or when
// installed as an add-on.

function onInstall() {
  onOpen();
}

function onOpen() {

 SpreadsheetApp.getUi()
       .createMenu('DialogTech')
       .addItem('Getting Started','gettingStarted')
       .addSeparator()
       .addItem('Configure Authentication and Options','openSideBar')
       .addSeparator()    
       .addItem('Generate Call Detail Dashboard','createCdrTab')
       .addItem('Clear CDR Tabs','clearCdrTabs')
       .addSeparator()
       .addItem('Generate Call Tracking Dashboard','createCallTrackingTab')
       .addItem('Clear Call Tracking Tabs','clearCallTrackingTabs')
       .addSeparator()
       .addItem('Retrieve CDR Data Without Dashboard ','getCdrData') 
       .addItem('Retrieve Call Tracking Data Without Dashboard ','getCallTrackingData')          
       .addSeparator()
       .addItem('Clear All Custom Tabs','clearAllTabs')
       .addItem('Clear Saved Options','clearSavedProperties')
       .addItem('About DialogTech Labs','labsHelp')
       .addToUi();
}

/**
 * Display a sidebar with a button, an input box, and a
 * label. The label is initially hidden.
 */
function openSideBar() {
  var htmlOutput = HtmlService.createHtmlOutputFromFile("sideBarForm");
  htmlOutput.setSandboxMode(HtmlService.SandboxMode.IFRAME)
            .setTitle("Dialogtech Configuration");
  var ui = SpreadsheetApp.getUi();
  ui.showSidebar(htmlOutput);
}

function processForm(data) {
  // Save the configuration properties in the google script store
  var userProperties = PropertiesService.getUserProperties();
  userProperties.setProperties(data);

  // Put any obsolete properties in the following method.
  removeObsoleteProperties();
}

function getStoredProperies() {
  var userProperties = PropertiesService.getUserProperties();
  var configurationData = userProperties.getProperties();
  return configurationData;
}

function clearSavedProperties() {
  removeProperty("UserName");
  removeProperty("Password");
  removeProperty("StartDate");
  removeProperty("EndDate");
  removeProperty("APIKey");
  removeProperty("ShortCalls");
  removeProperty("QuerySize");
  removeProperty("fetchURL");
  removeProperty("DebugMode");
}


function labsHelp() {

  checkForDebugMode();

  var helpText =
      "Dialogtech labs releases pre-production solutions that enhance the Dialogtech \\n" +
      "user experience.  While these solutions are engineered for quality they are \\n" +
      "considered experiments and will experience rapid interation that may be\\n" +
      "incompatible with product use.\\n\\n" +
      "If you anticipate using a DialogTech labs solution in production please contact\\n" +
      "your account manager or the DialogTech success team for support.\\n\\n";

  myMsgBox(helpText);
}

function gettingStarted() {

  checkForDebugMode();

  var blogJumpStart = '<a href="http://www.dialogtech.com/expertise/jumpstart/dialogtech-google-sheets-based-analytics-jumpstart-internal" target="_blank">' +
                      'Click on this link for the Add On Jumpstart</a>';
  var helpText =
      "<p>Thank you for trying the DialogTech Labs Google Sheets Integration.</p>" +
      "<p>You will find instuctions for using this integration on the DialogTech " +
      "blog at: </p><br /><br />" + blogJumpStart;

  showHTML(helpText,'Getting Started');
}

// HTML cannot be displayed in a msgBox so we have to use a UI alert instead
// were we need to include HTML

function showHTML(msg,myTitle) {
  // Display a modal dialog box with custom HtmlService content.
  var htmlOutput = HtmlService
      .createHtmlOutput(msg)
      .setWidth(500)
      .setHeight(250);
  SpreadsheetApp.getUi().showModalDialog(htmlOutput, myTitle);
}