/*jslint node: true */
/*global require, Buffer */
"use strict";
(function () {
    var settings = require("./server/settings.json"),
        mimetypes = require("./server/mimetypes.json"),

        zlib = require("zlib"),
        http = require("http"),
        path = require("path"),
        fs = require("fs"),
        url = require("url"),

        matchLayout = /(<!--([\s]+)?layout\(['"]?[\w\_\.\/]+['"]?\)([\s]+)?-->)/g,
        matchIncludes = /(<!--([\s]+)?include\(['"]?[\w\_\.\/]+['"]?\)([\s]+)?-->)/g,

        server,

        util = {
            getCallback: function (argsArray) {
                var callback = (argsArray instanceof Array && argsArray.length) ? argsArray[argsArray.length - 1] : null;

                return callback;
            }
        },

        resp = {
            gzip: function (rnrObject) {
                var buffe = new Buffer(rnrObject.data, "utf-8");

                if (rnrObject.etag) {
                    rnrObject.headers.ETag = rnrObject.etag;
                }

                rnrObject.contextCallback(rnrObject, zlib.gzip, [buffe, rnrObject.gzip]);
            },
            handlePhtmlTemplates: function (rnrObject) {
                if (rnrObject.layout) {
                    rnrObject.layout = rnrObject.layout.join();

                    server.getLayout(rnrObject);
                } else {
                    server.getIncludes(rnrObject, 0);
                }
            },
            isTemplate: function (rnrObject) {
                return (rnrObject.layout || rnrObject.includes);
            },
            getActionFunc: function (rnrObject) {
                return resp.isTemplate(rnrObject) ? resp.handlePhtmlTemplates : resp.gzip;
            },
            handlePHtml: function (rnrObject) {
                var actionFunc;

                rnrObject.data = rnrObject.data.toString("utf-8");

                rnrObject.layout = rnrObject.data.match(matchLayout);
                rnrObject.includes = rnrObject.data.match(matchIncludes);

                actionFunc = resp.getActionFunc(rnrObject);

                actionFunc(rnrObject);
            },
            "200": function (rnrObject) {
                var isPHtml = /\.phtml$/.test(rnrObject.fullPath);

                if (isPHtml) {
                    resp.handlePHtml(rnrObject);
                } else {
                    resp.gzip(rnrObject);
                }
            },
            "404": function (rnrObject) {
                rnrObject.data = "404 - file not found";

                rnrObject.statusCode = 404;
                resp.gzip(rnrObject);
            },
            "500": function (rnrObject, error) {
                rnrObject.data = (error || "Server error") + "\n";

                rnrObject.statusCode = 500;
                resp.gzip(rnrObject);
            }
        },
        RnRObject = function (request, response) {
            var that = this;

            this.request = request;
            this.response = response;
            this.reqUrl = (that.request.url === "/") ? "/" + settings.defaultfile : that.request.url;
            this.pathName = url.parse(that.reqUrl).pathname;
            this.fullPath = path.join(process.cwd(), that.pathName);
            this.headers = server.getHeaders(that.fullPath);
        },
        createRnRObject = function (request, response) { // RnR = Request aNd Response
            return new RnRObject(request, response);
        };

    RnRObject.prototype = {
        gzip: function () {
            var rnrObject = this,
                //args = arguments,
                //result = args[1],
                result = this.data; //args[1];

            //if (rnrObject.headers["Content-Type"] === "text/html;charset=utf-8") {
            //    console.log(rnrObject);
            //}

            rnrObject.headers["Content-Length"] = result.length;
            rnrObject.response.writeHead(rnrObject.statusCode, rnrObject.headers);
            rnrObject.response.end(result);
        },
        getEtag: function (stat) {
            return stat ? stat.size + "-" + Date.parse(stat.mtime) : "";
        },
        setEtag: function (stat, rnrObject) {
            var etag = this.getEtag(stat);

            if (etag) {
                rnrObject.headers["Last-Modified"] = stat.mtime;
                rnrObject.etag = etag;
            }

            return etag;
        },
        callbackEnd: function (rnrObject, etag) {
            if (etag && rnrObject.request.headers["if-none-match"] === etag) {
                rnrObject.response.statusCode = 304;
                rnrObject.response.end();
            } else {
                rnrObject.contextCallback(rnrObject, fs.readFile, [rnrObject.fullPath, rnrObject.readFileCallback]);
            }
        },
        statCallback: function () {
            var rnrObject = this,
                args = arguments,
                stat = args[1],
                etag = rnrObject.setEtag(stat, rnrObject);

            this.callbackEnd(rnrObject, etag);
        },
        exists: function (exists) {
            var rnrObject = this;

            if (!exists) {
                resp["404"](rnrObject);
            } else {
                rnrObject.contextCallback(rnrObject, fs.stat, ["." + rnrObject.request.url, rnrObject.statCallback]);
            }
        },
        readFileCallback: function (error, data) {
            var rnrObject = this;

            if (error) {
                resp["500"](rnrObject, error);
            } else {
                rnrObject.data = data;
                rnrObject.statusCode = 200;
                resp["200"](rnrObject);
            }
        },
        readFileInclude: function (error, data) {
            var rnrObject = this;

            if (error) {
                rnrObject.currentInclude = "<div style=\"color: red; background: #ffe2e7; padding: 5px 10px; border: solid 1px red;\">The file \"" + rnrObject.fullPath + "\" does not exist</div>";
            } else {
                rnrObject.currentInclude = data.toString("utf-8");
            }

            rnrObject.newdata = rnrObject.data.replace(rnrObject.includes[0], rnrObject.currentInclude);
            rnrObject.data = rnrObject.newdata;
            server.getIncludes(rnrObject);
        },
        contextCallback: function (context, func, argsArray) {
            var callback = util.getCallback(argsArray);

            if (typeof callback === "function") {
                argsArray.pop();

                argsArray.push(function () {
                    var args = arguments;

                    callback.apply(context, args);
                });
            }

            func.apply(context, argsArray);
        }
    };

    server = {
        trim: function (str) {
            return str.toString().replace(/(^\s+|\s+$)/g, "");
        },
        setupLayout: function (rnrObject, data) {
            var layoutData = data.toString("utf-8"),
                fileContent = server.trim(rnrObject.data.replace(matchLayout, "")),
                newData = layoutData.replace(/<\!--\s\[phtml\:content\]\s-->/, fileContent);

            rnrObject.data = server.trim(newData);

            server.getIncludes(rnrObject);
        },
        setLayout: function (error, data) {
            var rnrObject = this;

            if (error) {
                resp["500"](rnrObject, error);
            } else {
                server.setupLayout(rnrObject, data);
            }
        },
        getLayout: function (rnrObject) {
            var layoutUrl = rnrObject.layout.match(/["'][\w\_\/\.]+["']/).join().replace(/['"]/g, ""),
                fullPath = path.join(process.cwd(), layoutUrl);

            rnrObject.contextCallback(rnrObject, fs.readFile, [fullPath, server.setLayout]);
        },
        getInclude: function (rnrObject) {
            var includeUrl = rnrObject.includes[0].match(/["'][\w\_\/\.]+["']/).join().replace(/['"]/g, ""),
                fullPath = path.join(process.cwd(), includeUrl);

            rnrObject.fullPath = fullPath;
            rnrObject.contextCallback(rnrObject, fs.readFile, [fullPath, rnrObject.readFileInclude]);
        },
        getIncludes: function (rnrObject) {
            var hasIncludes = rnrObject.data.match(matchIncludes);

            if (hasIncludes) {
                rnrObject.includes = hasIncludes;
                server.getInclude(rnrObject);
            } else {
                resp.gzip(rnrObject);
            }
        },
        getType: function (fullPath) {
            var type = "text/plain",
                tlc = fullPath.toLowerCase(),
                file = tlc.match(/\.[a-z\d]+$/);

            if (mimetypes[file] && mimetypes[file].length) {
                type = mimetypes[file][0];
            }

            return type;
        },
        getHeaders: function (fullPath) {
            var type = server.getType(fullPath),

                now = new Date(),
                year = now.getFullYear(),
                month = now.getMonth(),
                date = now.getDate(),

                headers = {
                    "Content-Type": type,
                    "Accept-Charset": "utf-8",
                    //"Content-Encoding": "gzip",
                    "Cache-Control": "public, max-age=345600", // 4 days
                    "Date": now.toUTCString(),
                    "Expires": new Date(parseInt(year + 1, 10), month, date).toUTCString(),

                    "Host": settings.hostname + ":" + settings.port
                };

            return headers;
        },
        create: function (request, response) {
            var rnrObject = createRnRObject(request, response);

            rnrObject.contextCallback(rnrObject, fs.exists, [rnrObject.fullPath, rnrObject.exists]);
        }
    };

    http.createServer(server.create).listen(settings.port, settings.hostname);

    console.log("Server Running on http://" + settings.hostname + ":" + settings.port);
}());