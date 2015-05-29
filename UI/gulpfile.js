/*global require */
/*jslint node: true */
"use strict";

var gulp = require("gulp"),
    concat = require("gulp-concat"),
    watch = require("gulp-watch"),

    browserSync = require("browser-sync").create(),
    reload = browserSync.reload,

    lessPluginGlob = require("less-plugin-glob"),
    stripCssComments = require("gulp-strip-css-comments"),
    less = require("gulp-less"),

    please = require("gulp-pleeease"),
    minifyCSS = require("gulp-minify-css"),

    jslint = require("gulp-jslint"),
    complexity = require("gulp-complexity"),
    uglify = require("gulp-uglify"),

    imagemin = require("gulp-imagemin"),

    iconfont = require("gulp-iconfont"),
    consolidate = require("gulp-consolidate"),

    sourcemaps = require("gulp-sourcemaps"),

    util = {
        forEach: function (func, that, obj) {
            var k;

            for (k in obj) {
                if (obj.hasOwnProperty(k)) {
                    func.call(that, obj[k], k, obj);
                }
            }
        },
        setGulp: function (type, obj) {
            util.forEach(function (funcArray, name) {
                gulp[type](name, funcArray); // "funcArray" === "function OR Array"
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
        complexity : {
            src: ["js/*.js", "gulpfile.js"]
        },
        jsLint : {
            src: ["!js/lib", "js/*.js", "js/tests/*.js", "gulpfile.js"]
        },
        images : {
            src: "images/**",
            dest : "images/"
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

        watch: {
            "js/lib/**.js": ["scripts:dev"],
            "js/plugins/**.js": ["scripts:dev"],
            "js/**.js": ["scripts:dev"],
            "js/oldIe/**.js": ["scripts:ie:dev"],

            "less/**": ["less:dev"],
            "less/oldIe/**": ["less:ie:dev"],

            "dist/**/*.js": ["file-watch"],
            "dist/**/*.css": ["file-watch"],
            "styleguide/*": ["file-watch"],

            "../Views/**/*.cshtml": ["file-watch"],
            "../Views/**/**/*.cshtml": ["file-watch"]
        },

        tasks: {
            "watch": function () {
                util.setGulp("watch", gulpSettings.watch);
            },
            "file-watch": function () {
                setTimeout(browserSync.reload, 500);
            },
            "browser-sync": function () {
                browserSync.init({
                    proxy: "http://defaultweb.local:666"
                });
            },

            "images": function () {
                return gulp.src(gulpSettings.images.src)
                    .pipe(imagemin())
                    .pipe(gulp.dest(gulpSettings.images.dest));
            },
            "iconFont": function () {
                gulp.src(gulpSettings.iconFont.src)
                    .pipe(iconfont({
                        fontName: gulpSettings.iconFont.name
                    }))
                    .on("codepoints", function (codepoints) {
                        gulp.src(gulpSettings.iconFont.lesstemplate)
                            .pipe(consolidate("lodash", {
                                glyphs: codepoints,
                                fontName: gulpSettings.iconFont.name,
                                fontPath: gulpSettings.iconFont.dir,
                                className: gulpSettings.iconFont.className
                            }))
                            .pipe(gulp.dest(gulpSettings.iconFont.fontdest));
                    })
                    .pipe(gulp.dest(gulpSettings.iconFont.lessdest));
            },
            "complexity": function () {
                return gulp.src(gulpSettings.complexity.src)
                    .pipe(complexity());
            },
            "jslint": function () {
                return gulp.src(gulpSettings.jsLint.src)
                    .pipe(jslint());
            },

            "less:prod": function () {
                return gulp.src(gulpSettings.less.src)
                    .pipe(less(gulpSettings.less.options))
                    .pipe(please(gulpSettings.please))
                    .pipe(minifyCSS())
                    .pipe(stripCssComments(gulpSettings.comments))
                    .pipe(gulp.dest(gulpSettings.srcDest + gulpSettings.cssDest));
            },
            "less:dev": function () {
                return gulp.src(gulpSettings.less.src)
                    .pipe(sourcemaps.init())
                    .pipe(less(gulpSettings.less.options))
                    .pipe(please(gulpSettings.please))
                    .pipe(stripCssComments(gulpSettings.comments))
                    .pipe(sourcemaps.write("."))
                    .pipe(gulp.dest(gulpSettings.srcDest + gulpSettings.cssDest))
                    .pipe(reload({
                        stream: true
                    }));
            },
            "less:ie:prod": function () {
                return gulp.src(gulpSettings.less.oldIeSrc)
                    .pipe(concat(gulpSettings.less.oldIeFileName))
                    .pipe(less(gulpSettings.less.options))
                    .pipe(please(gulpSettings.please))
                    .pipe(minifyCSS())
                    .pipe(stripCssComments(gulpSettings.comments))
                    .pipe(gulp.dest(gulpSettings.srcDest + gulpSettings.cssDest));
            },
            "less:ie:dev": function () {
                return gulp.src(gulpSettings.less.oldIeSrc)
                    .pipe(concat(gulpSettings.less.oldIeFileName))
                    .pipe(less(gulpSettings.less.options))
                    .pipe(please(gulpSettings.please))
                    .pipe(gulp.dest(gulpSettings.srcDest + gulpSettings.cssDest))
                    .pipe(reload({
                        stream: true
                    }));
            },

            "scripts:prod": function () {
                return gulp.src(gulpSettings.js.src)
                    .pipe(concat(gulpSettings.js.fileName))
                    .pipe(uglify())
                    .pipe(gulp.dest(gulpSettings.srcDest + gulpSettings.jsDest));
            },
            "scripts:dev": function () {
                return gulp.src(gulpSettings.js.src)
                    .pipe(sourcemaps.init())
                    .pipe(concat(gulpSettings.js.fileName))
                    .pipe(sourcemaps.write("."))
                    .pipe(gulp.dest(gulpSettings.srcDest + gulpSettings.jsDest))
                    .pipe(reload({
                        stream: true
                    }));
            },
            "scripts:ie:dev": function () {
                return gulp.src(gulpSettings.js.oldIeSrc)
                    .pipe(concat(gulpSettings.js.oldIeFileName))
                    .pipe(gulp.dest(gulpSettings.srcDest + gulpSettings.jsDest))
                    .pipe(reload({
                        stream: true
                    }));
            },
            "scripts:ie:prod": function () {
                return gulp.src(gulpSettings.js.oldIeSrc)
                    .pipe(concat(gulpSettings.js.oldIeFileName))
                    .pipe(gulp.dest(gulpSettings.srcDest + gulpSettings.jsDest));
            },

            "default": ["iconFont", "less:dev", "less:ie:dev", "scripts:dev", "scripts:ie:dev", "images", "complexity", "jslint"],

            "sync-watch": ["browser-sync", "watch"],

            "dev": ["less:dev", "less:ie:dev", "scripts:dev", "scripts:ie:dev"],
            "prod": ["less:prod", "less:ie:prod", "scripts:prod", "scripts:ie:prod"]
        }
    };

util.setGulp("task", gulpSettings.tasks);