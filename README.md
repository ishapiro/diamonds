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
with GIT.

The code in the standalone script injects a spreadsheet object into the code so it can be tested
without being "bound" to a Google Sheet or run as an add-on.  In addition the toast and logging 
methods have been replaced with private methods that handle the ability to test without a "bound"
sheet and also to log errors to a tab in the current sheet instead of to the developer log which
does not work when testing add-ons.

Irv Shapiro
August 2016
