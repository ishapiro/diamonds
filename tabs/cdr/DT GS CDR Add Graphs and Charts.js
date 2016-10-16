function addCDRChartsAndGraphs(DTDataObj) {

  var dashBoardType = DTDataObj.dashBoardType, 
      dataColumns =   DTDataObj.lastColumn,
      dataRows =      DTDataObj.lastRow;

  var ss = MyConfigurationData.activeSpreadsheet;
  var sheet = ss.getSheetByName('Dashboard');

  // Determine the amount of Unique Days in the returned data
  // IMS 10/16/2016 Corrected range to exclude header
  var daysCount = sheet.getRange("Calcs!A2:A").getValues().filter(String).length;


  // Now build the call count chart
  // Postion is row, column, horizontal pixels, vertical pixels
  // IMS 10/16/2016 Only display graph if more than one day
  // IMS Adjust daysCount to include title

  if (daysCount > 1) {
    var chart = sheet.newChart()
      .setChartType(Charts.ChartType.COLUMN)
      .setOption('title', 'Call Count by Date')
      .setOption('backgroundColor', '#FFF5DA')
      .setOption('legend', {
        position: 'top',
        textStyle: {
          color: 'blue',
          fontSize: 12
        }
      })
      .addRange(sheet.getRange("Calcs!A1:A" + daysCount + 1))
      .addRange(sheet.getRange("Calcs!B1:B" + daysCount + 1))
      .setOption('width', 1223)
      .setOption('height', 200)
      .setPosition(7, 1, 5, 275)
      .build();

    sheet.insertChart(chart);

  } else {

      var appCountRange = sheet.getRange("A24");
      appCountRange.setValue('Graph skipped. Only one day selected.  Call count is: ' + dataRows);
      appCountRange.setFontWeight("bold");
      appCountRange.setFontSize("18");    
  }

  // Now build the call duration chart
  // IMS 10/16/2016 adjusted range to include title row
  // IMS Skip if only one day

  if (daysCount > 1) {
    var chart = sheet.newChart()
      .setChartType(Charts.ChartType.COLUMN)
      .setOption('title', 'Call Duration by Date')
      .setOption('backgroundColor', '#FFF5DA')
      .setOption('tooltip', true)
      .setOption('legend', {
        position: 'top',
        textStyle: {
          color: 'blue',
          fontSize: 12
        }
      })
      .addRange(sheet.getRange("Calcs!A1:A" + daysCount + 1))
      .addRange(sheet.getRange("Calcs!C1:C" + daysCount + 1))
      .setOption('width', 1223)
      .setOption('height', 200)
      .setPosition(7, 1, 5, 500)
      .build();

    sheet.insertChart(chart);

  } else {

      var callDuration = sheet.getRange("Calcs!C2:C2").getValue();
      var appCountRange = sheet.getRange("A33");
      appCountRange.setValue('Graph skipped. Only one day selected.  Total call duration is: ' + callDuration);
      appCountRange.setFontWeight("bold");
      appCountRange.setFontSize("18");    
  }

  // Now build the short call chart
  // IMS 10/16/2016 adjusted range to include title row

  // First check if we have any short calls
  var shortCallsDayOne = sheet.getRange("Calcs!O2:O2").getValue();

  if (shortCallsDayOne > 0) {
    if (daysCount > 1) {
      var shortCallLabel = 'Calls <' + getShortCallValue() + ' minutes';
      var chart = sheet.newChart()
        .setChartType(Charts.ChartType.COLUMN)
        .setOption('title', shortCallLabel)
        .setOption('backgroundColor', '#FFF5DA')
        .setOption('legend', {
          position: 'top',
          textStyle: {
            color: 'red',
            fontSize: 12
          }
        })
        .setOption('series', {
          0: {
            color: 'green'
          },
          1: {
            color: 'red'
          }
        })
        .setOption('isStacked', 'relative')
        .setOption('dataLabel', 'value')
        .setOption('tooltip', true)
        .addRange(sheet.getRange("Calcs!N1:N" + daysCount + 1))
        .addRange(sheet.getRange("Calcs!P1:P" + daysCount + 1))
        .addRange(sheet.getRange("Calcs!O1:O" + daysCount + 1))
        .setOption('width', 1223)
        .setOption('height', 200)
        .setPosition(7, 1, 5, 725)
        .build();

        sheet.insertChart(chart);

      } else {
        var appCountRange = sheet.getRange("A41");
        appCountRange.setValue('Graph Skipped. Only one day selected.  There were ' + shortCallsDayOne + " short calls.");
        appCountRange.setFontWeight("bold");
        appCountRange.setFontSize("18");    
      }

  } else {

    var ss = MyConfigurationData.activeSpreadsheet;
    var noShortCallMsg = ss.getRangeByName("B43");
    noShortCallMsg.setValue('No calls less than ' + getShortCallValue() + ' minutes.');
    noShortCallMsg.setFontWeight("bold");
    noShortCallMsg = ss.getRangeByName("B44");
    noShortCallMsg.setValue('You can change the short call duration in the configuration menu.');
    noShortCallMsg.setFontWeight("bold");
    noShortCallMsg.setFontSize("18"); 
  }

  // Now build the pie chart of call type

  var chart = sheet.newChart()
    .setChartType(Charts.ChartType.PIE)
    .setOption('title', 'Breakdown of Call Types')
    .setOption('backgroundColor', '#FFF5DA')
    .addRange(sheet.getRange("Calcs!F1:H7"))
    .setOption('width', 400)
    .setOption('height', 250)
    .setOption('is3D', true)
    .setOption('pieSliceText', 'none')
    .setOption('legend', {
      position: 'right',
      textStyle: {
        color: 'black',
        fontSize: 12
      }
    })
    .setOption('useFirstColumnAsDomain', true)
    .setOption('chartArea', {
      left: 15,
      right: 15,
      bottom: 15,
      top: 20,
      width: "70%"
    })
    .setOption('tooltip', true)
    .setPosition(7, 1, 5, 5)
    .build();

  sheet.insertChart(chart);

  // Calls by Day Pie Chart

  var chart = sheet.newChart()
    .setChartType(Charts.ChartType.PIE)
    .setOption('title', 'Calls by Days')
    .setOption('backgroundColor', '#FFF5DA')
    .addRange(sheet.getRange("Calcs!E10:E17"))
    .addRange(sheet.getRange("Calcs!G10:G17"))
    .setOption('width', 400)
    .setOption('height', 250)
    .setOption('legend', {
      position: 'right',
      textStyle: {
        color: 'black',
        fontSize: 12
      }
    })
    .setOption('useFirstColumnAsDomain', true)
    .setOption('chartArea', {
      left: 15,
      right: 15,
      bottom: 15,
      top: 20,
      width: "70%"
    })
    .setOption('pieSliceText', 'none')
    .setOption('tooltip', true)
    .setOption('pieHole', .5)
    .setPosition(7, 1, 417, 5)
    .build();

  sheet.insertChart(chart);

  // Calls by Phone Label Pie Chart

  var lastPhoneLabel = getFirstEmptyRow("K1:K", "Calcs");
  var chart = sheet.newChart()
    .setChartType(Charts.ChartType.PIE)
    .setOption('title', 'Calls by Phone Label')
    .setOption('backgroundColor', '#FFF5DA')
    .addRange(sheet.getRange("Calcs!J1:L" + lastPhoneLabel))
    .setOption('width', 400)
    .setOption('height', 250)
    .setOption('is3D', true)
    .setOption('legend', {
      position: 'right',
      textStyle: {
        color: 'black',
        fontSize: 12
      }
    })
    .setOption('chartArea', {
      left: 15,
      right: 15,
      bottom: 15,
      top: 20,
      width: "70%"
    })
    .setOption('useFirstColumnAsDomain', true)
    .setOption('pieSliceText', 'none')
    .setOption('tooltip', true)
    .setPosition(7, 1, 826, 5)
    .build();

  sheet.insertChart(chart);

  // Add line/bar charts

  var ss = MyConfigurationData.activeSpreadsheet;
  var sheet = ss.getSheetByName('Dashboard');
  var totalSheet = ss.getSheetByName('Calcs');
  var feqCnt = totalSheet.getRange("E19:E19").getValue();
  var endOfFeq = feqCnt + 20; // pivot values start at row 20

  // Now build the frequency Histogram --- which is really a column chart

  var chart = sheet.newChart()
    .setChartType(Charts.ChartType.COLUMN)
    .setOption('title', 'Calls Repeating 2 to 20 Times')
    .setOption('backgroundColor', '#FFF5DA')
    .addRange(sheet.getRange("Calcs!F19:G" + endOfFeq))
    .setOption('width', 400)
    .setOption('height', 250)
    .setOption('is3D', true)
    .setOption('value', true)
    .setOption('useFirstColumnAsDomain', true)
    .setOption('vAxis', {
      gridlines: {
        count: 4
      }
    })
    .setOption('hAxis', {
      gridlines: {
        count: feqCnt,
        format: '##'
      }
    })
    .setOption("series", {
      "1": {
        "annotations": {
          "stemColor": "none"
        },
        "dataLabel": "value"
      }
    })
    .setOption('legend', {
      position: 'none'
    })
    .setOption('tooltip', true)
    .setPosition(52, 1, 5, 5)
    .build();

  sheet.insertChart(chart);

  // Now build the pie chart of call type

  var chart = sheet.newChart()
    .setChartType(Charts.ChartType.PIE)
    .setOption('title', 'Call by Duration')
    .setOption('sliceVisibilityThreshold',0)
    .setOption('backgroundColor', '#FFF5DA')
    .addRange(sheet.getRange("Calcs!AA1:AB8"))
    .setOption('width', 400)
    .setOption('height', 250)
    .setOption('pieHole', .5)
    .setOption('legend', {
      position: 'right'
    })
    .setOption('pieSliceText', 'label')
    .setOption('pieSliceTextStyle', {
      fontsize: 6
    })
    .setOption('tooltip', true)
    .setPosition(52, 1, 417, 5)
    .build();

  sheet.insertChart(chart);

  // Top 20 Numbers
  // Some of the options below do not have any effect at this time
  // This chart type is not fully mature in google charts

  var chart = sheet.newChart()
    .setChartType(Charts.ChartType.TABLE)
    .setOption('title', 'Top 25 Repeat Callers')
    .addRange(sheet.getRange("Calcs!U1:V26"))
    .setOption('width', 400)
    .setOption('height', 250)
    .setOption('options', {
      alternatingRowStyle: true,
      showRowNumber: true,
      background: '#FFF5DA'
    })
    .setOption('legend', {
      position: 'none'
    })
    .setOption('tooltip', true)
    .setPosition(52, 1, 826, 5)
    .build();

  sheet.insertChart(chart);

  // Insert calls by Hour
  // The series annotations option below adds labels to the hours

  var chart = sheet.newChart()
    .setChartType(Charts.ChartType.COLUMN)
    .setOption('title', 'Calls By Hour')
    .setOption('backgroundColor', '#FFF5DA')
    .setOption('tooltip', true)
    .setOption('useFirstColumnAsDomain', true)
    .setOption('vAxis', {
      gridlines: {
        count: 4
      }
    })
    .setOption('hAxis', {
      gridlines: {
        count: 24
      }
    })
    .setOption("series", {
      "1": {
        "annotations": {
          "stemColor": "none"
        },
        "dataLabel": "value"
      }
    })
    .setOption('legend', {
      position: 'top',
      textStyle: {
        color: 'blue',
        fontSize: 12
      }
    })
    .addRange(sheet.getRange("Calcs!R1:S25"))
    .setOption('width', 1223)
    .setOption('height', 200)
    .setPosition(66, 1, 5, 1)
    .build();

  sheet.insertChart(chart);

}