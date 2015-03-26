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
                cbe(event);
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
            if ((getExtension(files[0].name) == "srt") || (getExtension(files[0].name) == "SRT" )) {
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
        $("#saveMenu").click(function(event) {
            event.preventDefault();
            app.gui.confirm("Voulez vous vraiment écraser le fichier d'origine ?", "Cliquez sur Ok pour accepter ou sur annuler pour abandonner l'action.", function(r){
                if(r){
                    
                }
            });
        });
        $("#openFileInput").change(function(event) {
            if ((getExtension($(this).val()) == "srt") || (getExtension($(this).val()) == "SRT")) {
                app.currentFile = openFile($(this).val());
                app.currentFilePath = $(this).val();
                $(document).trigger('fileReady');
                app.win.title("Subtitle Manager - " + app.currentFilePath);
            } else {
                app.gui.alert("Mauvaise extension", "Le fichier ne peut être ouvert par Subtitle Manager, il n'est pas au format .srt");
            }
        });
    })(jQuery);
