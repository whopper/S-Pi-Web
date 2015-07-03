function main(id) {
  // We use an inline data source in the example, usually data would
  // be fetched from a server
  console.log(id);
  var data = [],
    totalPoints = 300;
  function getRandomData() {
    if (data.length > 0)
      data = data.slice(1);
    // Do a random walk
    while (data.length < totalPoints) {
      var prev = data.length > 0 ? data[data.length - 1] : 50,
        y = prev + Math.random() * 10 - 5;
      if (y < 0) {
        y = 0;
      } else if (y > 100) {
        y = 100;
      }

      data.push(y);
    }
    // Zip the generated y values with the x values
    var res = [];
    for (var i = 0; i < data.length; ++i) {
      res.push([i, data[i]])
    }
    return res;
  }
  // Set up the control widget
  var updateInterval = 30;
  $("#updateInterval").val(updateInterval).change(function () {
    var v = $(this).val();
    if (v && !isNaN(+v)) {
      updateInterval = +v;
      if (updateInterval < 1) {
        updateInterval = 1;
      } else if (updateInterval > 2000) {
        updateInterval = 2000;
      }
      $(this).val("" + updateInterval);
    }
  });
  var plot = $.plot(id, [ getRandomData() ], {
    series: {
      shadowSize: 0 // Drawing is faster without shadows
    },
    yaxis: {
      min: 0,
      max: 100
    },
    xaxis: {
      show: false
    },
    colors: ["#00FF33", "#00FF33"],
  });
  function update() {
    plot.setData([getRandomData()]);
    // Since the axes don't change, we don't need to call plot.setupGrid()
    plot.draw();
    setTimeout(update, updateInterval);
  }
  update();
  // Add the Flot version string to the footer
  $("#footer").prepend("Flot " + $.plot.version + " &ndash; ");
};


function integrate(id) {
  // We use an inline data source in the example, usually data would
  // be fetched from a server
  console.log(id);
  var data = [],
  totalPoints = 300;

  var eb = new vertx.EventBus("http://s-pi-demo.com/api/streambus");

   var updateInterval = 30;
   $("#updateInterval").val(updateInterval).change(function () {
     var v = $(this).val();
     if (v && !isNaN(+v)) {
       updateInterval = +v;
       if (updateInterval < 1) {
         updateInterval = 1;
       } else if (updateInterval > 2000) {
         updateInterval = 2000;
       }
       $(this).val("" + updateInterval);
     }
   });

   eb.onopen = function() {
     $.when($.ajax("http://s-pi-demo.com/api/stream/numerical/hr/1"),
     $.ajax("http://s-pi-demo.com/api/stream/numerical/hr/2"),
     $.ajax("http://s-pi-demo.com/api/stream/numerical/hr/3"),
     $.ajax("http://s-pi-demo.com/api/stream/numerical/hr/4")).done(
      function(dat1) {
        eb.registerHandler(dat1[0], function(msg) {
          var dmsg = JSON.parse(msg);
          console.log("getting msg x: " + dmsg.x + " y: " + dmsg.y);

          if (dmsg.y < 0) {
            dmsg.y = 0;
          } else if (dmsg.y > 100) {
            dmsg.y = 100;
          }

          data.push([dmsg.x, dmsg.y]);
          if (data.length > 15)
            data.shift();
          console.log(data);

              var plot = $.plot(id, [ data ], {
                series: {
                  shadowSize: 0 // Drawing is faster without shadows
                },
                yaxis: {
                  min: 0,
                  max: 100
                },
                xaxis: {
                  show: false
                },
                colors: ["#00FF33", "#00FF33"],
              });
              $("#footer").prepend("Flot " + $.plot.version + " &ndash; ");
        })
      }
    )
  }
}
