/**
 * A set of functions/methods to retrieve CDR and Call Tracking data from DialogTech
 * and present the data in both tabular and graphical formats
 *
 * August 2nd - refactored to work as a standalone script.  Changes to make this work
 * are documented inline.  Basically the following was neccesary:
 *
 * 1. Check for the DebugMode HTML configurtion flag set via the user configuration page
 *    and store it in the Global configuration object
 * 2. Determine if this is running as an add-on or a standalone script (for debugging)
 * 3. If a standalone script create a spreadsheet with a unique name and set it as active
 * 4. If the debug mode is set create a debug log tab
 * 5. Create a myToast method that replaces the standard toast method and noops if this
 *    is not running bound to a spreadsheet.
 *
 * This project is maintained as a local copy available to github via the gapps project.
 * Information about gapps is located at https://github.com/danthareja/node-google-apps-script
 *
 * The main entry point for this application is getCDRData(reportName) which retrieves all
 * input parameters from the Google User Property store.
 *
 * @param {property} Google User Property UserName
 * @param {property} Google User Property Password
 * @param {property} Google User Property StartDate
 * @param {property} Google User Property EndDate
 * @param {property} Google User Property APIKey
 * @param {property} Google User Property ShortCalls (time in minutes as cutoff for short calls, i.e. .2 = 12 seconds)
 * @param {string} "CDRdata" or "CallTrackingData" -- select which data set to use for dashboard
 *
 * @return Tab CDRData
 * @return Tab CDRtmp -- used as a temporary work space
 * @return Tab Calcs (pivot tables and summary data for CDRs)
 * @return Tab TrackingCalcs (pivot tables and summary data for Call Tracking Data)
 * @return Tab CDR Dashboard (CDR Graphs and Charts)
 * @return Tab Tracking Dashboard
 * @return Tab FirstLastCalcs
 *
 * All global objects and parameters are defined in "DT GS Configuration.gs"
 *
 */

/*******************************************************************************************
   Main Routine (effectively the data controller)

   This function drives the flow of this application
*******************************************************************************************/

function getDialogTechData(dashBoardType) {

    // Setup/check for debug mode and bind the script to a spreadsheet
    checkForDebugMode();

    // This method will log the method with a timestamp to a debug tab in the current spreadsheet
    // This replaces Logger.log which will not be available when testing as an Add On
    debugLogger("Starting in getDialogTechData");

    // MyCOnfigurationData.activeSpreadsheet is the object variable with the currently active spreadsheet
    // DO NOT use getActiveSpreadsheet since this will not work with standalone scripts
    // Anyplace you would use getActiveSpreadsheet just retrieve this config parameter

    // The MyConfigurationData namespace (object) is defined in DT GS Configuration
    var ss = MyConfigurationData.activeSpreadsheet;

    // Track overall app execution time
    MyConfigurationData.startTime = new Date().getTime();

    // Remove any old tabs
    clearResults(dashBoardType);

    // Create and preallocate the main data sheet
    createDataSheet(dashBoardType);

    // Validate login data and api key if provided
    var loginStatus = checkLoginCredential();

    if (loginStatus == "failed") {

        // The checkLoginCredentials method displays any errors directly to the users
        return;

    } else {

        // The Spreadsheet.getactivespreadsheet().toast approach does not work with
        // standalone scripts.   Use myToast instead with the same parameters.
        myToast('Fetching date from DialogTech', 'Diagnostic Data', 5);

        // Retrieve the dates from the config data and reformat for use
        var dateObj = prepareQueryDates();
        var iDate = dateObj.startDateMil;

        // Saved the date for logs and user messages
        var originalStartDate = Utilities.formatDate(dateObj.startDate, "GMT", "yyyy.MM.dd");
        var originalEndDate = Utilities.formatDate(dateObj.endDate, "GMT", "yyyy.MM.dd");
        var displayDateRange = originalStartDate + " - " + originalEndDate;

        // Find the query increment
        var userProperties = PropertiesService.getUserProperties();
        var configurationData = userProperties.getProperties();
        var queryIncrement = configurationData.QuerySize;
        if (queryIncrement <= 0) queryIncrement = getDefaultQuerySize();

        // Loop through and retrieve queryIncrement days at a time
        var csv_response = "";
        var foundTitle = false;
        var nextCsvSegment = "";
        var lengthOfRecord = 1;
        var cdrStartDate = "";
        var cdrEndDate = "";

        // Loop through and retrieve queryIncrement days at a time
        debugLogger("Retrieving data");
        for (iDate; iDate <= dateObj.endDateMil; iDate = iDate + (queryIncrement * dateObj.msecPerDay)) {

            // Useful for debugging
            var previousStart = cdrStartDate;
            var previousEnd = cdrEndDate;
            var startLoop = new Date().getTime();

            // Calulate the query date range
            var cdrStartMil = new Date(iDate);
            var cdrStartDate = Utilities.formatDate(cdrStartMil, "GMT", "yyyyMMdd");

            // If the date range is one date make sure we do not end up with a negative range
            if (cdrStartMil != dateObj.endDateMil) {
                var nextDate = iDate + ((queryIncrement - 1) * dateObj.msecPerDay);
            } else {
                var nextDate = iDate;
            }

            // Do not attempt to retrieve more records than the user specified
            if (nextDate > dateObj.endDateMil) nextDate = dateObj.endDateMil;

            var cdrEndMil = new Date(nextDate);
            var cdrEndDate = Utilities.formatDate(cdrEndMil, "GMT", "yyyyMMdd");

            if (dashBoardType == "CDR") {

                // Build the DT CDR Data query
                var cdrQuery = "https://secure.dialogtech.com/ibp_api.php?api_key=" +
                    MyConfigurationData.apiKey + "&action=report.call_detail_csv&start_date=" +
                    cdrStartDate + "&end_date=" +
                    cdrEndDate;

            } else if (dashBoardType == "Call Tracking") {

                // Build the DT Call Tracking query
                var cdrQuery = "http://secure.dialogtech.com/ibp_api.php?api_key=" +
                    MyConfigurationData.apiKey + "&action=report.call_tracking&start_date=" +
                    cdrStartDate + "&end_date=" +
                    cdrEndDate + "&channel_filter=All%20Channels&date_added=1&sid=1&dnis=1" +
                    "&transfer_to_number=1&call_duration=1&switch_minutes=1&" +
                    "network_minutes=1&keywords=1&match_type=1&ads=1&ad_group=1&" +
                    "campaign=1&cpp=1&channel=1&domain_set_name=1&activity_type=1&" +
                    "activity_value=1&first_touch=1&last_touch=1&activity_log_url=1&" +
                    "call_only_flag=1&processing_flag=1";

                Logger.log(cdrQuery);

            } else {

                Browser.msgBox("**** Invalid Dashbaord Type, check with developer.");
                return;

            }

            debugLogger("Retrieving data with UTL: " + cdrQuery);

            // Send the rest request to DT and check for errors. On an error return to the user.
            nextCsvSegment = sendCurlRequest(cdrQuery);
            if (nextCsvSegment == "failed") {
                Browser.msgBox("***** Error retrieving data from Dialogtech, please reduce the query size in advanced options." +
                    "\\n In addition it is recommended that you exit the spreadsheet completely and reopen it.  This " +
                    "is neccesary do since Google Sheets does not always properly recover from errors. ");
                return;
            }

            // remove title rows after the first title is found
            if (!foundTitle) {
                lengthOfRecord = nextCsvSegment.indexOf("\n");
                nextCsvSegment = nextCsvSegment.substring(lengthOfRecord + 1);
                foundTitle = true;
            }

            var displayStart = Utilities.formatDate(cdrStartMil, "GMT", "yyyy.MM.dd");
            var displayEnd = Utilities.formatDate(cdrEndMil, "GMT", "yyyy.MM.dd");

            var endLoop = new Date().getTime();
            var displayElaspedTime = (endLoop - startLoop) / 1000;
            if (displayElaspedTime > 5) myToast('Completed so far ' + originalStartDate + ' - ' + displayEnd, 'Progress', 5);

            // concatenate the next segment onto the CSV string if we are manually fetching the data
            csv_response = csv_response + nextCsvSegment;

            // determine the numbers of rows
            var totalRows = csv_response.length / lengthOfRecord;
            Logger.log("total rows: " + totalRows);
            if (totalRows > getRowLimit()) {
                Browser.msgBox("***** Error retrieving data from Dialogtech. " +
                    Math.floor(totalRows) +
                    " calls retrieved so far exceeds the call limit of " +
                    getRowLimit() +
                    " calls due to Google Sheets limitations. Please reduce the date range and try again.");
                return;
            }

        } // End of for (iDate; ....

        debugLogger("Data retrieval complete");

        // Save the data size for analysis

        var dataSize = csv_response.length;
        MyConfigurationData.dataSize = dataSize;

        // Convert the CSV string into an array
        var dataFromCdr = "";

        // Now reformat the data into an array used by displayData
        dataFromCdr = formatTableData(csv_response);
        if (dataFromCdr == "failed") {
            Browser.msgBox("**** Too much data.  Please reduce the date range and try again.");
            return;
        }

        if (dataFromCdr != "failed") {
            displayData(dashBoardType, dataFromCdr, displayDateRange, dateObj.daysInData);
        } else {
            Browser.msgBox("ERROR: Failed to retrieve data from DialogTech. Check the account credentials and the date range.");
        }
    } // End of If INVALID ACCOUNT

    // Add this data if we retrieved some calls

    if (dataFromCdr.length == 0) {

        if (dashBoardType == "CDR") {
            var noCallMsg = "No calls found. Please check the date range.";
        } else {
            var noCallMsg = "No Sourcetrak data found. Please ensure Sourcetrak is in use for this account and check the date range.";
        }
        Browser.msgBox(noCallMsg);
        addSplashScreen();
        focusOnSplashScreen();

    } else {

        // All done --- finish up the spreadsheet, clean up.
        // Add the splash screen

        addSplashScreen();

        // Display the debug statistics
        debugStatistics();

        // Recorder the tabs and put the focus back on the dashboard
        reorderTabs(dashBoardType);
        focusOnSplashScreen();

        var toastTimer = Math.floor((dataFromCdr.length / 1000) + 3);
        myToast(
            'Google sheets calculating and filling graphs.  ' +
            'Click on the Dashboard tab to view the results.', 'Status', toastTimer);

    } // end no calls found

    debugLogger("All done ...");

    return;
}
