// JavaScript function for calling the api to get the graph data
// points and populating the flot graphs. This fucntion is specifically.
// for the ecg graphs on the patient graphs.
var currentGraphs = [];
function detail_graphs(eb) {
  var currentBuffers = {};
  var neededGraphs = [];
  neededGraphs.push(['waveform', 'bp', 1]);
  neededGraphs.push(['waveform', 'bp', 2]);
  neededGraphs.push(['waveform', 'bp', 3]);
  neededGraphs.push(['waveform', 'bp', 4]);

  console.log("hi");
  console.log(neededGraphs);

  var startGraph = function (stream, type, id) {
    $.when($.ajax('http://api.s-pi-demo.com/stream/'+stream+'/'+type+'/'+id)).done(
      function (data) {
        var channelName = data;
        var startTime = Date.now();
        currentBuffers[channelName] = new Array();
        var chart = makeSmoothie('chart' + id);
        currentGraphs.push({"channel": channelName,
          "startTime": startTime,
          "buffer": currentBuffers[channelName],
          "graph": chart.series,
          "chart": chart.chart});
        eb.registerHandler(channelName, function(msg) {
          currentBuffers[channelName].push(msg.data);
        });
      }
    )
  };

  var makeSmoothie = function (id) {
    console.log("id" + id)
    var chart = new SmoothieChart({millisPerPixel:8, strokeStyle:'green'});
    var canvas = document.getElementById(id);
    var series = new TimeSeries();
    chart.addTimeSeries(series, {lineWidth:0.7,strokeStyle:'green'});
    chart.streamTo(canvas, 1720);
    return {"series": series, "chart": chart};
  };

  var drawIt = function () {
    currentGraphs.forEach(function (item, idx, thisArray) {
      var data = item["buffer"].shift();
      if (typeof data !== 'undefined') {
        for (var i = data.length - 1; i >= 0; i--) {
          item["graph"].append(item["startTime"], data[i].SIGNAL);
          item["startTime"] += 8;
        }
      }
    });
  };

  eb.onopen = function () {
    for (var i = neededGraphs.length - 1; i >= 0; i--) {
      startGraph(neededGraphs[i][0], neededGraphs[i][1], neededGraphs[i][2]);
    }
    setInterval(drawIt, 400);
    console.log('about to call resize');
    handleResize;
  }
}
var handleResize = function () {
  for (var i = 0; i < currentGraphs.length; i++) {
    console.log('resized' + i);
    var mycanvas = currentGraphs[i].chart.canvas;
    mycanvas.width = mycanvas.parentNode.offsetWidth;
    currentGraphs[i].chart.resize();
  }
};
