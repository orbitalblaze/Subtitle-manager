(function($) {
    $(document).on('fileReady', function(event) {
        event.preventDefault();
        $("#body").fadeOut('fast', function() {
            $(".loader").css('display', 'block');
            $(".centered-message").fadeOut("fast", function() {
                $("#body .replicaList").html("");
                for (var i = 0; i < app.currentFile.length; i++) {
                    $("#body .replicaList").append('<div class="item"><div class="rank">' + app.currentFile[i].rank + '</div><p class="replica"><span>"' + app.currentFile[i].replica.replace("\r\n", " ↵ ") + '"</span></p><div class="timecode">' + prettifyTimecode(app.currentFile[i].timecode) + '</div></div>')
                }
                $("#workingGUI").fadeIn("fast", function() {
                    $(".loader").fadeOut("fast", function() {
                        $("#body").css('display', 'block');
                        $("#body").css('opacity', '1');
                    });
                });
            });
        });

    });

})(jQuery);

var work = {
    do: {
        timecodeModif: function(tcp) {
            for (var i = 0; i < app.currentFile.length; i++) {
                app.currentFile[i].timecode.start = timecodeOperations(tcp, app.currentFile[i].timecode.start);
                app.currentFile[i].timecode.end = timecodeOperations(tcp, app.currentFile[i].timecode.end);
            }
            jQuery("#body .replicaList").html("");
            for (var i = 0; i < app.currentFile.length; i++) {
                jQuery("#body .replicaList").append('<div class="item"><div class="rank">' + app.currentFile[i].rank + '</div> <div class="timecode">' + prettifyTimecode(app.currentFile[i].timecode) + '</div><div class="replica">"' + app.currentFile[i].replica + '"</div></div>')
            }
        },
        timeCodeCut: function(from, to) {

        }
    }
};
