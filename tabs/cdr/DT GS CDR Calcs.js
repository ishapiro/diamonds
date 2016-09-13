// Add calculated fields to main spreadsheet in support for dashboard calculations

function addCDRCalculatedFields(DTDataObj) {

  var dashBoardType = DTDataObj.dashBoardType, 
      dataRows =      DTDataObj.lastRow, 
      dataColumns =   DTDataObj.lastColumn;

  var sheet = getDataSheet(DTDataObj);

  // Convert the internal date into a usable date/time
  var formatRange = "A1:A" + sheet.getLastRow();
  sheet.getRange(formatRange).setNumberFormat("MM/DD/YY HH:MM:SS");

  // Create a column with just the date and no time
  sheet.insertColumnAfter(1);
  var range = sheet.getRange("B1:B" + dataRows);
  range.setBackground(calcRowColor());  // indicate this is a new row
  sheet.getRange("B1:B1").setValue("Day");
  var cell = sheet.getRange("B2:B" + dataRows);
  cell.setValue("=datevalue(A2)");
  cell.setNumberFormat("MM/DD/YY");

  // Add a day of week column
  var range = sheet.getRange("W1:W" + dataRows);
  range.setBackground(calcRowColor());  // indicate this is a new row
  sheet.getRange("W1:W1").setValue("DayOfWeek");
  var cell = sheet.getRange("W2:W" + dataRows);
  cell.setValue("=weekday(A2)");

  // Sum switch and network minutes
  var range = sheet.getRange("X1:X" + dataRows);
  range.setBackground(calcRowColor());  // indicate this is a new row
  sheet.getRange("X1:X1").setValue("Raw Minutes");
  var cell = sheet.getRange("X2:X" + dataRows);
  cell.setValue("=L2+M2");

  // Add an hour of the day field
  var range = sheet.getRange("Z1:Z" + dataRows);
  range.setBackground(calcRowColor());  // indicate this is a new row
  sheet.getRange("Z1:Z1").setValue("Hour of Day");
  var cell = sheet.getRange("Z2:Z" + dataRows);
  cell.setValue("=TEXT(A2,\"hh\")");

  // Add a Unique ANI Field we can use to Count Frequency
  var range = sheet.getRange("AB1:AB" + dataRows);
  range.setBackground(calcRowColor());  // indicate this is a new row
  sheet.getRange("AB1:AB1").setValue("Unique ANI");
  var cell = sheet.getRange("AB2:AB2");
  cell.setValue("=UNIQUE(K2:K" + dataRows + ")");

  // fequency COUNTIF(ani:ani,new row)
  var range = sheet.getRange("AC1:AC" + dataRows);
  range.setBackground(calcRowColor());  // indicate this is a new row
  sheet.getRange("AC1:AC1").setValue("Caller Frequency");
  var cell = sheet.getRange("AC2:AC" + dataRows);
  cell.setValue("=COUNTIF(K:K,AB2)");

}
