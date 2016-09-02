// Routines Used to Create Data Queries and Report Errors
//
// Add an option here when you add a new tab that requires different data from DT

function buildCdrQuery(dashBoardType, cdrStartDate, cdrEndDate) {
  if (dashBoardType == "CDR") {
    // Build the DT CDR Data query
    var cdrQuery = "https://secure.dialogtech.com/ibp_api.php?api_key=" +
      MyConfigurationData.apiKey + "&action=report.call_detail_csv&start_date=" +
      cdrStartDate + "&end_date=" +
      cdrEndDate;

  } else if (dashBoardType == "Call Tracking") {
    var cdrQuery = "http://secure.dialogtech.com/ibp_api.php?api_key=" +
      MyConfigurationData.apiKey + "&action=report.call_tracking&start_date=" +
      cdrStartDate + "&end_date=" +
      cdrEndDate + "&channel_filter=All%20Channels&date_added=1&sid=1&dnis=1" +
      "&transfer_to_number=1&call_duration=1&switch_minutes=1&" +
      "network_minutes=1&keywords=1&match_type=1&ads=1&ad_group=1&" +
      "campaign=1&cpp=1&channel=1&domain_set_name=1&activity_type=1&" +
      "activity_value=1&first_touch=1&last_touch=1&activity_log_url=1&" +
      "call_only_flag=1&processing_flag=1";
  } else {
    debugLogger("Invalid dashboardType specified");
    Browser.msgBox("**** Invalid query type. Contact support.");
  }
  return cdrQuery;
}

function displayNoData(dashboardType) {
  if (dashBoardType == "CDR") {
    var noCallMsg = "No calls found. Please check the date range.";
  } else if (dashboardType == "Call Tracking") {
    var noCallMsg = "No Sourcetrak data found. Please ensure Sourcetrak is in use for this account and check the date range.";
  } else {
    var noCallMsg = "No data selected.  Please check date range and filters.";
  }
  return noCallMsg;
}