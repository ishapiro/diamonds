/*******************************************************************************************
   Display Routine (create the view)

   This function drives formating of data and creation of graphs and charts
   
*******************************************************************************************/

function displayData(DTDataObj) {

  var ss = MyConfigurationData.activeSpreadsheet;

  var dashBoardType = DTDataObj.dashBoardType, 
      display_rows = DTDataObj.dataFromCdr, 
      dateRange = DTDataObj.dataRange;

  // Now display the data
   
  if (dashBoardType == "CDR") {
    var dataName = "CDRdata";
  } else {
    var dataName = "Call Tracking Data";
  }
  
  var sheet = ss.getSheetByName(dataName);
  var first_row = 2;
  var first_col = 1;

  // Publish data into new sheet (tab)

  if (display_rows[0] != 0) {
    var lastRow = display_rows.length;
    if (lastRow > 0) {
      var lastColumn = display_rows[0].length;
    } else {
      var lastColumn = 0;
    }
    
    if ((lastRow == 0) || (lastColumn == 0)) { 
    
      // Nothing to display just return to main loop
      return;
      
    } else {
      dataRange = sheet.getRange(first_row, first_col, lastRow, lastColumn);
    }
    
    var toastTimer = Math.floor((lastRow / 1000) + 3);
    myToast('Moving data to spreadsheet', 'Status', toastTimer);
    dataRange.setValues(display_rows);

  } else {
  
    var lastRow = sheet.getLastRow();
    var lastColumn = sheet.getLastColumn();
    var lastCell = sheet.getRange(first_row, first_col, lastRow, lastColumn);
  }

  // Highlight the Title Row

  var endColChar = NumToChar(lastColumn);
  var range = sheet.getRange("A1:" + endColChar + "1");
  range.setBackground("#ffffcc");
  range.setFontWeight("bold");

  var toastTimer = Math.floor((lastRow / 1000) + 3);
  myToast('Adding calculated fields', 'Status', toastTimer);
  addCalculatedFields(dashBoardType,sheet, lastRow, lastColumn);

  var toastTimer = Math.floor((lastRow / 1000) + 3);
  myToast('Building pivot tables. This may take some time.', 'Status', toastTimer);
  addPivotTables(dashBoardType,sheet, lastRow, lastColumn);
  
  addDashboardTitles(dashBoardType,sheet, lastRow, dateRange);
  myToast('Generating graphs ...', 'Status', 5);
  
  addBasicPieCharts(dashBoardType, sheet, lastRow, lastColumn);
  
  addDailyMinuteCharts(dashBoardType, sheet, lastRow, lastColumn);
  
  addFrequencyCharts(dashBoardType, sheet, lastRow, lastColumn);
 
  return;
}
