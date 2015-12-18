/*jslint node: true */
module.exports = {
    "projectName": "defaultWeb",

    "openUrls": [
        "http://defaultweb.local:666"
    ],
    "startBrowsers": [
        "firefox.exe",
        "chrome.exe",
        "iexplore.exe",
        "opera.exe"
    ],
    "openUrlInIE": 0, // for some reason IE only wants to open one tab. This number selects the "openUrl" to use.

    "cmdFiles": [{
        "fileName": "startServer",
        "commandLines": [
            "cd ..",
            "start node server.js",
            "exit"
        ]
    }, {
        "fileName": "gulp",
        "commandLines": [
            "start gulp sync-watch",
            "gulp"
        ]
    }]
};
