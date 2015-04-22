var gui = require('nw.gui'),
    fs = require('fs'); //or global.window.nwDispatcher.requireNwGui() (see https://github.com/rogerwang/node-webkit/issues/707)
// Get the current window
var win = gui.Window.get();
gui.App.setCrashDumpDir("./");
if (localStorage.getItem("isMaximized") == "true") {
    win.maximize();
    jQuery(".maximize").css('background-image', 'url(data/images/maximize.svg)');
} else if (localStorage.getItem("isMaximized") == "false") {
    win.unmaximize();
    jQuery(".maximize").css('background-image', 'url(data/images/unmaximize.svg)');
} else {
    localStorage.setItem("isMaximized", false)
    win.unmaximize();
}
var app = {
    gui: {
        alert: function(title, message) {
            $(".alert h1").text(title);
            $(".alert .message").text(message);
            $("#pushwindow").css('display', 'block');
            $("#pushwindow .alert").css('display', 'block');
        },
        confirm: function(question, message, cbe) {
            $(".confirm h1").text(question);
            $(".confirm .message").text(message);
            $("#pushwindow").css('display', 'block');
            $("#pushwindow .confirm").css('display', 'block');
            var result = null;
            $(document).on('confirmAccept', function(event) {
                event.preventDefault();
                cbe(true);
            });
            $(document).on('confirmAbort', function(event) {
                event.preventDefault();
                cbe(false);
            });
        }
    },
    win: {
        title: function(title) {
            win.title = title;
            jQuery(".header span").text(title);
        }
    },
    currentFile: false,
    currentFilePath: false,
    savePath: false
};
$("#pushwindow .alert .button").click(function(event) {
    $("#pushwindow").css('display', 'none');
    $("#pushwindow .alert").css('display', 'none');
});
$("#pushwindow .confirm .button.abort").click(function(event) {
    $("#pushwindow").css('display', 'none');
    $("#pushwindow .confirm").css('display', 'none');
    $(document).trigger('confirmAbort');
});
$("#pushwindow .confirm .button.ok").click(function(event) {
    $("#pushwindow").css('display', 'none');
    $("#pushwindow .confirm").css('display', 'none');
    $(document).trigger('confirmAccept');
});
$("#timecodeChanger").change(function(event) {
    //se déclenche lorsque c'est le bon décalage
    var neg = $(this).val().search("-");
    $(this).val().replace("-", "");
    var value = $(this).val().split(".");
    if (value[1] == undefined) {
        value[1] = 0;
    }
    value[0] = parseInt(value[0]);
    value[1] = parseInt(value[1]);
    if (neg != -1) {
        if (value[1] < 10) {
            neg = -100;
        } else {
            neg = -10;
        }
    } else {
        if (value[1] < 10) {
            neg = 100;
        } else {
            neg = 10;
        }
    }
    console.log(value[0] + "," + value[1]);
    $(document).trigger('pitchTimecode', {
        hour: 0,
        min: 0,
        sec: value[0],
        milis: neg * value[1]
    });
    $(".bubbleValue").fadeOut("fast");
    $("#timecodeChanger").val(0);
});
$("#timecodeChanger").on('input', function(event) {
    event.preventDefault();
    $(".bubbleValue").fadeIn("fast");
    //se déclenche lorsque l'utilisateur bouge le selecteur
    $(".bubbleValue").text($("#timecodeChanger").val() + "s");
});
$("#timecodeChangerms").on('input', function(event) {
    event.preventDefault();
    $(".bubbleValue").fadeIn("fast");
    //se déclenche lorsque l'utilisateur bouge le selecteur
    $(".bubbleValue").text($("#timecodeChanger").val() + " s");
});
$("#timecodeChangerms").change(function(event) {
    //se déclenche lorsque c'est le bon décalage
    var neg = $(this).val().search("-");
    $(this).val().replace("-", "");
    var value = $(this).val().split(".");
    if (value[1] == undefined) {
        value[1] = 0;
    }
    value[0] = parseInt(value[0]);
    value[1] = parseInt(value[1]);
    if (neg != -1) {
        if (value[1] < 100 && value[1] > 9) {
            neg = -10;
        } else {
            neg = -1;
        }
    } else {
        if (value[1] < 100 && value[1] > 9) {
            neg = 10;
        } else {
            neg = 1;
        }
    }
    console.log(value[0] + "," + value[1]);
    $(document).trigger('pitchTimecode', {
        hour: 0,
        min: 0,
        sec: value[0],
        milis: neg * value[1]
    });
    $(".bubbleValue").fadeOut("fast");
    $("#timecodeChangerms").val(0);
});
$("#timecodeChangerms").on('input', function(event) {
    event.preventDefault();
    $(".bubbleValue").fadeIn("fast");
    //se déclenche lorsque l'utilisateur bouge le selecteur
    $(".bubbleValue").text($("#timecodeChangerms").val() + " s");
});
$("#timecodeChangerm").on('input', function(event) {
    event.preventDefault();
    $(".bubbleValue").fadeIn("fast");
    //se déclenche lorsque l'utilisateur bouge le selecteur
    $(".bubbleValue").text($("#timecodeChanger").val() + " s");
});
$("#timecodeChangerm").change(function(event) {
    //se déclenche lorsque c'est le bon décalage
    var neg = $(this).val().search("-");
    $(this).val().replace("-", "");
    var value = $(this).val().split(".");
    if (value[1] == undefined) {
        value[1] = 0;
    }
    value[0] = parseInt(value[0]);
    value[1] = parseInt(value[1]);
    if (neg != -1) {
            neg = -100;
      
    } else {
            neg = 100;
    }
    console.log(value[0] + "," + value[1]);
    $(document).trigger('pitchTimecode', {
        hour: 0,
        min: 0,
        sec: value[0],
        milis: neg * value[1]
    });
    $(".bubbleValue").fadeOut("fast");
    $("#timecodeChangerm").val(0);
});
$("#timecodeChangerm").on('input', function(event) {
    event.preventDefault();
    $(".bubbleValue").fadeIn("fast");
    //se déclenche lorsque l'utilisateur bouge le selecteur
    $(".bubbleValue").text($("#timecodeChangerm").val() + " s");
});

function getExtension(filename) {
    var parts = filename.split(".");
    return (parts[(parts.length - 1)]);
}
(function($) {
    $(document).ready(function() {
        $("html").css('background', 'rgba(0,0,0,0)', function() {
            win.setTransparent(!win.isTransparent);
        });
    });
    $(".maximize").click(function() {
        if (localStorage.getItem("isMaximized") == "true") {
            win.unmaximize();
            $(".maximize").css('background-image', 'url(data/images/maximize.svg)');
        } else {
            win.maximize();
            $(".maximize").css('background-image', 'url(data/images/unmaximize.svg)');
        }
    });
    win.on('maximize', function() {
        localStorage.setItem("isMaximized", true);
        $(".maximize").css('background-image', 'url(data/images/unmaximize.svg)');
    });
    win.on('unmaximize', function() {
        localStorage.setItem("isMaximized", false);
        $(".maximize").css('background-image', 'url(data/images/maximize.svg)');
    });
    $(".minimize").click(function() {
        win.minimize();
    });
    $(".close").click(function() {
        win.close(true);
    });
    $(".dev").click(function() {
        win.showDevTools();
    });
    $(".reload").click(function() {
        win.reload();
    });
    $(document).on('dragenter', function(event) {
        event.preventDefault();
        if (app.currentFile == false) {
            $("#freeze").css('display', 'block');
        }
    });
    $(document).on('dragover', function(event) {
        event.stopPropagation();
        event.preventDefault();
        if (app.currentFile == false) {
            $(".filedragover").fadeIn("fast");
        }
    });
    $(document).on('dragend', function(event) {
        event.preventDefault();
        $(".filedragover").fadeOut("fast");
        $("#freeze").css('display', 'none');
    });
    $(document).on('dragleave', function(event) {
        event.preventDefault();
        $(".filedragover").fadeOut("fast");
        win.focus();
    });
    $(document).on('drop', function(event) {
        event.preventDefault();
        $(".filedragover").fadeOut("fast");
        $("#freeze").css('display', 'none');
        var files = event.originalEvent.dataTransfer.files;
        if ((getExtension(files[0].name) == "srt") || (getExtension(files[0].name) == "SRT")) {
            app.currentFile = openFile(files[0].path);
            app.currentFilePath = files[0].path;
            $(document).trigger('fileReady');
            app.win.title("Subtitle Manager - " + app.currentFilePath);
        } else {
            app.gui.alert("Mauvaise extension", "Le fichier ne peut être ouvert par Subtitle Manager, il n'est pas au format .srt");
        }
    });
    $("#openMenu").click(function(event) {
        event.preventDefault();
        $("#openFileInput").click();
    });
    $("#saveasMenu").click(function(event) {
        event.preventDefault();
        if (app.currentFilePath != false) {
            $("#saveFileInput").click();
        }
    });
    $("#saveMenu").click(function(event) {
        event.preventDefault();
        if (app.currentFilePath != false) {
            if (app.savePath == false) {
                $("#saveFileInput").click();
            } else {
                app.gui.confirm("Voulez vous vraiment écraser le fichier actuel ?", "Cliquez sur Ok pour accepter ou sur annuler pour abandonner l'action.", function(r) {
                    if (r == true) {
                        saveFile(app.savePath, function() {
                            app.gui.alert("Enregistrement terminé", "");
                        });
                    }
                });
            }
        }
    });
    $("#saveFileInput").change(function(event) {
        app.currentFilePath = $(this).val();
        app.savePath = $(this).val();
        app.win.title("Subtitle Manager - " + app.currentFilePath);
        saveFile(app.savePath, function() {
            app.gui.alert("Enregistrement terminé", "");
        });
    });
    $("#openFileInput").change(function(event) {
        if ((getExtension($(this).val()) == "srt") || (getExtension($(this).val()) == "SRT")) {
            app.currentFile = openFile($(this).val());
            app.currentFilePath = $(this).val();
            $(document).trigger('fileReady');
            app.win.title("Subtitle Manager - " + app.currentFilePath);
        } else if ($(this).val() == "") {
            return;
        } else {
            app.gui.alert("Mauvaise extension", "Le fichier ne peut être ouvert par Subtitle Manager, il n'est pas au format .srt");
        }
    });
})(jQuery);