/*jslint browser: true */
(function (window) {
    "use strict";

    var $ = window.jQuery,
        google,
        maps,
        ua = window.navigator.userAgent,
        isOldIe = /MSIE\s[678]/.test(ua);

    maps = {
        blocks: $(".googleMap"),
        "default": {
            markers: [{ "lat": 59.334156, "lng": 18.098511, "title": "Cloudnine" }], // linnégatan 89e
            zoom: 13
        },
        getLatLng: function (marker) {
            var lat = marker.lat,
                lng = marker.lng;

            return new google.maps.LatLng(lat, lng);
        },
        getBounds: function (markers) {
            var bounds = new google.maps.LatLngBounds(),
                latlng,
                i,
                l = markers.length;

            for (i = 0; i < l; i += 1) {
                latlng = maps.getLatLng(markers[i]);
                bounds.extend(latlng);
            }

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
                "zoom": zoom,
                "scrollwheel": false
            };
        },
        getMarkers: function (data) {
            var markers = data.markers || maps["default"].markers;

            return markers;
        },
        getAddressObject: function (marker) {
            var newAddressObject = {
                "address": $.trim(marker.address || ""),
                "postalCode": $.trim(marker.postalCode || ""),
                "city": $.trim(marker.city || "")
            };

            return newAddressObject;
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
                mapMarker = new google.maps.Marker({
                    position: latLng,
                    map: map,
                    //icon: markerIcon,
                    title: marker.title || "",
                    address: maps.getAddressObject(marker),
                    url: url || ""
                });

            if (url) {
                google.maps.event.addListener(mapMarker, "click", function () {
                    document.location = url;
                });
            }

            return mapMarker;
        },
        addMarkers: function (markers, map) {
            var i,
                l = markers.length,
                mapMarkers = [];

            for (i = 0; i < l; i += 1) {
                mapMarkers.push(maps.addMarker(markers[i], map));
            }

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
                sharedPosition = 0,
                position,
                i,
                l = markers.length,
                allMarkersHaveTheSamePosition;

            for (i = 0; i < l; i += 1) {
                position = markers[i].getPosition().toString();

                if (position === lastPosition) {
                    sharedPosition += 1;
                }

                lastPosition = position;
            }

            allMarkersHaveTheSamePosition = (sharedPosition === markers.length);

            return allMarkersHaveTheSamePosition;
        },
        getAddressHtmlStr: function (marker) {
            var address = marker.address,
                addressDiv = "";

            if (address.address || address.postalCode || address.city) {
                addressDiv = "<div class=\"address\">";

                if (address.address) {
                    addressDiv += "<p>" + address.address + "</p>";
                }

                if (address.postalCode || address.city) {
                    addressDiv += "<p>" + $.trim(address.postalCode + " " + address.city) + "</p>";
                }

                addressDiv += "</div>";
            }

            return addressDiv;
        },
        getMarkerUlListStyle: function (jqMapDiv) {
            var width = jqMapDiv.width(),
                height = jqMapDiv.height(),
                ofs = jqMapDiv.offset(),
                top = Math.round(ofs.top),
                left = Math.round(ofs.left),
                ulHeight = Math.round(height / 1.2),
                ulWidth = Math.round(width / 2),
                ulMarginTop = Math.round(((height - ulHeight) / 2) - 10),
                ulMarginLeft = Math.round((width - ulWidth) / 2),
                ulCss = {
                    width: ulWidth,
                    height: ulHeight,
                    top: top,
                    left: left,
                    marginTop: ulMarginTop,
                    marginLeft: ulMarginLeft
                };

            return ulCss;
        },
        removeMarkerList: function () {
            var that = this,
                jqMapDiv = $(that.getDiv());

            jqMapDiv.next("ul.markersList").remove();
        },
        showMarkerList: function (cluster, markers) {
            var ul = $("<ul class=\"markersList\" />"),
                addressHtmlStr,
                li,
                i,
                l = markers.length,
                map = cluster.getMap(),
                jqMapDiv = $(map.getDiv()),
                ulCss = maps.getMarkerUlListStyle(jqMapDiv);

            for (i = 0; i < l; i += 1) {
                addressHtmlStr = maps.getAddressHtmlStr(markers[i]);
                li = $("<li><a href=\"" + markers[i].url + "\"><h2>" + markers[i].title + "</h2>" + addressHtmlStr + "</a></li>");

                ul.append(li);
            }

            jqMapDiv.next("ul.markersList").remove();

            ul.css(ulCss);
            jqMapDiv.after(ul);
        },
        removeEvents: function (mapEventsObjArray) {
            while (mapEventsObjArray[0]) {
                google.maps.event.removeListener(mapEventsObjArray[0]);
                mapEventsObjArray.shift();
            }
        },
        removeMultipleEvents: function (map, events) {
            var evts = events.split(" "),
                i,
                l = evts.length,
                mapEventsObj = map.get("eventsObj") || {};

            for (i = 0; i < l; i += 1) {
                if (mapEventsObj[evts[i]]) {
                    maps.removeEvents(mapEventsObj[evts[i]]);
                }
            }
        },
        addMultipleEvents: function (map, events, func) {
            var evts = events.split(" "),
                i,
                l = evts.length,
                mapEventsObj = map.get("eventsObj") || {};

            for (i = 0; i < l; i += 1) {
                if (!mapEventsObj[evts[i]]) {
                    mapEventsObj[evts[i]] = [];
                }

                mapEventsObj[evts[i]].push(google.maps.event.addListener(map, evts[i], func));
            }

            map.set("eventsObj", mapEventsObj);
        },
        checkCluster: function (cluster) {
            var markers = cluster.getMarkers(),
                map = cluster.getMap(),
                allMarkersHaveTheSamePosition = maps.allMarkersHaveTheSamePosition(markers),
                events = "click drag center_changed zoom_changed";

            if (allMarkersHaveTheSamePosition) {
                maps.removeMultipleEvents(map, events);
                maps.showMarkerList(cluster, markers);

                setTimeout(function () {
                    maps.addMultipleEvents(map, events, maps.removeMarkerList);
                }, 100);
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
        setMap: function (data) {
            var mapBlock = this,
                jsonData = (typeof data === "string") ? $.parseJSON(data) : data,
                markers = maps.getMarkers(jsonData),
                zoom = maps.getZoom(jsonData),
                latLngCenter = maps.getLatLngCenter(jsonData),
                mapOptions = maps.getMapOptions(markers, zoom, latLngCenter),
                map = new google.maps.Map(mapBlock, mapOptions),
                bounds,
                mapMarkers,
                clusterer;

            mapMarkers = maps.addMarkers(markers, map);

            if (!latLngCenter && (markers.length > 1)) {
                bounds = maps.getBounds(markers);
                map.fitBounds(bounds);
            }

            if (window.MarkerClusterer) {
                clusterer = maps.setClusterer(map, mapMarkers);
                map.set("clusterer", clusterer);

                google.maps.event.addListener(clusterer, "clusterclick", maps.checkCluster);
            }

            if (jsonData.offsetCenter) {
                map.panBy(jsonData.offsetCenter.x || 0, jsonData.offsetCenter.y || 0);
            }
        },
        setSpinner: function (jqMapBlock) {
            jqMapBlock.trigger("spinner:get");
        },
        getMapData: function (mapBlock) {
            var jqMapBlock = $(mapBlock),
                url = jqMapBlock.attr("data-map-url") || "",
                dataMap = jqMapBlock.attr("data-map") || "",
                mapObj = dataMap ? $.parseJSON(dataMap) : null;

            maps.setSpinner(jqMapBlock);

            if (url) {
                $.ajax({
                    url: url,
                    context: mapBlock
                }).done(maps.setMap);
            } else if (mapObj) {
                maps.setMap.call(mapBlock, mapObj);
            }
        },
        init: function () {
            var mapBlocks = maps.blocks,
                i,
                l = mapBlocks.length;

            google = window.google;

            for (i = 0; i < l; i += 1) {
                maps.getMapData(mapBlocks[i]);
            }
        },
        loadScript: function (scriptUrl, callback) {
            var script = document.createElement("script");

            script.type = "text/javascript";
            script.src = scriptUrl;

            if (callback) {
                $(script).on("load", callback);
            }

            document.body.appendChild(script);
        },
        loadGoogelMapApi: function () {
            maps.loadScript("https://maps.googleapis.com/maps/api/js?callback=initMaps");
        },
        loadMarkerClusterer: function () {
            maps.loadScript("http://google-maps-utility-library-v3.googlecode.com/svn/trunk/markerclusterer/src/markerclusterer.js", maps.loadGoogelMapApi);
        }
    };

    if (!isOldIe) {
        if (maps.blocks.length) {
            window.initMaps = function () {
                maps.init();

                try {
                    delete window.initMaps;
                } catch (e) {
                    window.initMaps = null;
                }
            };

            maps.loadMarkerClusterer();
        }
    } else {
        maps.blocks.remove();
    }

}(window));