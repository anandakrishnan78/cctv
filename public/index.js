/**
 * @author [Abhishek m s]
 * @email [abhishek.m@thinkpalm.com]
 * @create date 2018-10-29 11:29:24
 * @modify date 2018-10-29 11:29:24
 * @desc [description]
*/

$(document).ready(() => {
    // code for selecting particular camera
    setInterval(() => {
        // let cam_id = document.getElementById("cam_id").value;
        let cam_id = 1;
        $.get("/start_ffmpeg", {
            "cam_id": cam_id,
        },
        (ob) => {
            if (ob) {
                document.getElementById("demo").innerHTML = ob;
            }
        });
    }, 2000);
    // $("#search").click(() => {
        
    // });
});