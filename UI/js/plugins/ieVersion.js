(function () {
    "use strict";

    // modified script founf at http://www.pinlady.net/PluginDetect/IE/

    var obj = document.createElement("div"),
        x,
        verIEtrue = -1, // True IE version [string/null]
        CLASSID = [
            "{45EA75A0-A269-11D1-B5BF-0000F8051515}", // Internet Explorer Help
            "{3AF36230-A269-11D1-B5BF-0000F8051515}", // Offline Browsing Pack 
            "{89820200-ECBD-11CF-8B85-00AA005B4383}"
        ],
        verFullFloat,
        docModeIE;

    try {
        obj.style.behavior = "url(#default#clientcaps)";
    } catch (e) {
        obj.style.behavior = null;
    }

    for (x = 0; x < CLASSID.length; x += 1) {
        try {
            verIEtrue = obj.getComponentVersion(CLASSID[x], "componentid").replace(/,/g, ".");
        } catch (e) {
            verIEtrue = -1;
        }

        if (verIEtrue) {
            break;
        }
    }

    // convert verIEtrue string to floating point number 
    verFullFloat = parseFloat(verIEtrue || "0", 10);

    // Get the IE browser document mode. 
    docModeIE = document.documentMode || ((/back/i).test(document.compatMode || "") ? 5 : verFullFloat) || ((/MSIE\s*(\d+\.?\d*)/i).test(navigator.userAgent || "") ? parseFloat(RegExp.$1, 10) : null);

    if (docModeIE > 0) {
        window.docModeIE = docModeIE;
    }
}());