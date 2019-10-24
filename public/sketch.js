const socket = io('http://172.31.47.255:1235');


let update_val = (c, a, j, s, e) => {
    $("#calm").html(c);
    $("#anger").html(a);
    $("#joy").html(j);
    $("#sorrow").html(s);
    $("#energy").html(e);
}

let canvas = document.getElementById("chartContainer")
let ctx = canvas.getContext('2d');

let chart = new Chart(ctx, {
    type: 'bar',

    data: {
        labels: ['Calm', 'Anger', 'Joy', 'Sorrow', 'Energy'],
        datasets: [{
            label: 'Moods propability',
            backgroundColor: 'rgb(0,199,120)',
            borderColor: 'rgb(0,0,0)',
            data: [0, 10, 23, 3, 2]
        }]
    },
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
        }
    }
});


$(document).ready(()=>{

    console.log(chart.data.datasets[0].data)
    socket.on("update", data => {
        let c = parseInt(data["calm"]);
        let a = parseInt(data["anger"]);
        let j = parseInt(data["joy"]);
        let s = parseInt(data["sorrow"]);
        let e = parseInt(data["energy"]);
        let new_data = [c, a, j, s, e];
        console.log(new_data);
        chart.data.datasets[0].data = new_data;
        chart.update();

    });
    socket.on("candy_drop", y => {
        $("#candy_drop_alert").show(0).delay(500).hide(0);
    });
    $("#btnApply").click(()=>{
        let thresh = $("#thVal").val();
        console.log(thresh);
        socket.emit("change_thresh", thresh);
    });
    
});