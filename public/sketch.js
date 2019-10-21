const socket = io('http://localhost:3000');


let update_val = (c, a, j, s, e) => {
    $("#calm").html(c);
    $("#anger").html(a);
    $("#joy").html(j);
    $("#sorrow").html(s);
    $("#energy").html(e);
}

$(document).ready(()=>{
    socket.on("update", data => {
        console.log(data);
        let c = data["calm"].toString();
        let a = data["anger"].toString();
        let j = data["joy"].toString();
        let s = data["sorrow"].toString();
        let e = data["energy"].toString();
        $("#calm").html(c);
        $("#anger").html(a);
        $("#joy").html(j);
        $("#sorrow").html(s);
        $("#energy").html(e);
        // update_val(calm, angry, joy, sorrow, energy)
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