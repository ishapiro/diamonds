// Retrieve the Call Tracking Data into a sheet and then kick off Dashboard

function createCallTrackingTab() {
  var loginStatus = getExecutionParameters();
  if (loginStatus  == "failed") {
    return;
  }
  
  MyConfigurationData.menuType = "dashboard";
  var DTDataObj = getDialogTechData("Call Tracking");

  if (DTDataObj && DTDataObj.dataFromCdr) {
    displayData(DTDataObj);
    
    var toastTimer = Math.floor((DTDataObj.lastRow / 1000) + 3);
    myToast('Adding calculated fields', 'Progress', toastTimer);
    addCallTrackingCalculatedFields(DTDataObj);
    
    var toastTimer = Math.floor((DTDataObj.lastRow / 1000) + 3);
    myToast('Building pivot tables. This may take some time.', 'Progress', toastTimer);
    
    addCallTrackingPivotTables(DTDataObj);
    
    addDashboardTitles(DTDataObj);
    
    myToast('Generating graphs ...', 'Progress', 5);
    addCallTrackingGraphsAndCharts(DTDataObj)
    
    var toastTimer = Math.floor((DTDataObj.lastRow / 1000) + 3);
    myToast(
      'Google sheets calculating and filling graphs.  ' +
      'Click on the Call Tracking Dashboard tab to view the results.', 'Status', toastTimer);
    cleanUpSpreadsheet(DTDataObj);
  }

  debugLogger("All done ...");

  return;
}

function getCallTrackingData() {
  var loginStatus = getExecutionParameters();
  if (loginStatus  == "failed") {
    return;
  }
  
  MyConfigurationData.menuType = "data";
  var DTDataObj = getDialogTechData("Call Tracking");

  if (DTDataObj.dataFromCdr != "failed") {
    displayData(DTDataObj);
  }
    
  cleanUpSpreadsheet(DTDataObj)
  debugLogger("All done ...");

  return;
}

