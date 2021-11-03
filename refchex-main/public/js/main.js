var CRUMINA = {};
!(function (e) {
    "use strict";
    var n = e(window),
        t = e(document),
        o = e("body"),
        s = e(".fixed-sidebar"),
        a = e("#hellopreloader");
    (CRUMINA.preloader = function () {
        return (
            n.scrollTop(0),
            setTimeout(function () {
                a.fadeOut(800);
            }, 500),
            !1
        );
    }),
        jQuery(".back-to-top").on("click", function () {
            return e("html,body").animate({ scrollTop: 0 }, 1200), !1;
        }),
        e(document).on("click", ".quantity-plus", function () {
            var n = parseInt(e(this).prev("input").val());
            return (
                e(this)
                    .prev("input")
                    .val(n + 1)
                    .change(),
                !1
            );
        }),
        e(document).on("click", ".quantity-minus", function () {
            var n = parseInt(e(this).next("input").val());
            return (
                1 !== n &&
                    e(this)
                        .next("input")
                        .val(n - 1)
                        .change(),
                !1
            );
        }),
        e(function () {
            var n;
            e(document).on("touchstart mousedown", ".number-spinner button", function () {
                var t = e(this),
                    o = t.closest(".number-spinner").find("input");
                t.closest(".number-spinner").find("button").prop("disabled", !1),
                    (n =
                        "up" == t.attr("data-dir")
                            ? setInterval(function () {
                                  null == o.attr("max") || parseInt(o.val()) < parseInt(o.attr("max")) ? o.val(parseInt(o.val()) + 1) : (t.prop("disabled", !0), clearInterval(n));
                              }, 50)
                            : setInterval(function () {
                                  null == o.attr("min") || parseInt(o.val()) > parseInt(o.attr("min")) ? o.val(parseInt(o.val()) - 1) : (t.prop("disabled", !0), clearInterval(n));
                              }, 50));
            }),
                e(document).on("touchend mouseup", ".number-spinner button", function () {
                    clearInterval(n);
                });
        }),
        e('a[data-toggle="tab"]').on("shown.bs.tab", function (n) {
            "#events" === e(n.target).attr("href") && e(".fc-state-active").click();
        }),
        e(".js-sidebar-open").on("click", function () {
            return e("body").outerWidth() <= 560 && e(this).closest("body").find(".popup-chat-responsive").removeClass("open-chat"), e(this).toggleClass("active"), e(this).closest(s).toggleClass("open"), !1;
        }),
        n.keydown(function (e) {
            27 == e.which && s.is(":visible") && s.removeClass("open");
        }),
        t.on("click", function (n) {
            !e(n.target).closest(s).length && s.is(":visible") && s.removeClass("open");
        });
    var i = e(".window-popup");
    e(".js-open-popup").on("click", function (n) {
        var t = e(this).data("popup-target"),
            s = i.filter(t),
            a = e(this).offset();
        return s.addClass("open"), s.css("top", a.top - s.innerHeight() / 2), o.addClass("overlay-enable"), !1;
    }),
        n.keydown(function (n) {
            27 == n.which &&
                (i.removeClass("open"),
                o.removeClass("overlay-enable"),
                e(".profile-menu").removeClass("expanded-menu"),
                e(".popup-chat-responsive").removeClass("open-chat"),
                e(".profile-settings-responsive").removeClass("open"),
                e(".header-menu").removeClass("open"),
                e(".js-sidebar-open").removeClass("active"));
        }),
        t.on("click", function (n) {
            e(n.target).closest(i).length ||
                (i.removeClass("open"), o.removeClass("overlay-enable"), e(".profile-menu").removeClass("expanded-menu"), e(".header-menu").removeClass("open"), e(".profile-settings-responsive").removeClass("open"));
        }),
        e("[data-toggle=tab]").on("click", function () {
            if (e(this).hasClass("active") && e(this).closest("ul").hasClass("mobile-app-tabs")) return e(e(this).attr("href")).toggleClass("active"), e(this).removeClass("active"), !1;
        }),
        e(".js-close-popup").on("click", function () {
            return e(this).closest(i).removeClass("open"), o.removeClass("overlay-enable"), !1;
        }),
        e(".profile-settings-open").on("click", function () {
            return e(".profile-settings-responsive").toggleClass("open"), !1;
        }),
        e(".js-expanded-menu").on("click", function () {
            return e(".header-menu").toggleClass("expanded-menu"), !1;
        }),
        e(".js-chat-open").on("click", function () {
            return e(".popup-chat-responsive").toggleClass("open-chat"), !1;
        }),
        e(".js-chat-close").on("click", function () {
            return e(".popup-chat-responsive").removeClass("open-chat"), !1;
        }),
        e(".js-open-responsive-menu").on("click", function () {
            return e(".header-menu").toggleClass("open"), !1;
        }),
        e(".js-close-responsive-menu").on("click", function () {
            return e(".header-menu").removeClass("open"), !1;
        }),
        (CRUMINA.perfectScrollbarInit = function () {
            var n = e(".popup-chat .mCustomScrollbar");
            e(".mCustomScrollbar").perfectScrollbar({ wheelPropagation: !1 }), n.length && (n.scrollTop(n.prop("scrollHeight")), n.perfectScrollbar("update"));
        }),
        (CRUMINA.responsive = {
            $profilePanel: null,
            $desktopContainerPanel: null,
            $responsiveContainerPanel: null,
            init: function () {
                (this.$profilePanel = jQuery("#profile-panel")),
                    (this.$desktopContainerPanel = jQuery("#desktop-container-panel > .ui-block")),
                    (this.$responsiveContainerPanel = jQuery("#responsive-container-panel .ui-block")),
                    this.update();
            },
            mixPanel: function () {
                window.matchMedia("(max-width: 1024px)").matches ? this.$responsiveContainerPanel.append(this.$profilePanel) : this.$desktopContainerPanel.append(this.$profilePanel);
            },
            update: function () {
                var n = this,
                    t = null;
                e(window)
                    .on("resize", function () {
                        null === t &&
                            (t = window.setTimeout(function () {
                                (t = null), n.mixPanel();
                            }, 300));
                    })
                    .resize();
            },
        }),
        t.ready(function () {
            CRUMINA.perfectScrollbarInit(),
                void 0 !== e.fn.gifplayer && e(".gif-play-image").gifplayer(),
                void 0 !== e.fn.mediaelementplayer && e("#mediaplayer").mediaelementplayer({ features: ["prevtrack", "playpause", "nexttrack", "loop", "shuffle", "current", "progress", "duration", "volume"] }),
                CRUMINA.responsive.init();
        });
})(jQuery)
    // $(document).ready(function () {
    //     var e = window.location.href;
    //     e.indexOf("crumina.net") + 1 == 0 &&
    //         e.indexOf("themeforest.net") + 1 == 0 &&
    //         setTimeout(function () {
    //             document.getElementsByTagName("html")[0].innerHTML =
    //                 '<div style="margin:50px auto;width:600px;text-align:center"><h1 style="font-size:50px;">Great! You like my template!</h1><div style="font-size:30px; color: #3db390"><a href="https://goo.gl/B6Y9qs" style="color: #007bcb">Please purchase it</a> if you\'d like to use it further</div> <p>or delete my tracking code if you wan\'t to get rid of this message and use it illegally :(</p></div>';
    //         }, 1e4);
    // });
