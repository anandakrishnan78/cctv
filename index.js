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
const bodyParser = require("body-parser");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.get("/start_ffmpeg", (request, response) => {
    let cam_id = request.query.cam_id;
    let xmlfile = __dirname + "/xmlFile/vessels.xml";
    let path, ip, portNumber, protocol, userName, passWord;
    let url = "";
    let checkFlag = false;
    try {
        fs.readFile(xmlfile, "utf-8", function (error, xml) {
            if (error) {
                throw error;
            } else {
                parseString(xml, function (err, result) {
                    for (let i = 0; i < result.vessel.camera.length; i++) {
                        if ((cam_id.toString() == result.vessel.camera[i].$.id)) {
                            console.log(cam_id);
                            path = result.vessel.camera[i].$.path;
                            ip = result.vessel.camera[i].$.IP;
                            portNumber = result.vessel.camera[i].$.portNumber;
                            userName = result.vessel.camera[i].$.userName;
                            passWord = result.vessel.camera[i].$.passWord;
                            protocol = result.vessel.camera[i].$.protocol;
                            url += protocol + "://" + userName + ":" + passWord + "@" + ip + ":" + portNumber + "/" + path;
                            const proc = spawn("D:\\smrtship_ffmpeg\\cctv\\ffmpeg", ["-rtsp_transport", "tcp", "-y", "-i", url, "-ss", "00:00:01.500", "-vf", "fps=1/2", "-f", "image2pipe", "-"]);
                            proc.stdout.on("data", (data) => {
                                fs.writeFile("D://myimage.jpg", data, "binary", () => {
                                    console.log("done");
                                });
                            });
                            checkFlag = true;
                            response.send(true);
                            setTimeout(() => {
                                proc.stdin.pause();
                                proc.kill();
                                console.log("ffmpeg stopped");
                            }, 30 * 1000);
                        }
                    }
                    if(!checkFlag) {
                        response.send(false);
                    }
                });
            }
        });
    } catch (err) {
        console.log("Error");
    }
});
app.listen(3001, () => {
    console.log("app listen at port 3001");
});