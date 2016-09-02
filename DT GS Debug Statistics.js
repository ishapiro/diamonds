function debugStatistics(dashBoardType) {

    // TO DO Add code for call tracking
    
    if ((dashBoardType != "CDR") || (MyConfigurationData.debugMode == "NO")) {
      return;
    }

     // Report the execution time and number of cells used.
    var appEndTime = new Date().getTime();
    var appElaspedTime = new Date(appEndTime - MyConfigurationData.startTime);
    var displayAppTime = Utilities.formatDate(appElaspedTime, "GMT", "HH:mm:ss");
    
    var ss = MyConfigurationData.activeSpreadsheet;
    var dashboardSheet = ss.getSheetByName("Dashboard");

    // Add statistics to the Dashboard
    var appTimeRange = dashboardSheet.getRange("I1");
    appTimeRange.setValue('------- DIAGNOSTIC DATA -------');
    appTimeRange.setFontWeight("bold");
    
    var appTimeRange = dashboardSheet.getRange("I2");
    appTimeRange.setValue('Time to run: ');
    appTimeRange.setFontWeight("bold");
    var appTimeRange = dashboardSheet.getRange("J2");
    appTimeRange.setValue(displayAppTime);
    
    var appTimeRange = dashboardSheet.getRange("I3");
    var sheet = ss.getSheetByName("CDRdata");
    var cdrSheetActiveCells = sheet.getLastColumn() * sheet.getLastRow();
    var sheet = ss.getSheetByName("Calcs"); 
    var totalSheetActiveCells = sheet.getLastColumn() * sheet.getLastRow();
    
    appTimeRange.setValue('Active cells:');
    appTimeRange.setFontWeight("bold");
    var appTimeRange = dashboardSheet.getRange("J3");
    appTimeRange.setValue(cdrSheetActiveCells + totalSheetActiveCells);
    appTimeRange.setNumberFormat("#,###");
    
    // Calculate the total cells current allocated in the spreadsheet
    var sheet = ss.getSheetByName("CDRdata");
    var cdrCells = sheet.getMaxColumns() * sheet.getMaxRows();
    var sheet = ss.getSheetByName("Calcs");  
    var totalSheetCells = sheet.getMaxColumns() * sheet.getMaxRows();
  
    var appTimeRange = dashboardSheet.getRange("I4");
    appTimeRange.setValue('Max cells:');
    appTimeRange.setFontWeight("bold");
    var appTimeRange = dashboardSheet.getRange("J4");
    appTimeRange.setValue(cdrCells + totalSheetCells);
    appTimeRange.setNumberFormat("#,###");
    
    var appTimeRange = dashboardSheet.getRange("I5");
    appTimeRange.setValue('Bytes of data');
    appTimeRange.setFontWeight("bold");
    var appTimeRange = dashboardSheet.getRange("J5");
    appTimeRange.setValue(MyConfigurationData.dataSize);
    appTimeRange.setNumberFormat("#,###");
    
    var sheet = ss.getSheetByName("CDRdata");
    var callCount = sheet.getLastRow();
    var toastTimer = (callCount / 1000) + 3;
    myToast("Processed " + callCount + " calls. " +
        "It will take up to 60 seconds for the spreadsheet to complete processing each 10,000 calls.", "Processing", Math.floor(toastTimer));
}
