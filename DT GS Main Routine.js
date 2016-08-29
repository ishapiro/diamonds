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
 * August 28th - refactored to "dry" up the code a bit and reduce the number of places where
 * we have specific logic checking for dashboard type.  This will make it easier to add 
 * dashboards.  Began the work to integrate Tim's initial code review comments.
 *
 * This project is maintained as a local copy available to github via the gapps project.
 * Information about gapps is located at https://github.com/danthareja/node-google-apps-script
 * 
 * Where debuginng standalone scripts that need a Google APPS object for execution you need
 * to moch in an active document.  As indicated above this is done in the checkForDebugMode()
 * method that is called at the beginning of execution.
 * 
 * In addtion when debugging in this mode the interactively setting of BREAKPOINTs is unrealiable
 * due to inconsistancies in the google script editor.  An alternative that is very 
 * reliable is to add a "DEBUGGER" statement to the code.  Once you have stopped
 * at a breakpoint further breakpoints in the module work reliably.
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
   Application Flow

   The application consists of a set commands that are executed from the Google
   Sheets Add On menu.  The files containing these methods are named:

   "DT GS tab-name driver" --- For example "DT GS CDR Driver"

   TO ADD A NEW Tab

   1. Create a new "DS GS tabname driver" file with a createXXXTab method.
   2. Add a no data found option to displayNoData() in "DT GS Create Data URL"
   3. Add a buildCdrQuery(dashBoardType, StartDate, cdrEndData) option in "DT GS Create Data URL"

*******************************************************************************************/

function getExecutionParameters() {
    
    // Setup/check for debug mode and bind the script to a spreadsheet
    checkForDebugMode();

    // Track overall app execution time
    MyConfigurationData.startTime = new Date().getTime();

    // Validate login data and api key if provided
    var loginStatus = checkLoginCredential();
    if (MyConfigurationData.loginStatus == "failed") {
        // The checkLoginCredentials method displays any errors directly to the users
        return;
    }
}

function getDialogTechData(dashBoardType) {

    // This method will log the method with a timestamp to a debug tab in the current spreadsheet
    // This replaces Logger.log which will not be available when testing as an Add On
    debugLogger("Starting in getDialogTechData");

    // MyCOnfigurationData.activeSpreadsheet is the object variable with the currently active spreadsheet
    // DO NOT use getActiveSpreadsheet since this will not work with standalone scripts
    // Anyplace you would use getActiveSpreadsheet just retrieve this config parameter

    // The MyConfigurationData namespace (object) is defined in DT GS Configuration
    var ss = MyConfigurationData.activeSpreadsheet;

    // Remove any old tabs
    clearResults(dashBoardType);

    // Create and preallocate the main data sheet
    createDataSheet(dashBoardType);

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

        var cdrQuery = buildCdrQuery(dashBoardType, cdrStartDate, cdrEndDate);;
        debugLogger("Retrieving data with URL: " + cdrQuery);

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

        // concatenate the next segment onto the CSV string 
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

    // Add this data if we retrieved some calls

    if (dataFromCdr.length == 0) {

        noCallMsg = displayNoData(dashboardType);
        Browser.msgBox(noCallMsg);
        addSplashScreen();
        focusOnSplashScreen();

    } else {

        // All done --- finish up the spreadsheet, clean up.
        // Add the splash screen

        addSplashScreen();

        // Display the debug statistics
        debugStatistics(dashBoardType);

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