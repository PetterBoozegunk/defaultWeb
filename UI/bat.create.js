/*jslint node: true, stupid: true */
"use strict";

var path = require("path"),
    fs = require("fs"),
    os = require("os"),

    userName = process.env.USERPROFILE.split(path.sep)[2],

    readFileOptions = {
        encoding: "utf-8"
    },
    settings = require("./bat.settings.js"),

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
        getBrowserCmdStr: function (browserName, openUrls, ieOpenUrl) {
            return (browserName === "iexplore.exe") ? bat.getBrowserCmdLine(browserName, openUrls) : bat.getBrowserCmdLine(browserName, ieOpenUrl);
        },
        getBrowserCmd: function (browserName) {
            var openUrls = settings.openUrls.join(" "),
                ieOpenUrl = settings.openUrls[settings.openUrlInIE || 0],
                cmdStr = bat.getBrowserCmdStr(browserName, openUrls, ieOpenUrl);

            return cmdStr;
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
            var fileStr = item.cd ? "C: " + os.EOL + os.EOL + "cd " + item.cd + bat.getFileStr(item) : bat.getFileStr(item),
                fullFileName = settings.projectName + "." + item.fileName + ".bat";

            process.chdir(userDir);
            bat.writeFile(fullFileName, fileStr, userDir);
        },
        createFiles: function () {
            settings.cmdFiles.forEach(bat.createFile);
        },
        init: function () {
            bat.setDir();

            bat.addBrowsersCmd();
            bat.addStartSlnCmd();
            bat.addAllCmd();

            bat.createFiles();
        }
    };

bat.init();
