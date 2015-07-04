// JavaScript function for calling the api to get the graph data
// points and populating the flot graphs. This fucntion is specifically 
// for the ecg graphs on the overview page.
function ecg_graph(id) {
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
        $.when($.ajax("http://s-pi-demo.com/api/stream/numerical/hr/" + id),
                $.ajax("http://s-pi-demo.com/api/stream/numerical/hr/" + id),
                $.ajax("http://s-pi-demo.com/api/stream/numerical/hr/" + id),
                $.ajax("http://s-pi-demo.com/api/stream/numerical/hr/" + id)
            ).done(
                function(dat1) {
                    eb.registerHandler(dat1[0], function(msg) {
                        var dmsg = JSON.parse(msg);
                        console.log("getting msg x: " + dmsg.x + " y: " + dmsg.y);

                        if (dmsg.y < 0) {
                            dmsg.y = 0;
                        } else if (dmsg.y > 100) {
                            dmsg.y = dmsg.y % 100;
                        }

                        data.push([dmsg.x, dmsg.y]);
                        if (data.length > 15)
                            data.shift();
                        console.log(data);

                        var plot = $.plot("#patient" + id, [ data ], {
                            series: {
                                shadowSize: 0, // Drawing is faster without shadows
                                curvedLines: {
                                    apply: true,
                                    active: true,
                                    monotonicFit: true
                                }
                            },
                            yaxis: {
                                min: 0,
                                max: 100
                            },
                            xaxis: {
                                show: false
                            },
                            colors: ["#00FF33", "#00FF33"]
                        });
                    })
                }
        )
    }
}
