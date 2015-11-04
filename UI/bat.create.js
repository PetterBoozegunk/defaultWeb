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
        drive: "u:/",
        suffix: ".gulp",
        tasks: [
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

            settings.tasks.forEach(function (task) {
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

                console.log(settings.drive + fullFileName + " has been created");
            });
        },
        assemble: function (fileName) {
            var currentDir = path.resolve("\."),
                fileStr = "C: " + os.EOL + os.EOL + "cd " + currentDir + bat.getFileStr(),
                fullFileName = bat.setFileName(fileName) + settings.suffix + ".bat";

            process.chdir(settings.drive);
            bat.writeFile(fullFileName, fileStr);

            rl.close();
        },
        init: function () {
            rl.question("Name your bat-file: ", bat.assemble);
        }
    };

bat.init();
