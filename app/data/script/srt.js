var fs = require('fs');

function parseTimecode(timecodes) {
    var timecode = timecodes.split(" --> ");
    var result = new Array();
    for (var i = 0; i < timecode.length; i++) {
        var reste = timecode[i].split(",");
        var ms = reste[1];
        reste = reste[0].split(":");
        var h = reste[0];
        var m = reste[1];
        var s = reste[2];
        result[i] = {
            hour: parseInt(h, 10),
            min: parseInt(m, 10),
            sec: parseInt(s, 10),
            milis: parseInt(ms, 10)
        };
    };
    if (result.length == 1) {
        return result[0];
    } else {
        return {
            start: result[0],
            end: result[1]
        };
    }
}

function timecodeOperations(tcp, tc) {
    var ms = tc.milis + tcp.milis;
    var s = tc.sec + tcp.sec;
    var m = tc.min + tcp.min;
    var h = tc.hour + tcp.hour;

    if (ms > 999) {
        ms = ms - 1000;
        s = s + 1;
    } else if (ms < 0) {
        s = s - 1;
        ms = ms + 1000; //ms en negatif
    }

    if (s > 59) {
        s = s - 60;
        m = m + 1;
    } else if (s < 0) {
        m = m - 1;
        s = s + 60; // s en negatif
    }

    if (m > 59) {
        m = m - 60;
        h = h + 1;
    } else if (m < 0) {
        h = h - 1;
        m = m + 60; // m est negatif
    }
    return {
        hour: h,
        min: m,
        sec: s,
        milis: ms
    };
}

function openFile(path) {
    var file = fs.readFileSync(path, {
        encoding: "utf8"
    });
    file = file.split('\r\n\r\n');
    var treatedFile = new Array();
    var k = 0;
    for (var i = 0; i < file.length; i++) {
        var replicaInfos = file[i].split('\r\n');
        if (file[i] == "\r\n" || file[i] == "") {
            console.log("bad");
        } else {
            treatedFile[k] = {
                rank: replicaInfos[0],
                timecode: parseTimecode(replicaInfos[1]),
            };
            treatedFile[k].replica = replicaInfos[2];
            for (var j = 3; j < replicaInfos.length; j++) {
                treatedFile[k].replica += "\r\n" + replicaInfos[j];
            }
            k++;
        }
    }
    return treatedFile;
}

function prettifyTimecode(tc) {
    if (tc.start == undefined) {
        var ms = tc.milis;
        var s = tc.sec;
        var m = tc.min;
        var h = tc.hour;
        if (h < 0 || m < 0 || s < 0 || ms < 0) {
            h = 0;
            m = 0;
            s = 0;
            ms = 0;
        }
        if (m < 10) {
            m = "0" + m;
        }
        if (h < 10) {
            h = "0" + h;
        }
        if (ms < 10) {
            ms = "00" + ms;
        } else if (ms < 100) {
            ms = "0" + ms;
        }
        if (s < 10) {
            s = "0" + s;
        }
        var result = h + ":" + m + ":" + s + "," + ms;
    } else {
        var ms = {
            start: tc.start.milis,
            end: tc.end.milis
        };
        var s = {
            start: tc.start.sec,
            end: tc.end.sec
        };
        var m = {
            start: tc.start.min,
            end: tc.end.min
        };
        var h = {
            start: tc.start.hour,
            end: tc.end.hour
        };
        if (h.start < 0 || m.start < 0 || s.start < 0 || ms.start < 0) {
            h.start = 0;
            m.start = 0;
            s.start = 0;
            ms.start = 0;
        }
        if (h.end < 0 || m.end < 0 || s.end < 0 || ms.end < 0) {
            h.end = 0;
            m.end = 0;
            s.end = 0;
            ms.end = 0;
        }
        if (m.start < 10) {
            m.start = "0" + m.start;
        }
        if (h.start < 10) {
            h.start = "0" + h.start;
        }
        if (ms.start < 10) {
            ms.start = "00" + ms.start;
        }
        if (ms.start < 100) {
            ms.start = "0" + ms.start;
        }
        if (s.start < 10) {
            s.start = "0" + s.start;
        }
        if (m.end < 10) {
            m.end = "0" + m.end;
        }
        if (h.end < 10) {
            h.end = "0" + h.end;
        }
        if (ms.end < 10) {
            ms.end = "00" + ms.end;
        }
        if (ms.end < 100) {
            ms.end = "0" + ms.end;
        }
        if (s.end < 10) {
            s.end = "0" + s.end;
        }
        var result = h.start + ":" + m.start + ":" + s.start + "," + ms.start + " --> " + h.end + ":" + m.end + ":" + s.end + "," + ms.end;
    }
    return result;
}
function saveFile(path, cb) {
    /*
    app.currentFile[x] = {
        rank: (int),
        replica: (string),
        timecode: {
            start:{
                hour: (int),
                min: (int),
                sec: (int),
                milis: (int)
            },
            end{
                hour: (int),
                min: (int),
                sec: (int),
                milis: (int)    
            }
        }
    }
    */
    fs.writeFileSync(path, "", {
        encoding: "utf8"
    });
    for (var i = 0; i < app.currentFile.length; i++) {
        var replica = app.currentFile[i].rank + "\r\n" + prettifyTimecode(app.currentFile[i].timecode) + "\r\n" + app.currentFile[i].replica + "\r\n\r\n";
        fs.appendFileSync(path, replica, {
            encoding: "utf8"
        });
    }
    return cb(true);
}
