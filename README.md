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

Irv Shapiro
August 2016
