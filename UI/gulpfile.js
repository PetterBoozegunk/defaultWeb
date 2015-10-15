/*global require */
/*jslint node: true */
"use strict";

var gulp = require("gulp"),

    plugins = require("gulp-load-plugins")(),

    browserSync = require("browser-sync").create(),
    reload = browserSync.reload,

    lessPluginGlob = require("less-plugin-glob"),

    settings = {
        srcDest: "dist",

        localServer: require("../server/settings.json"),

        less: {
            dest: "/css",
            src: ["less/styles.less"],
            options: {
                "plugins": [lessPluginGlob]
            },
            oldIeSrc: ["less/oldIe/*.less"],
            oldIeFileName: "oldIe.less",

            // watch object {"taskName": ["srcArray"]}
            watch: [{
                "less:dev": ["less/**"]
            }, {
                "less:ie:dev": ["less/oldIe/**"]
            }]
        },
        js: {
            dest: "/js",
            fileName: "scripts.js",

            src: ["js/lib/*.js", "js/*.js", "js/tests/*.js"],
            checkSrc: ["js/*.js", "js/tests/*.js", "gulpfile.js", "../server.js"],

            jsLint: {
                js: {
                    jslintHappy: true
                }
            },

            oldIeFileName: "oldIe.js",
            oldIeSrc: ["js/oldIe/*.js"],

            watch: [{
                "js:dev": ["js/lib/*.js", "js/*.js", "js/tests/*.js"]
            }, {
                "js:ie:dev": ["js/oldIe/*.js"]
            }]
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
        svg: {
            font: {
                src: ["fonts/svg/*.svg"],
                dest: "fonts/svg"
            },
            images: {
                src: ["images/*.svg"],
                dest: "images"
            }
        },
        images: {
            src: ["images/**"],
            dest: "images"
        },
        iconFont: {
            name: "icon",
            src: ["fonts/svg/*.svg"],
            lesstemplate: "fonts/templates/icon.less",
            lessdest: "fonts/",
            fontdest: "less/fonts/",
            dir: "/UI/fonts/",
            className: "icon",
            watch: [{
                "iconFont": ["fonts/svg/*.svg"]
            }]
        },
        browserReload: {
            stream: true
        },
        fileWatch: {
            delay: 2000,
            watch: [{
                "file-watch": ["[srcDest]/**/*.js", "[srcDest]/**/*.css"]
            }]
        }
    },

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
    },

    tasks = {
        "file-watch": function () {
            setTimeout(browserSync.reload, settings.fileWatch.delay);
        },
        "browser-sync": function () {
            browserSync.init({
                proxy: settings.localServer.hostname + ":" + settings.localServer.port
            });
        },

        "watch": function () {
            var watchObj = util.getWatch();

            setTimeout(function () {
                util.setGulp("watch", watchObj);
            }, settings.fileWatch.delay);
        },

        "clean": function () {
            return gulp.src(settings.srcDest)
                .pipe(plugins.clean());
        },

        "svg-min:font": function () {
            return gulp.src(settings.svg.font.src)
                .pipe(plugins.svgmin())
                .pipe(gulp.dest(settings.svg.font.dest));
        },
        "svg-min:image": function () {
            return gulp.src(settings.svg.images.src)
                .pipe(plugins.svgmin())
                .pipe(gulp.dest(settings.svg.images.dest));
        },

        "images": function () {
            return gulp.src(settings.images.src)
                .pipe(plugins.plumber())
                .pipe(plugins.imagemin())
                .pipe(gulp.dest(settings.images.dest));
        },

        "iconFont": {
            beforetask: ["svg-min:font"],
            task: function () {
                gulp.src(settings.iconFont.src)
                    .pipe(plugins.plumber())
                    .pipe(plugins.iconfont({
                        fontName: settings.iconFont.name,
                        normalize: true
                    }))
                    .on("codepoints", function (codepoints) {
                        gulp.src(settings.iconFont.lesstemplate)
                            .pipe(plugins.plumber())
                            .pipe(plugins.consolidate("lodash", {
                                glyphs: codepoints,
                                fontName: settings.iconFont.name,
                                fontPath: settings.iconFont.dir,
                                className: settings.iconFont.className
                            }))
                            .pipe(gulp.dest(settings.iconFont.fontdest));
                    })
                    .pipe(gulp.dest(settings.iconFont.lessdest));
            }
        },

        "prettify": function () {
            return util.prettify(["js/*.js"], "js");
        },
        "prettifyGulp": function () {
            return util.prettify(["gulpfile.js", "package.json"], ".");
        },
        "prettifyServer": function () {
            return util.prettify(["../server.js"], "..");
        },

        "complexity": function () {
            return gulp.src(settings.js.checkSrc)
                .pipe(plugins.plumber())
                .pipe(plugins.complexity());
        },
        "platoReport": function () {
            return gulp.src(settings.js.checkSrc)
                .pipe(plugins.plumber())
                .pipe(plugins.plato("report"));
        },
        "jslint": {
            beforetask: ["prettify", "prettifyGulp", "prettifyServer"],
            task: function () {
                return gulp.src(settings.js.checkSrc)
                    .pipe(plugins.plumber())
                    .pipe(plugins.jslint());
            }
        },

        "less:prod": function () {
            return gulp.src(settings.less.src)
                .pipe(plugins.less(settings.less.options))
                .pipe(plugins.pleeease(settings.please))
                .pipe(plugins.minifyCss())
                .pipe(plugins.stripCssComments(settings.comments))
                .pipe(gulp.dest(settings.srcDest + settings.less.dest));
        },
        "less:dev": function () {
            return gulp.src(settings.less.src)
                .pipe(plugins.plumber())
                .pipe(plugins.sourcemaps.init())
                .pipe(plugins.less(settings.less.options))
                .pipe(plugins.pleeease(settings.please))
                .pipe(plugins.stripCssComments(settings.comments))
                .pipe(plugins.sourcemaps.write("."))
                .pipe(gulp.dest(settings.srcDest + settings.less.dest));
        },
        "less:ie:prod": function () {
            return gulp.src(settings.less.oldIeSrc)
                .pipe(plugins.concat(settings.less.oldIeFileName))
                .pipe(plugins.less(settings.less.options))
                .pipe(plugins.pleeease(settings.please))
                .pipe(plugins.minifyCss())
                .pipe(plugins.stripCssComments(settings.comments))
                .pipe(gulp.dest(settings.srcDest + settings.less.dest));
        },
        "less:ie:dev": function () {
            return gulp.src(settings.less.oldIeSrc)
                .pipe(plugins.plumber())
                .pipe(plugins.concat(settings.less.oldIeFileName))
                .pipe(plugins.less(settings.less.options))
                .pipe(plugins.pleeease(settings.please))
                .pipe(gulp.dest(settings.srcDest + settings.less.dest));
        },

        "js:prod": function () {
            return gulp.src(settings.js.src)
                .pipe(plugins.concat(settings.js.fileName))
                .pipe(plugins.uglify())
                .pipe(gulp.dest(settings.srcDest + settings.js.dest));
        },
        "js:dev": function () {
            return gulp.src(settings.js.src)
                .pipe(plugins.plumber())
                .pipe(plugins.sourcemaps.init())
                .pipe(plugins.concat(settings.js.fileName))
                .pipe(plugins.sourcemaps.write("."))
                .pipe(gulp.dest(settings.srcDest + settings.js.dest));
        },
        "js:ie:dev": function () {
            return gulp.src(settings.js.oldIeSrc)
                .pipe(plugins.plumber())
                .pipe(plugins.concat(settings.js.oldIeFileName))
                .pipe(gulp.dest(settings.srcDest + settings.js.dest));
        },
        "js:ie:prod": function () {
            return gulp.src(settings.js.oldIeSrc)
                .pipe(plugins.concat(settings.js.oldIeFileName))
                .pipe(gulp.dest(settings.srcDest + settings.js.dest));
        },

        "sync-watch": ["browser-sync", "watch"],

        "dev": ["less:dev", "less:ie:dev", "js:dev", "js:ie:dev"],
        "prod": {
            beforetask: ["clean"],
            task: function () {
                gulp.start("less:prod", "less:ie:prod", "js:prod", "js:ie:prod");
            }
        },

        "image-min": ["images", "svg-min:image"],

        "check-js": ["complexity", "jslint", "platoReport"],
        "js:all": ["check-js", "js:dev", "js:ie:dev"],

        "default": ["dev"]
    };

util.setGulp("task", tasks);
