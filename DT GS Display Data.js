/*******************************************************************************************
   Display Routine (create the view)

   This function drives formating of data and creation of graphs and charts
   
*******************************************************************************************/

function displayData(DTDataObj) {

  var ss = MyConfigurationData.activeSpreadsheet;

  var dashBoardType = DTDataObj.dashBoardType, 
      display_rows =  DTDataObj.dataFromCdr; 

  // Now display the data
   
  var sheet = getDataSheet(DTDataObj);
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

  // Store the key values in the DTDataObj

  DTDataObj.lastRow = lastRow;
  DTDataObj.lastColumn = lastColumn;
  DTDataObj.lastCell = lastCell;

  // Highlight the Title Row

  highlightTitleRow(DTDataObj);

  return;
}

function highlightTitleRow(DTDataObj) {
  var endColChar = NumToChar(DTDataObj.lastColumn);
  var sheet = getDataSheet(DTDataObj);
  var range = sheet.getRange("A1:" + endColChar + "1");
  range.setBackground(calcRowColor());
  range.setFontWeight("bold");
}
