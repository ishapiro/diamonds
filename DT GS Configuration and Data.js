/*****************************************************************************************************
 *
 *  The Following functions/methods are used to provision global parameters and provide generic
 *  support for Google sheet manipulation.
 *
 *****************************************************************************************************/

// setup a namespace for shared configuration values
// theses are basically global variables

var MyConfigurationData = {
  startTime:    undefined,
  endTime:      undefined,
  dataSize:     undefined,
  apiKey:       undefined,
  debugMode:    undefined,
  activeSpreadsheet: undefined,
  menuType:  undefined
};

// The data from DT is saved into this namespace

var DTDataObj= {
  csvData:          undefined,
  dataSize:         undefined,
  dataFromCdr:      undefined,
  displayDataRange: undefined,
  dashBoardType:    undefined,
  lastRow:          undefined,
  lastColumn:       undefined,
  lastCell:         undefined
};

function getDataSheet(DTDataObj) {
  if (DTDataObj.dashBoardType == "CDR") {
    var dataName = "CDRdata";
  } else {
    var dataName = "Call Tracking Data";
  }
  var ss = MyConfigurationData.activeSpreadsheet;
  var sheet = ss.getSheetByName(dataName);
  return sheet;
}

function getRowLimit() {
  // The following is the size limit in rows for each data table in this application
  // Google sheets are limited to 2M total rows
  return 50000;
}

function getDefaultQuerySize() {
  // The number of days of data to retrieve at one time
  // This needs to be small enough so the fetchURL method will not faile
  // But large enough to be efficient
  return 15;
}

function getShortCallValue() {
  var userProperties = PropertiesService.getUserProperties();
  var configurationData = userProperties.getProperties();
  return configurationData.ShortCalls;
}

function getDurationCol() {
  // This is the column in the CDR data that contains the duration in minutes
  return 'B';
}

function getDebugMode() {
  var userProperties = PropertiesService.getUserProperties();
  var configurationData = userProperties.getProperties();
  return configurationData.DebugMode;
}

function calcRowColor() {
  return "#ffffcc";
}



// Define an object that will hold the date ranges for the query

function prepareQueryDates() {
  var userProperties = PropertiesService.getUserProperties();
  var configurationData = userProperties.getProperties();

  var startDateHTML = isoToDate(configurationData.StartDate);
  var endDateHTML = isoToDate(configurationData.EndDate);

  var startDate = new Date(startDateHTML);
  var endDate = new Date(endDateHTML);

  var startDateMil = startDate.getTime();
  var endDateMil = endDate.getTime();

  // Set the unit values in milliseconds.
  var msecPerMinute = 1000 * 60;
  var msecPerHour = msecPerMinute * 60;
  var msecPerDay = msecPerHour * 24;
  var daysInData = (endDate - startDate) / msecPerDay;

  var dateObj = {
    startDate: startDate,
    startDateHTML: startDateHTML,
    startDateMil: startDateMil,
    endDate: endDate,
    endDateHTML: endDateHTML,
    endDateMil: endDateMil,
    daysInData: daysInData,
    msecPerDay: msecPerDay
  };

  return dateObj;

};

