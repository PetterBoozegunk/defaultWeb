/*global require */
/*jslint node: true */
"use strict";

var gulp = require("gulp"),

    plugins = require("gulp-load-plugins")(),

    browserSync = require("browser-sync").create(),
    reload = browserSync.reload,

    lessPluginGlob = require("less-plugin-glob"),

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
        }
    },

    gulpSettings = {

        srcDest: "dist",
        cssDest: "/css",
        jsDest: "/js",

        less: {
            src: ["less/styles.less"],
            options: {
                "plugins": [lessPluginGlob]
            },
            oldIeSrc: ["less/oldIe/*.less"],
            oldIeFileName: "oldIe.less"
        },
        js: {
            fileName: "scripts.js",
            src: ["js/lib/*.js", "js/plugins/*.js", "js/*.js", "js/tests/*js"],

            oldIeFileName: "oldIe.js",
            oldIeSrc: ["js/oldIe/*.js"]
        },

        comments: {
            all: true
        },
        please: {
            "browsers": ["last 4 versions"],
            "minifier": false,
            "pseudoElements": true,
            "filters": {
                "oldIE": true
            }
        },
        iconFont: {
            name: "icon",
            src: ["fonts/svg/*.svg"],
            lesstemplate: "fonts/templates/icon.less",
            lessdest: "fonts/",
            fontdest: "less/fonts/",
            dir: "/UI/fonts/",
            className: "icon"
        },
        browserReload: {
            stream: true
        },

        watch: {
            "js/lib/**.js": ["scripts:dev"],
            "js/plugins/**.js": ["scripts:dev"],
            "js/**.js": ["scripts:dev"],
            "js/oldIe/**.js": ["scripts:ie:dev"],

            "less/**": ["less:dev"],
            "less/oldIe/**": ["less:ie:dev"],

            "dist/**/*.js": ["file-watch"],
            "dist/**/*.css": ["file-watch"],

            "../Views/**/*.cshtml": ["file-watch"],
            "../Views/**/**/*.cshtml": ["file-watch"]
        },

        tasks: {
            "watch": function () {
                util.setGulp("watch", gulpSettings.watch);
            },
            "file-watch": function () {
                //setTimeout(browserSync.reload, 500);
                console.log("file-watch");
            },
            "browser-sync": function () {
                //browserSync.init({
                //    proxy: "http://defaultweb.local:666"
                //});
                console.log("browser-sync");
            },

            "clean": function () {
                return gulp.src(gulpSettings.srcDest)
                    .pipe(plugins.clean());
            },

            "images": function () {
                return gulp.src("images/**")
                    .pipe(plugins.plumber())
                    .pipe(plugins.imagemin())
                    .pipe(gulp.dest("images/"));
            },
            "iconFont": function () {
                gulp.src(gulpSettings.iconFont.src)
                    .pipe(plugins.plumber())
                    .pipe(plugins.iconfont({
                        fontName: gulpSettings.iconFont.name
                    }))
                    .on("codepoints", function (codepoints) {
                        gulp.src(gulpSettings.iconFont.lesstemplate)
                            .pipe(plugins.plumber())
                            .pipe(plugins.consolidate("lodash", {
                                glyphs: codepoints,
                                fontName: gulpSettings.iconFont.name,
                                fontPath: gulpSettings.iconFont.dir,
                                className: gulpSettings.iconFont.className
                            }))
                            .pipe(gulp.dest(gulpSettings.iconFont.fontdest));
                    })
                    .pipe(gulp.dest(gulpSettings.iconFont.lessdest));
            },
            "prettify": function () {
                return gulp.src(["js/*.js"])
                    .pipe(plugins.plumber())
                    .pipe(plugins.jsbeautifier({
                        js: {
                            jslintHappy: true
                        }
                    }))
                    .pipe(gulp.dest("js"));
            },
            "prettifyGulpFile": function () {
                return gulp.src(["gulpfile.js"])
                    .pipe(plugins.plumber())
                    .pipe(plugins.jsbeautifier({
                        js: {
                            jslintHappy: true
                        }
                    }))
                    .pipe(gulp.dest("."));
            },

            "complexity": function () {
                return gulp.src(["js/*.js", "gulpfile.js"])
                    .pipe(plugins.plumber())
                    .pipe(plugins.complexity());
            },
            "platoReport": function () {
                return gulp.src(["js/*.js", "js/plugins/*", "gulpfile.js"])
                    .pipe(plugins.plumber())
                    .pipe(plugins.plato("report"))
                    .pipe(reload(gulpSettings.browserReload));
            },

            "jslint": {
                beforetask: ["prettify", "prettifyGulpFile"],
                task: function () {
                    return gulp.src(["!js/lib", "js/*.js", "js/tests/*.js", "gulpfile.js"])
                        .pipe(plugins.plumber())
                        .pipe(plugins.jslint());
                }
            },

            "less:prod": function () {
                return gulp.src(gulpSettings.less.src)
                    .pipe(plugins.less(gulpSettings.less.options))
                    .pipe(plugins.pleeease(gulpSettings.please))
                    .pipe(plugins.minifyCss())
                    .pipe(plugins.stripCssComments(gulpSettings.comments))
                    .pipe(gulp.dest(gulpSettings.srcDest + gulpSettings.cssDest));
            },
            "less:dev": function () {
                return gulp.src(gulpSettings.less.src)
                    .pipe(plugins.plumber())
                    .pipe(plugins.sourcemaps.init())
                    .pipe(plugins.less(gulpSettings.less.options))
                    .pipe(plugins.pleeease(gulpSettings.please))
                    .pipe(plugins.stripCssComments(gulpSettings.comments))
                    .pipe(plugins.sourcemaps.write("."))
                    .pipe(gulp.dest(gulpSettings.srcDest + gulpSettings.cssDest))
                    .pipe(reload(gulpSettings.browserReload));
            },
            "less:ie:prod": function () {
                return gulp.src(gulpSettings.less.oldIeSrc)
                    .pipe(plugins.concat(gulpSettings.less.oldIeFileName))
                    .pipe(plugins.less(gulpSettings.less.options))
                    .pipe(plugins.pleeease(gulpSettings.please))
                    .pipe(plugins.minifyCss())
                    .pipe(plugins.stripCssComments(gulpSettings.comments))
                    .pipe(gulp.dest(gulpSettings.srcDest + gulpSettings.cssDest));
            },
            "less:ie:dev": function () {
                return gulp.src(gulpSettings.less.oldIeSrc)
                    .pipe(plugins.plumber())
                    .pipe(plugins.concat(gulpSettings.less.oldIeFileName))
                    .pipe(plugins.less(gulpSettings.less.options))
                    .pipe(plugins.pleeease(gulpSettings.please))
                    .pipe(gulp.dest(gulpSettings.srcDest + gulpSettings.cssDest))
                    .pipe(reload(gulpSettings.browserReload));
            },

            "scripts:prod": function () {
                return gulp.src(gulpSettings.js.src)
                    .pipe(plugins.concat(gulpSettings.js.fileName))
                    .pipe(plugins.uglify())
                    .pipe(gulp.dest(gulpSettings.srcDest + gulpSettings.jsDest));
            },
            "scripts:dev": function () {
                return gulp.src(gulpSettings.js.src)
                    .pipe(plugins.plumber())
                    .pipe(plugins.sourcemaps.init())
                    .pipe(plugins.concat(gulpSettings.js.fileName))
                    .pipe(plugins.sourcemaps.write("."))
                    .pipe(gulp.dest(gulpSettings.srcDest + gulpSettings.jsDest))
                    .pipe(reload(gulpSettings.browserReload));
            },
            "scripts:ie:dev": function () {
                return gulp.src(gulpSettings.js.oldIeSrc)
                    .pipe(plugins.plumber())
                    .pipe(plugins.concat(gulpSettings.js.oldIeFileName))
                    .pipe(gulp.dest(gulpSettings.srcDest + gulpSettings.jsDest))
                    .pipe(reload(gulpSettings.browserReload));
            },
            "scripts:ie:prod": function () {
                return gulp.src(gulpSettings.js.oldIeSrc)
                    .pipe(plugins.concat(gulpSettings.js.oldIeFileName))
                    .pipe(gulp.dest(gulpSettings.srcDest + gulpSettings.jsDest));
            },

            "check-js": ["complexity", "jslint"],
            "sync-watch": ["browser-sync", "watch"],

            "dev": ["less:dev", "less:ie:dev", "scripts:dev", "scripts:ie:dev"],
            "prod": {
                beforetask: ["clean"],
                task: function () {
                    gulp.start("less:prod", "less:ie:prod", "scripts:prod", "scripts:ie:prod");
                }
            },

            "default": ["prettify", "check-js", "dev"]
        }
    };

util.setGulp("task", gulpSettings.tasks);
