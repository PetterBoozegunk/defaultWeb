/*jslint browser: true */
(function (window) {
    "use strict";

    var $ = window.jQuery,
        google,
        ua = window.navigator.userAgent,
        isOldIe = /MSIE\s[678]/.test(ua),

        util = {
            createScriptElem: function (scriptUrl) {
                var script = document.createElement("script");

                script.type = "text/javascript";
                script.src = scriptUrl;

                return script;
            },
            getClassNameStr: function (className) {
                return className ? " class=\"" + className + "\"" : "";
            },
            getHtmlStr: function (tagName, str, className) {
                var classStr = util.getClassNameStr(className),
                    htmlStr = (tagName && str) ? "<" + tagName + classStr + ">" + str + "</" + tagName + ">" : "";

                return htmlStr;
            },
            loadScript: function (scriptUrl, callback) {
                var script = util.createScriptElem(scriptUrl);

                if (callback) {
                    $(script).on("load", callback);
                }

                document.body.appendChild(script);
            },
            trim: function (str) {
                return (typeof str === "string") ? str.replace(/(^\s+|\s+$)/, "") : "";
            },
            getNumber: function (num) {
                return (num && typeof num === "number") ? num : 0;
            },
            getArray: function (arr) {
                return (arr instanceof Array) ? arr : [];
            }
        },

        maps = {
            blocks: $(".googleMap"),
            "default": {
                markers: [{
                    "lat": 59.334156,
                    "lng": 18.098511,
                    "title": "Cloudnine"
                }], // linnégatan 89e
                zoom: 13
            },
            getLatLng: function (marker) {
                var lat = marker.lat,
                    lng = marker.lng;

                return new google.maps.LatLng(lat, lng);
            },
            extendBounds: function (marker, bounds) {
                var latlng = maps.getLatLng(marker);

                bounds.extend(latlng);

                return bounds;
            },
            getBounds: function (markers) {
                var bounds = new google.maps.LatLngBounds();

                markers.forEach(function (marker) {
                    bounds = maps.extendBounds(marker, bounds);
                });

                return bounds;
            },
            getCenter: function (markers) {
                var bounds = maps.getBounds(markers);

                return bounds.getCenter();
            },
            getMapOptions: function (markers, zoom, latLngCenter) {
                var center = latLngCenter || maps.getCenter(markers);

                return {
                    "center": center,
                    "zoom": zoom //,
                        //"scrollwheel": false
                };
            },
            getMarkers: function (data) {
                var markers = data.markers || maps["default"].markers;

                return markers;
            },
            getAddressObject: function (marker) {
                var newAddressObject = {
                    "address": util.trim(marker.address),
                    "postalCode": util.trim(marker.postalCode),
                    "city": util.trim(marker.city)
                };

                return newAddressObject;
            },
            getMarkerOptions: function (latLng, map, marker) {
                return {
                    position: latLng,
                    map: map,
                    //icon: markerIcon,
                    title: marker.title || "",
                    address: maps.getAddressObject(marker),
                    url: marker.url || ""
                };
            },
            getMapMarker: function (latLng, map, marker) {
                var options = maps.getMarkerOptions(latLng, map, marker),
                    mapMarker = new google.maps.Marker(options);

                return mapMarker;
            },
            addMarkerListener: function (mapMarker, url) {
                if (url) {
                    google.maps.event.addListener(mapMarker, "click", function () {
                        document.location = url;
                    });
                }
            },
            addMarker: function (marker, map) {
                var latLng = maps.getLatLng(marker),
                    url = marker.url,
                    //markerIcon = {
                    //    url: "/UI/images/marker.png",
                    //    size: new google.maps.Size(70, 75),
                    //    origin: new google.maps.Point(0, 0),
                    //    anchor: new google.maps.Point(35, 65)
                    //},
                    mapMarker = maps.getMapMarker(latLng, map, marker);

                maps.addMarkerListener(mapMarker, url);

                return mapMarker;
            },
            addMarkers: function (markers, map) {
                var mapMarkers = [];

                markers.forEach(function (marker) {
                    mapMarkers.push(maps.addMarker(marker, map));
                });

                return mapMarkers;
            },
            setClusterer: function (map, mapMarkers) {
                var mc = new window.MarkerClusterer(map, mapMarkers); //,
                //styleObj = {
                //    width: 70,
                //    height: 75,
                //    url: "/UI/images/marker.png",
                //    textColor: "#fff"
                //};

                //mc.setStyles([styleObj, styleObj, styleObj, styleObj, styleObj]);
                mc.redraw();

                return mc;
            },
            allMarkersHaveTheSamePosition: function (markers) {
                var lastPosition = markers[0].getPosition().toString(),
                    sharedPosition = 0;

                markers.forEach(function (marker) {
                    var position = marker.getPosition().toString();

                    if (position === lastPosition) {
                        sharedPosition += 1;
                    }

                    lastPosition = position;
                });

                return (sharedPosition === markers.length);
            },
            getAddressHtmlStr: function (marker) {
                var address = marker.address,
                    addressP = util.getHtmlStr("p", address.address) + util.getHtmlStr("p", $.trim((address.postalCode || "") + " " + (address.city || ""))),
                    addressDiv = util.getHtmlStr("div", addressP, "address");

                return addressDiv;
            },
            setTopLeft: function (jqMapDiv) {
                var ofs = jqMapDiv.offset(),
                    ulCss = {
                        top: Math.round(ofs.top),
                        left: Math.round(ofs.left)
                    };

                return ulCss;
            },
            setHeightWidth: function (ulCss, jqMapDiv) {
                var width = jqMapDiv.width(),
                    height = jqMapDiv.height();

                ulCss.height = Math.round(height / 1.2);
                ulCss.width = Math.round(width / 2);

                return ulCss;
            },
            getTopMargin: function (height, ulCss) {
                return Math.round(((height - ulCss.height) / 2) - 10);
            },
            setMargin: function (ulCss, jqMapDiv) {
                var width = jqMapDiv.width(),
                    height = jqMapDiv.height();

                ulCss.marginTop = maps.getTopMargin(height, ulCss);
                ulCss.marginLeft = Math.round((width - ulCss.width) / 2);

                return ulCss;
            },
            getMarkerUlListStyle: function (jqMapDiv) {
                var ulCss = maps.setTopLeft(jqMapDiv);

                ulCss = maps.setHeightWidth(ulCss, jqMapDiv);
                ulCss = maps.setMargin(ulCss, jqMapDiv);

                return ulCss;
            },
            removeMarkerList: function () {
                var that = this,
                    jqMapDiv = $(that.getDiv());

                jqMapDiv.next("ul.markersList").remove();
            },
            addLiToMarkerList: function (marker) {
                var ul = this,
                    addressHtmlStr = maps.getAddressHtmlStr(marker),
                    li = $("<li><a href=\"" + marker.url + "\"><h2>" + marker.title + "</h2>" + addressHtmlStr + "</a></li>");

                ul.append(li);
            },
            showMarkerList: function (ul, jqMapDiv) {
                var ulCss = maps.getMarkerUlListStyle(jqMapDiv);

                jqMapDiv.next("ul.markersList").remove();

                ul.css(ulCss);
                jqMapDiv.after(ul);
            },
            setMarkerList: function (cluster, markers) {
                var ul = $("<ul class=\"markersList\" />"),
                    map = cluster.getMap(),
                    jqMapDiv = $(map.getDiv());

                markers.forEach(maps.addLiToMarkerList, ul);

                maps.showMarkerList(ul, jqMapDiv);
            },
            removeEvents: function (mapEventsObjArray) {
                var evtsObjArr = util.getArray(mapEventsObjArray);

                while (evtsObjArr[0]) {
                    google.maps.event.removeListener(evtsObjArr[0]);
                    evtsObjArr.shift();
                }
            },
            removeMultipleEvents: function (map, events) {
                var eventsArray = events.split(" "),
                    mapEventsObj = map.get("eventsObj") || {};

                eventsArray.forEach(function (event) {
                    maps.removeEvents(mapEventsObj[event]);
                });
            },
            addEvent: function (map, mapEventsObj, evt, func) {
                if (!mapEventsObj[evt]) {
                    mapEventsObj[evt] = [];
                }

                mapEventsObj[evt].push(google.maps.event.addListener(map, evt, func));
            },
            addMultipleEvents: function (map, events, func) {
                var evts = events.split(" "),
                    mapEventsObj = map.get("eventsObj") || {};

                evts.forEach(function (evt) {
                    maps.addEvent(map, mapEventsObj, evt, func);
                });

                map.set("eventsObj", mapEventsObj);
            },
            handleSamePosition: function (map, markers, cluster) {
                var events = "click drag center_changed zoom_changed";

                maps.removeMultipleEvents(map, events);
                maps.setMarkerList(cluster, markers);

                setTimeout(function () {
                    maps.addMultipleEvents(map, events, maps.removeMarkerList);
                }, 100);
            },
            checkCluster: function (cluster) {
                var markers = cluster.getMarkers(),
                    map = cluster.getMap(),
                    allMarkersHaveTheSamePosition = maps.allMarkersHaveTheSamePosition(markers);

                if (allMarkersHaveTheSamePosition) {
                    maps.handleSamePosition(map, markers, cluster);
                }
            },
            getLatLngCenter: function (data) {
                var center = data.center || null,
                    latLngCenter = center ? new google.maps.LatLng(center.lat, center.lng) : null;

                return latLngCenter;
            },
            getZoom: function (data) {
                var zoom = data.zoom || maps["default"].zoom;

                return zoom;
            },
            setCenter: function (map, markers, jsonData) {
                var latLngCenter = maps.getLatLngCenter(jsonData),
                    bounds;

                if (!latLngCenter && (markers.length > 1)) {
                    bounds = maps.getBounds(markers);
                    map.fitBounds(bounds);
                }
            },
            initClusterer: function (map, markers) {
                if (window.MarkerClusterer) {
                    var mapMarkers = maps.addMarkers(markers, map),
                        clusterer = maps.setClusterer(map, mapMarkers);

                    map.set("clusterer", clusterer);

                    google.maps.event.addListener(clusterer, "clusterclick", maps.checkCluster);
                }
            },
            offsetCenter: function (map, jsonData) {
                if (jsonData.offsetCenter) {
                    var x = util.getNumber(jsonData.offsetCenter.x),
                        y = util.getNumber(jsonData.offsetCenter.y);

                    map.panBy(x, y);
                }
            },
            getJsonData: function (data) {
                return (typeof data === "string") ? $.parseJSON(data) : data;
            },
            assembleMapOptions: function (markers, jsonData) {
                var zoom = maps.getZoom(jsonData),
                    latLngCenter = maps.getLatLngCenter(jsonData),
                    mapOptions = maps.getMapOptions(markers, zoom, latLngCenter);

                return mapOptions;
            },
            setMap: function (map, markers, jsonData) {
                maps.setCenter(map, markers, jsonData);
                maps.initClusterer(map, markers);
                maps.offsetCenter(map, jsonData);
            },
            getMap: function (data) {
                var mapBlock = this,
                    jsonData = maps.getJsonData(data),
                    markers = maps.getMarkers(jsonData),

                    mapOptions = maps.assembleMapOptions(markers, jsonData),

                    map = new google.maps.Map(mapBlock, mapOptions);

                maps.setMap(map, markers, jsonData);
            },
            setSpinner: function (jqMapBlock) {
                jqMapBlock.trigger("spinner:get");
            },
            getAjaxMap: function (url, mapBlock, jqMapBlock) {
                maps.setSpinner(jqMapBlock);

                $.ajax({
                    url: url,
                    context: mapBlock
                }).done(maps.getMap);
            },
            getJsonMap: function (mapObj, mapBlock, jqMapBlock) {
                maps.setSpinner(jqMapBlock);
                maps.getMap.call(mapBlock, mapObj);
            },
            getMapObj: function (jqMapBlock) {
                var dataMap = jqMapBlock.attr("data-map") || "",
                    mapObj = dataMap ? $.parseJSON(dataMap) : maps["default"];

                return mapObj;
            },
            getMapData: function (mapBlock) {
                var jqMapBlock = $(mapBlock),
                    mapObj = maps.getMapObj(jqMapBlock),
                    url = jqMapBlock.attr("data-map-url"),
                    mapData = url || mapObj,
                    getMap = url ? maps.getAjaxMap : maps.getJsonMap;

                getMap(mapData, mapBlock, jqMapBlock);
            },
            setSingleMap: function (key, mapBlocks) {
                maps.getMapData(mapBlocks[key]);
            },
            setMaps: function () {
                Object.keys(maps.blocks).forEach(function (key) {
                    if (maps.blocks[key].tagName) {
                        maps.getMapData(maps.blocks[key]);
                    }
                });
            },
            init: function () {
                google = window.google;

                maps.setMaps();
            },
            loadGoogelMapApi: function () {
                util.loadScript("https://maps.googleapis.com/maps/api/js?callback=initMaps");
            },
            loadMarkerClusterer: function () {
                util.loadScript("http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/src/markerclusterer.js", maps.loadGoogelMapApi);
            },
            winInitMaps: function () {
                maps.init();

                try {
                    delete window.initMaps;
                } catch (e) {
                    window.initMaps = null;
                }
            },
            initMaps: function () {
                if (maps.blocks.length) {
                    window.initMaps = maps.winInitMaps;

                    maps.loadMarkerClusterer();
                }
            },
            checkLoad: function () {
                if (!isOldIe) {
                    maps.initMaps();
                } else {
                    maps.blocks.remove();
                }
            }
        };

    maps.checkLoad();

}(window));
