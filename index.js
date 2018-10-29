/**
 * @author [Abhishek m s]
 * @email [abhishek.m@thinkpalm.com]
 * @create date 2018-10-26 11:44:32
 * @modify date 2018-10-26 11:44:32
 * @desc [page for sending image as byte stream by using ffmpeg]
*/

const spawn = require("child_process").spawn;
const express = require("express");
const app = express();
const fs = require("fs");
const parseString = require("xml2js").parseString;
const dataArray = {};
const procArray = {};
app.use(express.static("public"));

/**
 * start_ffmpeg request to start the new ffmpeg image fetching
 */
app.get("/start_ffmpeg", (request, response) => {
    let cam_id = request.query.cam_id;
    let xmlFile = __dirname + "/xmlFile/vessels.xml";
    let path, ip, portNumber, protocol, userName, passWord;
    let url = "";
    try {
        fs.readFile(xmlFile, "utf-8", function (error, xml) {
            if (error) {
                throw error;
            } else {
                if(procArray[cam_id]){
                    response.send(dataArray[cam_id]);
                    console.log("call on ffmpeg");
                    return;
                }
                parseString(xml, function (err, result) {
                    for (let i = 0; i < result.vessel.camera.length; i++) { // for-loop for itrating through the xml doc to find camra url
                        if ((cam_id.toString() == result.vessel.camera[i].$.id)) { // checking the camera_id from xml doc against the requested camera_id
                            path = result.vessel.camera[i].$.path;
                            ip = result.vessel.camera[i].$.IP;
                            portNumber = result.vessel.camera[i].$.portNumber;
                            userName = result.vessel.camera[i].$.userName;
                            passWord = result.vessel.camera[i].$.passWord;
                            protocol = result.vessel.camera[i].$.protocol;
                            url += protocol + "://" + userName + ":" + passWord + "@" + ip + ":" + portNumber + "/" + path; // generating camera url
                            processCCTV(cam_id, url, response);//function processCCTV() is called to start new ffmpeg
                        }
                    }
                });
            }
        });
    } catch (err) {
        console.log("Error");
    }
});

/**
 * processCCTV() function to start new ffmpeg which continuosly for 30 seconds 
 * @param {*} cam_id 
 * @param {*} url 
 * @param {*} response 
 */
function processCCTV(cam_id, url, response) {
    console.log("first call on ffmpeg");
    let ffmpegPath = __dirname + "\\ffmpeg";
    const proc = spawn(ffmpegPath, ["-rtsp_transport", "tcp", "-y", "-i", url, "-ss", "00:00:01.500", "-vf", "fps=1/2", "-f", "image2pipe", "-"]);
    procArray[cam_id] = proc.pid;
    proc.stdout.on("data", (data) => {
        dataArray[cam_id] = data;
    });
    if (response) {
        response.send(dataArray[cam_id]);
    }
    // proc.stderr.on("data", (data) => {
    //     console.log(`stderr: ${data}`);
    // });
    proc.on("close", (code) => {
        console.log(`child process exited with code ${code}`);
    });
    setTimeout(() => {
        proc.stdin.pause();
        proc.kill();
        procArray[cam_id] = undefined;
    }, 30 * 1000);
}
app.listen(3001, () => {
    console.log("app listen at port 3001");
});