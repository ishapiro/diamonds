// Functions to manage Google properties
function removeProperty(myProperty) {
  var userProperties = PropertiesService.getUserProperties();
  var configurationData = userProperties.getProperties();
  if ((typeof configurationData[myProperty] !== 'undefined') && (configurationData[myProperty] !== null)) {
    userProperties.deleteProperty(myProperty);
  }
}

function removeObsoleteProperties() {
  removeProperty('ImportData');
  removeProperty('fetchURL');
}

// Utility function to highlight range yellow and bold
function yellowTitle(rangeStr, dashBoardType) {

  var ss = MyConfigurationData.activeSpreadsheet;
  if (dashBoardType == "Call Tracking") {
    var sheet = ss.getSheetByName('Call Tracking Calcs');
  } else {
    var sheet = ss.getSheetByName('Calcs');
  }
  
  var range = sheet.getRange(rangeStr);
  range.setBackground(calcRowColor());
  range.setFontWeight("bold");
}

// Utility functions to convert numbers to spreadsheet letters
function NumToChar(number) {
  var numeric = ((number - 1) % 26);
  var letter = String.fromCharCode(number + 65);
  var number2 = parseInt((number - 1) / 26);
  if (number2 > 0) {
    return numToChar(number2) + letter;
  } else {
    return letter;
  }
};

// Google does not support all of the standard Javascript datatype formats so we
// need to reformat dates to use with a Javascript date object.  Our HTML form used in the sidebar
// returns dates in ISO format.

function isoToDate(dateStr){// argument = date string iso format
  var str = dateStr.replace(/-/,'/').replace(/-/,'/').replace(/T/,' ').replace(/\+/,' \+').replace(/Z/,' +00');
  return new Date(str);
}

// The following function finds the first empty row in column provided as a parameter
// The rowRange is a complete range.  For example A2:A.  The Second position should always be just a column name.

 function getFirstEmptyRow(rowRange, sheetName) {
  Logger.log("Function getFirstEmptyRow: " + rowRange + " / " + sheetName);
  var ss = MyConfigurationData.activeSpreadsheet;
  if (sheetName != null) {
    var sheet = ss.getSheetByName(sheetName);
  } else {
    var sheet = ss.getActiveSheet();
  }
  var range = sheet.getRange(rowRange);
  var array = range.getValues();
  var arrayLength = array.length;
  for (var ct = 0; ct < arrayLength; ct++) {
      if (array[ct] == "") {
        break;
      }
  }
  Logger.log("Function getFirstEmptyRow(return value): " + ct);
  return (ct);
}
