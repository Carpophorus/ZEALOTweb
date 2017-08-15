(function (global) {

    var ZEALOT = {};

    ZEALOT.browserWidth;
    ZEALOT.browserHeight;
    ZEALOT.popupWidth;
    ZEALOT.mainWidthSmall;
    ZEALOT.mainWidthLarge;
    ZEALOT.x = 3;

    var insertHtml = function (selector, html) {
        var targetElem = document.querySelector(selector);
        targetElem.innerHTML = html;
    };

    ZEALOT.thumbEnter = function () {
      $(".thumb").css({
          "cursor": "pointer",
          "color": "#00b3b3",
          "background-color": "#003d3d"
      });
      $(".under-thumb-container").css({"background-color": "#003d3d"});
    };

    ZEALOT.thumbLeave = function () {
      $(".thumb").css({
          "cursor": "default",
          "color": "#003d3d",
          "background-color": "#00b3b3"
      });
      $(".under-thumb-container").css({"background-color": "#00b3b3"});
    };

    ZEALOT.thumbClick = function () {
      var thumb = $(".thumb i");
      var popup = $(".sidebar-popup");
      var main = $(".main-panel");
      if (thumb.hasClass("fa-chevron-left")) {
        thumb.removeClass("fa-chevron-left");
        thumb.addClass("fa-chevron-right");
        popup.css({
          "margin-left": -ZEALOT.popupWidth,
          "transition": ".75s"
        });
        if (ZEALOT.mainWidthSmall == 0) {
          main.css({
            "margin-right": 0,
            "transition": "0.75s"
          });
        } else {
          main.css({"width": ZEALOT.mainWidthLarge, "transition": "0.75s"});
        }
      }
      else if (thumb.hasClass("fa-chevron-right")) {
        thumb.removeClass("fa-chevron-right");
        thumb.addClass("fa-chevron-left");
        popup.css({
          "margin-left": 0,
          "transition": ".75s"
        });
        if (ZEALOT.mainWidthSmall == 0) {
          $(".main-panel").css({
            "margin-right": -(ZEALOT.mainWidthLarge),
            "transition": "0.75s"
          });
        } else {
          main.css({"width": ZEALOT.mainWidthSmall, "transition": "0.75s"});
        }
      }
    };

    ZEALOT.mainLoaded = function (e) {
      ZEALOT.browserWidth = window.innerWidth;
      ZEALOT.browserHeight = window.innerHeight;
      var nineVH = $(".sidebar").width();
      if (ZEALOT.browserWidth < 992) {
        ZEALOT.popupWidth = Math.round(ZEALOT.browserWidth - nineVH - ZEALOT.x);
        ZEALOT.mainWidthSmall = 0;
        ZEALOT.mainWidthLarge = Math.round(ZEALOT.browserWidth - nineVH - ZEALOT.x);
      } else {
        ZEALOT.popupWidth = 333;
        ZEALOT.mainWidthSmall = Math.round(ZEALOT.browserWidth - 2*nineVH - ZEALOT.popupWidth - ZEALOT.x);
        ZEALOT.mainWidthLarge = Math.round(ZEALOT.browserWidth - 2*nineVH - ZEALOT.x);
      }
      $(".sidebar-popup").css({"width": ZEALOT.popupWidth});
      if (ZEALOT.mainWidthSmall == 0) {
        $(".main-panel").css({
          "width": ZEALOT.mainWidthLarge,
          "margin-right": -(ZEALOT.mainWidthLarge)
        });
      } else {
        $(".main-panel").css({"width": ZEALOT.mainWidthSmall});
      }
      $(e).remove();
    };

    global.$ZEALOT = ZEALOT;

})(window);
