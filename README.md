# diamonds
Our diamonds (Google Scripts) integration with our Carbon APIs under pressure.

This project is a Google Apps Script (multiple files) that implements a Google Sheets Add-on.

The Add-on integrates DialogTech Call Detail and Call Tracking with Google Sheets and handles:

- Authentication (via username/password or public API key)
- Retrieval of data from the CDR or Call Tracking APIs
- Creation of Pivot Tables and Calculated fields based on the data
- Graphing the selected data and producing dashboard

This code is implemented as a standalone Google script.  Standalone Google scripts are stored
in Google Drive accounts.   The GAPPS project "node-google-apps-script" is used to extract the
files in this repository from Google and store them in a local directory so they can be managed
with GIT.  The following URL is the github repository for GAPPS.

https://github.com/danthareja/node-google-apps-script

Detailed instructions for installing GAPPS in our are located in the file:

"Google Apps Script Debugging using GAPPS.pdf file.

GAPPS will rename the .js files to .gs when it uploads them to Google.  Using .js extensions
will allow you to use a code aware javascript editor.   Please note Google APPs Script is based
on Javascript 1.4 with additions from later versions but DOES NOT support the full V5 ECMAScript
API.  More information is located at the following URL.

https://developers.google.com/apps-script/overview

The code in the standalone script injects a spreadsheet object into the code so it can be tested
without being "bound" to a Google Sheet or run as an add-on.  In addition the toast and logging
methods have been replaced with private methods that handle the ability to test without a "bound"
sheet and also to log errors to a tab in the current sheet instead of to the developer log which
does not work when testing add-ons.

The best starting point to begin reviewing the code is "DT GS Main Routine.js"

*** GETTING STARTED QUICK ***

To get started in evaluating this code quickly take the following steps.

1. Download the zip file of this code and save to a directory.

2. Install GAPPS via NPM

     npm install ­-g node­-google­-apps­-script

3. Create a json file with the following content where fileid is the Google Drive
ID of an empty script file.  The file ID for a Google drive file is the string between
the d/ and /edit.  For example:

         ..... /d/1mGkt1HxFPQvYh8uSbh5435NKIwBWT-NlJymec-z4EaJ7tYQ_oPtkvhC7/edit ....

        Create the file containing the following four lines and save as gapps.config.json

        {
        "path": ".",
        "fileId": "1mGkt1HxFPQvYh8uSbh5435NKIwBWT-NlJymec-z4EaJ7tYQ_oPtkvhC7"
        }

4. Now to upload your code to the Google Drive Script file just type:

    bash-3.2$ gapps push                                                                          
    Pushing back up to Google Drive...                                                            
    The latest files were successfully uploaded to your Apps Script project.                      
    bash-3.2$   

5. Once your script file is created it may be debugged by "testing as an add on" or by
selecting a module and clicking debug to run.  Here are the recommended first steps:

    a. Create a new blank spreadsheet and remember it's name
    b. Return to your script and Run as an add-on via "Publish / Test as Add On"
    c. Choose "Select Doc" in the bottom right and locate your spreadsheet
    d. Select the radio button in the top of the "Test as add-on" window, next to the spreadsheet you selected in step C
    e. Select the configuration options from the Add On menu within your spreadsheet
    f. Save your account credentials or API Key, as well as a date range.
    f. MAKE SURE you set the debug configuration option to YES, and save.
    g. Via the Add On menu, select any of the reporting options to. 

    When you are ready to debug since your configuration has been saved you
    can now run directly from the script IDE.

    a. Put a debugger statement, yes the word debugger, somewhere in the code.
    b. Select one of the "driver" modules
    c. Click the debug icon
    d. The code will identify that it is running in debug mode and not in add on
    mode and it will create a temporaty spreadsheet for debugging.
    e. The code will break when it reaches your debugger statement.


Irv Shapiro
September 2016
