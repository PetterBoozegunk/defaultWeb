/*global require */
/*jslint node: true, stupid: true */
"use strict";

var gulp = require("gulp"),

    config = require("./config.js"),
    fs = require("fs"),

    util = {
        returnArray: function (checkArray) {
            var returnArray = (checkArray instanceof Array) ? checkArray : [];

            return returnArray;
        },
        forEach: function (func, that, obj) {
            Object.keys(obj).forEach(function (key) {
                func.call(that, obj[key], key, obj);
            });
        },
        instanceOfArray: [{
            name: "date",
            instof: Date
        }, {
            name: "array",
            instof: Array
        }, {
            name: "regexp",
            instof: RegExp
        }],
        checkType: function (item, instofObj, objectType) {
            if (item instanceof instofObj.instof) {
                objectType = instofObj.name;
            }

            return objectType;
        },
        getObjectType: function (item) {
            var instanceOfArray = util.instanceOfArray,
                objectType;

            instanceOfArray.forEach(function (instofObj) {
                objectType = util.checkType(item, instofObj, objectType);
            });

            return objectType;
        },
        getTrueType: function (item) {
            var objectType = util.getObjectType(item);

            return objectType || typeof item;
        },
        setGulpTask: function (watchOrTask, name, funcArrayObj) {
            var itemType = util.getTrueType(funcArrayObj);

            if (itemType === "object") {
                gulp[watchOrTask](name, funcArrayObj.beforetask, funcArrayObj.task);
            } else {
                gulp[watchOrTask](name, funcArrayObj);
            }
        },
        setGulp: function (type, obj) {
            util.forEach(function (funcArrayObj, name) {
                // "funcArrayObj" === "function OR Array Or Object"
                util.setGulpTask(type, name, funcArrayObj);
            }, this, obj);
        },

        addDefaultTask: function (fileName) {
            var tasks = require("./tasks/" + fileName).tasks,
                currentDefaultTask = util.returnArray(tasks["default"]),
                defaultTask = util.returnArray(config.tasks["default"]);

            defaultTask = defaultTask.concat(currentDefaultTask);

            config.tasks["default"] = defaultTask;
        },
        addTaskType: function (type, fileName) {
            // type is 'tasks' or 'watch'
            var typeObj = require("./tasks/" + fileName)[type] || {};

            Object.keys(typeObj).forEach(function (name) {
                if (name !== "default") {
                    config[type][name] = typeObj[name];
                }
            });
        },
        addTasksToConfig: function (fileName) {
            util.addTaskType("tasks", fileName);
            util.addDefaultTask(fileName);
        },
        addWatchToConfig: function (fileName) {
            util.addTaskType("watch", fileName);
        },
        addToConfig: function (files) {
            files.forEach(util.addTasksToConfig);
            files.forEach(util.addWatchToConfig);
        },

        addWatch: function (watchObj) {
            config.tasks.watch = function () {
                util.setGulp("watch", watchObj);
            };
        },

        init: function () {
            var files = fs.readdirSync("./gulp/tasks");

            util.addToConfig(files);

            util.addWatch(config.watch);
            util.setGulp("task", config.tasks);
        }
    };

module.exports = util;
