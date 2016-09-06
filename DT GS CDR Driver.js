// Retrieve the CDR Data into a sheet and then kick off Dashboard

function createCdrTab() {
  getExecutionParameters();
  MyConfigurationData.menuType = "dashboard";
  
  var DTDataObj = getDialogTechData("CDR");

  if (DTDataObj.dataFromCdr != "failed") {
    displayData(DTDataObj);
    var toastTimer = Math.floor((DTDataObj.lastRow / 1000) + 3);
    myToast('Adding calculated fields', 'Status', toastTimer);
    addCalculatedFields(DTDataObj);
    var toastTimer = Math.floor((DTDataObj.lastRow / 1000) + 3);
    myToast('Building pivot tables. This may take some time.', 'Status', toastTimer);
    addPivotTables(DTDataObj);
    addDashboardTitles(DTDataObj);
    myToast('Generating graphs ...', 'Status', 5);
    addBasicPieCharts(DTDataObj);
    addDailyMinuteCharts(DTDataObj);
    addFrequencyCharts(DTDataObj);
    var toastTimer = Math.floor((DTDataObj.lastRow / 1000) + 3);
    myToast(
      'Google sheets calculating and filling graphs.  ' +
      'Click on the Dashboard tab to view the results.', 'Status', toastTimer);
  }
    
  cleanUpSpreadsheet(DTDataObj)
  debugLogger("All done ...");

  return;
}

function getCdrData() {
  getExecutionParameters();
  MyConfigurationData.menuType = "data";
  
  var DTDataObj = getDialogTechData("CDR");

  if (DTDataObj.dataFromCdr != "failed") {
    displayData(DTDataObj);
  }

  cleanUpSpreadsheet(DTDataObj)
  debugLogger("All done ...");

  return;
}


