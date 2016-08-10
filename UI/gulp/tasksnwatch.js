/*global require */
/*jslint node: true, stupid: true */
"use strict";

var gulp = require("gulp"),

    config = require("./config.js"),
    fs = require("fs"),

    tasksnwatch = {
        returnArray: function (checkArray) {
            return (checkArray instanceof Array) ? checkArray : [];
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
        checkNull: function (item) {
            return (item === null) ? "null" : typeof item;
        },
        getObjectType: function (item) {
            var instanceOfArray = tasksnwatch.instanceOfArray,
                objectType = tasksnwatch.checkNull(item);

            instanceOfArray.forEach(function (instofObj) {
                objectType = tasksnwatch.checkType(item, instofObj, objectType);
            });

            return objectType;
        },
        setGulpTask: function (watchOrTask, name, funcArrayObj) {
            var itemType = tasksnwatch.getObjectType(funcArrayObj);

            if (itemType === "object") {
                gulp[watchOrTask](name, funcArrayObj.beforetask, funcArrayObj.task);
            } else {
                gulp[watchOrTask](name, funcArrayObj);
            }
        },
        setGulp: function (type, obj) {
            tasksnwatch.forEach(function (funcArrayObj, name) {
                // "funcArrayObj" === "function OR Array Or Object"
                tasksnwatch.setGulpTask(type, name, funcArrayObj);
            }, this, obj);
        },
        addDefaultTask: function (fileName) {
            var tasks = require("./tasks/" + fileName).tasks,
                currentDefaultTask = tasksnwatch.returnArray(tasks["default"]),
                defaultTask = tasksnwatch.returnArray(config.tasks["default"]);

            defaultTask = defaultTask.concat(currentDefaultTask);

            config.tasks["default"] = defaultTask;
        },
        addTaskType: function (type, name, typeObj) {
            var nameList = name.replace(/\s/g, "").split(",");

            nameList.forEach(function (item) {
                config[type][item] = typeObj[name];
            });
        },
        addTaskTypes: function (type, fileName) {
            // type is 'tasks' or 'watch'
            var typeObj = require("./tasks/" + fileName)[type] || {};

            Object.keys(typeObj).forEach(function (name) {
                if (name !== "default") {
                    tasksnwatch.addTaskType(type, name, typeObj);
                }
            });
        },
        setConfigBeforeTask: function (tasksObj, eqTaskName, taskName) {
            config.beforetasks[eqTaskName] = (config.beforetasks[eqTaskName] || []).concat(tasksObj[taskName]);

            delete tasksObj[taskName];
        },
        checkBeforetask: function (taskName) {
            var tasksObj = this,
                isBeforeTask = /^before\:/.test(taskName),
                eqTaskName = taskName.replace(/^before\:/, "");

            if (isBeforeTask) {
                tasksnwatch.setConfigBeforeTask(tasksObj, eqTaskName, taskName);
            }
        },
        addBeforeTasksToConfig: function (fileName) {
            var tasksObj = require("./tasks/" + fileName).tasks || {};

            Object.keys(tasksObj).forEach(tasksnwatch.checkBeforetask, tasksObj);
        },
        addTasksToConfig: function (fileName) {
            tasksnwatch.addTaskTypes("tasks", fileName);
            tasksnwatch.addDefaultTask(fileName);
        },
        addWatchToConfig: function (fileName) {
            tasksnwatch.addTaskTypes("watch", fileName);
        },
        addToConfig: function (files) {
            files.forEach(tasksnwatch.addBeforeTasksToConfig);
            files.forEach(tasksnwatch.addTasksToConfig);
            files.forEach(tasksnwatch.addWatchToConfig);
        },
        addWatch: function (watchObj) {
            if (!config.tasks.watch) {
                config.tasks.watch = function () {
                    tasksnwatch.setGulp("watch", watchObj);
                };
            }
        },
        addToNamedArray: function (taskName) {
            // tasks that end with ":all" will not be added.
            var isCollectionTask = /(\:all)$/.test(taskName),
                // tasks without ":" in the name will not be added.
                addToNamedArray = /\:/.test(taskName);

            return (!isCollectionTask && addToNamedArray);
        },
        getCollectionArray: function (taskCollectionName) {
            var collectionArray = tasksnwatch.returnArray(config.tasks[taskCollectionName]);

            if (!config.tasks[taskCollectionName]) {
                config.tasks[taskCollectionName] = collectionArray;
            }

            return collectionArray;
        },
        setNamedTaskArray: function (taskName) {
            var splitTaskName = taskName.split(":"),
                taskCollectionName = splitTaskName[splitTaskName.length - 1],
                collectionArray = tasksnwatch.getCollectionArray(taskCollectionName);

            collectionArray.push(taskName);
        },
        getNamedTaskArrays: function () {
            var tasks = config.tasks;

            Object.keys(tasks).forEach(function (taskName) {
                if (tasksnwatch.addToNamedArray(taskName)) {
                    tasksnwatch.setNamedTaskArray(taskName);
                }
            });
        },
        setBeforeTaskType: function (task) {
            return (task instanceof Array) ? function () {
                gulp.start(task);
            } : task;
        },
        setBeforeTask: function (taskName, beforetasksArray, task) {
            config.tasks[taskName] = {
                beforetask: beforetasksArray,
                task: tasksnwatch.setBeforeTaskType(task)
            };
        },
        setBeforeTasks: function () {
            Object.keys(config.beforetasks).forEach(function (taskName) {
                var beforeTasksArray = config.beforetasks[taskName],
                    task = config.tasks[taskName];

                tasksnwatch.setBeforeTask(taskName, beforeTasksArray, task);
            });
        },
        init: function () {
            var files = fs.readdirSync("./gulp/tasks");

            tasksnwatch.addToConfig(files);
            tasksnwatch.getNamedTaskArrays();
            tasksnwatch.setBeforeTasks();
            tasksnwatch.addWatch(config.watch);
            tasksnwatch.setGulp("task", config.tasks);
        }
    };

module.exports = tasksnwatch;
