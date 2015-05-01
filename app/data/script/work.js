(function($) {
    $(document).on('fileReady', function(event) {
        event.preventDefault();
        $("#body").fadeOut('fast', function() {
            $(".loader").css('display', 'block');
            $(".centered-message").fadeOut("fast", function() {
                $("#body .replicaList").html("");
                for (var i = 0; i < app.currentFile.length; i++) {
                    $("#body .replicaList").append('<div class="item" id="' + app.currentFile[i].rank + '"><div class="rank"><span class="number">' + app.currentFile[i].rank + '</span><span class="checkbox"><img src="data/images/checkbox.svg"></span></div><p class="replica"><span>"' + app.currentFile[i].replica.replace("\r\n", " ↵ ") + '"</span></p><div class="timecode">' + prettifyTimecode(app.currentFile[i].timecode) + '</div></div>')
                }
                $(document).trigger("selectSys");
                $("#workingGUI").fadeIn("fast", function() {
                    $(".loader").fadeOut("fast", function() {
                        $("#body").css('display', 'block');
                        $("#body").css('opacity', '1');
                    });
                });
            });
        });
    });
    $(document).on('pitchTimecode', function(event, tcp) {
        var replicas = [];
        if (app.isSelectedReplica == 0) {
            for (var i = 0; i < app.currentFile.length; i++) {
                app.currentFile[i].timecode.start = timecodeOperations(tcp, app.currentFile[i].timecode.start);
                app.currentFile[i].timecode.end = timecodeOperations(tcp, app.currentFile[i].timecode.end);
            }
            for (var i = 1; i <= app.currentFile.length; i++) {
                $("#" + i + " .timecode").text(prettifyTimecode(app.currentFile[i - 1].timecode));
            }
        }
        if (app.isSelectedReplica > 0) {
            for (var i = 0; i < app.currentFile.length; i++) {
                if (app.currentFile[i].selected == true) {
                    app.currentFile[i].timecode.start = timecodeOperations(tcp, app.currentFile[i].timecode.start);
                    app.currentFile[i].timecode.end = timecodeOperations(tcp, app.currentFile[i].timecode.end);
                    replicas.push(app.currentFile[i].rank);
                }
            }
            for (var i = replicas.length - 1; i >= 0; i--) {
                console.log(replicas[i]);
                $("#" + replicas[i] + " .timecode").text(prettifyTimecode(app.currentFile[replicas[i] - 1].timecode));
            }
        }
    });
    
})(jQuery);
var work = {
    do :{
        timecodeModif: function(tcp) {},
        timeCodeCut: function(from, to) {}
    }
};