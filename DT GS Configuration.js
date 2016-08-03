/*****************************************************************************************************
 *
 *  The Following functions/methods are used to provision global parameters and provide generic
 *  support for Google sheet manipulation.
 *
 *****************************************************************************************************/

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

// Use the EMCMAScript 5 getter and setter syntax
// Global vaiables used to measure performance

var MyConfigurationData = function() {
    this._startTime = undefined;
    this._endTime = undefined;
    this._dataSize = undefined;
    this._apiKey = undefined;
    this._debugMode = undefined;
    this._activeSpreadsheet = undefined;
};

Object.defineProperties(MyConfigurationData.prototype, {
    startTime : {
        get : function() {
            return this._startTime;
        },
        set : function(value) {
            this._startTime = value;
        }
    },
    endTime : {
        get : function() {
            return this._endTime;
        },
        set : function(value) {
            this._endTime = value;
        }
    },
    dataSize : {
        get : function() {
          return this._dataSize;
        },
        set : function(value) {
          this._dataSize = value;
        }
    },
    apiKey : {
        get : function() {
          return this._apiKey;
        },
        set : function(value) {
          this._apiKey = value;
        }
    },
    debugMode : {
        get : function() {
          return this._debugMode;
        },
        set : function(value) {
          this._debugMode = value;
        }
    },
    activeSpreadsheet : {
        get : function() {
          return this._activeSpreadsheet;
        },
        set : function(value) {
          this._activeSpreadsheet = value;
        }
    }
});

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
      startDate:     startDate,
      startDateHTML: startDateHTML,
      startDateMil:  startDateMil,
      endDate:       endDate,
      endDateHTML:   endDateHTML,
      endDateMil:    endDateMil,
      daysInData:    daysInData,
      msecPerDay:    msecPerDay
    };
    
    return dateObj;

};

