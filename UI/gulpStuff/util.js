/*global require */
/*jslint node: true */
"use strict";

var gulp = require("gulp"),
    plugins = require("gulp-load-plugins")(),

    settings = require("./settings.js"),

    util = {
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
        prettify: function (src, dest) {
            return gulp.src(src)
                .pipe(plugins.plumber())
                .pipe(plugins.jsbeautifier(settings.js.jsLint))
                .pipe(gulp.dest(dest));
        },
        setCurrentWatchTask: function (currentSrcName) {
            var forEachThis = this;

            forEachThis.watchObj[currentSrcName.replace(/\[srcDest\]/, settings.srcDest)] = [forEachThis.currentWatchObjName];
        },
        setCurrentWatchArray: function (currentWatchObjName) {
            var forEachThis = this,
                watchSrcArray = forEachThis.currentWatchObj[currentWatchObjName];

            forEachThis.currentWatchObjName = currentWatchObjName;

            watchSrcArray.forEach(util.setCurrentWatchTask, forEachThis);
        },
        getCurrentWatchArray: function (currentWatchObj) {
            var watchObj = this,
                forEachThis = {
                    "watchObj": watchObj,
                    "currentWatchObj": currentWatchObj
                };

            Object.keys(currentWatchObj).forEach(util.setCurrentWatchArray, forEachThis);
        },
        checkWatchArray: function (name) {
            var watchObj = this,
                currentSettingsObj = settings[name],
                watchArray = currentSettingsObj.watch;

            if (watchArray) {
                watchArray.forEach(util.getCurrentWatchArray, watchObj);
            }
        },
        getWatch: function () {
            var watchObj = {};

            Object.keys(settings).forEach(util.checkWatchArray, watchObj);

            return watchObj;
        }
    };

module.exports = util;
