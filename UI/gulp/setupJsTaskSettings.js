/*global require */
/*jslint node: true */
"use strict";

var defaultProperties = {},
    settings = {},

    setupJsTaskSettings = {
        copyProperties: function (fromObj, toObj) {
            Object.keys(fromObj).forEach(function (propName) {
                toObj[propName] = fromObj[propName];
            });

            return toObj;
        },
        setCustomOptions: function (customSettings) {
            var defaultObj = setupJsTaskSettings.copyProperties(defaultProperties, {}),
                obj = setupJsTaskSettings.copyProperties(customSettings, defaultObj);

            return obj;
        },
        setDirArray: function (srcArray) {
            srcArray.forEach(function (obj, index) {
                var srcObj = setupJsTaskSettings.setCustomOptions(obj);

                srcArray[index] = srcObj;
            });

            return srcArray;
        },
        getDirArray: function () {
            var srcArray = settings.src;

            return setupJsTaskSettings.setDirArray(srcArray);
        },
        getFilePaths: function (obj) {
            var filePaths = [];

            obj.files.forEach(function (name) {
                filePaths.push(obj.dir + name);
            });

            return filePaths;
        },
        addToArrayMethods: {
            prettify: function (propName, obj) {
                var filePaths = setupJsTaskSettings.getFilePaths(obj);

                settings[propName].push({
                    files: filePaths,
                    dest: obj.dir.replace(/\/$/, "")
                });
            },
            "default": function (propName, obj) {
                var filePaths = setupJsTaskSettings.getFilePaths(obj);

                filePaths.forEach(function (filePath) {
                    settings[propName].push(filePath);
                });
            }
        },
        setAddMethod: function (propName, obj) {
            var addMethod = setupJsTaskSettings.addToArrayMethods[propName] || setupJsTaskSettings.addToArrayMethods["default"];

            addMethod(propName, obj);
        },
        addToJsSrcArray: function (obj) {
            Object.keys(obj).forEach(function (propName) {
                if (obj[propName] === true) {
                    setupJsTaskSettings.setAddMethod(propName, obj);
                }
            });
        },
        addToJsSrcArrays: function (dirArray) {
            dirArray.forEach(setupJsTaskSettings.addToJsSrcArray);
        },
        init: function (sets, defaultProps) {
            var dirArray;

            defaultProperties = defaultProps;
            settings = sets;

            dirArray = setupJsTaskSettings.getDirArray();

            setupJsTaskSettings.addToJsSrcArrays(dirArray);
        }
    };

module.exports = setupJsTaskSettings;