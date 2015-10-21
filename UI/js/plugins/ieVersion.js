/*jslint browser: true */
(function (window) {
    "use strict";

    // modified script found at http://www.pinlady.net/PluginDetect/IE/

    var ua = navigator.userAgent,
        util = {
            trim: function (str) {
                return str.toString().replace(/(^\s+|\s+$)/g, "").replace(/^\[object\sobject\]$/i, "");
            }
        },
        ieVersion = {
            classId: [
                "{45EA75A0-A269-11D1-B5BF-0000F8051515}", // Internet Explorer Help
                "{3AF36230-A269-11D1-B5BF-0000F8051515}", // Offline Browsing Pack 
                "{89820200-ECBD-11CF-8B85-00AA005B4383}"
            ],
            setBehavior: function (obj) {
                try {
                    obj.style.behavior = "url(#default#clientcaps)";
                } catch (e) {
                    obj.style.behavior = null;
                }

                return obj;
            },
            getObj: function () {
                var newDiv = document.createElement("div"),
                    obj = ieVersion.setBehavior(newDiv);

                return obj;
            },
            tryVerIe: function (obj, x, verIEtrue) {
                try {
                    verIEtrue = obj.getComponentVersion(ieVersion.classId[x], "componentid").replace(/,/g, ".");
                } catch (e) {
                    verIEtrue = -1;
                }

                return verIEtrue;
            },
            verIeLoop: function (obj, verIEtrue) {
                ieVersion.classId.forEach(function (index) {
                    verIEtrue = ieVersion.tryVerIe(obj, index, verIEtrue);
                });

                return verIEtrue;
            },
            getVerIEtrue: function () {
                var obj = ieVersion.getObj(),
                    verIEtrue = ieVersion.verIeLoop(obj, -1); // True IE version [string/null]

                return verIEtrue;
            },
            getVerFullFloat: function () {
                var verIEtrue = ieVersion.getVerIEtrue(),
                    verFullFloat = parseFloat(verIEtrue || "0", 10);

                return verFullFloat;
            },
            checkBack: function () {
                return (/back/i).test(document.compatMode || "");
            },
            checkCompatMode: function (verFullFloat) {
                return (ieVersion.checkBack() ? 5 : verFullFloat);
            },
            uaMatch: function () {
                return util.trim((/MSIE\s*(\d+\.?\d*)/i).test(ua));
            },
            uaCheck: function () {
                return (ieVersion.uaMatch() ? parseFloat(RegExp.$1, 10) : null);
            },
            advancedCheck: function (verFullFloat) {
                return ieVersion.checkCompatMode(verFullFloat) || ieVersion.uaCheck();
            },
            getDocMode: function (verFullFloat) {
                return document.documentMode || ieVersion.advancedCheck(verFullFloat);
            },
            init: function () {
                var verFullFloat = ieVersion.getVerFullFloat(),
                    docModeIe = ieVersion.getDocMode(verFullFloat);

                if (docModeIe > 0) {
                    window.docModeIE = docModeIe;
                }
            }
        };

    ieVersion.init();

}(window));
