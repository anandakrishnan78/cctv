
$(document).ready( () => {
    // code for selecting particular camera
    $("#search").click( () => { 
        let cam_id = document.getElementById("cam_id").value;
        $.get("/start_ffmpeg", {
            "cam_id": cam_id,
        },
        (ob) => {
            if (!ob) {
                alert("failed");
                return;
            }
            document.getElementById("demo").innerHTML = ob;
        });
    });
    // code for selecting latest image in every two seconds
    // setInterval(() => {
    //     let cam_id = document.getElementById("cam_id").value;
    //     let text = " ";
    //     $.get("/display_image", {
    //         "cam_id": cam_id,
    //     },
    //     (ob) => {
            
    //         document.getElementById("demo").innerHTML = ob;
    //     });
    // }, 2000);
});