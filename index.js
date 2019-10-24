const express = require('express');
const app = express();
app.set('view engine', 'ejs');
app.set('views','./views');
app.use(express.static('public'));

var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(process.env.PORT || 1234);

moods = {
    "calm": 25,
    "angry": 1,
    "joy": 12,
    "sorrow": 35,
    "energy": 4,
}

io.on('connection', socket => {
    console.log(socket.id)
    socket.on("moods", data => {
        io.emit("update", data);
    });
    socket.on("change_thresh", thresh =>{
        io.emit("new_thresh", thresh);
    });
    socket.on("drop_candy", y =>{
        if(y == 'YES'){
            io.emit("candy_drop", y);
        }
    });
});
app.get('/', (req,res) => res.render('home.ejs'));

