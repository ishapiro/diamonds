// Create pivot and summary tables on Calcs tab used by dashboard

function addCallTrackingPivotTables(DTDataObj) {

  var dashBoardType = DTDataObj.dashBoardType, 
      dataRows =      DTDataObj.lastRow, 
      dataColumns =   DTDataObj.lastColumn;

  createCalcTab(dashBoardType);
  var ss = MyConfigurationData.activeSpreadsheet;
  var sheet = ss.getSheetByName('Call Tracking Calcs');

  // Totals by Sourctrak Channel
  var cell = sheet.getRange("A2:A2");
  cell.setValue('=QUERY(\'Call Tracking Data\'!A1:O' + dataRows + ', "select O,count(A) group by O order by count(A) desc label count(A) \'Channel Count\' ")');
  yellowTitle("A2:B2", dashBoardType); 

  // Totals by Activity Type
  var cell = sheet.getRange("D2:D2");
  cell.setValue('=QUERY(\'Call Tracking Data\'!A1:Q' + dataRows + ', "select Q,count(A) group by Q order by count(A) desc label count(A) \'Activity Type Count\' ")');
  yellowTitle("D2:E2", dashBoardType); 

  // Totals by Activity Value
  var cell = sheet.getRange("G2:G2");
  cell.setValue('=QUERY(\'Call Tracking Data\'!A1:R' + dataRows + ', "select R,count(A) group by R order by count(A) desc label count(A) \'Activity Value Count\' ")');
  yellowTitle("F2:G2", dashBoardType); 

  // Totals by First Touch
  var cell = sheet.getRange("J2:J2");
  cell.setValue('=QUERY(\'FirstLastCalcs\'!A1:N' + dataRows + ', "select E,count(A) group by E order by count(A) desc label count(A) \'First Page CNT\' ")');
  yellowTitle("J2:K2", dashBoardType);   

  // Totals by Last Touch
  var cell = sheet.getRange("M2:M2");
  cell.setValue('=QUERY(\'FirstLastCalcs\'!A1:N' + dataRows + ', "select M,count(A) group by M order by count(A) desc label count(A) \'Last Page CNT\' ")');
  yellowTitle("M2:N2", dashBoardType);  

  // Totals First Last Combination
  var cell = sheet.getRange("P2:P2");
  cell.setValue('=QUERY(\'FirstLastCalcs\'!P1:R' + dataRows + ', "select P, Q, R  order by R desc limit 25 ")');
  yellowTitle("M2:N2", dashBoardType); 

  // Add the first and last combined with ==> to show graphically
  var cell = sheet.getRange("S1:S1");
  cell.setValue('First ==> Last');    
  var cell = sheet.getRange("S2:S27");
  cell.setValue('=CONCATENATE(P4," ==> ",Q4)');

  return;

}
