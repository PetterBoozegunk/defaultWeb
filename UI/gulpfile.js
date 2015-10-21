/*global require */
/*jslint node: true */
"use strict";

var gulp = require("gulp"),

    plugins = require("gulp-load-plugins")(),

    browserSync = require("browser-sync").create(),
    lessPluginGlob = require("less-plugin-glob"),

    settings = require("./gulpStuff/settings.js"),
    util = require("./gulpStuff/util.js"),

    fileWatchTimeout = null,

    tasks = {
        "file-watch": function () {
            clearTimeout(fileWatchTimeout);

            fileWatchTimeout = setTimeout(browserSync.reload, settings["browser-sync"].delay);
        },
        "browser-sync": function () {
            browserSync.init(settings["browser-sync"].options);
        },

        "watch": function () {
            var watchObj = util.getWatch();

            setTimeout(function () {
                util.setGulp("watch", watchObj);
            }, settings["browser-sync"].delay);
        },

        "clean": function () {
            return gulp.src(settings.srcDest)
                .pipe(plugins.rimraf());
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
        "images": {
            beforetask: ["svg-min:image"],
            task: function () {
                return gulp.src(settings.images.src)
                    .pipe(plugins.plumber())
                    .pipe(plugins.smushit({
                        verbose: true
                    }))
                    .pipe(gulp.dest(settings.images.dest));
            }
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

        "platoReport": function () {
            gulp.start(plugins.shell.task(["node gulpStuff/plato.js"], {
                verbose: true
            }));
        },
        "prettify": function () {
            var prettifyArray = settings.js.prettify;

            prettifyArray.forEach(function (prettifyObj) {
                return util.prettify(prettifyObj.files, prettifyObj.dest);
            });
        },
        "jslint": {
            beforetask: ["prettify"],
            task: function () {
                return gulp.src(settings.js.checkSrc)
                    .pipe(plugins.plumber())
                    .pipe(plugins.jslint());
            }
        },

        "less:prod": function () {
            return gulp.src(settings.less.src)
                .pipe(plugins.less(settings.less.options))
                .pipe(plugins.pleeease(settings.pleeease))
                .pipe(plugins.minifyCss())
                .pipe(plugins.stripCssComments(settings.less.comments))
                .pipe(gulp.dest(settings.srcDest + settings.less.dest));
        },
        "less:dev": function () {
            return gulp.src(settings.less.src)
                .pipe(plugins.plumber())
                .pipe(plugins.sourcemaps.init())
                .pipe(plugins.less(settings.less.options))
                .pipe(plugins.pleeease(settings.pleeease))
                .pipe(plugins.stripCssComments(settings.comments))
                .pipe(plugins.sourcemaps.write("."))
                .pipe(gulp.dest(settings.srcDest + settings.less.dest));
        },
        "less:ie:prod": function () {
            return gulp.src(settings.less.oldIeSrc)
                .pipe(plugins.concat(settings.less.oldIeFileName))
                .pipe(plugins.less(settings.less.options))
                .pipe(plugins.pleeease(settings.pleeease))
                .pipe(plugins.minifyCss())
                .pipe(plugins.stripCssComments(settings.less.comments))
                .pipe(gulp.dest(settings.srcDest + settings.less.dest));
        },
        "less:ie:dev": function () {
            return gulp.src(settings.less.oldIeSrc)
                .pipe(plugins.plumber())
                .pipe(plugins.concat(settings.less.oldIeFileName))
                .pipe(plugins.less(settings.less.options))
                .pipe(plugins.pleeease(settings.pleeease))
                .pipe(gulp.dest(settings.srcDest + settings.less.dest));
        },

        "js:prod": function () {
            return gulp.src(settings.js.concatSrc)
                .pipe(plugins.concat(settings.js.fileName))
                .pipe(plugins.uglify(settings.js.uglify))
                .pipe(gulp.dest(settings.srcDest + settings.js.dest));
        },
        "js:dev": function () {
            return gulp.src(settings.js.concatSrc)
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

        "check-js": ["jslint", "platoReport"],
        "js:all": ["check-js", "js:dev", "js:ie:dev"],

        "default": ["dev"]
    };

util.setGulp("task", tasks);
