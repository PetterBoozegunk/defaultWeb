/*jslint node: true */
"use strict";

var gulp = require("gulp"),
    concat = require("gulp-concat"),
    del = require("del"),
    //path = require("path"),
    //cssGlobbing = require("gulp-css-globbing"),
    less = require("gulp-less"),
    minifyCSS = require("gulp-minify-css"),
    LessPluginAutoPrefix = require("less-plugin-autoprefix"),
    autoprefix = new LessPluginAutoPrefix({
        browsers: ["last 4 versions"]
    }),
    //sourcemaps = require("gulp-sourcemaps"),
    uglify = require("gulp-uglify"),
    includeSources = require("gulp-include-source"),

    srcDest = "dist",
    mapsDest = "./maps",

    util = {
        "del" : function (dest) {
            del([dest], function (err, deletedFiles) {
                console.log("Files deleted:", deletedFiles.join(', '));
            });
        }
    }

gulp.task("less", function () {
    //util.del(srcDest + "/css/styles.css");

    return gulp.src([
        "less/fonts/*",
        "less/vars/*",
        "less/mixins/*",
        "less/default/*",
        "less/grid/*",
        "less/site/*",
        "less/pages/*",
        "less/components/*"
    ])
    .pipe(concat("styles.less"))
    .pipe(less({
        plugins: [autoprefix]
    }))
    .pipe(minifyCSS())
    .pipe(gulp.dest(srcDest + "/css"));
});

gulp.task("js", function () {
    //util.del(srcDest + "/js/scripts.js");

    return gulp.src(["js/lib/*.js", "js/*.js"])
        .pipe(concat("scripts.js"))
        .pipe(uglify())
        .pipe(gulp.dest(srcDest + "/js"));
});

gulp.task("tests", function () {
    //util.del(srcDest + "/js/tests.js");

    return gulp.src(["js/tests/*.js"])
        .pipe(concat("tests.js"))
        .pipe(uglify())
        .pipe(gulp.dest(srcDest + "/js"));
});

gulp.task("html", function () {
    return gulp.src(["../mod_blocks/styles.html", "../mod_blocks/scripts.html"])
      .pipe(includeSources())
      .pipe(gulp.dest("../blocks"));
});

gulp.task("default", ["less", "js", "tests", "html"]);