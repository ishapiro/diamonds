// Add calculated fields to main spreadsheet in support for dashboard calculations

function addCalculatedFields(DTDataObj) {

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
  range.setBackground("#ffffcc");  // indicate this is a new row
  sheet.getRange("B1:B1").setValue("Day");
  var cell = sheet.getRange("B2:B" + dataRows);
  cell.setValue("=datevalue(A2)");
  cell.setNumberFormat("MM/DD/YY");

  if (dashBoardType == "CDR" ) {

    // Add a day of week column
    var range = sheet.getRange("W1:W" + dataRows);
    range.setBackground("#ffffcc");  // indicate this is a new row
    sheet.getRange("W1:W1").setValue("DayOfWeek");
    var cell = sheet.getRange("W2:W" + dataRows);
    cell.setValue("=weekday(A2)");

    // Sum switch and network minutes
    var range = sheet.getRange("X1:X" + dataRows);
    range.setBackground("#ffffcc");  // indicate this is a new row
    sheet.getRange("X1:X1").setValue("Raw Minutes");
    var cell = sheet.getRange("X2:X" + dataRows);
    cell.setValue("=L2+M2");

    // Add an hour of the day field
    var range = sheet.getRange("Z1:Z" + dataRows);
    range.setBackground("#ffffcc");  // indicate this is a new row
    sheet.getRange("Z1:Z1").setValue("Hour of Day");
    var cell = sheet.getRange("Z2:Z" + dataRows);
    cell.setValue("=TEXT(A2,\"hh\")");

    // Add a Unique ANI Field we can use to Count Frequency
    var range = sheet.getRange("AB1:AB" + dataRows);
    range.setBackground("#ffffcc");  // indicate this is a new row
    sheet.getRange("AB1:AB1").setValue("Unique ANI");
    var cell = sheet.getRange("AB2:AB2");
    cell.setValue("=UNIQUE(K2:K" + dataRows + ")");

    // fequency COUNTIF(ani:ani,new row)
    var range = sheet.getRange("AC1:AC" + dataRows);
    range.setBackground("#ffffcc");  // indicate this is a new row
    sheet.getRange("AC1:AC1").setValue("Caller Frequency");
    var cell = sheet.getRange("AC2:AC" + dataRows);
    cell.setValue("=COUNTIF(K:K,AB2)");

  } else {

   // Add a day of week column
    var range = sheet.getRange("X1:X" + dataRows);
    range.setBackground("#ffffcc");  // indicate this is a new row
    sheet.getRange("X1:X1").setValue("DayOfWeek");
    var cell = sheet.getRange("X2:X" + dataRows);
    cell.setValue("=weekday(A2)");

    // Initially I used a custom function but this failed because Google limits
    // the number of times you can invoke a custom function per second
    // Now I will use a custome tab and a regular expression that returns an array

    createFirstLastTab();
    var ss = MyConfigurationData.activeSpreadsheet;
    var sheet = ss.getSheetByName("FirstLastCalcs");

    // Regular Expression that will Parse a URL
    // Right leaning slashes need to be doubled up
    var parse_url = '^(?:([A-Za-z]+):)?(\\/{0,3})([0-9.\\-A-Za-z]+)(?::(\\d+))?(?:\\/([^?#]*))?(?:\\?([^#]*))?(?:#(.*))?$';

    // Parse the First Touch URL and get the Path
    var range = sheet.getRange("A1:A" + dataRows);
    range.setBackground("#ffffcc");  // indicate this is a new row
    sheet.getRange("A1:A1").setValue("First Touch");
    sheet.getRange("C1:C1").setValue("First Domain");
    sheet.getRange("E1:E1").setValue("First Page");
    sheet.getRange("F1:F1").setValue("First Parameters");
    sheet.getRange("A1:F1").setBackground("#ffffcc");
    var cell = sheet.getRange("A2:A" + dataRows);
    cell.setValue('=REGEXEXTRACT(\'Call Tracking Data\'!S2,"' + parse_url + '")');
    
    // Parse the Last Touch URL and get the Path
    var range = sheet.getRange("I1:I" + dataRows);
    range.setBackground("#ffffcc");  // indicate this is a new row
    sheet.getRange("I1:I1").setValue("Last Touch");
    sheet.getRange("K1:K1").setValue("Last Domain");
    sheet.getRange("M1:M1").setValue("Last Page");
    sheet.getRange("N1:N1").setValue("Last Parameters");
    sheet.getRange("I1:N1").setBackground("#ffffcc");
    var cell = sheet.getRange("I2:I" + dataRows);
    cell.setValue('=REGEXEXTRACT(\'Call Tracking Data\'!T2,"' + parse_url + '")');

    // Add a rows with unique combinations of first and last
    // Add to first last tab
    // =unique({E2:E,M2:M})
    var sheet = ss.getSheetByName("FirstLastCalcs");
    var range = sheet.getRange("P1");
    range.setValue('Unique First Last Combinations');
    var range = sheet.getRange("P2");
    range.setValue('=unique({E2:E,M2:M})');

    // Count the unqiue combinations
    // =COUNTIFS(E:E,P2,M:M,Q2)
    var sheet = ss.getSheetByName("FirstLastCalcs");
    var range = sheet.getRange("R1");
    range.setValue('Count First Last Combinations');
    var range = sheet.getRange("R2:R" + dataRows);
    range.setValue('=COUNTIFS(E:E,P2,M:M,Q2)');


    // Set the rows to right align to make them easier to read
    var range = sheet.getRange("A:N");
    range.setHorizontalAlignment('right');

  }
}
