function addDashboardTitles(dashBoardType, mainSheet, dataRows, dateRange) {

  createDashboard(dashBoardType);
  
  var ss = MyConfigurationData.activeSpreadsheet;
  if (dashBoardType == "CDR") {
    var dashBoardName = "Dashboard";
    var dashBoardTitle = "Conversation Detail Dashboard";
  } else {
    var dashBoardName = "Call Tracking Dashboard";
    var dashBoardTitle = "Call Tracking Dashboard";
  }
  
  var sheet = ss.getSheetByName(dashBoardName);

  // At a logo and title to the page
  sheet.setRowHeight(1, 50);
  sheet.setColumnWidth(1, 175);
  var titleCell = sheet.getRange("A1:A1");
  titleCell.setValue('=image("https://www.dialogtech.com/wp-content/uploads/2015/02/dialogtech_logo_rgb1-e1425267086594.png")');

  titleCell = sheet.getRange("A3:A3");
  titleCell.setValue(dashBoardTitle);
  titleCell.setFontSize(20);

  titleCell = sheet.getRange("A4:A4");
  titleCell.setValue('Conversations Processed: ' + dataRows);
  titleCell.setFontSize(15);
  titleCell.setFontColor("#1E6234");

  titleCell = sheet.getRange("A5:A5");
  titleCell.setValue('For Date Range: ' + dateRange);
  titleCell.setFontSize(15);
  titleCell.setFontColor("#1E6234");

  // Postion the cell cursor out of the way
  var range = sheet.getRange("A2:A2");
  sheet.setActiveSelection(range);
}

function addSplashScreen() {
  
  var ss = MyConfigurationData.activeSpreadsheet;
  var welcomeScreen = ss.getSheetByName("DialogTech Welcome Screen");
  if ((typeof welcomeScreen === 'undefined') || (welcomeScreen === null)) {
    var sheet = ss.insertSheet('DialogTech Welcome Screen',0);
  } 
          
  var sheet = ss.getSheetByName("DialogTech Welcome Screen");
  sheet.clear(welcomeScreen);

  // At a logo and title to the page
  sheet.setRowHeight(2, 50);
  sheet.setColumnWidth(2, 600);
  var titleCell = sheet.getRange("B2:B2");
  titleCell.setValue('=image("https://www.dialogtech.com/wp-content/uploads/2015/02/dialogtech_logo_rgb1-e1425267086594.png")');
  
  titleCell = sheet.getRange("B4:B4");
  titleCell.setValue('DialogTech Google Sheets Based Analytics');
  titleCell.setFontSize(16);
  titleCell = sheet.getRange("B5:B5");
  titleCell.setValue('Experimental Software from DialogTech Labs');
  titleCell.setFontSize(14);
  titleCell.setFontColor("red");
  
  titleCell = sheet.getRange("B7:B7");
  var instructions = 
      '="To proceed select the DialogTech menu from the Add-on or main menu bar." & char(10) & ' +
      'char(10) & ' +
      '"1. Select Configure Authentication and Options: " & char(10) & ' +
      '"   a. Enter a username and password or an API key " & char(10) & ' +
      '"   b. Specify a date range " & char(10) & ' +
      '"2. Save the configuration." & char(10) & ' +
      '"3. Generate the dashboards " & char(10) & ' +
      '"   a. Generate the Call Detail Dashboard or " & char(10) & ' +
      '"   b. Generate the Call Tracking Dashboard" & char(10) & char(10) & ' +
      '"The yellow tabs contain the graphical dashboards. " & char(10) & ' +
      '"The clear tabs contain the raw data. " & char(10) & ' +
      '"And the green tabs contain pivot tables and calculated values. "';
      
  var googleNotice = 
      '="GOOGLE SHEETS LIMITATIONS: While Google Sheets is a powerful and " & char(10) & ' +
      '"flexible environment it does not recover well from errors. If this application " & char(10) & ' +
      '"is not working as you would  expect please close the spreadsheet and reopen " & char(10) & ' +
      '"it before trying again. "';
      
  titleCell.setValue(instructions);
  titleCell.setFontSize(12);
  sheet.setRowHeight(7, 200);
  var colorCells = sheet.getRange("B2:B7");
  colorCells.setBackground("#fff2e6");

  titleCell = sheet.getRange("B9:B9");
  titleCell.setValue(googleNotice);
  titleCell.setFontSize(12);
  sheet.setRowHeight(9, 50);
  var colorCells = sheet.getRange("B9:B9");
  colorCells.setBackground("#FCAA89");
  
}

// Clear the tabs added by this script
function clearResults(dashBoardType) {

  var ss = MyConfigurationData.activeSpreadsheet;

  if (dashBoardType == "CDR") {
    try {
      // will trigger error if the tab does not exist
      var sheet = ss.getSheetByName('CDRdata');
      if (sheet !== null) {
        ss.deleteSheet(sheet);
      }
    } catch (e) { /* do nothing */ }
    try {
      var sheet = ss.getSheetByName('Calcs');
      if (sheet !== null) {
        ss.deleteSheet(sheet);
      }
    } catch (e) { /* do nothing */ }
    try {
      var sheet = ss.getSheetByName('Dashboard');
      if (sheet !== null) {
        ss.deleteSheet(sheet);
      }
    } catch (e) { /* do nothing */ }
    
  } else {
    try {
      // will trigger error if the tab does not exist
      var sheet = ss.getSheetByName('Call Tracking Data');
      if (sheet !== null) {
        ss.deleteSheet(sheet);
      }
    } catch (e) { /* do nothing */ }
    try {
      var sheet = ss.getSheetByName('Call Tracking Calcs');
      if (sheet !== null) {
        ss.deleteSheet(sheet);
      }
    } catch (e) { /* do nothing */ }  
    try {
      var sheet = ss.getSheetByName('Call Tracking Dashboard');
      if (sheet !== null) {
        ss.deleteSheet(sheet);
      }
    } catch (e) { /* do nothing */ } 
    try {
      var sheet = ss.getSheetByName('FirstLastCalcs');
      if (sheet !== null) {
        ss.deleteSheet(sheet);
      }
    } catch (e) { /* do nothing */ }  
  
  }
}

function clearCdrTabs() {

  clearResults("CDR");
  
}

function clearCallTrackingTabs() {

  clearResults("Call Tracking");
  
}

function clearAllTabs() {

  clearResults("CDR");
  clearResults("Call Tracking");
  
}


/*******************************************************************************************
* 
* Support methods use by main functions and menus
*
********************************************************************************************/

function createDataSheet(dashBoardType) {
  
  var ss = MyConfigurationData.activeSpreadsheet;
  if (dashBoardType == "CDR") {
    var dataName = "CDRdata";
  } else {
    var dataName = "Call Tracking Data";
  }
  var sheet = ss.getSheetByName(dataName);
  if ((typeof sheet === 'undefined') || (sheet == null)) {
    var sheet = ss.insertSheet(dataName);
  } else {
    sheet.clear();
  }
  
  // Pre allocate room for XXXX calls which is the max this application will support
  if (dashBoardType == "CDR") {
    sheet.insertRowsAfter(1, getRowLimit());
  }
}

function createDashboard(dashBoardType) {
  var ss = MyConfigurationData.activeSpreadsheet;
  if (dashBoardType == "CDR") {
    var dashBoardName = "Dashboard";
  } else {
    var dashBoardName = "Call Tracking Dashboard";
  }
  var sheet = ss.getSheetByName(dashBoardName);
  if ((typeof sheet === 'undefined') || (sheet == null)) {
    var sheet = ss.insertSheet(dashBoardName);
  } else {
    sheet.clear();
  }
}

function createCalcTab(dashBoardType) {
  if (dashBoardType == "CDR") {
    var calcTab = "Calcs";
  } else {
    var calcTab = "Call Tracking Calcs";
  }
  var ss = MyConfigurationData.activeSpreadsheet;
  var sheet = ss.getSheetByName(calcTab);
  if ((typeof sheet === 'undefined') || (sheet == null)) {
    var sheet = ss.insertSheet(calcTab);
  } else {
    sheet.clear();
  }
}

function createFirstLastTab() {
  var ss = MyConfigurationData.activeSpreadsheet;
  var sheet = ss.getSheetByName("FirstLastCalcs");
  if ((typeof sheet === 'undefined') || (sheet == null)) {
    var sheet = ss.insertSheet("FirstLastCalcs");
  } else {
    sheet.clear();
  }
}

function focusOnSplashScreen(){
  // Put the user back on the dashboard
  var ss = MyConfigurationData.activeSpreadsheet;
  var sheet = ss.getSheetByName("DialogTech Welcome Screen");
  ss.setActiveSheet(sheet);
}

function reorderTabs(dashBoardType) {
  var sheetNameArray = [];
  
  // These sheets are in reverse order because the code always moves the next sheet
  // to the first postion.  This avoids issues with attempting to put a sheet past
  // the current tabs which Google does not like.
  sheetNameArray.push("FirstLastCalcs");
  sheetNameArray.push("Call Tracking Calcs");  
  sheetNameArray.push("Call Tracking Data");
  sheetNameArray.push("Call Tracking Dashboard");  
  sheetNameArray.push("Calcs"); 
  sheetNameArray.push("CDRdata");
  sheetNameArray.push("Dashboard");
  sheetNameArray.push("DialogTech Welcome Screen");

  var ss = MyConfigurationData.activeSpreadsheet;
  var sheet;
  
  for( var j = 0; j < (sheetNameArray.length); j++ ) {
      sheet = ss.getSheetByName(sheetNameArray[j]);
      if ((typeof sheet != 'undefined') && (sheet != null)) {
        ss.setActiveSheet(sheet);
        ss.moveActiveSheet(1);
        
        if (sheetNameArray[j].indexOf("Dashboard") != -1) {
          sheet.setTabColor("yellow");
        }
        
        if (sheetNameArray[j].indexOf("Calcs") != -1) {
          sheet.setTabColor("green");
        }
      }
  }
  
  sheet = ss.getSheetByName("DialogTech Welcome Screen");
  ss.setActiveSheet(sheet);
}
