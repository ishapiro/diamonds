// Create pivot and summary tables on Calcs tab used by dashboard

function addCDRPivotTables(DTDataObj) {

  var dashBoardType = DTDataObj.dashBoardType, 
      dataRows =      DTDataObj.lastRow+1, 
      dataColumns =   DTDataObj.lastColumn;

  createCalcTab(dashBoardType);
  var ss = MyConfigurationData.activeSpreadsheet;
  var sheet = ss.getSheetByName('Calcs');

  // Now build the pivot/summary tables

  // Totals By Day of Week
  var cell = sheet.getRange("A1:A1");
  cell.setValue('=QUERY(CDRdata!A1:V' + dataRows + ', "select B, count(A), sum(R) where B is not null group by B label B \'Day\', count(A) \'Call Count\', sum(R) \'Call Duration\' ")');
  yellowTitle("A1:C1");

  // Totals by Day
  var cell = sheet.getRange("F1:F1");
  cell.setValue('=QUERY(CDRdata!A1:V' + dataRows + ', "select D,count(A), sum(R) group by D label D \'Type\', count(A) \'Call Count\', sum(R) \'Duration\'")');
  yellowTitle("F1:H1");

  // Totals of Calls by Day
  var cell = sheet.getRange("F10:F10");
  cell.setValue('=QUERY(CDRdata!A1:W' + dataRows + ', "select W,count(A), sum(R) where W > 0 group by W label W \'Day of Week\', count(A) \'Call Count\', sum(R) \'Duration\' ")');
  yellowTitle("E10:H10");
  // Add a column with the date as TEXT for the graph labels
  for (var iDay = 0; iDay <= 6; iDay++) {
    var rowDay = iDay + 11;
    var dayCell = "E" + rowDay + ":" + "E" + rowDay;
    var cell = sheet.getRange(dayCell);    
    cell.setValue('=TEXT(F' + rowDay + ',"dddd")');
  }

  // Totals Calls by Phone Label
  var cell = sheet.getRange("J1:J1");
  cell.setValue('=QUERY(CDRdata!A1:W' + dataRows + ', "select U,count(A), sum(R) group by U label count(A) \'Call Count\', sum(R) \'Duration\' ")');
  yellowTitle("J1:L1");

  // Totals for short calls
  var cell = sheet.getRange("N1:N1");
  cell.setValue('=QUERY(CDRdata!A1:X' + dataRows + ', "select B, count(X) where (X < ' + getShortCallValue() + ' and B is not null) group by B label count(X) \'Short Calls\' ")');
  yellowTitle("N1:P1");

  // Add total call column to short call table
  var daysWithCalls = getFirstEmptyRow('A1:A');
  var daysWithShortCalls = getFirstEmptyRow('N1:N');

  Logger.log("Days with short calls N1:N: " + daysWithShortCalls);

  var cell = sheet.getRange("P1:P1");
  cell.setValue("Good Calls");
  var cell = sheet.getRange("P2:P" + daysWithShortCalls);
  cell.setValue("=vlookup(N2, $A$2:$C$" + daysWithCalls + ", 2)-O2");

  // Call Frequencies Repeat Callers
  var cell = sheet.getRange("F19:F19");
  cell.setValue("=QUERY(CDRdata!AA1:AC, \"select AC, count(AB) where AC > 1 and AC <= 20 group by AC label AC 'Call Frequency', count(AB) 'Count at Frequency'\")");
  yellowTitle("F19:G19");

  // The count of non-zero cells to E19 (number of call frequencies)
  var cell = sheet.getRange("E19:E19");
  cell.setValue('=countif(F20:F,"<>")');
  yellowTitle("E19:H19");

  // Top 20 numbers -- less than 100 calls
  var cell = sheet.getRange("U1:U1");
  cell.setValue("=query(index(CDRdata!AB1:AC),\"select AB,AC where AC < 100 order by AC desc limit 20 label AB 'ANI', AC 'Call Count'\")");
  yellowTitle("U1:V1");

  // Add Data for Calls by Hour
  var cell = sheet.getRange("R1:R1");
  cell.setValue("Hour of Day");  
  var cell = sheet.getRange("S1:S1");
  cell.setValue("Call Count"); 
  var initHourRow = 2;  
  var countRow = 0;
  for (var iHour = 0; iHour <= 23; iHour++) {
    var hourRow = initHourRow + iHour;
    var hourCell = "R" + hourRow + ":" + "R" + hourRow;
    var cell = sheet.getRange(hourCell);    
    cell.setValue(iHour);
    var hourCountCell = "S" + hourRow + ":" + "S" + hourRow;
    var cell = sheet.getRange(hourCountCell);
    cell.setValue("=COUNTIF(CDRdata!Z2:Z" + dataRows + ", R" + hourRow + ")");
  }
  yellowTitle("R1:S1");

  // Add calls broken down by duration
  var cell = sheet.getRange("X1:X1");
  cell.setValue("=QUERY(CDRdata!A1:V" + dataRows + ", \"select R, count(A) group by R label count(A) 'CNT at Duration', R 'Call Duration' \")");  
  yellowTitle("X1:Y1");

  // Add ranges for Call per Duration
  // must be a two dimension array even if our range is just a single dimention
  var mySetValues = [[]];  
  var cell = sheet.getRange("AA1:AB1");
  mySetValues = [['Duration','Total Calls']];
  cell.setValues(mySetValues);
  yellowTitle("AA1:AB1");

  var cell = sheet.getRange("AA2:AB2");
  mySetValues = [['<1','=SUMIF(X:X,"<1",Y:Y)']];
  cell.setValues(mySetValues);  

  var cell = sheet.getRange("AA3:AB3");
  mySetValues = [['1-5','=SUMIFS(Y:Y,X:X,">=1",X:X,"<5")']];
  cell.setValues(mySetValues); 

  var cell = sheet.getRange("AA4:AB4");
  mySetValues = [['5-15','=SUMIFS(Y:Y,X:X,">=5",X:X,"<15")']];
  cell.setValues(mySetValues);   

  var cell = sheet.getRange("AA5:AB5");
  mySetValues = [['15-30','=SUMIFS(Y:Y,X:X,">=15",X:X,"<30")']];
  cell.setValues(mySetValues);   

  var cell = sheet.getRange("AA6:AB6");
  mySetValues = [['30-60','=SUMIFS(Y:Y,X:X,">=30",X:X,"<60")']];
  cell.setValues(mySetValues);   ;   

  var cell = sheet.getRange("AA7:AB7");
  mySetValues = [['>60','=SUMIF(X:X,">=60",Y:Y)']];
  cell.setValues(mySetValues);   

  return;
}
