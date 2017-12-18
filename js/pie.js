window.onload = function () {

    var chart = new CanvasJS.Chart("chartContainer", {
        backgroundColor: "transparent",
        interactivityEnabled: false,
        legend: {
            display: false,
            labels: {
                display: false
            }
        },
        credits: false,
        data: [{
            type: "doughnut",
            innerRadius: 174,
            dataPoints: [{
                    y: 450,
                },
                {
                    y: 120,
                },
                {
                    y: 300,
                },
                {
                    y: 800,
                },
                {
                    y: 150,
                },
                {
                    y: 150,
                },
                {
                    y: 250,
                }
            ]
        }]
    });
    chart.render();
}