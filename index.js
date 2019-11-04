// -------------- Express JS configuration -----------------//
const express = require('express');
const app = express();
app.set('view engine', 'ejs');
app.set('views','./views');
app.use(express.static('public'));
// -------------- Socket.io server configuration -----------------//
var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(process.env.PORT || 3000);
// -------------- Modules importing -----------------//
var fs = require("fs");
var data = fs.readFileSync("data.json");
DATA_BASE = JSON.parse(data);
console.log(DATA_BASE);
// -------------- Database contructor explained -----------------//
/*
{
    "JOY_THRESHOLD" : 25,
    "CANDY_DROP": 0,
    "data": [
        {
            "date_time": "2019/01/11 - 14:25:36",
            "year": "2019",
            "month": "11",
            "date": "01",
            "hour": "14",
            "minute": "25",
            "second": "36",
            "joy": "24",
            "current_threshold": "20"
        },
        {
            "date_time": "2019/01/11 - 18:11:40",
            "year": "2019",
            "month": "11",
            "date": "01",
            "hour": "18",
            "minute": "11",
            "second": "40"
            "joy": "37",
            "current_threshold": "20"
        },
    ]
}
*/
// -------------- Define functions -----------------//
/*
    Function getFullTime():
    - Return a JSON contain:
    + timeString: Display time in string
    + time: a JSON contents time data
*/
let getFullTime = () => {
    date_object = new Date();
    let year = date_object.getFullYear();
    let month = ("0" + (date_object.getMonth() + 1)).slice(-2);
    let date = ("0" + date_object.getDate()).slice(-2);
    let hour = date_object.getHours();
    let minute = date_object.getMinutes();
    let second = date_object.getSeconds();
    let time_string = year + '/' + date + '/' + month + " - " + 
    hour + ":" + minute + ":" + second

    return {
        timeString : time_string,
        time: {
            year: year,
            date: date,
            month: month,
            hour: hour,
            minute: minute,
            second: second
        }
    }
};

let saveDataBase = () => {
    let saved_data = JSON.stringify(DATA_BASE, 2);
    fs.writeFile("data.json", saved_data, err => {
        console.log("File saved!!")
    });
}
/*

*/
// -------------- Variable declarations -----------------//
let candy_box_sockets = [];
/*
This variable contains the detail of candy box connect to the server
    sockets = [
        {
            "candy_box_id": "#1",
            "socket_id": "adf1vfa31aszcvw23",
        },
        {
            "candy_box_id": "#2",
            "socket_id": "afffdca1hg45thfggh",
        },
    ]
*/
let web_client_sockets = []
/*
This variable contains the detail of candy box connect to the server
    sockets = [
        {
            "web_id": "#1",
            "socket_id": "adf1vfa31aszcvw23",
        },
        {
            "web_id": "#2",
            "socket_id": "afffdca1hg45thfggh",
        },
    ]
*/
// -------------- Socket.io Server handler -----------------//
io.on('connection', socket => {
    // Checkin event, when a candy box connect to server, 

    socket.on("moods", data => {
        io.emit("update", data);
    });
    socket.on("change_thresh", thresh =>{
        DATA_BASE["JOY_THRESHOLD"] = thresh;
        saveDataBase();
        io.emit("new_thresh", thresh);
    });
    socket.on("drop_candy", joy =>{
        // data = JSON.parse(data)
        DATA_BASE["CANDY_DROP"] += 1;
        let current_joy = joy
        let current_time = getFullTime();
        let new_data = {
            "date_time": current_time["timeString"],
            "year": current_time["time"]["year"],
            "month": current_time["time"]["month"],
            "date": current_time["time"]["date"],
            "hour": current_time["time"]["hour"],
            "minute": current_time["time"]["minute"],
            "second": current_time["time"]["second"],
            "joy": current_joy,
            "current_threshold": DATA_BASE["JOY_THRESHOLD"]
        }
        DATA_BASE["data"].push(new_data);
        saveDataBase();
        io.emit("candy_drop", "JUST DO IT");
    });
});

app.get('/', (req,res) => {
    res.render('home.ejs');
});

