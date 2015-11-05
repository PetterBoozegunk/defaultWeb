/*jslint node: true */
"use strict";

var readline = require("readline"),
    rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    }),

    path = require("path"),
    fs = require("fs"),
    os = require("os"),

    settings = {

        // Where do you want the bat file to be created
        drive: "u:/",

        // If you dont want the bat file in the drive root add a folder path here.
        folder: "",

        // This will be added to the filename before ".bat". 
        // ex: If you type "myProject" in the cmd and set suffix to ".gulp" the file will be called "myProject.gulp.bat"
        suffix: "",

        // This array will be the rows of text in the bat file.
        commandLines: [
            "cd ..",
            "start node server.js",
            "cd ui",
            "start gulp sync-watch",
            "gulp"
        ]
    },

    bat = {
        getFileStr: function () {
            var fileStr = "";

            settings.commandLines.forEach(function (task) {
                fileStr += os.EOL + os.EOL + task;
            });

            return fileStr;
        },
        setFileName: function (fileName) {
            return fileName.trim().replace(/\s+/g, ".");
        },
        writeFile: function (fullFileName, fileStr) {
            fs.writeFile(fullFileName, fileStr, function (error) {
                if (error) {
                    throw error;
                }

                console.log(settings.drive + settings.folder + fullFileName + " has been created");
            });
        },
        assemble: function (fileName) {
            var currentDir = path.resolve("."),
                fileStr = "C: " + os.EOL + os.EOL + "cd " + currentDir + bat.getFileStr(),
                fullFileName = bat.setFileName(fileName) + settings.suffix + ".bat";

            process.chdir(settings.drive + settings.folder);
            bat.writeFile(fullFileName, fileStr);

            rl.close();
        },
        init: function () {
            rl.question("Name your bat-file: ", bat.assemble);
        }
    };

bat.init();
