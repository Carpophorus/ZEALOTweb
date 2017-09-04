(function(global) {

  var ZEALOT = {};

  ZEALOT.browserWidth;
  ZEALOT.browserHeight;
  ZEALOT.popupWidth;
  ZEALOT.mainWidthSmall;
  ZEALOT.mainWidthLarge;
  ZEALOT.x = 1;
  ZEALOT.adminPrivilegesGranted;
  ZEALOT.idSectorForStats = 0;
  ZEALOT.idOperatorForStats = 0;
  ZEALOT.idStatusForTicket = 0;
  ZEALOT.idTypeForTicket = 0;
  ZEALOT.idCompanyForTicket = 0;
  ZEALOT.clientNameForTicket = 0;
  ZEALOT.clientPhoneForTicket = 0;
  ZEALOT.idSectorForTicket = 0;
  ZEALOT.idOperatorForTicket = 0;
  ZEALOT.idPriorityForTicket = 0;

  var insertHtml = function(selector, html) {
    var targetElem = document.querySelector(selector);
    targetElem.innerHTML = html;
  };

  ZEALOT.thumbEnter = function() {
    $(".thumb").css({
      "cursor": "pointer",
      "color": "#00b3b3",
      "background-color": "#003d3d"
    });
    $(".under-thumb-container").css({
      "background-color": "#003d3d"
    });
  };

  ZEALOT.thumbLeave = function() {
    $(".thumb").css({
      "cursor": "default",
      "color": "#003d3d",
      "background-color": "#00b3b3"
    });
    $(".under-thumb-container").css({
      "background-color": "#00b3b3"
    });
  };

  ZEALOT.thumbClick = function() {
    var thumb = $(".thumb i");
    var popup = $(".sidebar-popup");
    var main = $(".main-panel");
    if (thumb.hasClass("fa-chevron-left")) {
      thumb.removeClass("fa-chevron-left");
      thumb.addClass("fa-chevron-right");
      popup.css({
        "margin-left": -ZEALOT.popupWidth + 1,
        "transition": ".75s"
      });
      if (ZEALOT.mainWidthSmall == 0) {
        main.css({
          "margin-right": 0,
          "transition": "0.75s"
        });
      } else {
        main.css({
          "width": ZEALOT.mainWidthLarge,
          "transition": "0.75s"
        });
      }
    } else if (thumb.hasClass("fa-chevron-right")) {
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
        main.css({
          "width": ZEALOT.mainWidthSmall,
          "transition": "0.75s"
        });
      }
    }
  };

  ZEALOT.sidebarButtonClick = function(e) {
    if ($(e).hasClass("active")) return;
    $(".sidebar .sidebar-button").removeClass("active");
    $(e).addClass("active");
    if ($(e).hasClass("inbox-button")) {} else if ($(e).hasClass("contacts-button")) {} else if ($(e).hasClass("admin-settings-button")) {} else if ($(e).hasClass("account-settings-button")) {} else if ($(e).hasClass("statistics-button")) {}
  };

  ZEALOT.mainLoaded = function(e) {
    ZEALOT.browserWidth = window.innerWidth;
    ZEALOT.browserHeight = window.innerHeight;
    var nineVH = $(".sidebar").width();
    if (ZEALOT.browserWidth < 992) {
      ZEALOT.popupWidth = Math.round(ZEALOT.browserWidth - nineVH - ZEALOT.x);
      ZEALOT.mainWidthSmall = 0;
      ZEALOT.mainWidthLarge = Math.round(ZEALOT.browserWidth - nineVH - ZEALOT.x);
    } else {
      ZEALOT.popupWidth = 333;
      ZEALOT.mainWidthSmall = Math.round(ZEALOT.browserWidth - 2 * nineVH - ZEALOT.popupWidth - ZEALOT.x);
      ZEALOT.mainWidthLarge = Math.round(ZEALOT.browserWidth - 2 * nineVH - ZEALOT.x);
    }
    $(".sidebar-popup").css({
      "width": ZEALOT.popupWidth
    });
    if (ZEALOT.mainWidthSmall == 0) {
      $(".main-panel").css({
        "width": ZEALOT.mainWidthLarge,
        "margin-right": -(ZEALOT.mainWidthLarge)
      });
    } else {
      $(".main-panel").css({
        "width": ZEALOT.mainWidthSmall
      });
    }
    $(e).remove();
  };

  ZEALOT.statsLoaded = function(e) {
    $(".stats-progress-bar").addClass("stats-progress-bar-loaded");
    $(e).remove();
  };

  ZEALOT.ticketsLoaded = function(e) {
    $('[data-toggle="tooltip"]').tooltip();
    $(e).remove();
  };

  ZEALOT.ticketLoaded = function(e) {
    ZEALOT.idStatusForTicket = 0;
    ZEALOT.idTypeForTicket = 0;
    ZEALOT.idCompanyForTicket = 0;
    ZEALOT.clientNameForTicket = 0;
    ZEALOT.clientPhoneForTicket = 0;
    ZEALOT.idSectorForTicket = 0;
    ZEALOT.idOperatorForTicket = 0;
    ZEALOT.idPriorityForTicket = 0;
    tinymce.init({
      selector: '#tinymce-editor',
      menubar: false,
      branding: false,
      statusbar: false,
      height: Math.round(ZEALOT.browserHeight * 0.64),
      plugins: [
        'advlist autolink lists link image charmap print preview anchor',
        'searchreplace visualblocks code fullscreen',
        'insertdatetime media table contextmenu paste code'
      ],
      toolbar: 'undo redo | insert | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image'
    });
    $(".scrollable-hotfix").css({
      "height": Math.round(ZEALOT.browserHeight * 0.91 - 33)
    });
    $(".scrollable-hotfix").scrollTop($(".scrollable-hotfix")[0].scrollHeight);
    $(".mec-editor-toggle").on("mouseenter", function() {
      $(".mec-menu").css({
        "background-color": "#003d3d"
      });
      $(".mec-editor-toggle").css({
        "color": "#00b3b3"
      });
    });
    $(".mec-editor-toggle").on("mouseleave", function() {
      $(".mec-menu").css({
        "background-color": "#00b3b3"
      });
      $(".mec-editor-toggle").css({
        "color": "#003d3d"
      });
    });
    $(".mec-editor-toggle").on("click", function() {
      if ($(".mec-editor-toggle").hasClass("fa-chevron-up")) {
        $(".mec-editor-toggle").removeClass("fa-chevron-up");
        $(".mec-editor-toggle").addClass("fa-chevron-down");
        $(".mec-send").removeClass("gone");
        $(".mec-internal").removeClass("gone");
        $(".mail-editor-container").css({
          "height": Math.round(33 + ZEALOT.browserHeight * 0.64)
        });
        $(".main-panel-ticket").css({
          "height": Math.round(ZEALOT.browserHeight * 0.27 - 33)
        });
      } else if ($(".mec-editor-toggle").hasClass("fa-chevron-down")) {
        $(".mec-editor-toggle").removeClass("fa-chevron-down");
        $(".mec-editor-toggle").addClass("fa-chevron-up");
        $(".mec-send").addClass("gone");
        $(".mec-internal").addClass("gone");
        $(".mail-editor-container").css({
          "height": 33
        });
        $(".main-panel-ticket").css({
          "height": Math.round(ZEALOT.browserHeight * 0.91 - 33)
        });
      }
    });
    $(e).remove();
  };

  ZEALOT.categoryClicked = function(e) {
    $(".category .fa-caret-right").addClass("hidden");
    $(e).find(".fa-caret-right").removeClass("hidden");
    if (ZEALOT.browserWidth < 992) {
      setTimeout(ZEALOT.thumbClick, 750);
    }
    //make api call
  };

  ZEALOT.adminPrivileges = function(e) {
    //maybe all if hasadminprivileges in user info
    if ($(e).prop("checked") == true) {
      $(".admin-privileges-status").text("UKLJUČENO");
      ZEALOT.adminPrivilegesGranted = 1;
    } else {
      $(".admin-privileges-status").text("ISKLJUČENO");
      ZEALOT.adminPrivilegesGranted = 0;
    }
    $(".main-panel").text("");
  };

  ZEALOT.statsSectorSelect = function(e, idS) {
    $(".popup-stats div .num").removeClass("fa-check-circle");
    $(".popup-stats div .num").addClass("fa-circle-o");
    $(e).find(".num").removeClass("fa-circle-o");
    $(e).find(".num").addClass("fa-check-circle");
    ZEALOT.idSectorForStats = idS;
    //change datalist in combobox and clear it, ZEALOT.idOperatorForStats = 0
  };

  ZEALOT.operatorSelect = function(e) {
    var val = e.value;
    if (val === "")
      ZEALOT.idOperatorForStats = 0;
    else
      $('#select-operator option').each(function() {
        if (this.value.toUpperCase() === val.toUpperCase()) {
          ZEALOT.idOperatorForStats = $(this).find("#val").attr("value");
        }
      });
  };

  ZEALOT.ticketSelectionSelect = function(e) {
    var val = e.value;
    if (val === "") {
      ZEALOT.idSelectionForTicket = 0;
      $("div[class^='to-']").addClass("gone");
    } else
      $('#select-selection-ticket option').each(function() {
        if (this.value.toUpperCase() === val.toUpperCase()) {
          ZEALOT.idSelectionForTicket = $(this).find("#val").attr("value");
          $("div[class^='to-']").addClass("gone");
          switch ($(this).find("#val").attr("value")) {
            case 1, "1":
              $(".to-status").removeClass("gone");
              $(".to-type").removeClass("gone");
              break;
            case 2, "2":
              $(".to-company").removeClass("gone");
              $(".to-add-company-button").removeClass("gone");
              $(".to-client-name").removeClass("gone");
              $(".to-client-phone").removeClass("gone");
              break;
            case 3, "3":
              $(".to-sector").removeClass("gone");
              $(".to-operator").removeClass("gone");
              break;
            case 4, "4":
              $(".to-priority").removeClass("gone");
              break;
            default:
              break;
          }
          $(".to-save-button").removeClass("gone");
        }
      });
  };

  ZEALOT.ticketSectorSelect = function(e) {
    var val = e.value;
    if (val === "")
      ZEALOT.idSectorForTicket = 0;
    else
      $('#select-sector-ticket option').each(function() {
        if (this.value.toUpperCase() === val.toUpperCase()) {
          ZEALOT.idSectorForTicket = $(this).find("#val").attr("value");
        }
      });
  };

  ZEALOT.ticketOperatorSelect = function(e) {
    var val = e.value;
    if (val === "")
      ZEALOT.idOperatorForTicket = 0;
    else
      $('#select-operator-ticket option').each(function() {
        if (this.value.toUpperCase() === val.toUpperCase()) {
          ZEALOT.idOperatorForTicket = $(this).find("#val").attr("value");
        }
      });
  };

  ZEALOT.contactExpand = function(e) {
    if ($(e).hasClass("fa-chevron-down")) {
      $(e).removeClass("fa-chevron-down");
      $(e).addClass("fa-chevron-up");
    } else if ($(e).hasClass("fa-chevron-up")) {
      $(e).removeClass("fa-chevron-up");
      $(e).addClass("fa-chevron-down");
    }
  };

  //stats button onclick = load main-panel snp after api call, call itself every 5 minutes unless other tab selected

  global.$ZEALOT = ZEALOT;

})(window);
