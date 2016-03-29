/*jslint node: true, stupid: true */
"use strict";

var path = require("path"),
    fs = require("fs"),
    os = require("os"),

    readline = require("readline"),

    rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    }),

    userName = process.env.USERPROFILE.split(path.sep)[2],

    readFileOptions = {
        encoding: "utf-8"
    },
    settings = require("./bat.settings.json"),

    util = {
        getParentDir: function (dir) {
            var dirArray = dir.split("\\"),
                parentDir = [];

            dirArray.pop();

            parentDir = dirArray.join("\\");

            return parentDir;
        },
        getFileArray: function (dir) {
            return dir ? fs.readdirSync(dir) : [];
        },
        checkForFileType: function (fileArray, fileType) {
            var re = new RegExp("\\." + fileType + "(,|$)", "ig");

            return fileArray.length ? fileArray.join().match(re) : null;
        },
        checkParentDir: function (dir, parentDir, fileType, containsFileType) {
            return containsFileType ? dir : util.dirContainsFileOfType(parentDir, fileType);
        },
        checkHasFile: function (dir, parentDir, fileType, containsFileType) {
            return dir ? util.checkParentDir(dir, parentDir, fileType, containsFileType) : "";
        },
        dirContainsFileOfType: function (dir, fileType) {
            var fileArray = util.getFileArray(dir),
                containsFileType = util.checkForFileType(fileArray, fileType),

                parentDir = util.getParentDir(dir),

                slnDir = util.checkHasFile(dir, parentDir, fileType, containsFileType);

            return slnDir;
        },
        getSlnDir: function (dir) {
            var slnDir = util.dirContainsFileOfType(dir, "sln");

            return slnDir;
        },
        isSlnFile: function (fileName) {
            var slnFile = "";

            if (/\.sln$/i.test(fileName)) {
                slnFile = fileName;
            }

            return slnFile;
        },
        getSlnFileName: function (dir) {
            var fileArray = dir ? fs.readdirSync(dir) : [],
                slnFileName = "";

            fileArray.forEach(function (fileName) {
                slnFileName = (!slnFileName) ? util.isSlnFile(fileName) : slnFileName;
            });

            return slnFileName;
        }
    },

    currentDir = path.resolve("."),
    userDir = "C:\\Users\\" + userName,
    slnDir = util.getSlnDir(currentDir),
    slnFileName = util.getSlnFileName(slnDir),

    bat = {
        setDir: function () {
            settings.cmdFiles.forEach(function (item) {
                item.cd = currentDir;
            });
        },
        getBrowserCmdLine: function (browserName, openUrls) {
            return "start " + browserName + " " + openUrls;
        },
        getIeCmdLines: function (openUrls) {
            var ieLines = openUrls.replace(/(^|\s)/g, os.EOL + "start /d \"\" iexplore.exe ");

            return ieLines.trim();
        },
        getBrowserCmdStr: function (browserName, openUrls) {
            return (browserName === "iexplore.exe") ? bat.getIeCmdLines(openUrls) : bat.getBrowserCmdLine(browserName, openUrls);
        },
        getBrowserCmd: function (browserName) {
            var openUrls = settings.openUrls.join(" "),
                ieOpenUrl = settings.openUrls[settings.openUrlInIE || 0],
                cmdStr = bat.getBrowserCmdStr(browserName, openUrls, ieOpenUrl);

            return cmdStr;
        },
        addDirectoryCmd: function () {
            settings.cmdFiles.push({
                "fileName": "directory",
                "commandLines": [
                    "explorer " + currentDir,
                    "exit"
                ]
            });
        },
        addBrowserCmd: function (browsersCmd) {
            settings.cmdFiles.push({
                "fileName": "startBrowsers",
                "commandLines": browsersCmd
            });
        },
        addBrowsersCmd: function () {
            var browsersCmd = [];

            settings.startBrowsers.forEach(function (browserName) {
                browsersCmd.push(bat.getBrowserCmd(browserName));
            });

            browsersCmd.push("exit");
            bat.addBrowserCmd(browsersCmd);
        },
        addStartSlnCmd: function () {
            if (slnDir && slnFileName) {
                settings.cmdFiles.push({
                    "fileName": "startSln",
                    "commandLines": [
                        "start " + slnDir + "\\" + slnFileName, "exit"
                    ]
                });
            }
        },
        getAllCmds: function () {
            var allCmds = [];

            settings.cmdFiles.forEach(function (item) {
                allCmds.push("start " + settings.projectName + "." + item.fileName + ".bat");
            });

            allCmds.push("exit");

            return allCmds;
        },
        addAllCmd: function () {
            var allCmds = bat.getAllCmds();

            settings.cmdFiles.push({
                "fileName": "all",
                "commandLines": allCmds
            });
        },
        getFileStr: function (item) {
            var fileStr = "";

            item.commandLines.forEach(function (task) {
                fileStr += os.EOL + os.EOL + task;
            });

            return fileStr;
        },
        handleError: function (error) {
            if (error) {
                throw error;
            }
        },
        writeFile: function (fullFileName, fileStr, dirPath) {
            fs.writeFile(fullFileName, fileStr, function (error) {
                bat.handleError(error);

                console.log(dirPath + "\\" + fullFileName + " has been created");
            });
        },
        createFile: function (item) {
            var fileStr = item.cd ? "cd " + item.cd + bat.getFileStr(item) : bat.getFileStr(item),
                fullFileName = settings.projectName + "." + item.fileName + ".bat";

            process.chdir(userDir);
            bat.writeFile(fullFileName, fileStr.trim(), userDir);
        },
        createFiles: function () {
            settings.cmdFiles.forEach(bat.createFile);
        },
        automaticBats: {
            bats: ["Browsers", "StartSln", "Directory", "All"],
            set: function () {
                bat.automaticBats.bats.forEach(function (name) {
                    bat["add" + name + "Cmd"]();
                });
            }
        },
        writeFiles: function () {
            bat.automaticBats.set();

            bat.createFiles();

            rl.close();
        },
        getProjectNameFromUser: function () {
            rl.question("Enter the projects name (the bat files name will start with this): ", function (answer) {
                settings.projectName = answer;

                bat.writeFiles();

                console.log(" \nThe project name is:", answer, "\n ");
            });
        },
        getProjectNameFromProject: function (projectName) {
            settings.projectName = projectName.toString().toLowerCase().replace(/\.sln$/, "");
            bat.writeFiles();
        },
        checkProjectName: function () {
            return slnFileName || settings.projectName;
        },
        setProjectName: function () {
            var projectName = bat.checkProjectName();

            if (!projectName) {
                bat.getProjectNameFromUser();
            } else {
                bat.getProjectNameFromProject(projectName);
            }
        },
        init: function () {
            bat.setDir();
            bat.setProjectName();
        }
    };

bat.init();