const fs = require("fs");
const spawn = require("child_process").spawn;
const dataArray = {};
const procArray = {};
processCCTV("kk");
setInterval(() => {
    if (!dataArray.kk) {
        return;
    }
    fs.writeFile("D://myimage.jpg", new Buffer(dataArray.kk), "binary", () => {
        console.log("done");
    });
}, 2000);

function processCCTV(name, response) {
    const proc = spawn("D:\\Nodejs Project\\genericcctv\\ffmpeg", ["-rtsp_transport", "tcp", "-y", "-i", "rtsp://admin:123456@192.168.2.5:554/media/video1", "-ss", "00:00:01.500", "-vf", "fps=1/2", "-f", "image2pipe", "-"]);
    procArray[name] = proc.pid;
    proc.stdout.on("data", (data) => {
        dataArray[name] = data;
        if(response) {
            console.log("writing to response");
        }
    });
    proc.stderr.on("data", (data) => {
        console.log(`stderr: ${data}`);
    });
    proc.on("close", (code) => {
        console.log(`child process exited with code ${code}`);
    });

    setTimeout(() => {
        proc.stdin.pause();
        proc.kill();
        procArray[name] = undefined;
    }, 30*1000);
}