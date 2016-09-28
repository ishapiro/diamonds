function addCallTrackingGraphsAndCharts(DTDataObj) {

  var dashBoardType = DTDataObj.dashBoardType,
      dataRows =      DTDataObj.lastRow,
      dataColumns =   DTDataObj.lastColumn;

  // Call Tracking Pie Charts

  var ss = MyConfigurationData.activeSpreadsheet;
  var sheet = ss.getSheetByName('Call Tracking Dashboard');

  // Now build the pie chart of call type

  var chart = sheet.newChart()
    .setChartType(Charts.ChartType.PIE)
    .setOption('title', 'Sourcetrak Channel')
    .setOption('backgroundColor', '#FFF5DA')
    .addRange(sheet.getRange("Call Tracking Calcs!A2:B50"))
    .setOption('width', 600)
    .setOption('height', 325)
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
    .setOption('pieSliceText', 'none')
    .setOption('tooltip', true)
    .setPosition(7, 1, 5, 5)
    .build();

  sheet.insertChart(chart);

  var chart = sheet.newChart()
    .setChartType(Charts.ChartType.PIE)
    .setOption('title', 'Sourcetrak Activity Type')
    .setOption('backgroundColor', '#FFF5DA')
    .addRange(sheet.getRange("Call Tracking Calcs!D2:E50"))
    .setOption('width', 600)
    .setOption('height', 325)
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
    .setOption('pieSliceText', 'none')
    .setOption('tooltip', true)
    .setPosition(7, 1, 615, 5)
    .build();

  sheet.insertChart(chart);

  var chart = sheet.newChart()
    .setChartType(Charts.ChartType.PIE)
    .setOption('title', 'Sourcetrak Activity Value')
    .setOption('backgroundColor', '#FFF5DA')
    .addRange(sheet.getRange("Call Tracking Calcs!G2:H100"))
    .setOption('width', 1200)
    .setOption('height', 450)
    .setOption('pieHole', .5)
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
    .setOption('pieSliceText', 'none')
    .setOption('tooltip', true)
    .setPosition(24, 1, 8, 5)
    .build();

  sheet.insertChart(chart);

  // First and Last Touch Pie Charts

  var chart = sheet.newChart()
    .setChartType(Charts.ChartType.PIE)
    .setOption('title', 'First Touch Page (top 100)')
    .setOption('backgroundColor', '#FFF5DA')
    .addRange(sheet.getRange("Call Tracking Calcs!J2:K100"))
    .setOption('width', 600)
    .setOption('height', 325)
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
    .setOption('pieSliceText', 'none')
    .setOption('tooltip', true)
    .setPosition(47, 1, 5, 5)
    .build();

  sheet.insertChart(chart);

  var chart = sheet.newChart()
    .setChartType(Charts.ChartType.PIE)
    .setOption('title', 'Last Touch Page (top 100)')
    .setOption('backgroundColor', '#FFF5DA')
    .addRange(sheet.getRange("Call Tracking Calcs!M2:N100"))
    .setOption('width', 600)
    .setOption('height', 325)
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
    .setOption('pieSliceText', 'none')
    .setOption('tooltip', true)
    .setPosition(47, 1, 615, 5)
    .build();

  sheet.insertChart(chart);

  // Call Tracking First Last Chart

  var ss = MyConfigurationData.activeSpreadsheet;
  var sheet = ss.getSheetByName('Call Tracking Dashboard');

  var seriesOptions = {
    0: {
      color: '#ffff99',
      dataLabel: 'none'
    }
  };

  var chart = sheet.newChart()
    .setChartType(Charts.ChartType.BAR)
    .setOption('title', 'Top First Touch Last Touch Landing Page Combinations')
    .setOption('backgroundColor', '#FFF5DA')
    .setOption('chartArea', {
      left: 50,
      right: 50,
      bottom: 50,
      top: 50,
      width: "70%"
    })
    .setOption('tooltip', true)
    .setOption('series', seriesOptions)
    .setOption('bar', {
      groupWidth: "80%"
    })
    .setOption('vAxis', {
      textPosition: 'in',
      textStyle: {
        fontSize: 14,
        color: '#004d00',
        auraColor: 'none'
      }
    })
    .setOption('hAxis', {
      textPostion: 'out',
      'gridlines': {
        count: 15
      },
      textStyle: {
        fontSize: 12,
        color: 'black'
      }
    })
    .setOption('legend', {
      position: 'none'
    })
    .addRange(sheet.getRange("'Call Tracking Calcs'!S1:S25"))
    .addRange(sheet.getRange("'Call Tracking Calcs'!R1:R25"))
    .setOption('width', 1218)
    .setOption('height', 800)
    .setPosition(64, 1, 5, 1)
    .build();

  sheet.insertChart(chart);

}