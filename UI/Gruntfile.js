/*jslint node: true */
"use strict";

module.exports = function (grunt) {

    var util = {
            trim: function (str) {
                return str.replace(/(^\s+)(\s+$)/g, "");
            },
            loadNpmTasks: function (tasksArray) {
                var i,
                    l = tasksArray.length;

                for (i = 0; i < l; i += 1) {
                    grunt.loadNpmTasks(tasksArray[i]);
                }
            },
            registerTasks: function (regTasks) {
                var k;

                for (k in regTasks) {
                    if (regTasks.hasOwnProperty(k)) {
                        grunt.registerTask(k, regTasks[k]);
                    }
                }
            }
        },

        paths = {
            css: {
                concat: {
                    files : {
                        "dist/css/styles.less": [
                            "less/fonts/*",
                            "less/vars/*",
                            "less/mixins/*",
                            "less/default/*",
                            "less/grid/*",
                            "less/site/*",
                            "less/pages/*",
                            "less/components/*"
                        ],
                        "dist/css/oldIe.less": [
                            "less/oldIe/*.less"
                        ]
                    }
                },
                toFrom: {
                    "dist/css/styles.css": "dist/css/styles.less",
                    "dist/css/oldIe.css": "dist/css/oldIe.less"
                },
                watch: "less/**"
            },
            js: {
                concat: {
                    files : {
                        "dist/js/scripts.js" : [
                            "js/lib/*.js",
                            "js/*.js"
                        ],
                        "dist/js/oldIe.js": ["js/oldIe/**"],
                        "dist/js/tests.js" : ["js/tests/**"]
                    }
                },
                toFrom: {
                    "dist/js/scripts.js": ["dist/js/scripts.js"]
                },
                watch: "js/**"
            },
            dist: {
                root: "dist"
            }
        },

        config = {
            pkg: grunt.file.readJSON('package.json'),
            chmod: {
                dev: {
                    options: {
                        mode: "777"
                    },
                    src: [paths.dist.root + "/**"]
                }
            },
            clean: {
                dist: {
                    src: [paths.dist.root + "/css/**", paths.dist.root + "/js/**", paths.dist.root + "/**"]
                },
                less: {
                    src: [paths.dist.root + "/css/*.less"]
                }
            },
            jslint: {
                server: {
                    src: [
                        "Gruntfile.js",
                        "js/*.js"
                    ],
                    options: {
                        edition: "latest"
                        // failOnError: false
                    }
                }
            },
            concat: {
                css: paths.css.concat,
                js: paths.js.concat
            },
            less: {
                "default": {
                    options: {
                        compress: true
                    },
                    files: paths.css.toFrom
                }
            },
            uglify: {
                "default": {
                    files: paths.js.toFrom
                }
            },
            watch: {
                gruntfile: {
                    files: "Gruntfile.js"
                },
                src: {
                    files: [paths.css.watch, paths.js.watch, "Gruntfile.js"],
                    tasks: ["default"]
                }
            }
        },

        defaultTasks = [
            "chmod",
            "clean:dist",
            "jslint",
            "concat",
            "less",
            "uglify",
            "clean:less"
        ],

        tasks = {
            npmTasks: [
                "grunt-chmod",
                "grunt-contrib-clean",
                "grunt-jslint",
                "grunt-contrib-concat",
                "grunt-contrib-less",
                "grunt-contrib-uglify",
                "grunt-contrib-watch"
            ],
            reg: {
                "default": defaultTasks,
                "Debug": defaultTasks,
                "Release": defaultTasks
            }
        };

    // Project configuration.
    grunt.initConfig(config);

    util.loadNpmTasks(tasks.npmTasks);
    util.registerTasks(tasks.reg);
};