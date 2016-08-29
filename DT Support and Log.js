function debugLogger(debugStatement) {
  if (MyConfigurationData.debugMode == "NO") {
    return;
  }
  
  var ss = MyConfigurationData.activeSpreadsheet;
  var debugTab = ss.getSheetByName("DT Debug Log");
  if ((typeof debugTab === 'undefined') || (debugTab === null)) {
    var debugTab = ss.insertSheet('DT Debug Log',0);
  } 
  debugTab.insertRows(1);
  var cell = debugTab.getRange("A1");
  var d = new Date();
  var currentTime = d.toTimeString();
  var logMsg = currentTime + " : " + debugStatement;
  cell.setValue(logMsg);
}

// Use this method instead of toast that only works when you have a bound spreadsheet
// If there is not bound sheet this method is a no-opp

function myToast(toastMsg, toastStatus, toastTime ) {
  if (SpreadsheetApp.getActiveSpreadsheet() != null) {
    SpreadsheetApp.getActiveSpreadsheet().toast(toastMsg, toastStatus, toastTime);
  }
  
  // Save the same message to the debuglog
  debugLogger(toastStatus + " : " + toastMsg);
  
}

function checkForDebugMode() {
  var debugMode = getDebugMode();
  if (debugMode === undefined) {
    MyConfigurationData.debugMode = "YES";
  } else {
    MyConfigurationData.debugMode = debugMode.toUpperCase();
  } 

  if (MyConfigurationData.activeSpreadsheet) {

    // We have already identified the spreadsheet so don't do it again
    return;
  }
  
  // Use the current spreadsheet or if not running as an add-on the debug sheet
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (ss === null) {
    var d = new Date();
    var t = d.getTime();
    ss = SpreadsheetApp.create("DT Debug Spreadsheet: " + t);
  }
  MyConfigurationData.activeSpreadsheet = ss;
}
