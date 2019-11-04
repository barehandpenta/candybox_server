// Create Socketio connection to 18.179.14.225:3000 --- Konel AWS Server IPv4
// const socket = io('http://18.179.14.225:3000');
const socket = io("localhost:3000")


//------- Get HTML Element -------//
let dashboard = document.getElementById("dashboard");
let ctx_dashboard = dashboard.getContext('2d');
let threshSlider = document.getElementById("thVal");

let chart = new Chart(ctx_dashboard, {
    // Configuring bar chart:
    type: 'bar',
    // Content label for horizonal axis
    data: {
        labels: ['Calm', 'Anger', 'Joy', 'Sorrow', 'Energy'],
        // Content data value and setting
        datasets:
        [
            {
            label: 'Moods propability',
            backgroundColor: 'rgb(0,199,120)',
            data: [0, 10, 23, 3, 2] // Value of each label follow indexing
            },
        ]
    },
    // Option for the whole chart:
    options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2,
        scales: {
            yAxes: [{
                ticks: {
                    fontColor: 'rgb(255, 255, 255)',
                    fontSize: 25,
                    max: 50
                }
            }],
            xAxes: [{
                ticks: {
                    fontColor: 'rgb(255, 255, 255)',
                    fontSize: 25
                }
            }]
        },
        // Title for the chart
        title:{
            display: true,
            fontSize: 45,
            text: "CANDY BOX DASHBOARD",
            fontColor: 'rgb(255, 255, 255)'
        },
        legend: {
            display: true,
            labels: {
                fontSize: 25,
                fontColor: 'rgb(0, 199, 120)'
            }
        },
        animation: {
            duration: 2000
        },
        // Chartjs annotation-plugin, add Line to chart
        annotation:{
            // Line #0, this is the line that shows the current value of Threshold Slider
            annotations:[{
                type: 'line',
                mode: 'horizontal',
                scaleID: 'y-axis-0',
                value: 25,
                borderColor: 'rgba(255, 255, 255, 0.5)',
                borderWidth: 4,
                label:{
                    enabled: true,
                    content: 'Threshold'
                }
            },
            // Line #1, this is the line that shows the SET value of Candy Box threshold
            {
                type: 'line',
                mode: 'horizontal',
                scaleID: 'y-axis-0',
                value: 25,
                borderColor: 'rgb(255, 0, 0)',
                borderWidth: 4,
                label:{
                    enabled: true,
                    content: 'Threshold'
                }
            },
        ]
        }
    }
});

//------- Main event trigger or JQuery codes go here: -------//
$(document).ready(()=>{
    //------- Update Line #0 with the value of Threshold Slider -------//
    threshSlider.oninput = () => {
        chart.options.annotation.annotations[0].value = parseInt(threshSlider.value);
        chart.update();
    };
    //------- Get result from Candy Box -------//
    socket.on("update", data => {
        let c = parseInt(data["calm"]);
        let a = parseInt(data["anger"]);
        let j = parseInt(data["joy"]);
        let s = parseInt(data["sorrow"]);
        let e = parseInt(data["energy"]);
        let new_data = [c, a, j, s, e];
        // Change value of main chart:
        chart.data.datasets[0].data = new_data;
        chart.update();

    });
    //------- Check when Candy Box pass the threshold -------//
    socket.on("candy_drop", y => {
        let a = $("#candyDrop").text();
        let candy = parseInt(a);
        candy += 1;
        console.log(candy);
        
        $("#candyDrop").text(candy.toString());
    });
    //------- JQuery click event of #btnApply -------//
    $("#btnApply").click(()=>{
        // Get the value of Threshold Slider
        let thresh = $("#thVal").val();      
        // Move Line #1 to the new position with value of Line #0
        chart.options.annotation.annotations[1].value = chart.options.annotation.annotations[0].value;
        chart.update();
        // Send the new threshold value to server
        socket.emit("change_thresh", thresh);
    });
    
});