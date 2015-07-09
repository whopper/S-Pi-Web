// JavaScript function for calling the api to get the graph data
// points and populating the flot graphs. This fucntion is specifically.
// for the ecg graphs on the patient graphs.
function detail_graphs(eb) {
  var currentBuffers = {};
  var currentGraphs = [];
  var neededGraphs = [];
  neededGraphs.push(['waveform', 'bp', 1]);
  neededGraphs.push(['waveform', 'bp', 2]);
  neededGraphs.push(['waveform', 'bp', 3]);
  neededGraphs.push(['waveform', 'bp', 4]);

  var startGraph = function (stream, type, id) {
    $.when($.ajax('http://api.s-pi-demo.com/stream/'+stream+'/'+type+'/'+id)).done(
      function (data) {
        var channelName = data;
        var startTime = Date.now();
        currentBuffers[channelName] = new Array();
        var series = makeSmoothie('chart' + id);
        currentGraphs.push({"channel": channelName,
          "startTime": startTime,
          "buffer": currentBuffers[channelName],
          "graph": series});
        eb.registerHandler(channelName, function(msg) {
          currentBuffers[channelName].push(msg.data);
        });
      }
    )
  }

  var makeSmoothie = function (id) {
    console.log("id" + id)
    var chart = new SmoothieChart({millisPerPixel:8, strokeStyle:'green'});
    var canvas = document.getElementById(id);
    var series = new TimeSeries();
    chart.addTimeSeries(series, {lineWidth:0.7,strokeStyle:'green'});
    chart.streamTo(canvas, 1720);
    return series;
  }

  var drawIt = function () {
    currentGraphs.forEach(function (item, idx, thisArray) {
      var data = item["buffer"].shift();
      if (typeof data !== 'undefined') {
        for (var i = data.length - 1; i >= 0; i--) {
          item["graph"].append(item["startTime"], data[i].SIGNAL);
          item["startTime"] += 8;
        };
      }
    });
  }

  eb.onopen = function () {
    for (var i = neededGraphs.length - 1; i >= 0; i--) {
      startGraph(neededGraphs[i][0], neededGraphs[i][1], neededGraphs[i][2]);
    };
    setInterval(drawIt, 400);
  }
}
