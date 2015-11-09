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

    defaultSettings = {
        // A string or an array of strings that sets where the created .bat file(s) should end up.
        path: ["c:/"],

        // This will be added to the filename before ".bat". 
        // ex: If you type "myProject" in the cmd and set suffix to ".gulp" the file will be called "myProject.gulp.bat"
        suffix: ".gulp",

        // This array will be the rows of text in the bat file.
        commandLines: [
            "start gulp watch",
            "gulp"
        ]
    },

    readFileOptions = {
        encoding: "utf-8"
    },
    settings = (function () {
        fs.readFile("./bat.settings.json", readFileOptions, function (error, data) {
            var settingsObj = error ? defaultSettings : JSON.parse(data);

            settings = settingsObj;
        });
    }()),

    bat = {
        getPaths: function () {
            var paths = settings.path;

            if (!(paths instanceof Array)) {
                paths = [paths];
            }

            settings.path = paths;

            return settings.path;
        },
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
        handleError: function (error) {
            if (error) {
                throw error;
            }
        },
        checkPaths: function () {
            var paths = bat.getPaths();

            if (paths.length) {
                bat.writeFiles(bat.fileName);
            } else {
                rl.close();
            }
        },
        writeFile: function (fullFileName, fileStr, dirPath) {
            fs.writeFile(fullFileName, fileStr, function (error) {
                bat.handleError(error);

                bat.checkPaths();
                console.log(dirPath + fullFileName + " has been created");
            });
        },
        assemble: function (dirPath) {
            var currentDir = bat.destDir || path.resolve("."),
                fileStr = "C: " + os.EOL + os.EOL + "cd " + currentDir + bat.getFileStr(),
                fullFileName = bat.setFileName(bat.fileName) + settings.suffix + ".bat";

            bat.destDir = currentDir;

            process.chdir(dirPath);
            bat.writeFile(fullFileName, fileStr, dirPath);
        },
        writeFiles: function (fileName) {
            var paths = bat.getPaths(),
                firstpath = paths.shift(0);

            bat.fileName = fileName;

            bat.assemble(firstpath);
        },
        init: function () {
            rl.question("Name your bat-file: ", bat.writeFiles);
        }
    };

bat.init();
