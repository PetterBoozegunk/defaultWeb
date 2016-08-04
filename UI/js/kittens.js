/*jslint browser: true */
// Replace 400 and 500 error images with a kitten.
(function (window) {
    "use strict";

    var $ = window.jQuery,
        images = {
            loadedImages: {},
            setKitten: function (img) {
                img.src = "/shopUi/images/dummies/cute-kitten.jpg";
            },
            ajaxMethods: {
                error: function () {
                    var img = this;

                    images.setKitten(img);
                    images.loadedImages[img.src] = false;
                },
                success: function () {
                    var img = this;

                    images.loadedImages[img.src] = true;
                }
            },
            getAjaxOptions: function (img) {
                var url = img.src,
                    ajaxOptions = images.ajaxMethods;

                ajaxOptions.url = url;
                ajaxOptions.context = img;

                return ajaxOptions;
            },
            getImage: function (key) {
                var img = this[key],
                    ajaxOptions = images.getAjaxOptions(img);

                $.ajax(ajaxOptions);
            },
            chooseAction: function (img, key, imageLoaded) {
                if (imageLoaded === undefined) {
                    images.getImage.call(this, key);
                } else if (imageLoaded === false) {
                    images.setKitten(img);
                }
            },
            checkImage: function (key) {
                var img = this[key],
                    src = img.src,
                    imageLoaded = images.loadedImages[src];

                images.chooseAction.call(this, img, key, imageLoaded);
            },
            checkImages: function () {
                var imgs = document.images;

                Object.keys(imgs).forEach(images.checkImage, imgs);
            },
            triggerImageCover: function () {
                $("body").trigger("imageCover:run");
            },
            bindEvents: function () {
                var body = $("body");

                body.on("load", "img", images.triggerImageCover);
                body.on("images:check", images.checkImages);
            },
            addKittensIfLocalHost: function () {
                var isLocalhost = /^localhost/.test(document.location.hostname),
                    is3000Port = /^3000$/.test(document.location.port);

                return isLocalhost || is3000Port;
            },
            checkInlineBGImages: function () {
                var allInlineBgImageElems = $("body [style*=background-image]");

                allInlineBgImageElems.each(function () {
                    var orgImg = this,
                        tempImg = document.createElement("img");

                    tempImg.className = "temp-kitten-check";
                    tempImg.src = orgImg.style.backgroundImage.replace(/(^url\([\"]?|[\"]?\))/g, "");

                    $(tempImg).on("load", function () {
                        orgImg.style.backgroundImage = "url(\"" + this.src + "\")";

                        document.body.removeChild(tempImg);
                    });

                    $("body").prepend(tempImg);
                });
            },
            initDelay: function () {
                images.bindEvents();
                images.checkInlineBGImages();
                images.checkImages();
            },
            init: function () {
                if (images.addKittensIfLocalHost()) {
                    setTimeout(images.initDelay, 1000);
                }
            }
        };

    images.init();

}(window));
