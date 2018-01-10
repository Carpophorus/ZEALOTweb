(function(global) {

  ZEALOT = {};

  ZEALOT.browserWidth;
  ZEALOT.browserHeight;
  ZEALOT.popupWidth;
  ZEALOT.mainWidthSmall;
  ZEALOT.mainWidthLarge;
  ZEALOT.x = 1;
  ZEALOT.adminPrivilegesGranted = false;
  ZEALOT.hideClicked = false;
  ZEALOT.idTicketCurrent = 0;
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

  //ZEALOT.apiRoot = "https://zealott.azurewebsites.net/api/";
  ZEALOT.apiRoot = "http://localhost:50358/api/";
  ZEALOT.userInfo = "";
  ZEALOT.allOperators = "";
  ZEALOT.allSectors = "";
  ZEALOT.allTicketTypes = "";
  ZEALOT.allTicketStatuses = "";
  ZEALOT.allTicketPriorities = "";
  ZEALOT.allCompanies = "";
  ZEALOT.s0 = "";
  ZEALOT.s1 = "";
  ZEALOT.s2 = "";
  ZEALOT.s3 = "";
  var specialCounters = {};
  ZEALOT.nc = false;

  $.trumbowyg.svgPath = 'wyg/ui/icons.svg';

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
    if ($(e).hasClass("inbox-button")) {
      ZEALOT.loadSidebarTickets();
    } else if ($(e).hasClass("contacts-button")) {
      ZEALOT.loadSidebarContacts();
    } else if ($(e).hasClass("admin-settings-button")) {
      //
    } else if ($(e).hasClass("account-settings-button")) {
      ZEALOT.loadSidebarAccount();
    } else if ($(e).hasClass("statistics-button")) {
      ZEALOT.loadSidebarStats();
    }
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
    $(".stats-progress-bar").animate({
        width: $(".stats-progress-bar").parent().width() + 15
      }, 180 * 1000, "linear",
      function() {
        if ($(".statistics-button").hasClass("active") && $(".stats-progress-bar").width() > $(".stats-progress-bar").parent().width() + 14)
          ZEALOT.statsSearch();
      });
    $(e).remove();
  };

  ZEALOT.ticketsLoaded = function(e) {
    $('[data-toggle="tooltip"]').tooltip();
    /*$(".pulse").pulsate({
      color: "#b30000",
      reach: 5,
      speed: 666,
      pause: 0,
      glow: true,
      repeat: true,
      onHover: false
    });*/
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
    $("#mail-editor").trumbowyg({
      btnsDef: {
        image: {
          dropdown: ['insertImage', 'base64'],
          ico: 'insertImage'
        }
      },
      btns: [
        ['formatting'],
        ['strong', 'em', 'underline', 'del'],
        ['superscript', 'subscript'],
        ['foreColor', 'backColor'],
        ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
        ['unorderedList', 'orderedList'],
        ['link'],
        ['image'],
        ['horizontalRule'],
        ['removeformat'],
        ['fullscreen']
      ]
    });
    $(".trumbowyg-editor").html(`
      <br>
      <br>
      <br>
      <div id="mail-signature" style="margin-left: 5px">
        <div id="mail-signature-logo" display="inline-block" style="background: url('img/DBS logo.svg') no-repeat; height: 10vh; width: 20vh; background-size: 100% auto"></div>
        <span id="mail-signature-name" style="font-size: 2.7vh; font-weight: bold; display: inline-block; margin-bottom: 10px; padding-top: 10px">` + ZEALOT.userInfo.operatorName + `</span>
        <br><span style="font-size: 2vh; font-style: italic; display: inline-block; min-width: 10vh; line-height: 1.2">sektor:</span><span id="mail-signature-sector" style="font-size: 2vh; line-height: 1.2">` + ZEALOT.userInfo.sectorName + `</span>
        <br><span style="font-size: 2vh; font-style: italic; display: inline-block; min-width: 10vh; line-height: 1.2">e-mail:</span><span id="mail-signature-email" style="font-size: 2vh; line-height: 1.2">` + ZEALOT.userInfo.username + `</span>
        <br><span style="font-size: 2vh; font-style: italic; display: inline-block; min-width: 10vh; line-height: 1.2">telefon:</span><span id="mail-signature-phone" style="font-size: 2vh; line-height: 1.2">` + ZEALOT.userInfo.phone + `</span>
        <div id="mail-signature-eco" style="margin-top: 3vh; margin-bottom: 3vh; height: 3vh">
          <div id="mail-signature-leaf" alt="leaf" style="background: url('img/green leaf.svg') no-repeat; height: 3vh; width: 3vh; background-size: 100% auto; display: inline-block"></div>
          <div id="mail-signature-eco-notice" style="color: #00b3b3; font-size: 1.2vh; line-height: 1.5vh; display: inline-block; margin-top: -0.5vh; vertical-align: 0.5vh; padding-left: 0.5vh">
            Molimo Vas da odštampate ovu poruku samo ukoliko je to neophodno.
            <br>Please print this e-mail only if necessary.
          </div>
        </div>
      </div>
    `);
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
        $(".trumbowyg-editor").css({
          "height": Math.round(ZEALOT.browserHeight * 0.64 - $(".trumbowyg-button-pane").height()),
          "min-height": 0,
          "padding": 0
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

  ZEALOT.hideOrShowTicket = function(e, idT, u) {
    if (u) return;
    ZEALOT.hideClicked = true;
    $.confirm({
      theme: "material",
      title: "Potvrda akcije",
      content: "Da li želite da " + ($(e).hasClass("tc-hide") ? "sakrijete" : "otkrijete") + " tiket " + idT + "?",
      type: ($(e).hasClass("tc-hide") ? "red" : "green"),
      typeAnimated: true,
      buttons: {
        no: {
          text: "NE",
          action: function() {}
        },
        yes: {
          text: "DA",
          btnClass: ($(e).hasClass("tc-hide") ? "btn-red" : "btn-green"),
          action: function() {
            if ($(e).hasClass("tc-hide")) {
              $ajaxUtils.sendGetRequest(
                ZEALOT.apiRoot + "hideTicket" + "?idT=" + idT,
                function(responseArray, status) {},
                true /*, ZEALOT.bearer*/
              );
            } else {
              $ajaxUtils.sendGetRequest(
                ZEALOT.apiRoot + "showTicket" + "?idT=" + idT,
                function(responseArray, status) {},
                true /*, ZEALOT.bearer*/
              );
            }
            $(e).parent().addClass("gone");
          }
        }
      }
    });
  };

  ZEALOT.sendMail = function() {
    $.confirm({
      theme: "material",
      title: "Potvrda akcije",
      content: "Da li želite da pošaljete ovaj mail klijentu?",
      type: "red",
      typeAnimated: true,
      autoClose: 'no|10000',
      buttons: {
        no: {
          text: "NE",
          action: function() {}
        },
        yes: {
          text: "DA",
          btnClass: "btn-red",
          action: function() {
            $ajaxUtils.sendPostRequest(
              ZEALOT.apiRoot + "newOperatorMessage" + "?idT=" + ZEALOT.idTicketCurrent + "&iI=false" + "&body=" + encodeURIComponent($(".trumbowyg-editor").html()) + "&idO=" + ZEALOT.userInfo.idOperator,
              function(responseArray, status) {
                ZEALOT.loadSidebarTickets();
                $(".main-panel-ticket").html($(".main-panel-ticket").html() + `
                  <div class="operator-message">
                    ` + $(".trumbowyg-editor").html() + `
                    <div class="unselectable speechdart">◥</div>
                    <div class="timestamp">` + ZEALOT.userInfo.operatorName + ` &bull; just now</div>
                  </div>
                `);
                $(".trumbowyg-editor").html(`
                  <br>
                  <br>
                  <br>
                  <div id="mail-signature" style="margin-left: 5px">
                    <div id="mail-signature-logo" display="inline-block" style="background: url('img/DBS logo.svg') no-repeat; height: 10vh; width: 20vh; background-size: 100% auto"></div>
                    <span id="mail-signature-name" style="font-size: 2.7vh; font-weight: bold; display: inline-block; margin-bottom: 10px; padding-top: 10px">` + ZEALOT.userInfo.operatorName + `</span>
                    <br><span style="font-size: 2vh; font-style: italic; display: inline-block; min-width: 10vh; line-height: 1.2">sektor:</span><span id="mail-signature-sector" style="font-size: 2vh; line-height: 1.2">` + ZEALOT.userInfo.sectorName + `</span>
                    <br><span style="font-size: 2vh; font-style: italic; display: inline-block; min-width: 10vh; line-height: 1.2">e-mail:</span><span id="mail-signature-email" style="font-size: 2vh; line-height: 1.2">` + ZEALOT.userInfo.username + `</span>
                    <br><span style="font-size: 2vh; font-style: italic; display: inline-block; min-width: 10vh; line-height: 1.2">telefon:</span><span id="mail-signature-phone" style="font-size: 2vh; line-height: 1.2">` + ZEALOT.userInfo.phone + `</span>
                    <div id="mail-signature-eco" style="margin-top: 3vh; margin-bottom: 3vh; height: 3vh">
                      <div id="mail-signature-leaf" alt="leaf" style="background: url('img/green leaf.svg') no-repeat; height: 3vh; width: 3vh; background-size: 100% auto; display: inline-block"></div>
                      <div id="mail-signature-eco-notice" style="color: #00b3b3; font-size: 1.2vh; line-height: 1.5vh; display: inline-block; margin-top: -0.5vh; vertical-align: 0.5vh; padding-left: 0.5vh">
                        Molimo Vas da odštampate ovu poruku samo ukoliko je to neophodno.
                        <br>Please print this e-mail only if necessary.
                      </div>
                    </div>
                  </div>
                `);
                if ($(".mec-editor-toggle").hasClass("fa-chevron-down")) {
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
              },
              true /*, ZEALOT.bearer*/
            );
            $.confirm({
              theme: "material",
              title: "Promena statusa",
              content: "Koji je novi status za tekući tiket?",
              type: "red",
              typeAnimated: true,
              buttons: {
                cancel: {
                  text: "NE MENJAJ STATUS",
                  action: function() {}
                },
                one: {
                  text: "NEOBRAĐEN",
                  btnClass: "btn-red",
                  action: function() {
                    $ajaxUtils.sendPostRequest(
                      ZEALOT.apiRoot + "editTicket" + "?idT=" + ZEALOT.idTicketCurrent + "&idTs=1",
                      function(responseArray, status) {},
                      true /*, ZEALOT.bearer*/
                    );
                  }
                },
                three: {
                  text: "OBRADA U TOKU",
                  btnClass: "btn-red",
                  action: function() {
                    $ajaxUtils.sendPostRequest(
                      ZEALOT.apiRoot + "editTicket" + "?idT=" + ZEALOT.idTicketCurrent + "&idTs=3",
                      function(responseArray, status) {},
                      true /*, ZEALOT.bearer*/
                    );
                  }
                },
                four: {
                  text: "USPEŠNO KOMPLETIRAN",
                  btnClass: "btn-red",
                  action: function() {
                    $ajaxUtils.sendPostRequest(
                      ZEALOT.apiRoot + "editTicket" + "?idT=" + ZEALOT.idTicketCurrent + "&idTs=4",
                      function(responseArray, status) {},
                      true /*, ZEALOT.bearer*/
                    );
                  }
                }
              }
            });
          }
        }
      }
    });
  };

  ZEALOT.sendInternal = function() {
    $.confirm({
      theme: "material",
      title: "Potvrda akcije",
      content: "Da li želite da pošaljete ovu poruku kao internu?",
      type: "blue",
      typeAnimated: true,
      autoClose: 'no|10000',
      buttons: {
        no: {
          text: "NE",
          action: function() {}
        },
        yes: {
          text: "DA",
          btnClass: "btn-blue",
          action: function() {
            $(".trumbowyg-editor #mail-signature").remove();
            $ajaxUtils.sendPostRequest(
              ZEALOT.apiRoot + "newOperatorMessage" + "?idT=" + ZEALOT.idTicketCurrent + "&iI=true" + "&body=" + encodeURIComponent($(".trumbowyg-editor").html()) + "&idO=" + ZEALOT.userInfo.idOperator,
              function(responseArray, status) {
                $(".main-panel-ticket").html($(".main-panel-ticket").html() + `
                  <div class="internal-message">
                    ` + $(".trumbowyg-editor").html() + `
                    <div class="timestamp">` + ZEALOT.userInfo.operatorName + ` &bull; just now</div>
                  </div>
                `);
                $(".trumbowyg-editor").html(`
                  <br>
                  <br>
                  <br>
                  <div id="mail-signature" style="margin-left: 5px">
                    <div id="mail-signature-logo" display="inline-block" style="background: url('img/DBS logo.svg') no-repeat; height: 10vh; width: 20vh; background-size: 100% auto"></div>
                    <span id="mail-signature-name" style="font-size: 2.7vh; font-weight: bold; display: inline-block; margin-bottom: 10px; padding-top: 10px">` + ZEALOT.userInfo.operatorName + `</span>
                    <br><span style="font-size: 2vh; font-style: italic; display: inline-block; min-width: 10vh; line-height: 1.2">sektor:</span><span id="mail-signature-sector" style="font-size: 2vh; line-height: 1.2">` + ZEALOT.userInfo.sectorName + `</span>
                    <br><span style="font-size: 2vh; font-style: italic; display: inline-block; min-width: 10vh; line-height: 1.2">e-mail:</span><span id="mail-signature-email" style="font-size: 2vh; line-height: 1.2">` + ZEALOT.userInfo.username + `</span>
                    <br><span style="font-size: 2vh; font-style: italic; display: inline-block; min-width: 10vh; line-height: 1.2">telefon:</span><span id="mail-signature-phone" style="font-size: 2vh; line-height: 1.2">` + ZEALOT.userInfo.phone + `</span>
                    <div id="mail-signature-eco" style="margin-top: 3vh; margin-bottom: 3vh; height: 3vh">
                      <div id="mail-signature-leaf" alt="leaf" style="background: url('img/green leaf.svg') no-repeat; height: 3vh; width: 3vh; background-size: 100% auto; display: inline-block"></div>
                      <div id="mail-signature-eco-notice" style="color: #00b3b3; font-size: 1.2vh; line-height: 1.5vh; display: inline-block; margin-top: -0.5vh; vertical-align: 0.5vh; padding-left: 0.5vh">
                        Molimo Vas da odštampate ovu poruku samo ukoliko je to neophodno.
                        <br>Please print this e-mail only if necessary.
                      </div>
                    </div>
                  </div>
                `);
                if ($(".mec-editor-toggle").hasClass("fa-chevron-down")) {
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
              },
              true /*, ZEALOT.bearer*/
            );
          }
        }
      }
    });
  };

  ZEALOT.saveTicketInfo = function() {
    switch (ZEALOT.idSelectionForTicket) {
      case 1, "1": //status & type
        $ajaxUtils.sendPostRequest(
          ZEALOT.apiRoot + "editTicket" + "?idT=" + ZEALOT.idTicketCurrent +
          "&idTs=" + ZEALOT.idStatusForTicket +
          "&idTt=" + ZEALOT.idTypeForTicket,
          function(responseArray, status) {
            $.confirm({
              theme: "material",
              title: "Potvrda akcije",
              content: "Podaci sačuvani.",
              type: "green",
              typeAnimated: true,
              buttons: {
                ok: {
                  text: "OK",
                  btnClass: "btn-green",
                  action: function() {}
                }
              }
            });
          },
          true /*, ZEALOT.bearer*/
        );
        break;
      case 2, "2": //company & client
        $ajaxUtils.sendPostRequest(
          ZEALOT.apiRoot + "editTicket" + "?idT=" + ZEALOT.idTicketCurrent +
          "&idCo=" + ZEALOT.idCompanyForTicket +
          "&cn=" + encodeURIComponent(ZEALOT.clientNameForTicket) +
          "&cp=" + encodeURIComponent(ZEALOT.clientPhoneForTicket),
          function(responseArray, status) {
            $.confirm({
              theme: "material",
              title: "Potvrda akcije",
              content: "Podaci sačuvani.",
              type: "green",
              typeAnimated: true,
              buttons: {
                ok: {
                  text: "OK",
                  btnClass: "btn-green",
                  action: function() {}
                }
              }
            });
          },
          true /*, ZEALOT.bearer*/
        );
        break;
      case 3, "3": //sector & operator
        $ajaxUtils.sendPostRequest(
          ZEALOT.apiRoot + "editTicket" + "?idT=" + ZEALOT.idTicketCurrent +
          "&idS=" + ZEALOT.idSectorForTicket +
          "&idO=" + ZEALOT.idOperatorForTicket,
          function(responseArray, status) {
            $.confirm({
              theme: "material",
              title: "Potvrda akcije",
              content: "Podaci sačuvani.",
              type: "green",
              typeAnimated: true,
              buttons: {
                ok: {
                  text: "OK",
                  btnClass: "btn-green",
                  action: function() {}
                }
              }
            });
          },
          true /*, ZEALOT.bearer*/
        );
        break;
      case 4, "4": //priority
        $ajaxUtils.sendPostRequest(
          ZEALOT.apiRoot + "editTicket" + "?idT=" + ZEALOT.idTicketCurrent +
          "&idTp=" + ZEALOT.idPriorityForTicket,
          function(responseArray, status) {
            $.confirm({
              theme: "material",
              title: "Potvrda akcije",
              content: "Podaci sačuvani.",
              type: "green",
              typeAnimated: true,
              buttons: {
                ok: {
                  text: "OK",
                  btnClass: "btn-green",
                  action: function() {}
                }
              }
            });
          },
          true /*, ZEALOT.bearer*/
        );
        break;
      case 5, "5": //tags
        $ajaxUtils.sendGetRequest(
          ZEALOT.apiRoot + "clearTags" + "?idT=" + ZEALOT.idTicketCurrent,
          function(responseArray, status) {
            var sync = 0;
            var array = $(".to-tags").tagsinput("items");
            var syncmax = array.length;
            for (var i = 0; i < syncmax; i++)
              $ajaxUtils.sendGetRequest(
                ZEALOT.apiRoot + "addTag" + "?idT=" + ZEALOT.idTicketCurrent + "&tag=" + encodeURIComponent(array[i]),
                function(responseArray, status) {
                  sync = sync + 1;
                  if (sync == syncmax)
                    $.confirm({
                      theme: "material",
                      title: "Potvrda akcije",
                      content: "Podaci sačuvani.",
                      type: "green",
                      typeAnimated: true,
                      buttons: {
                        ok: {
                          text: "OK",
                          btnClass: "btn-green",
                          action: function() {}
                        }
                      }
                    });
                },
                true /*, ZEALOT.bearer*/
              );
          },
          true /*, ZEALOT.bearer*/
        );
        break;
      default:
        break;
    }
  };

  ZEALOT.cnChanged = function(e) {
    ZEALOT.clientNameForTicket = $(e).val();
  };

  ZEALOT.cpChanged = function(e) {
    ZEALOT.clientPhoneForTicket = $(e).val();
  };

  ZEALOT.formatDate = function(dateString) {
    var year = dateString.substring(0, 4);
    var month = dateString.substring(5, 7);
    var day = dateString.substring(8, 10);
    var hour = dateString.substring(11, 13);
    var minute = dateString.substring(14, 16);
    var second = dateString.substring(17, 19);
    return ("" + day + "." + month + "." + year + ". " + hour + ":" + minute + ":" + second);
  };

  ZEALOT.injectHTML = function(e, html) {
    var iframedoc = e.document;
    if (e.contentDocument)
      iframedoc = e.contentDocument;
    else if (e.contentWindow)
      iframedoc = e.contentWindow.document;
    if (iframedoc) {
      iframedoc.open();
      iframedoc.writeln(decodeURIComponent(html));
      iframedoc.close();
    }
  };

  ZEALOT.ticketClicked = function(idT, completed) {
    if (ZEALOT.hideClicked) {
      ZEALOT.hideClicked = false;
      return;
    }
    $(".tooltip").addClass("gone");
    $ajaxUtils.sendGetRequest(
      ZEALOT.apiRoot + "getConversation" + "?idT=" + idT,
      function(responseArray, status) {
        ZEALOT.idTicketCurrent = idT;
        var ticketHtml = `
          <div class="title-fixed oswald-blue-semibold">
            Tiket ` + idT + `
            <div class="title-bar"></div>
            <img class="ticket-loaded-helper" src="img/Z white.svg" onload="$ZEALOT.ticketLoaded(this);">
            <div class="ticket-options-container">
              <div class="toc-selection">
                <input id="selection-select-ticket" type="search" list="select-selection-ticket" placeholder="Podešavanje" onfocus="this.placeholder=''" onblur="this.placeholder='Podešavanje'" oninput="$ZEALOT.ticketSelectionSelect(this)">
                <datalist id="select-selection-ticket">
                    ` + ((completed == false) ? `<option value="Status i tip"><div value="1" id="val"></div></option>` : ``) + `
                    <option value="Kompanija i klijent"><div value="2" id="val"></div></option>
                    <option value="Tagovi"><div value="5" id="val"></div></option>
                    ` + ((ZEALOT.adminPrivilegesGranted) ? (`
                    ` + ((completed == false) ? `<option value="Preraspodela"><div value="3" id="val"></div></option>` : ``) + `
                    <option value="Prioritet"><div value="4" id="val"></div></option>
                    `) : ``) + `
                </datalist>
              </div>
              <div class="to-status gone">
                <input id="status-select-ticket" type="search" list="select-status-ticket" placeholder="Status" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Status'" oninput="$ZEALOT.ticketStatusSelect(this)">
                <datalist id="select-status-ticket">
        `;
        for (var i = 0; i < ZEALOT.allTicketStatuses.length; i++)
          if (Number(ZEALOT.allTicketStatuses[i].idSt) <= 4 || Number(ZEALOT.allTicketStatuses[i].idSt) > 4 && ZEALOT.adminPrivilegesGranted)
            ticketHtml += `<option value="` + ZEALOT.allTicketStatuses[i].stn + `"><div value="` + ZEALOT.allTicketStatuses[i].idSt + `" id="val"></div></option>`;
        ticketHtml += `
                </datalist>
              </div>
              <div class="to-type gone">
                <input id="type-select-ticket" type="search" list="select-type-ticket" placeholder="Tip" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Tip'" oninput="$ZEALOT.ticketTypeSelect(this)">
                <datalist id="select-type-ticket">
        `;
        for (var i = 0; i < ZEALOT.allTicketTypes.length; i++)
          ticketHtml += `<option value="` + ZEALOT.allTicketTypes[i].ttpn + `"><div value="` + ZEALOT.allTicketTypes[i].idTtp + `" id="val"></div></option>`;
        ticketHtml += `
                </datalist>
              </div>
              <div class="to-company gone">
                <input id="company-select-ticket" type="search" list="select-company-ticket" placeholder="Kompanija" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Kompanija'" oninput="$ZEALOT.ticketCompanySelect(this)">
                <datalist id="select-company-ticket">
        `;
        for (var i = 0; i < ZEALOT.allCompanies.length; i++)
          ticketHtml += `<option value="` + ZEALOT.allCompanies[i].companyName + `"><div value="` + ZEALOT.allCompanies[i].idCompany + `" id="val"></div></option>`;
        ticketHtml += `
                </datalist>
              </div>
              <div class="to-button-container to-add-company-button gone">
                <button class="to-button" onclick="ZEALOT.addCompany();"><i class="fa fa-plus"></i></button>
              </div>
              <div class="to-client-name gone">
                <input type="text" placeholder="Ime klijenta" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Ime klijenta'" oninput="ZEALOT.cnChanged(this);"></input>
              </div>
              <div class="to-client-phone gone">
                <input type="text" placeholder="Telefon klijenta" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Telefon klijenta'" oninput="ZEALOT.cpChanged(this);"></input>
              </div>
              <div class="to-sector gone">
                <input id="sector-select-ticket" type="search" list="select-sector-ticket" placeholder="Sektor" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Sektor'" oninput="$ZEALOT.ticketSectorSelect(this)">
                <datalist id="select-sector-ticket">
        `;
        for (var i = 0; i < ZEALOT.allSectors.length; i++)
          ticketHtml += `<option value="` + ZEALOT.allSectors[i].scn + `"><div value="` + ZEALOT.allSectors[i].idSc + `" id="val"></div></option>`;
        ticketHtml += `
                </datalist>
              </div>
              <div class="to-operator gone">
                <input id="operator-select-ticket" type="search" list="select-operator-ticket" placeholder="Operater" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Operater'" oninput="$ZEALOT.ticketOperatorSelect(this)">
                <datalist id="select-operator-ticket">
        `;
        for (var i = 0; i < ZEALOT.allOperators.length; i++)
          if (ZEALOT.allOperators[i].idSc != null)
            ticketHtml += `<option value="` + ZEALOT.allOperators[i].onm + `"><div value="` + ZEALOT.allOperators[i].idO + `" id="val"></div></option>`;
        ticketHtml += `
                </datalist>
              </div>
              <div class="to-priority gone">
                <input id="priority-select-ticket" type="search" list="select-priority-ticket" placeholder="Prioritet" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Prioritet'" oninput="$ZEALOT.ticketPrioritySelect(this)">
                <datalist id="select-priority-ticket">
        `;
        for (var i = 0; i < ZEALOT.allTicketPriorities.length; i++)
          ticketHtml += `<option value="` + ZEALOT.allTicketPriorities[i].pn + `"><div value="` + ZEALOT.allTicketPriorities[i].idP + `" id="val"></div></option>`;
        ticketHtml += `
                </datalist>
              </div>
              <div class="to-button-container to-save-button gone">
                <button class="to-button" onclick="ZEALOT.saveTicketInfo();"><i class="fa fa-check"></i></button>
              </div>
            </div>
          </div>
          <input class="to-tags gone">
          <div class="main-panel-ticket scrollable-hotfix conversation-container">
        `;
        for (var i = 0; i < responseArray.length; i++) {
          ticketHtml += `
            <div class="` + ((responseArray[i].side) ? ((responseArray[i].isInternal) ? `internal-message` : `operator-message`) : `client-message`) + `">` +
            ((!responseArray[i].side) ? `<iframe class="message-iframe" src="about:blank" onload="$ZEALOT.injectHTML(this, \`` + encodeURIComponent(responseArray[i].body) + `\`);"></iframe>` : responseArray[i].body) +
            ((responseArray[i].side) ? ((responseArray[i].isInternal) ? `` : `<div class="unselectable speechdart">◥</div>`) : `<div class="unselectable speechdart">◤</div>`) + `
              <div class="timestamp">` + ((responseArray[i].side) ? responseArray[i].onm + ` &bull; ` : "") + ZEALOT.formatDate(responseArray[i].messageCreated) + `</div>
            </div>
          `;
        }
        ticketHtml += `
          </div>
          <div class="mail-editor-container">
            <div class="mec-menu">
              <div class="mec-editor-toggle fa fa-chevron-up"></div>
              <div class="mec-send fa fa-send gone" onclick="ZEALOT.sendMail();"></div>
              <div class="mec-internal fa fa-info-circle gone" onclick="ZEALOT.sendInternal();"></div>
            </div>
            <div class="mec-editor">
              <div id="trumbowyg-icons">
                <svg xmlns="http://www.w3.org/2000/svg"><symbol id="trumbowyg-blockquote" viewBox="0 0 72 72"><path d="M21.3 31.9h-.6c.8-1.2 1.9-2.2 3.4-3.2 2.1-1.4 5-2.7 9.2-3.3l-1.4-8.9c-4.7.7-8.5 2.1-11.7 4-2.4 1.4-4.3 3.1-5.8 4.9-2.3 2.7-3.7 5.7-4.5 8.5-.8 2.8-1 5.4-1 7.5 0 2.3.3 4 .4 4.8 0 .1.1.3.1.4 1.2 5.4 6.1 9.5 11.9 9.5 6.7 0 12.2-5.4 12.2-12.2s-5.5-12-12.2-12zM49.5 31.9h-.6c.8-1.2 1.9-2.2 3.4-3.2 2.1-1.4 5-2.7 9.2-3.3l-1.4-8.9c-4.7.7-8.5 2.1-11.7 4-2.4 1.4-4.3 3.1-5.8 4.9-2.3 2.7-3.7 5.7-4.5 8.5-.8 2.8-1 5.4-1 7.5 0 2.3.3 4 .4 4.8 0 .1.1.3.1.4 1.2 5.4 6.1 9.5 11.9 9.5 6.7 0 12.2-5.4 12.2-12.2s-5.5-12-12.2-12z"/></symbol><symbol id="trumbowyg-bold" viewBox="0 0 72 72"><path d="M51.1 37.8c-1.1-1.4-2.5-2.5-4.2-3.3 1.2-.8 2.1-1.8 2.8-3 1-1.6 1.5-3.5 1.5-5.3 0-2-.6-4-1.7-5.8-1.1-1.8-2.8-3.2-4.8-4.1-2-.9-4.6-1.3-7.8-1.3h-16v42h16.3c2.6 0 4.8-.2 6.7-.7 1.9-.5 3.4-1.2 4.7-2.1 1.3-1 2.4-2.4 3.2-4.1.9-1.7 1.3-3.6 1.3-5.7.2-2.5-.5-4.7-2-6.6zM40.8 50.2c-.6.1-1.8.2-3.4.2h-9V38.5h8.3c2.5 0 4.4.2 5.6.6 1.2.4 2 1 2.7 2 .6.9 1 2 1 3.3 0 1.1-.2 2.1-.7 2.9-.5.9-1 1.5-1.7 1.9-.8.4-1.7.8-2.8 1zm2.6-20.4c-.5.7-1.3 1.3-2.5 1.6-.8.3-2.5.4-4.8.4h-7.7V21.6h7.1c1.4 0 2.6 0 3.6.1s1.7.2 2.2.4c1 .3 1.7.8 2.2 1.7.5.9.8 1.8.8 3-.1 1.3-.4 2.2-.9 3z"/></symbol><symbol id="trumbowyg-close" viewBox="0 0 72 72"><path d="M57 20.5l-5.4-5.4-15.5 15.5-15.6-15.5-5.4 5.4L30.7 36 15.1 51.5l5.4 5.4 15.6-15.5 15.5 15.5 5.4-5.4L41.5 36z"/></symbol><symbol id="trumbowyg-create-link" viewBox="0 0 72 72"><path d="M31.1 48.9l-6.7 6.7c-.8.8-1.6.9-2.1.9s-1.4-.1-2.1-.9L15 50.4c-1.1-1.1-1.1-3.1 0-4.2l6.1-6.1.2-.2 6.5-6.5c-1.2-.6-2.5-.9-3.8-.9-2.3 0-4.6.9-6.3 2.6L11 41.8c-3.5 3.5-3.5 9.2 0 12.7l5.2 5.2c1.7 1.7 4 2.6 6.3 2.6s4.6-.9 6.3-2.6l6.7-6.7c2.5-2.6 3.1-6.7 1.5-10l-5.9 5.9zM38.7 22.5l6.7-6.7c.8-.8 1.6-.9 2.1-.9s1.4.1 2.1.9l5.2 5.2c1.1 1.1 1.1 3.1 0 4.2l-6.1 6.1-.2.2L42 38c1.2.6 2.5.9 3.8.9 2.3 0 4.6-.9 6.3-2.6l6.7-6.7c3.5-3.5 3.5-9.2 0-12.7l-5.2-5.2c-1.7-1.7-4-2.6-6.3-2.6s-4.6.9-6.3 2.6l-6.7 6.7c-2.7 2.7-3.3 6.9-1.7 10.2l6.1-6.1c0 .1 0 .1 0 0z"/><path d="M44.2 30.5c.2-.2.4-.6.4-.9 0-.3-.1-.6-.4-.9l-2.3-2.3c-.3-.2-.6-.4-.9-.4-.3 0-.6.1-.9.4L25.9 40.6c-.2.2-.4.6-.4.9 0 .3.1.6.4.9l2.3 2.3c.2.2.6.4.9.4.3 0 .6-.1.9-.4l14.2-14.2zM49.9 55.4h-8.5v-5h8.5v-8.9h5.2v8.9h8.5v5h-8.5v8.9h-5.2v-8.9z"/></symbol><symbol id="trumbowyg-del" viewBox="0 0 72 72"><path d="M45.8 45c0 1-.3 1.9-.9 2.8-.6.9-1.6 1.6-3 2.1s-3.1.8-5 .8c-2.1 0-4-.4-5.7-1.1-1.7-.7-2.9-1.7-3.6-2.7-.8-1.1-1.3-2.6-1.5-4.5l-.1-.8-6.7.6v.9c.1 2.8.9 5.4 2.3 7.6 1.5 2.3 3.5 4 6.1 5.1 2.6 1.1 5.7 1.6 9.4 1.6 2.9 0 5.6-.5 8-1.6 2.4-1.1 4.3-2.7 5.6-4.7 1.3-2 2-4.2 2-6.5 0-1.6-.3-3.1-.9-4.5l-.2-.6H44c0 .1 1.8 2.3 1.8 5.5zM29 28.9c-.8-.8-1.2-1.7-1.2-2.9 0-.7.1-1.3.4-1.9.3-.6.7-1.1 1.4-1.6.6-.5 1.4-.9 2.5-1.1 1.1-.3 2.4-.4 3.9-.4 2.9 0 5 .6 6.3 1.7 1.3 1.1 2.1 2.7 2.4 5.1l.1.9 6.8-.5v-.9c-.1-2.5-.8-4.7-2.1-6.7s-3.2-3.5-5.6-4.5c-2.4-1-5.1-1.5-8.1-1.5-2.8 0-5.3.5-7.6 1.4-2.3 1-4.2 2.4-5.4 4.3-1.2 1.9-1.9 3.9-1.9 6.1 0 1.7.4 3.4 1.2 4.9l.3.5h11.8c-2.3-.9-3.9-1.7-5.2-2.9zm13.3-6.2zM22.7 20.3zM13 34.1h46.1v3.4H13z"/></symbol><symbol id="trumbowyg-em" viewBox="0 0 72 72"><path d="M26 57l10.1-42h7.2L33.2 57H26z"/></symbol><symbol id="trumbowyg-fullscreen" viewBox="0 0 72 72"><path d="M25.2 7.1H7.1v17.7l6.7-6.5 10.5 10.5 4.5-4.5-10.4-10.5zM47.2 7.1l6.5 6.7-10.5 10.5 4.5 4.5 10.5-10.4 6.7 6.8V7.1zM47.7 43.2l-4.5 4.5 10.4 10.5-6.8 6.7h18.1V47.2l-6.7 6.5zM24.3 43.2L13.8 53.6l-6.7-6.8v18.1h17.7l-6.5-6.7 10.5-10.5z"/><path fill="currentColor" d="M10.7 28.8h18.1V11.2l-6.6 6.4L11.6 7.1l-4.5 4.5 10.5 10.5zM60.8 28.8l-6.4-6.6 10.5-10.6-4.5-4.5-10.5 10.5-6.7-6.9v18.1zM60.4 64.9l4.5-4.5-10.5-10.5 6.9-6.7H43.2v17.6l6.6-6.4zM11.6 64.9l10.5-10.5 6.7 6.9V43.2H11.1l6.5 6.6L7.1 60.4z"/></symbol><symbol id="trumbowyg-h1" viewBox="0 0 72 72"><path d="M6.4 14.9h7.4v16.7h19.1V14.9h7.4V57h-7.4V38H13.8v19H6.4V14.9zM47.8 22.5c1.4 0 2.8-.1 4.1-.4 1.3-.2 2.5-.6 3.6-1.2 1.1-.5 2-1.3 2.8-2.1.8-.9 1.3-1.9 1.5-3.2h5.5v41.2h-7.4v-29H47.8v-5.3z"/></symbol><symbol id="trumbowyg-h2" viewBox="0 0 72 72"><path d="M1.5 14.9h7.4v16.7H28V14.9h7.4V57H28V38H8.8v19H1.5V14.9zM70.2 56.9H42c0-3.4.9-6.4 2.5-9s3.8-4.8 6.6-6.7c1.3-1 2.7-1.9 4.2-2.9 1.5-.9 2.8-1.9 4-3 1.2-1.1 2.2-2.2 3-3.4.8-1.2 1.2-2.7 1.2-4.3 0-.7-.1-1.5-.3-2.4s-.5-1.6-1-2.4c-.5-.7-1.2-1.3-2.1-1.8-.9-.5-2.1-.7-3.5-.7-1.3 0-2.4.3-3.3.8s-1.6 1.3-2.1 2.2-.9 2-1.2 3.3c-.3 1.3-.4 2.6-.4 4.1h-6.7c0-2.3.3-4.4.9-6.3.6-1.9 1.5-3.6 2.7-5 1.2-1.4 2.7-2.5 4.4-3.3 1.7-.8 3.8-1.2 6.1-1.2 2.5 0 4.6.4 6.3 1.2 1.7.8 3.1 1.9 4.1 3.1 1 1.3 1.8 2.6 2.2 4.1.4 1.5.6 2.9.6 4.2 0 1.6-.3 3.1-.8 4.5-.5 1.3-1.2 2.6-2.1 3.7-.9 1.1-1.8 2.2-2.9 3.1-1.1.9-2.2 1.8-3.4 2.7-1.2.8-2.4 1.6-3.5 2.4-1.2.7-2.3 1.5-3.3 2.2-1 .7-1.9 1.5-2.6 2.3-.7.8-1.3 1.7-1.5 2.6h20.1v5.9z"/></symbol><symbol id="trumbowyg-h3" viewBox="0 0 72 72"><path d="M1.4 14.5h7.4v16.7h19.1V14.5h7.4v42.1h-7.4v-19H8.8v19H1.4V14.5zM53.1 32.4c1.1 0 2.2 0 3.3-.2 1.1-.2 2.1-.5 2.9-1 .9-.5 1.6-1.2 2.1-2 .5-.9.8-1.9.8-3.2 0-1.8-.6-3.2-1.8-4.2-1.2-1.1-2.7-1.6-4.6-1.6-1.2 0-2.2.2-3.1.7-.9.5-1.6 1.1-2.2 1.9-.6.8-1 1.7-1.3 2.7-.3 1-.4 2-.4 3.1h-6.7c.1-2 .5-3.9 1.1-5.6.7-1.7 1.6-3.2 2.7-4.4s2.6-2.2 4.2-2.9c1.6-.7 3.5-1.1 5.6-1.1 1.6 0 3.2.2 4.7.7 1.6.5 2.9 1.2 4.2 2.1 1.2.9 2.2 2.1 3 3.4.7 1.4 1.1 3 1.1 4.8 0 2.1-.5 3.9-1.4 5.4-.9 1.6-2.4 2.7-4.4 3.4v.1c2.4.5 4.2 1.6 5.5 3.5 1.3 1.9 2 4.1 2 6.8 0 2-.4 3.7-1.2 5.3-.8 1.6-1.8 2.9-3.2 3.9-1.3 1.1-2.9 1.9-4.7 2.5-1.8.6-3.6.9-5.6.9-2.4 0-4.5-.3-6.3-1s-3.3-1.7-4.5-2.9c-1.2-1.3-2.1-2.8-2.7-4.5-.6-1.8-1-3.7-1-5.9h6.7c-.1 2.5.5 4.6 1.9 6.3 1.3 1.7 3.3 2.5 5.9 2.5 2.2 0 4.1-.6 5.6-1.9 1.5-1.3 2.3-3.1 2.3-5.4 0-1.6-.3-2.9-.9-3.8-.6-.9-1.5-1.7-2.5-2.2-1-.5-2.2-.8-3.4-.9-1.3-.1-2.6-.2-3.9-.1v-5.2z"/></symbol><symbol id="trumbowyg-h4" viewBox="0 0 72 72"><path d="M1.5 14.9h7.4v16.7H28V14.9h7.4V57H28V38H8.9v19H1.5V14.9zM70.5 47.2h-5.3V57h-6.4v-9.8H41.2v-6.7l17.7-24.8h6.4v26.2h5.3v5.3zm-24.2-5.3h12.5V23.7h-.1L46.3 41.9z"/></symbol><symbol id="trumbowyg-horizontal-rule" viewBox="0 0 72 72"><path d="M9.1 32h54v8h-54z"/></symbol><symbol id="trumbowyg-insert-image" viewBox="0 0 72 72"><path d="M64 17v38H8V17h56m8-8H0v54h72V9z"/><path d="M17.5 22C15 22 13 24 13 26.5s2 4.5 4.5 4.5 4.5-2 4.5-4.5-2-4.5-4.5-4.5zM16 50h27L29.5 32zM36 36.2l8.9-8.5L60.2 50H45.9S35.6 35.9 36 36.2z"/></symbol><symbol id="trumbowyg-italic" viewBox="0 0 72 72"><path d="M26 57l10.1-42h7.2L33.2 57H26z"/></symbol><symbol id="trumbowyg-justify-center" viewBox="0 0 72 72"><path d="M9 14h54v8H9zM9 50h54v8H9zM18 32h36v8H18z"/></symbol><symbol id="trumbowyg-justify-full" viewBox="0 0 72 72"><path d="M9 14h54v8H9zM9 50h54v8H9zM9 32h54v8H9z"/></symbol><symbol id="trumbowyg-justify-left" viewBox="0 0 72 72"><path d="M9 14h54v8H9zM9 50h54v8H9zM9 32h36v8H9z"/></symbol><symbol id="trumbowyg-justify-right" viewBox="0 0 72 72"><path d="M9 14h54v8H9zM9 50h54v8H9zM27 32h36v8H27z"/></symbol><symbol id="trumbowyg-link" viewBox="0 0 72 72"><path d="M30.9 49.1l-6.7 6.7c-.8.8-1.6.9-2.1.9s-1.4-.1-2.1-.9l-5.2-5.2c-1.1-1.1-1.1-3.1 0-4.2l6.1-6.1.2-.2 6.5-6.5c-1.2-.6-2.5-.9-3.8-.9-2.3 0-4.6.9-6.3 2.6L10.8 42c-3.5 3.5-3.5 9.2 0 12.7l5.2 5.2c1.7 1.7 4 2.6 6.3 2.6s4.6-.9 6.3-2.6l6.7-6.7C38 50.5 38.6 46.3 37 43l-6.1 6.1zM38.5 22.7l6.7-6.7c.8-.8 1.6-.9 2.1-.9s1.4.1 2.1.9l5.2 5.2c1.1 1.1 1.1 3.1 0 4.2l-6.1 6.1-.2.2-6.5 6.5c1.2.6 2.5.9 3.8.9 2.3 0 4.6-.9 6.3-2.6l6.7-6.7c3.5-3.5 3.5-9.2 0-12.7l-5.2-5.2c-1.7-1.7-4-2.6-6.3-2.6s-4.6.9-6.3 2.6l-6.7 6.7c-2.7 2.7-3.3 6.9-1.7 10.2l6.1-6.1z"/><path d="M44.1 30.7c.2-.2.4-.6.4-.9 0-.3-.1-.6-.4-.9l-2.3-2.3c-.2-.2-.6-.4-.9-.4-.3 0-.6.1-.9.4L25.8 40.8c-.2.2-.4.6-.4.9 0 .3.1.6.4.9l2.3 2.3c.2.2.6.4.9.4.3 0 .6-.1.9-.4l14.2-14.2z"/></symbol><symbol id="trumbowyg-ordered-list" viewBox="0 0 72 72"><path d="M27 14h36v8H27zM27 50h36v8H27zM27 32h36v8H27zM11.8 15.8V22h1.8v-7.8h-1.5l-2.1 1 .3 1.3zM12.1 38.5l.7-.6c1.1-1 2.1-2.1 2.1-3.4 0-1.4-1-2.4-2.7-2.4-1.1 0-2 .4-2.6.8l.5 1.3c.4-.3 1-.6 1.7-.6.9 0 1.3.5 1.3 1.1 0 .9-.9 1.8-2.6 3.3l-1 .9V40H15v-1.5h-2.9zM13.3 53.9c1-.4 1.4-1 1.4-1.8 0-1.1-.9-1.9-2.6-1.9-1 0-1.9.3-2.4.6l.4 1.3c.3-.2 1-.5 1.6-.5.8 0 1.2.3 1.2.8 0 .7-.8.9-1.4.9h-.7v1.3h.7c.8 0 1.6.3 1.6 1.1 0 .6-.5 1-1.4 1-.7 0-1.5-.3-1.8-.5l-.4 1.4c.5.3 1.3.6 2.3.6 2 0 3.2-1 3.2-2.4 0-1.1-.8-1.8-1.7-1.9z"/></symbol><symbol id="trumbowyg-p" viewBox="0 0 72 72"><path d="M47.8 15.1H30.1c-4.7 0-8.5 3.7-8.5 8.4s3.7 8.4 8.4 8.4v25h7V19.8h3v37.1h4.1V19.8h3.7v-4.7z"/></symbol><symbol id="trumbowyg-redo" viewBox="0 0 72 72"><path d="M10.8 51.2c0-5.1 2.1-9.7 5.4-13.1 3.3-3.3 8-5.4 13.1-5.4H46v-12L61.3 36 45.9 51.3V39.1H29.3c-3.3 0-6.4 1.3-8.5 3.5-2.2 2.2-3.5 5.2-3.5 8.5h-6.5z"/></symbol><symbol id="trumbowyg-removeformat" viewBox="0 0 72 72"><path d="M58.2 54.6L52 48.5l3.6-3.6 6.1 6.1 6.4-6.4 3.8 3.8-6.4 6.4 6.1 6.1-3.6 3.6-6.1-6.1-6.4 6.4-3.7-3.8 6.4-6.4zM21.7 52.1H50V57H21.7zM18.8 15.2h34.1v6.4H39.5v24.2h-7.4V21.5H18.8v-6.3z"/></symbol><symbol id="trumbowyg-strikethrough" viewBox="0 0 72 72"><path d="M45.8 45c0 1-.3 1.9-.9 2.8-.6.9-1.6 1.6-3 2.1s-3.1.8-5 .8c-2.1 0-4-.4-5.7-1.1-1.7-.7-2.9-1.7-3.6-2.7-.8-1.1-1.3-2.6-1.5-4.5l-.1-.8-6.7.6v.9c.1 2.8.9 5.4 2.3 7.6 1.5 2.3 3.5 4 6.1 5.1 2.6 1.1 5.7 1.6 9.4 1.6 2.9 0 5.6-.5 8-1.6 2.4-1.1 4.3-2.7 5.6-4.7 1.3-2 2-4.2 2-6.5 0-1.6-.3-3.1-.9-4.5l-.2-.6H44c0 .1 1.8 2.3 1.8 5.5zM29 28.9c-.8-.8-1.2-1.7-1.2-2.9 0-.7.1-1.3.4-1.9.3-.6.7-1.1 1.4-1.6.6-.5 1.4-.9 2.5-1.1 1.1-.3 2.4-.4 3.9-.4 2.9 0 5 .6 6.3 1.7 1.3 1.1 2.1 2.7 2.4 5.1l.1.9 6.8-.5v-.9c-.1-2.5-.8-4.7-2.1-6.7s-3.2-3.5-5.6-4.5c-2.4-1-5.1-1.5-8.1-1.5-2.8 0-5.3.5-7.6 1.4-2.3 1-4.2 2.4-5.4 4.3-1.2 1.9-1.9 3.9-1.9 6.1 0 1.7.4 3.4 1.2 4.9l.3.5h11.8c-2.3-.9-3.9-1.7-5.2-2.9zm13.3-6.2zM22.7 20.3zM13 34.1h46.1v3.4H13z"/></symbol><symbol id="trumbowyg-strong" viewBox="0 0 72 72"><path d="M51.1 37.8c-1.1-1.4-2.5-2.5-4.2-3.3 1.2-.8 2.1-1.8 2.8-3 1-1.6 1.5-3.5 1.5-5.3 0-2-.6-4-1.7-5.8-1.1-1.8-2.8-3.2-4.8-4.1-2-.9-4.6-1.3-7.8-1.3h-16v42h16.3c2.6 0 4.8-.2 6.7-.7 1.9-.5 3.4-1.2 4.7-2.1 1.3-1 2.4-2.4 3.2-4.1.9-1.7 1.3-3.6 1.3-5.7.2-2.5-.5-4.7-2-6.6zM40.8 50.2c-.6.1-1.8.2-3.4.2h-9V38.5h8.3c2.5 0 4.4.2 5.6.6 1.2.4 2 1 2.7 2 .6.9 1 2 1 3.3 0 1.1-.2 2.1-.7 2.9-.5.9-1 1.5-1.7 1.9-.8.4-1.7.8-2.8 1zm2.6-20.4c-.5.7-1.3 1.3-2.5 1.6-.8.3-2.5.4-4.8.4h-7.7V21.6h7.1c1.4 0 2.6 0 3.6.1s1.7.2 2.2.4c1 .3 1.7.8 2.2 1.7.5.9.8 1.8.8 3-.1 1.3-.4 2.2-.9 3z"/></symbol><symbol id="trumbowyg-subscript" viewBox="0 0 72 72"><path d="M32 15h7.8L56 57.1h-7.9L44.3 46H27.4l-4 11.1h-7.6L32 15zm-2.5 25.4h12.9L36 22.3h-.2l-6.3 18.1zM58.7 59.9c.6-1.4 2-2.8 4.1-4.4 1.9-1.3 3.1-2.3 3.7-2.9.8-.9 1.3-1.9 1.3-3 0-.9-.2-1.6-.7-2.2-.5-.6-1.2-.9-2.1-.9-1.2 0-2.1.5-2.5 1.4-.3.5-.4 1.4-.5 2.5h-4c.1-1.8.4-3.2 1-4.3 1.1-2.1 3-3.1 5.8-3.1 2.2 0 3.9.6 5.2 1.8 1.3 1.2 1.9 2.8 1.9 4.8 0 1.5-.5 2.9-1.4 4.1-.6.8-1.6 1.7-3 2.6L66 57.7c-1 .7-1.7 1.2-2.1 1.6-.4.3-.7.7-1 1.1H72V64H57.8c0-1.5.3-2.8.9-4.1z"/></symbol><symbol id="trumbowyg-superscript" viewBox="0 0 72 72"><path d="M32 15h7.8L56 57.1h-7.9l-4-11.1H27.4l-4 11.1h-7.6L32 15zm-2.5 25.4h12.9L36 22.3h-.2l-6.3 18.1zM49.6 28.8c.5-1.1 1.6-2.3 3.4-3.6 1.5-1.1 2.5-1.9 3-2.4.7-.7 1-1.6 1-2.4 0-.7-.2-1.3-.6-1.8-.4-.5-1-.7-1.7-.7-1 0-1.7.4-2.1 1.1-.2.4-.3 1.1-.4 2.1H49c.1-1.5.3-2.6.8-3.5.9-1.7 2.5-2.6 4.8-2.6 1.8 0 3.2.5 4.3 1.5 1.1 1 1.6 2.3 1.6 4 0 1.3-.4 2.4-1.1 3.4-.5.7-1.3 1.4-2.4 2.2l-1.3 1c-.8.6-1.4 1-1.7 1.3-.3.3-.6.6-.8.9h7.4v3H48.8c0-1.3.3-2.4.8-3.5z"/></symbol><symbol id="trumbowyg-table" viewBox="0 0 72 72"><path d="M25.686 51.38v-6.347q0-.462-.297-.76-.298-.297-.761-.297H14.04q-.463 0-.761.297-.298.298-.298.76v6.346q0 .463.298.76.298.298.76.298h10.589q.463 0 .76-.298.298-.297.298-.76zm0-12.692v-6.346q0-.463-.297-.76-.298-.298-.761-.298H14.04q-.463 0-.761.298-.298.297-.298.76v6.346q0 .462.298.76.298.297.76.297h10.589q.463 0 .76-.297.298-.298.298-.76zm16.94 12.691v-6.346q0-.462-.297-.76-.298-.297-.761-.297H30.98q-.463 0-.76.297-.299.298-.299.76v6.346q0 .463.298.76.298.298.761.298h10.588q.463 0 .76-.298.299-.297.299-.76zm-16.94-25.383v-6.345q0-.463-.297-.76-.298-.298-.761-.298H14.04q-.463 0-.761.297-.298.298-.298.76v6.346q0 .463.298.76.298.298.76.298h10.589q.463 0 .76-.298.298-.297.298-.76zm16.94 12.692v-6.346q0-.463-.297-.76-.298-.298-.761-.298H30.98q-.463 0-.76.298-.299.297-.299.76v6.346q0 .462.298.76.298.297.761.297h10.588q.463 0 .76-.297.299-.298.299-.76zm16.94 12.691v-6.346q0-.462-.297-.76-.298-.297-.76-.297H47.92q-.463 0-.76.297-.298.298-.298.76v6.346q0 .463.297.76.298.298.761.298h10.588q.463 0 .761-.298.298-.297.298-.76zm-16.94-25.383v-6.345q0-.463-.297-.76-.298-.298-.761-.298H30.98q-.463 0-.76.297-.299.298-.299.76v6.346q0 .463.298.76.298.298.761.298h10.588q.463 0 .76-.298.299-.297.299-.76zm16.94 12.692v-6.346q0-.463-.297-.76-.298-.298-.76-.298H47.92q-.463 0-.76.298-.298.297-.298.76v6.346q0 .462.297.76.298.297.761.297h10.588q.463 0 .761-.297.298-.298.298-.76zm0-12.692v-6.345q0-.463-.297-.76-.298-.298-.76-.298H47.92q-.463 0-.76.297-.298.298-.298.76v6.346q0 .463.297.76.298.298.761.298h10.588q.463 0 .761-.298.298-.297.298-.76zm4.236-10.576v35.96q0 2.18-1.555 3.734-1.555 1.553-3.739 1.553H14.04q-2.184 0-3.739-1.553-1.555-1.553-1.555-3.735V15.42q0-2.181 1.555-3.735 1.555-1.553 3.739-1.553h44.468q2.184 0 3.739 1.553 1.555 1.554 1.555 3.735z"/></symbol><symbol id="trumbowyg-underline" viewBox="0 0 72 72"><path d="M36 35zM15.2 55.9h41.6V59H15.2zM21.1 13.9h6.4v21.2c0 1.2.1 2.5.2 3.7.1 1.3.5 2.4 1 3.4.6 1 1.4 1.8 2.6 2.5 1.1.6 2.7 1 4.8 1 2.1 0 3.7-.3 4.8-1 1.1-.6 2-1.5 2.6-2.5.6-1 .9-2.1 1-3.4.1-1.3.2-2.5.2-3.7V13.9H51v23.3c0 2.3-.4 4.4-1.1 6.1-.7 1.7-1.7 3.2-3 4.4-1.3 1.2-2.9 2-4.7 2.6-1.8.6-3.9.9-6.1.9-2.2 0-4.3-.3-6.1-.9-1.8-.6-3.4-1.5-4.7-2.6-1.3-1.2-2.3-2.6-3-4.4-.7-1.7-1.1-3.8-1.1-6.1V13.9z"/></symbol><symbol id="trumbowyg-undo" viewBox="0 0 72 72"><path d="M61.2 51.2c0-5.1-2.1-9.7-5.4-13.1-3.3-3.3-8-5.4-13.1-5.4H26.1v-12L10.8 36l15.3 15.3V39.1h16.7c3.3 0 6.4 1.3 8.5 3.5 2.2 2.2 3.5 5.2 3.5 8.5h6.4z"/></symbol><symbol id="trumbowyg-unlink" viewBox="0 0 72 72"><path d="M30.9 49.1l-6.7 6.7c-.8.8-1.6.9-2.1.9s-1.4-.1-2.1-.9l-5.2-5.2c-1.1-1.1-1.1-3.1 0-4.2l6.1-6.1.2-.2 6.5-6.5c-1.2-.6-2.5-.9-3.8-.9-2.3 0-4.6.9-6.3 2.6L10.8 42c-3.5 3.5-3.5 9.2 0 12.7l5.2 5.2c1.7 1.7 4 2.6 6.3 2.6s4.6-.9 6.3-2.6l6.7-6.7C38 50.5 38.6 46.3 37 43l-6.1 6.1zM38.5 22.7l6.7-6.7c.8-.8 1.6-.9 2.1-.9s1.4.1 2.1.9l5.2 5.2c1.1 1.1 1.1 3.1 0 4.2l-6.1 6.1-.2.2-6.5 6.5c1.2.6 2.5.9 3.8.9 2.3 0 4.6-.9 6.3-2.6l6.7-6.7c3.5-3.5 3.5-9.2 0-12.7l-5.2-5.2c-1.7-1.7-4-2.6-6.3-2.6s-4.6.9-6.3 2.6l-6.7 6.7c-2.7 2.7-3.3 6.9-1.7 10.2l6.1-6.1z"/><path d="M44.1 30.7c.2-.2.4-.6.4-.9 0-.3-.1-.6-.4-.9l-2.3-2.3c-.2-.2-.6-.4-.9-.4-.3 0-.6.1-.9.4L25.8 40.8c-.2.2-.4.6-.4.9 0 .3.1.6.4.9l2.3 2.3c.2.2.6.4.9.4.3 0 .6-.1.9-.4l14.2-14.2zM41.3 55.8v-5h22.2v5H41.3z"/></symbol><symbol id="trumbowyg-unordered-list" viewBox="0 0 72 72"><path d="M27 14h36v8H27zM27 50h36v8H27zM9 50h9v8H9zM9 32h9v8H9zM9 14h9v8H9zM27 32h36v8H27z"/></symbol><symbol id="trumbowyg-view-html" viewBox="0 0 72 72"><path fill="none" stroke="currentColor" stroke-width="8" stroke-miterlimit="10" d="M26.9 17.9L9 36.2 26.9 54M45 54l17.9-18.3L45 17.9"/></symbol><symbol id="trumbowyg-base64" viewBox="0 0 72 72"><path d="M64 17v38H8V17h56m8-8H0v54h72V9z"/><path d="M29.9 28.9c-.5-.5-1.1-.8-1.8-.8s-1.4.2-1.9.7c-.5.4-.9 1-1.2 1.6-.3.6-.5 1.3-.6 2.1-.1.7-.2 1.4-.2 1.9l.1.1c.6-.8 1.2-1.4 2-1.8.8-.4 1.7-.5 2.7-.5.9 0 1.8.2 2.6.6.8.4 1.6.9 2.2 1.5.6.6 1 1.3 1.2 2.2.3.8.4 1.6.4 2.5 0 1.1-.2 2.1-.5 3-.3.9-.8 1.7-1.5 2.4-.6.7-1.4 1.2-2.3 1.6-.9.4-1.9.6-3 .6-1.6 0-2.8-.3-3.9-.9-1-.6-1.8-1.4-2.5-2.4-.6-1-1-2.1-1.3-3.4-.2-1.3-.4-2.6-.4-3.9 0-1.3.1-2.6.4-3.8.3-1.3.8-2.4 1.4-3.5.7-1 1.5-1.9 2.5-2.5 1-.6 2.3-1 3.8-1 .9 0 1.7.1 2.5.4.8.3 1.4.6 2 1.1.6.5 1.1 1.1 1.4 1.8.4.7.6 1.5.7 2.5h-4c0-1-.3-1.6-.8-2.1zm-3.5 6.8c-.4.2-.8.5-1 .8-.3.4-.5.8-.6 1.2-.1.5-.2 1-.2 1.5s.1.9.2 1.4c.1.5.4.9.6 1.2.3.4.6.7 1 .9.4.2.9.3 1.4.3.5 0 1-.1 1.3-.3.4-.2.7-.5 1-.9.3-.4.5-.8.6-1.2.1-.5.2-.9.2-1.4 0-.5-.1-1-.2-1.4-.1-.5-.3-.9-.6-1.2-.3-.4-.6-.7-1-.9-.4-.2-.9-.3-1.4-.3-.4 0-.9.1-1.3.3zM36.3 41.3v-3.8l9-12.1H49v12.4h2.7v3.5H49v4.8h-4v-4.8h-8.7zM45 30.7l-5.3 7.2h5.4l-.1-7.2z"/></symbol><symbol id="trumbowyg-back-color" viewBox="0 0 72 72"><path d="M36.5 22.3l-6.3 18.1H43l-6.3-18.1z"/><path d="M9 8.9v54.2h54.1V8.9H9zm39.9 48.2L45 46H28.2l-3.9 11.1h-7.6L32.8 15h7.8l16.2 42.1h-7.9z"/></symbol><symbol id="trumbowyg-fore-color" viewBox="0 0 72 72"><path d="M32 15h7.8L56 57.1h-7.9l-4-11.1H27.4l-4 11.1h-7.6L32 15zm-2.5 25.4h12.9L36 22.3h-.2l-6.3 18.1z"/></symbol><symbol id="trumbowyg-emoji" viewBox="0 0 72 72"><path d="M36.05 9C21.09 9 8.949 21.141 8.949 36.101c0 14.96 12.141 27.101 27.101 27.101 14.96 0 27.101-12.141 27.101-27.101S51.01 9 36.05 9zm9.757 15.095c2.651 0 4.418 1.767 4.418 4.418s-1.767 4.418-4.418 4.418-4.418-1.767-4.418-4.418 1.767-4.418 4.418-4.418zm-19.479 0c2.651 0 4.418 1.767 4.418 4.418s-1.767 4.418-4.418 4.418-4.418-1.767-4.418-4.418 1.767-4.418 4.418-4.418zm9.722 30.436c-14.093 0-16.261-13.009-16.261-13.009h32.522S50.143 54.531 36.05 54.531z"/></symbol><symbol id="trumbowyg-insert-audio" viewBox="0 0 8 8"><path d="M3.344 0L2 2H0v4h2l1.344 2H4V0h-.656zM5 1v1c.152 0 .313.026.469.063H5.5c.86.215 1.5.995 1.5 1.938a1.99 1.99 0 0 1-2 2.001v1a2.988 2.988 0 0 0 3-3 2.988 2.988 0 0 0-3-3zm0 2v2l.25-.031C5.683 4.851 6 4.462 6 4c0-.446-.325-.819-.75-.938v-.031h-.031L5 3z"/></symbol><symbol id="trumbowyg-noembed" viewBox="0 0 72 72"><path d="M31.5 33.6V25l11 11-11 11v-8.8z"/><path d="M64 17v38H8V17h56m8-8H0v54h72V9z"/></symbol><symbol id="trumbowyg-preformatted" viewBox="0 0 72 72"><path d="M10.3 33.5c.4 0 .9-.1 1.5-.2s1.2-.3 1.8-.7c.6-.3 1.1-.8 1.5-1.3.4-.5.6-1.3.6-2.1V17.1c0-1.4.3-2.6.8-3.6s1.2-1.9 2-2.5c.8-.7 1.6-1.2 2.5-1.5.9-.3 1.6-.5 2.2-.5h5.3v5.3h-3.2c-.7 0-1.3.1-1.8.4-.4.3-.8.6-1 1-.2.4-.4.9-.4 1.3-.1.5-.1.9-.1 1.4v11.4c0 1.2-.2 2.1-.7 2.9-.5.8-1 1.4-1.7 1.8-.6.4-1.3.8-2 1-.7.2-1.3.3-1.7.4v.1c.5 0 1 .1 1.7.3.7.2 1.3.5 2 .9.6.5 1.2 1.1 1.7 1.9.5.8.7 2 .7 3.4v11.1c0 .4 0 .9.1 1.4.1.5.2.9.4 1.3s.6.7 1 1c.4.3 1 .4 1.8.4h3.2V63h-5.3c-.6 0-1.4-.2-2.2-.5-.9-.3-1.7-.8-2.5-1.5s-1.4-1.5-2-2.5c-.5-1-.8-2.2-.8-3.6V43.5c0-.9-.2-1.7-.6-2.3-.4-.6-.9-1.1-1.5-1.5-.6-.4-1.2-.6-1.8-.7-.6-.1-1.1-.2-1.5-.2v-5.3zM61.8 38.7c-.4 0-1 .1-1.6.2-.6.1-1.2.4-1.8.7-.6.3-1.1.7-1.5 1.3-.4.5-.6 1.3-.6 2.1v12.1c0 1.4-.3 2.6-.8 3.6s-1.2 1.9-2 2.5c-.8.7-1.6 1.2-2.5 1.5-.9.3-1.6.5-2.2.5h-5.3v-5.3h3.2c.7 0 1.3-.1 1.8-.4.4-.3.8-.6 1-1 .2-.4.4-.9.4-1.3.1-.5.1-.9.1-1.4V42.3c0-1.2.2-2.1.7-2.9.5-.8 1-1.4 1.7-1.8.6-.4 1.3-.8 2-1 .7-.2 1.3-.3 1.7-.4v-.1c-.5 0-1-.1-1.7-.3-.7-.2-1.3-.5-2-.9-.6-.4-1.2-1.1-1.7-1.9-.5-.8-.7-2-.7-3.4V18.5c0-.4 0-.9-.1-1.4-.1-.5-.2-.9-.4-1.3s-.6-.7-1-1c-.4-.3-1-.4-1.8-.4h-3.2V9.1h5.3c.6 0 1.4.2 2.2.5.9.3 1.7.8 2.5 1.5s1.4 1.5 2 2.5c.5 1 .8 2.2.8 3.6v11.6c0 .9.2 1.7.6 2.3.4.6.9 1.1 1.5 1.5.6.4 1.2.6 1.8.7.6.1 1.2.2 1.6.2v5.2z"/></symbol><symbol id="trumbowyg-upload" viewBox="0 0 72 72"><path d="M64 27v28H8V27H0v36h72V27h-8z"/><path d="M32.1 6.7h8v33.6h-8z"/><path d="M48 35.9L36 49.6 24 36h24z"/></symbol></svg>
              </div>
              <textarea id="mail-editor"></textarea>
            </div>
          </div>
        `;
        insertHtml(".main-panel", ticketHtml);
      },
      true /*, ZEALOT.bearer*/
    );
  }

  ZEALOT.ccAux = function(messagesArray) {
    var mainTicketsHtml = `
      <div class="title-fixed oswald-blue-semibold">
        Tiketi
        <div class="title-bar"></div>
        <img class="tickets-loaded-helper" src="img/Z white.svg" onload="$ZEALOT.ticketsLoaded(this);">
      </div>
      <div class="main-panel-tickets scrollable container open-sans-dark-normal">
    `;
    for (var i = 0; i < messagesArray.length; i++) {
      var statusIcon = "";
      switch (messagesArray[i].idType) {
        case 1:
          statusIcon = "fa-question-circle";
          break;
        case 2:
          statusIcon = "fa-exclamation-triangle";
          break;
        case 3:
          statusIcon = "fa-exclamation-circle";
          break;
        case 4:
          statusIcon = "fa-check-circle";
          break;
        default:
          break;
      }
      var assignedOperator = Number(messagesArray[i].idOperator);
      var assignedSector = Number(messagesArray[i].idSector);
      var sectorSign = "";
      var sectorName = "";
      switch (assignedSector) {
        case 1:
          sectorSign = "🅞";
          sectorName = "OPERATIVA";
          break;
        case 2:
          sectorSign = "🅧";
          sectorName = "PODRŠKA";
          break;
        case 3:
          sectorSign = "🅟";
          sectorName = "PRODAJA";
          break;
        case 4:
          sectorSign = "🅣";
          sectorName = "TEHNIKA";
          break;
        case 5:
          sectorSign = "🅕";
          sectorName = "FINANSIJE";
          break;
        default:
          break;
      }
      var now = new Date();
      var lcmt = new Date(messagesArray[i].lcmt);
      mainTicketsHtml += `
        <div class="ticket-container row` + ((messagesArray[i].isUnread) ? ` open-sans-dark-bold` : ``) + `" onclick="$ZEALOT.ticketClicked(` + messagesArray[i].idTicket + `, ` + ((Number(messagesArray[i].idStatus) < 4) ? `false` : `true`) + `);">
          <div class="tc-priority-` + messagesArray[i].idPriority + ` col-1 fa fa-circle ` + ((lcmt.getTime() < now.getTime() - 48 * 60 * 60 * 1000 && Number(messagesArray[i].idPriority) == 2) ? `pulse` : ``) + `" data-toggle="tooltip" data-placement="right" title="` + messagesArray[i].priorityName + ` PRIORITET"></div>
          <div class="tc-id-len col-2">` + messagesArray[i].idTicket + ` (` + messagesArray[i].conversationLength + `)</div>
          <div class="tc-sender col-3" data-toggle="tooltip" data-placement="right" title="` + messagesArray[i].clientName + `, ` + messagesArray[i].companyName + `">` + messagesArray[i].clientMail + `</div>
          <div class="tc-subject col-3">` + messagesArray[i].eMailSubject + `</div>
          <div class="tc-status col-1" data-toggle="tooltip" data-placement="left" title="` + messagesArray[i].statusName + `">&#` + (10101 + messagesArray[i].idStatus) + `;</div>
          <div class="tc-type col-1 fa ` + statusIcon + `" data-toggle="tooltip" data-placement="left" title="` + messagesArray[i].typeName + `"></div>
          <div class="tc-assign col-1" data-toggle="tooltip" data-placement="left" title="` + ((sectorName != "") ? sectorName : "NEDODELJEN") + `">` + sectorSign + `</div>
        </div>
      `;
      /*
      <div class="` + ((messagesArray[i].isHidden) ? `tc-show` : `tc-hide`) + ` col-1 fa fa-trash ` + ((messagesArray[i].isUnread) ? `hidden` : ``) + `" data-toggle="tooltip" data-placement="left" title="` + ((messagesArray[i].isHidden) ? `OTKRIJ TIKET` : `SAKRIJ TIKET`) + `" onclick="$ZEALOT.hideOrShowTicket(this, ` + messagesArray[i].idTicket + `, ` + messagesArray[i].isUnread + `)"></div>
      */
    }
    mainTicketsHtml += `
      </div>
    `;
    insertHtml(".main-panel", mainTicketsHtml);
  };

  ZEALOT.categoryClicked = function(e) {
    $(".category .fa-caret-right").addClass("hidden");
    $(e).find(".fa-caret-right").removeClass("hidden");
    if (ZEALOT.browserWidth < 992) {
      setTimeout(ZEALOT.thumbClick, 750);
    }
    if ($(e).hasClass("t-visible")) {
      $ajaxUtils.sendGetRequest(
        ZEALOT.apiRoot + "allTickets" + "?idO=" + ((ZEALOT.adminPrivilegesGranted) ? 0 : ZEALOT.userInfo.idOperator) + "&hidden=false",
        function(responseArray, status) {
          var responseArrayModified = [];
          for (var i = 0; i < responseArray.length; i++)
            if (Number(responseArray[i].idStatus) < 4)
              responseArrayModified.push(responseArray[i]);
          ZEALOT.ccAux(responseArrayModified);
        },
        true /*, ZEALOT.bearer*/
      );
    } else if ($(e).hasClass("t-hidden")) {
      $ajaxUtils.sendGetRequest(
        ZEALOT.apiRoot + "allTickets" + "?idO=" + ((ZEALOT.adminPrivilegesGranted) ? 0 : ZEALOT.userInfo.idOperator) + "&hidden=true",
        function(responseArray, status) {
          ZEALOT.ccAux(responseArray);
        },
        true /*, ZEALOT.bearer*/
      );
    } else if ($(e).hasClass("t-unassigned")) {
      $ajaxUtils.sendGetRequest(
        ZEALOT.apiRoot + "allTickets" + "?idO=" + ((ZEALOT.adminPrivilegesGranted) ? 0 : ZEALOT.userInfo.idOperator) + "&hidden=false",
        function(responseArray, status) {
          var responseArrayModified = [];
          for (var i = 0; i < responseArray.length; i++)
            if ((Number(responseArray[i].idOperator) == 0 || Number(responseArray[i].idSector) == 0) && Number(responseArray[i].idStatus) < 4)
              responseArrayModified.push(responseArray[i]);
          ZEALOT.ccAux(responseArrayModified);
        },
        true /*, ZEALOT.bearer*/
      );
    } else if ($(e).hasClass("t-priority")) {
      $ajaxUtils.sendGetRequest(
        ZEALOT.apiRoot + "allTicketsByPriority" + "?idO=" + ((ZEALOT.adminPrivilegesGranted) ? 0 : ZEALOT.userInfo.idOperator) + "&idP=" + $(e).attr("value"),
        function(responseArray, status) {
          ZEALOT.ccAux(responseArray);
        },
        true /*, ZEALOT.bearer*/
      );
    } else if ($(e).hasClass("t-status")) {
      $ajaxUtils.sendGetRequest(
        ZEALOT.apiRoot + "allTicketsByStatus" + "?idO=" + ((ZEALOT.adminPrivilegesGranted) ? 0 : ZEALOT.userInfo.idOperator) + "&idS=" + $(e).attr("value"),
        function(responseArray, status) {
          ZEALOT.ccAux(responseArray);
        },
        true /*, ZEALOT.bearer*/
      );
    } else if ($(e).hasClass("t-type")) {
      $ajaxUtils.sendGetRequest(
        ZEALOT.apiRoot + "allTicketsByType" + "?idO=" + ((ZEALOT.adminPrivilegesGranted) ? 0 : ZEALOT.userInfo.idOperator) + "&idT=" + $(e).attr("value"),
        function(responseArray, status) {
          ZEALOT.ccAux(responseArray);
        },
        true /*, ZEALOT.bearer*/
      );
    } else if ($(e).hasClass("c-dbs")) {
      var dbsContactsHtml = `
        <div class="title-fixed oswald-blue-semibold">
          DBS kontakti
          <div class="title-bar"></div>
        </div>
        <div class="main-panel-contacts scrollable container">
          <div class="company-container">
            <div class="company-header">
              <div class="company-name oswald-dark-blue-normal">DBS</div>
              <a class="company-expand fa fa-chevron-up" data-toggle="collapse" data-target="#collapse-contacts-1" onclick="$ZEALOT.contactExpand(this);"></a>
            </div>
            <style>#collapse-contacts-1 {height: ` + (ZEALOT.allOperators.length * 4.5) + `vh;}</style>
            <div id="collapse-contacts-1" class="company-contacts-container collapse show">
      `;
      for (var i = 0; i < ZEALOT.allOperators.length; i++)
        if (ZEALOT.allOperators[i].idSc != null)
          dbsContactsHtml += `
              <div class="company-contact row">
                <div class="contact-name col-4">` + ZEALOT.allOperators[i].onm + `</div>
                <div class="contact-email col-4">` + ZEALOT.allOperators[i].mail + `</div>
                <div class="contact-phone col-4">` + ZEALOT.allOperators[i].p + `</div>
              </div>
          `;
      dbsContactsHtml += `
            </div>
          </div>
        </div>
      `;
      insertHtml(".main-panel", dbsContactsHtml);
    } else if ($(e).hasClass("c-others")) {
      var otherContactsHtml = `
        <div class="title-fixed oswald-blue-semibold">
          Ostali kontakti
          <div class="title-bar"></div>
        </div>
        <div class="main-panel-contacts scrollable container">
        </div>
      `;
      insertHtml(".main-panel", otherContactsHtml);
      $ajaxUtils.sendGetRequest(
        ZEALOT.apiRoot + "contacts",
        function(responseArray, status) {
          if (responseArray.length > 0) {
            otherContactsHtml = `
              <div class="title-fixed oswald-blue-semibold">
                Ostali kontakti
                <div class="title-bar"></div>
              </div>
              <div class="main-panel-contacts scrollable container">
            `;
            var i = 0;
            var companyNum = 1;
            var companyHeadCount = 0;
            var companyName = "";
            while (i < responseArray.length) {
              companyName = responseArray[i].companyName;
              companyHeadCount = 0;
              otherContactsHtml += `
                <div class="company-container">
                  <div class="company-header">
                    <div class="company-name oswald-dark-blue-normal">` + companyName + `</div>
                    <a class="company-expand fa fa-chevron-down" data-toggle="collapse" data-target="#collapse-contacts-` + companyNum + `" onclick="$ZEALOT.contactExpand(this);"></a>
                  </div>
                  <div id="collapse-contacts-` + companyNum + `" class="company-contacts-container collapse">
              `;
              while (i < responseArray.length) {
                if (responseArray[i].companyName != companyName) break;
                otherContactsHtml += `
                    <div class="company-contact row">
                      <div class="contact-name col-4">` + responseArray[i].clientName + `</div>
                      <div class="contact-email col-4">` + responseArray[i].clientMail + `</div>
                      <div class="contact-phone col-4">` + responseArray[i].clientPhone + `</div>
                    </div>
                `;
                i = i + 1;
                companyHeadCount = companyHeadCount + 1;
              }
              otherContactsHtml += `
                  </div>
                  <style>#collapse-contacts-` + companyNum + ` {height: ` + (companyHeadCount * 4.5) + `vh;}</style>
                </div>
              `;
              companyNum = companyNum + 1;
            }
            otherContactsHtml += `
              </div>
            `;
            insertHtml(".main-panel", otherContactsHtml);
          }
        },
        true /*, ZEALOT.bearer*/
      );
    }
  };

  ZEALOT.adminPrivileges = function(e) {
    //maybe all if hasadminprivileges in user info
    if ($(e).prop("checked") == true) {
      $(".admin-privileges-status").html("UKLJUČENO");
      ZEALOT.adminPrivilegesGranted = 1;
    } else {
      $(".admin-privileges-status").html("ISKLJUČENO");
      ZEALOT.adminPrivilegesGranted = 0;
    }
    $(".main-panel").html("");
  };

  ZEALOT.statsSectorSelect = function(e, idS) {
    $(".popup-stats div .num").removeClass("fa-check-circle");
    $(".popup-stats div .num").addClass("fa-circle-o");
    $(".popup-stats div .switch-num").removeClass("fa-circle-o");
    if (e != null) {
      $(e).find(".num").removeClass("fa-circle-o");
      $(e).find(".num").addClass("fa-check-circle");
    } else {
      $(".popup-stats .s-all .num").removeClass("fa-circle-o");
      $(".popup-stats .s-all .num").addClass("fa-check-circle");
    }
    ZEALOT.idSectorForStats = idS;
    ZEALOT.idOperatorForStats = 0;
    $("#operator-select").val("");
    var datalistHtml = " ";
    for (var i = 0; i < ZEALOT.allOperators.length; i++) {
      if ((ZEALOT.allOperators[i].idSc == idS || idS == 0) && ZEALOT.allOperators[i].idSc != null)
        datalistHtml += `<option value="` + ZEALOT.allOperators[i].onm + `"><div value="` + ZEALOT.allOperators[i].idO + `" id="val"></div></option>`;
    }
    insertHtml("#select-operator", datalistHtml);
  };

  ZEALOT.statsOperatorSelect = function(e) {
    var val = e.value;
    if (val === "") {
      ZEALOT.idOperatorForStats = 0;
      ZEALOT.statsSectorSelect(null, 0);
    } else
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
      $(".bootstrap-tagsinput").addClass("gone");
    } else
      $('#select-selection-ticket option').each(function() {
        if (this.value.toUpperCase() === val.toUpperCase()) {
          ZEALOT.idSelectionForTicket = $(this).find("#val").attr("value");
          $("div[class^='to-']").addClass("gone");
          $(".bootstrap-tagsinput").addClass("gone");
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
            case 5, "5":
              $ajaxUtils.sendGetRequest(
                ZEALOT.apiRoot + "getTags" + "?idT=" + ZEALOT.idTicketCurrent,
                function(responseArray, status) {
                  $(".to-tags").tagsinput("removeAll");
                  $(".to-tags").tagsinput({
                    trimValue: true
                  });
                  for (var i = 0; i < responseArray.length; i++) {
                    $(".to-tags").tagsinput("add", responseArray[i].tagName);
                  }
                  $(".to-tags").removeClass("gone");
                  $(".bootstrap-tagsinput").removeClass("gone");
                },
                true /*, ZEALOT.bearer*/
              );
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
    if (val === "") {
      ZEALOT.idSectorForTicket = 0;
      $("#operator-select-ticket").val("");
      var datalistHtmlSectorCleared = "";
      for (var i = 0; i < ZEALOT.allOperators.length; i++) {
        if (ZEALOT.allOperators[i].idSc != null)
          datalistHtmlSectorCleared += `<option value="` + ZEALOT.allOperators[i].onm + `"><div value="` + ZEALOT.allOperators[i].idO + `" id="val"></div></option>`;
      }
      insertHtml("#select-operator-ticket", datalistHtmlSectorCleared);
    } else
      $('#select-sector-ticket option').each(function() {
        if (this.value.toUpperCase() === val.toUpperCase()) {
          ZEALOT.idSectorForTicket = $(this).find("#val").attr("value");
          ZEALOT.idOperatorForTicket = 0;
          $("#operator-select-ticket").val("");
          var datalistHtml = "";
          for (var i = 0; i < ZEALOT.allOperators.length; i++) {
            if ((ZEALOT.allOperators[i].idSc == ZEALOT.idSectorForTicket || ZEALOT.idSectorForTicket == 0) && ZEALOT.allOperators[i].idSc != null)
              datalistHtml += `<option value="` + ZEALOT.allOperators[i].onm + `"><div value="` + ZEALOT.allOperators[i].idO + `" id="val"></div></option>`;
          }
          insertHtml("#select-operator-ticket", datalistHtml);
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

  ZEALOT.ticketStatusSelect = function(e) {
    var val = e.value;
    if (val === "")
      ZEALOT.idStatusForTicket = 0;
    else
      $('#select-status-ticket option').each(function() {
        if (this.value.toUpperCase() === val.toUpperCase()) {
          ZEALOT.idStatusForTicket = $(this).find("#val").attr("value");
        }
      });
  };

  ZEALOT.ticketTypeSelect = function(e) {
    var val = e.value;
    if (val === "")
      ZEALOT.idTypeForTicket = 0;
    else
      $('#select-type-ticket option').each(function() {
        if (this.value.toUpperCase() === val.toUpperCase()) {
          ZEALOT.idTypeForTicket = $(this).find("#val").attr("value");
        }
      });
  };

  ZEALOT.ticketPrioritySelect = function(e) {
    var val = e.value;
    if (val === "")
      ZEALOT.idPriorityForTicket = 0;
    else
      $('#select-priority-ticket option').each(function() {
        if (this.value.toUpperCase() === val.toUpperCase()) {
          ZEALOT.idPriorityForTicket = $(this).find("#val").attr("value");
        }
      });
  };

  ZEALOT.ticketCompanySelect = function(e) {
    var val = e.value;
    if (val === "")
      ZEALOT.idCompanyForTicket = 0;
    else
      $('#select-company-ticket option').each(function() {
        if (this.value.toUpperCase() === val.toUpperCase()) {
          ZEALOT.idCompanyForTicket = $(this).find("#val").attr("value");
        }
      });
  };

  ZEALOT.addCompany = function() {
    if ($("#company-select-ticket").val() == "" || $("#company-select-ticket").val() == null) return;
    $.confirm({
      theme: "material",
      title: "Potvrda akcije",
      content: "Da li želite da dodate kompaniju " + $("#company-select-ticket").val().toUpperCase() + " u sistem?",
      type: "green",
      typeAnimated: true,
      buttons: {
        no: {
          text: "NE",
          action: function() {}
        },
        yes: {
          text: "DA",
          btnClass: "btn-green",
          action: function() {
            $ajaxUtils.sendPostRequest(
              ZEALOT.apiRoot + "addNewCompany" + "?name=" + encodeURIComponent($("#company-select-ticket").val().toUpperCase()),
              function(responseArray, status) {
                $ajaxUtils.sendGetRequest(
                  ZEALOT.apiRoot + "getCompanies",
                  function(companiesArray, status) {
                    ZEALOT.allCompanies = companiesArray;
                    $("#company-select-ticket").val("");
                    var companyDatalistOptionsHtml = "";
                    for (var i = 0; i < companiesArray.length; i++)
                      companyDatalistOptionsHtml += `<option value="` + ZEALOT.allCompanies[i].companyName + `"><div value="` + ZEALOT.allCompanies[i].idCompany + `" id="val"></div></option>`;
                    insertHtml("#select-company-ticket", companyDatalistOptionsHtml);
                  },
                  true /*, ZEALOT.bearer*/
                );
              },
              true /*, ZEALOT.bearer*/
            );
          }
        }
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

  ZEALOT.siAux = function() {
    insertHtml("#main-content", `
      <img class="main-loaded-helper" src="img/Z white.svg" onload="$ZEALOT.mainLoaded(this);">
      <div class="main-screen">
        <div class="sidebar">
          <div class="sidebar-button inbox-button active" onclick="$ZEALOT.sidebarButtonClick(this);">
            <i class="fa fa-ticket"></i>
          </div>
          <div class="sidebar-button contacts-button" onclick="$ZEALOT.sidebarButtonClick(this);">
            <i class="fa fa-address-book"></i>
          </div>
          <div class="thumb hidden-md-up">
            <div class="thumb-helper" onmouseenter="$ZEALOT.thumbEnter();" onmouseout="$ZEALOT.thumbLeave();" onclick="$ZEALOT.thumbClick();"></div>
            <i class="fa fa-chevron-left"></i>
          </div>
          <div class="sidebar-button admin-settings-button hidden" onclick="$ZEALOT.sidebarButtonClick(this);">
            <i class="fa fa-cog"></i>
          </div>
          <div class="sidebar-button account-settings-button" onclick="$ZEALOT.sidebarButtonClick(this);">
            <i class="fa fa-user"></i>
          </div>
          <div class="sidebar-button statistics-button" onclick="$ZEALOT.sidebarButtonClick(this);">
            <i class="fa fa-pie-chart"></i>
          </div>
        </div>
        <div class="sidebar-popup">
          <div class="sidebar-popup-content open-sans-dark-normal">
          </div>
          <div class="copyright oswald-dark-blue-normal">
            Copyright&nbsp;&copy;&nbsp;2017.&nbsp;DBS. All&nbsp;rights&nbsp;reserved.
          </div>
        </div>
        <div class="sidebar-thumb hidden-md-down">
          <div class="thumb">
            <div class="thumb-helper" onmouseenter="$ZEALOT.thumbEnter();" onmouseout="$ZEALOT.thumbLeave();" onclick="$ZEALOT.thumbClick();"></div>
            <i class="fa fa-chevron-left"></i>
          </div>
          <div class="under-thumb-container">
            <div class="under-thumb"></div>
          </div>
        </div>
        <div class="main-panel">
        </div>
      </div>
    `);
  };

  ZEALOT.signIn = function() {
    $("#login-button").html("<i class='fa fa-circle-o-notch fa-spin'></i>");
    $("#username, #password").prop("disabled", true);
    if ($("#username").val() == "" || $("#password").val() == "") {
      $("#login-button").html("Sign In");
      $("#username, #password").prop("disabled", false);
      $.confirm({
        theme: "material",
        title: "Greška",
        content: "Morate uneti svoje kredencijale u oba polja.",
        type: "red",
        typeAnimated: true,
        buttons: {
          ok: {
            text: "OK",
            btnClass: "btn-red",
            action: function() {}
          }
        }
      });
      return;
    }
    $ajaxUtils.sendGetRequest(
      ZEALOT.apiRoot + "login" + "?user=" + $("#username").val() + "&pass=" + $("#password").val(),
      function(responseArray, status) {
        if (responseArray.length == 0) {
          $("#login-button").html("Sign In");
          $("#username, #password").prop("disabled", false);
          $.confirm({
            theme: "material",
            title: "Greška",
            content: "U sistemu ne postoji zadata kombinacija korisničkog imena i lozinke.<br><br>Proverite svoje kredencijale i pokušajte opet.",
            type: "red",
            typeAnimated: true,
            buttons: {
              ok: {
                text: "OK",
                btnClass: "btn-red",
                action: function() {}
              }
            }
          });
          return;
        } else {
          ZEALOT.userInfo = responseArray[0];
          ZEALOT.adminPrivilegesGranted = ZEALOT.userInfo.isAdmin;
          ZEALOT.siAux();
          var sync = 0;
          $ajaxUtils.sendGetRequest(
            ZEALOT.apiRoot + "allOperators",
            function(responseArray, status) {
              ZEALOT.allOperators = responseArray;
              sync = sync + 1;
              if (sync == 6) ZEALOT.loadSidebarTickets();
            },
            true /*, ZEALOT.bearer*/
          );
          $ajaxUtils.sendGetRequest(
            ZEALOT.apiRoot + "allSectors",
            function(responseArray, status) {
              ZEALOT.allSectors = responseArray;
              sync = sync + 1;
              if (sync == 6) ZEALOT.loadSidebarTickets();
            },
            true /*, ZEALOT.bearer*/
          );
          $ajaxUtils.sendGetRequest(
            ZEALOT.apiRoot + "allTicketTypes",
            function(responseArray, status) {
              ZEALOT.allTicketTypes = responseArray;
              sync = sync + 1;
              if (sync == 6) ZEALOT.loadSidebarTickets();
            },
            true /*, ZEALOT.bearer*/
          );
          $ajaxUtils.sendGetRequest(
            ZEALOT.apiRoot + "allTicketStatuses",
            function(responseArray, status) {
              ZEALOT.allTicketStatuses = responseArray;
              sync = sync + 1;
              if (sync == 6) ZEALOT.loadSidebarTickets();
            },
            true /*, ZEALOT.bearer*/
          );
          $ajaxUtils.sendGetRequest(
            ZEALOT.apiRoot + "allTicketPriorities",
            function(responseArray, status) {
              ZEALOT.allTicketPriorities = responseArray;
              sync = sync + 1;
              if (sync == 6) ZEALOT.loadSidebarTickets();
            },
            true /*, ZEALOT.bearer*/
          );
          $ajaxUtils.sendGetRequest(
            ZEALOT.apiRoot + "getCompanies",
            function(responseArray, status) {
              ZEALOT.allCompanies = responseArray;
              sync = sync + 1;
              if (sync == 6) ZEALOT.loadSidebarTickets();
            },
            true /*, ZEALOT.bearer*/
          );
        }
      },
      true /*, ZEALOT.bearer*/
    );
  };

  ZEALOT.loadSidebarTickets = function() {
    var sync = 0;
    var syncp = 0;
    var syncs = 0;
    var synct = 0;
    $ajaxUtils.sendGetRequest(
      ZEALOT.apiRoot + "allUnreadTicketsCount" + "?idO=" + ((ZEALOT.adminPrivilegesGranted) ? 0 : ZEALOT.userInfo.idOperator),
      function(responseArray, status) {
        ZEALOT.allUnreadTicketsCount = responseArray[0].allUnreadTicketsCount;
        ZEALOT.allUncompletedTicketsCount = responseArray[0].allUncompletedTicketsCount;
        ZEALOT.allUnassignedTicketsCount = responseArray[0].allUnassignedTicketsCount;
        sync = sync + 1;
        if (sync == 4) ZEALOT.lstAux();
      },
      true /*, ZEALOT.bearer*/
    );
    for (var i = 0; i < ZEALOT.allTicketPriorities.length; i++) {
      $ajaxUtils.sendGetRequest(
        ZEALOT.apiRoot + "allUnreadTicketsByPriorityCount" + "?idO=" + ((ZEALOT.adminPrivilegesGranted) ? 0 : ZEALOT.userInfo.idOperator) + "&idP=" + ZEALOT.allTicketPriorities[i].idP + "&i=" + i,
        function(responseArray, status) {
          ZEALOT.allTicketPriorities[responseArray[0].i].unread = responseArray[0].allUnreadTicketsByPriorityCount;
          ZEALOT.allTicketPriorities[responseArray[0].i].all = responseArray[0].allTicketsByPriorityCount;
          syncp = syncp + 1;
          if (syncp == ZEALOT.allTicketPriorities.length) {
            sync = sync + 1;
            if (sync == 4) ZEALOT.lstAux();
          }
        },
        true /*, ZEALOT.bearer*/
      );
    }
    for (var i = 0; i < ZEALOT.allTicketStatuses.length; i++) {
      $ajaxUtils.sendGetRequest(
        ZEALOT.apiRoot + "allUnreadTicketsByStatusCount" + "?idO=" + ((ZEALOT.adminPrivilegesGranted) ? 0 : ZEALOT.userInfo.idOperator) + "&idS=" + ZEALOT.allTicketStatuses[i].idSt + "&i=" + i,
        function(responseArray, status) {
          ZEALOT.allTicketStatuses[responseArray[0].i].unread = responseArray[0].allUnreadTicketsByStatusCount;
          ZEALOT.allTicketStatuses[responseArray[0].i].all = responseArray[0].allTicketsByStatusCount;
          syncs = syncs + 1;
          if (syncs == ZEALOT.allTicketStatuses.length) {
            sync = sync + 1;
            if (sync == 4) ZEALOT.lstAux();
          }
        },
        true /*, ZEALOT.bearer*/
      );
    }
    for (var i = 0; i < ZEALOT.allTicketTypes.length; i++) {
      $ajaxUtils.sendGetRequest(
        ZEALOT.apiRoot + "allUnreadTicketsByTypeCount" + "?idO=" + ((ZEALOT.adminPrivilegesGranted) ? 0 : ZEALOT.userInfo.idOperator) + "&idT=" + ZEALOT.allTicketTypes[i].idTtp + "&i=" + i,
        function(responseArray, status) {
          ZEALOT.allTicketTypes[responseArray[0].i].unread = responseArray[0].allUnreadTicketsByTypeCount;
          ZEALOT.allTicketTypes[responseArray[0].i].all = responseArray[0].allTicketsByTypeCount;
          synct = synct + 1;
          if (synct == ZEALOT.allTicketTypes.length) {
            sync = sync + 1;
            if (sync == 4) ZEALOT.lstAux();
          }
        },
        true /*, ZEALOT.bearer*/
      );
    }
  };

  ZEALOT.searchTickets = function() {
    var words = $("#search-terms").val();
    if (words == "") return;
    $(".category .fa-caret-right").addClass("hidden");
    $ajaxUtils.sendGetRequest(
      ZEALOT.apiRoot + "search" + "?idO=" + ((ZEALOT.adminPrivilegesGranted) ? 0 : ZEALOT.userInfo.idOperator) + "&words=" + encodeURIComponent(words),
      function(responseArray, status) {
        ZEALOT.ccAux(responseArray);
      },
      true /*, ZEALOT.bearer*/
    );
  };

  ZEALOT.lstAux = function() {
    var popupTicketsHtml = `
      <div class="popup-ticket">
        <div class="popup-bar">
          <input type="text" onkeydown="if (event.keyCode == 13) $ZEALOT.searchTickets();" id="search-terms" class="open-sans-dark-normal bump" placeholder="Pretraga" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Pretraga'"></input>
          <button class="popup-button" onclick="$ZEALOT.searchTickets();"><i class="fa fa-search"></i></button>
        </div>
        <h2 class="oswald-dark-blue-normal">Svi tiketi</h2>
        <div class="` + ((ZEALOT.allUnreadTicketsCount > 0) ? `open-sans-dark-bold` : `open-sans-dark-normal`) + ` bump tabbed category t-visible" onclick="$ZEALOT.categoryClicked(this);">NEKOMPLETIRANI<div class="num">` + ((ZEALOT.allUnreadTicketsCount > 0) ? ZEALOT.allUnreadTicketsCount : `0`) + `/` + ZEALOT.allUncompletedTicketsCount + `</div><div class="fa fa-caret-right hidden"></div></div>` +
      ((ZEALOT.adminPrivilegesGranted == true) ? `
        <div class="` + ((ZEALOT.allUnassignedTicketsCount > 0) ? `open-sans-dark-bold` : `open-sans-dark-normal`) + ` bump tabbed category t-unassigned" onclick="$ZEALOT.categoryClicked(this);">NEDODELJENI<div class="num">` + ZEALOT.allUnassignedTicketsCount + `</div><div class="fa fa-caret-right hidden"></div></div>
        ` : ``) + `
    `;
    /*
    <div class="open-sans-dark-normal bump tabbed category t-hidden" onclick="$ZEALOT.categoryClicked(this);">SAKRIVENI<div class="fa fa-caret-right hidden"></div></div>
    */
    popupTicketsHtml += `<h2 class="oswald-dark-blue-normal">Po statusu</h2>`;
    for (var i = 0; i < ZEALOT.allTicketStatuses.length; i++) {
      popupTicketsHtml += `
        <div class="` + ((ZEALOT.allTicketStatuses[i].unread > 0) ? `open-sans-dark-bold` : `open-sans-dark-normal`) + ` bump tabbed category t-status" value=` + ZEALOT.allTicketStatuses[i].idSt + ` onclick="$ZEALOT.categoryClicked(this);">` + ZEALOT.allTicketStatuses[i].stn + `<div class="num">` + ((ZEALOT.allTicketStatuses[i].unread > 0) ? ZEALOT.allTicketStatuses[i].unread : `0`) + `/` + ZEALOT.allTicketStatuses[i].all + `</div><div class="fa fa-caret-right hidden"></div></div>
      `;
    }
    /*
    popupTicketsHtml += `<h2 class="oswald-dark-blue-normal">Po prioritetu</h2>`;
    for (var i = 0; i < ZEALOT.allTicketPriorities.length; i++) {
      popupTicketsHtml += `
        <div class="` + ((ZEALOT.allTicketPriorities[i].unread > 0) ? `open-sans-dark-bold` : `open-sans-dark-normal`) + ` bump tabbed category t-priority" value=` + ZEALOT.allTicketPriorities[i].idP + ` onclick="$ZEALOT.categoryClicked(this);">` + ZEALOT.allTicketPriorities[i].pn + `<div class="num">` + ((ZEALOT.allTicketPriorities[i].unread > 0) ? ZEALOT.allTicketPriorities[i].unread : `0`) + `/` + ZEALOT.allTicketPriorities[i].all + `</div><div class="fa fa-caret-right hidden"></div></div>
      `;
    }
    */
    popupTicketsHtml += `<h2 class="oswald-dark-blue-normal">Po tipu</h2>`;
    for (var i = 0; i < ZEALOT.allTicketTypes.length; i++) {
      popupTicketsHtml += `
        <div class="` + ((ZEALOT.allTicketTypes[i].unread > 0) ? `open-sans-dark-bold` : `open-sans-dark-normal`) + ` bump tabbed category t-type" value=` + ZEALOT.allTicketTypes[i].idTtp + ` onclick="$ZEALOT.categoryClicked(this);">` + ZEALOT.allTicketTypes[i].ttpn + `<div class="num">` + ((ZEALOT.allTicketTypes[i].unread > 0) ? ZEALOT.allTicketTypes[i].unread : `0`) + `/` + ZEALOT.allTicketTypes[i].all + `</div><div class="fa fa-caret-right hidden"></div></div>
      `;
    }
    popupTicketsHtml += `</div>`;
    insertHtml(".sidebar-popup-content", popupTicketsHtml);
  };

  ZEALOT.loadSidebarContacts = function() {
    insertHtml(".sidebar-popup-content", `
      <div class="popup-contacts">
        <h2 class="oswald-dark-blue-normal">Kontakti</h2>
        <div class="open-sans-dark-normal bump tabbed category c-dbs" onclick="$ZEALOT.categoryClicked(this);">DBS<div class="fa fa-caret-right hidden"></div></div>
        <div class="open-sans-dark-normal bump tabbed category c-others" onclick="$ZEALOT.categoryClicked(this);">OSTALI<div class="fa fa-caret-right hidden"></div></div>
      </div>
    `);
  };

  ZEALOT.changePassword = function() {
    if ($("#change-password").val() == "") return;
    $ajaxUtils.sendGetRequest(
      ZEALOT.apiRoot + "changePassword" + "?idO=" + ZEALOT.userInfo.idOperator + "&newPass=" + encodeURIComponent($("#change-password").val()),
      function(responseArray, status) {},
      true /*, ZEALOT.bearer*/
    );
  };

  ZEALOT.loadSidebarAccount = function() {
    insertHtml(".sidebar-popup-content", `
      <div class="popup-account">
        <div class="popup-bar unhoverable">
          <input id="change-password" type="password" class="open-sans-dark-normal bump" placeholder="Promena lozinke" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Promena lozinke'"></input>
          <button class="popup-button" onclick="ZEALOT.changePassword();"><i class="fa fa-key"></i></button>
        </div>
        <h2 class="oswald-dark-blue-normal">Informacije</h2>
        <div class="open-sans-dark-normal bump tabbed unhoverable">IME<div class="num user-name">` + ZEALOT.userInfo.operatorName + `</div></div>
        <div class="open-sans-dark-normal bump tabbed unhoverable">SEKTOR<div class="num user-sector">` + ZEALOT.userInfo.sectorName + `</div></div>
        <div class="open-sans-dark-normal bump tabbed unhoverable">E-MAIL<div class="num user-email">` + ZEALOT.userInfo.username + `</div></div>
        <div class="open-sans-dark-normal bump tabbed unhoverable">TELEFON<div class="num user-phone">` + ZEALOT.userInfo.phone + `</div></div>` + ((ZEALOT.userInfo.isAdmin) ? `
        <h2 class="oswald-dark-blue-normal">Admin privilegije</h2>
        <div class="open-sans-dark-normal bump tabbed unhoverable"><div class="admin-privileges-status">` + ((ZEALOT.adminPrivilegesGranted) ? `UKLJUČENO` : `ISKLJUČENO`) + `</div><div class="num"><label class="switch"><input class="admin-privileges" type="checkbox" onclick="$ZEALOT.adminPrivileges(this);" ` + ((ZEALOT.adminPrivilegesGranted) ? `checked` : ``) + `></input><span class="slider"></span></label></div></div>` : ``) + `
      </div>
    `);
  };

  ZEALOT.ssAux = function(all, nc) {
    var statsSearchHtml = `
      <div class="title-fixed oswald-blue-semibold">
        Statistika
        <div class="stats-progress-bar"></div>
        <div class="stats-progress-bar-gradient"></div>
        <img class="stats-loaded-helper" src="img/Z white.svg" onload="$ZEALOT.statsLoaded(this);">
      </div>
      <div class="main-panel-stats scrollable row">
    `;
    if (all == false) {
      var s0sum = 0;
      var s1sum = 0;
      var s2sum = 0;
      var s3sum = 0;
      for (var i = 0; i < ZEALOT.s0.length; i++) {
        s0sum += ZEALOT.s0[i].cnt;
        s1sum += ZEALOT.s1[i].cnt;
        s2sum += ZEALOT.s2[i].cnt;
        s3sum += ZEALOT.s3[i].cnt;
      }
      statsSearchHtml += `
        <div class="stat col-12 col-md-6">
          <div class="stat-title oswald-blue-normal">Za poslednja 24h:</div>
          <div class="stat-numbers">
            <div class="large-number oswald-dark-blue-normal">` + s1sum + `</div>
      `;
      if (nc == true) {
        statsSearchHtml += `
            <div class="small-numbers-container">
        `;
        for (var i = 0; i < ZEALOT.s1.length; i++)
          statsSearchHtml += `<div class="small-number-` + (i + 1) + `">` + ZEALOT.s1[i].cnt + ` ` + ZEALOT.s1[i].pn + `</div>`;
        statsSearchHtml += `
            </div>
        `;
      }
      statsSearchHtml += `
          </div>
        </div>
      `;
      statsSearchHtml += `
        <div class="stat col-12 col-md-6">
          <div class="stat-title oswald-blue-normal">Za poslednjih 7 dana:</div>
          <div class="stat-numbers">
            <div class="large-number oswald-dark-blue-normal">` + s2sum + `</div>
      `;
      if (nc == true) {
        statsSearchHtml += `
            <div class="small-numbers-container">
        `;
        for (var i = 0; i < ZEALOT.s2.length; i++)
          statsSearchHtml += `<div class="small-number-` + (i + 1) + `">` + ZEALOT.s2[i].cnt + ` ` + ZEALOT.s2[i].pn + `</div>`;
        statsSearchHtml += `
            </div>
        `;
      }
      statsSearchHtml += `
          </div>
        </div>
      `;
      statsSearchHtml += `
        <div class="stat col-12 col-md-6">
          <div class="stat-title oswald-blue-normal">Za poslednjih 30 dana:</div>
          <div class="stat-numbers">
            <div class="large-number oswald-dark-blue-normal">` + s3sum + `</div>
      `;
      if (nc == true) {
        statsSearchHtml += `
            <div class="small-numbers-container">
        `;
        for (var i = 0; i < ZEALOT.s3.length; i++)
          statsSearchHtml += `<div class="small-number-` + (i + 1) + `">` + ZEALOT.s3[i].cnt + ` ` + ZEALOT.s3[i].pn + `</div>`;
        statsSearchHtml += `
            </div>
        `;
      }
      statsSearchHtml += `
          </div>
        </div>
      `;
      statsSearchHtml += `
        <div class="stat col-12 col-md-6">
          <div class="stat-title oswald-blue-normal">Ukupno:</div>
          <div class="stat-numbers">
            <div class="large-number oswald-dark-blue-normal">` + s0sum + `</div>
      `;
      if (nc == true) {
        statsSearchHtml += `
            <div class="small-numbers-container">
        `;
        for (var i = 0; i < ZEALOT.s0.length; i++)
          statsSearchHtml += `<div class="small-number-` + (i + 1) + `">` + ZEALOT.s0[i].cnt + ` ` + ZEALOT.s0[i].pn + `</div>`;
        statsSearchHtml += `
            </div>
        `;
      }
      statsSearchHtml += `
          </div>
        </div>
      `;
    } else {
      statsSearchHtml += `<div class="special-stat col-md-1 hidden-sm-down"></div>`;
      for (var i = 0; i < ZEALOT.allSectors.length; i++) {
        var sum = 0;
        for (var j = 0; j < specialCounters['s' + i].length; j++) sum += specialCounters['s' + i][j].cnt;
        statsSearchHtml += `
          <div class="special-stat stat col-12 col-md-2">
            <div class="stat-title oswald-blue-normal">` + ZEALOT.allSectors[i].scn + `:</div>
            <div class="stat-numbers">
              <div class="large-number oswald-dark-blue-normal">` + sum + `</div>
        `;
        if (nc == true) {
          statsSearchHtml += `
              <div class="small-numbers-container">
          `;
          for (var j = 0; j < specialCounters['s' + i].length; j++)
            statsSearchHtml += `<div class="small-number-` + (j + 1) + `">` + specialCounters['s' + i][j].cnt + ` ` + specialCounters['s' + i][j].pn + `</div>`;
          statsSearchHtml += `
              </div>
          `;
        }
        statsSearchHtml += `
            </div>
          </div>
        `;
      }
    }
    statsSearchHtml += `
      </div>
    `;
    insertHtml(".main-panel", statsSearchHtml);
  };

  ZEALOT.statsSearch = function() {
    var sync = 0;
    if (Number(ZEALOT.idOperatorForStats) == 0 && Number(ZEALOT.idSectorForStats) == 0) {
      $ajaxUtils.sendGetRequest(
        ZEALOT.apiRoot + "countTickets" + "?t=0" + "&idO=" + ZEALOT.idOperatorForStats + "&idS=" + ZEALOT.allSectors[0].idSc + "&nc=" + ZEALOT.nc,
        function(responseArray, status) {
          specialCounters['s' + 0] = responseArray;
          sync = sync + 1;
          if (sync == ZEALOT.allSectors.length) ZEALOT.ssAux(true, ZEALOT.nc);
        },
        true /*, ZEALOT.bearer*/
      );
      $ajaxUtils.sendGetRequest(
        ZEALOT.apiRoot + "countTickets" + "?t=0" + "&idO=" + ZEALOT.idOperatorForStats + "&idS=" + ZEALOT.allSectors[1].idSc + "&nc=" + ZEALOT.nc,
        function(responseArray, status) {
          specialCounters['s' + 1] = responseArray;
          sync = sync + 1;
          if (sync == ZEALOT.allSectors.length) ZEALOT.ssAux(true, ZEALOT.nc);
        },
        true /*, ZEALOT.bearer*/
      );
      $ajaxUtils.sendGetRequest(
        ZEALOT.apiRoot + "countTickets" + "?t=0" + "&idO=" + ZEALOT.idOperatorForStats + "&idS=" + ZEALOT.allSectors[2].idSc + "&nc=" + ZEALOT.nc,
        function(responseArray, status) {
          specialCounters['s' + 2] = responseArray;
          sync = sync + 1;
          if (sync == ZEALOT.allSectors.length) ZEALOT.ssAux(true, ZEALOT.nc);
        },
        true /*, ZEALOT.bearer*/
      );
      $ajaxUtils.sendGetRequest(
        ZEALOT.apiRoot + "countTickets" + "?t=0" + "&idO=" + ZEALOT.idOperatorForStats + "&idS=" + ZEALOT.allSectors[3].idSc + "&nc=" + ZEALOT.nc,
        function(responseArray, status) {
          specialCounters['s' + 3] = responseArray;
          sync = sync + 1;
          if (sync == ZEALOT.allSectors.length) ZEALOT.ssAux(true, ZEALOT.nc);
        },
        true /*, ZEALOT.bearer*/
      );
      $ajaxUtils.sendGetRequest(
        ZEALOT.apiRoot + "countTickets" + "?t=0" + "&idO=" + ZEALOT.idOperatorForStats + "&idS=" + ZEALOT.allSectors[4].idSc + "&nc=" + ZEALOT.nc,
        function(responseArray, status) {
          specialCounters['s' + 4] = responseArray;
          sync = sync + 1;
          if (sync == ZEALOT.allSectors.length) ZEALOT.ssAux(true, ZEALOT.nc);
        },
        true /*, ZEALOT.bearer*/
      );
    } else {
      $ajaxUtils.sendGetRequest(
        ZEALOT.apiRoot + "countTickets" + "?t=0" + "&idO=" + ZEALOT.idOperatorForStats + "&idS=" + ZEALOT.idSectorForStats + "&nc=" + ZEALOT.nc,
        function(responseArray, status) {
          ZEALOT.s0 = responseArray;
          sync = sync + 1;
          if (sync == 4) ZEALOT.ssAux(false, ZEALOT.nc);
        },
        true /*, ZEALOT.bearer*/
      );
      $ajaxUtils.sendGetRequest(
        ZEALOT.apiRoot + "countTickets" + "?t=1" + "&idO=" + ZEALOT.idOperatorForStats + "&idS=" + ZEALOT.idSectorForStats + "&nc=" + ZEALOT.nc,
        function(responseArray, status) {
          ZEALOT.s1 = responseArray;
          sync = sync + 1;
          if (sync == 4) ZEALOT.ssAux(false, ZEALOT.nc);
        },
        true /*, ZEALOT.bearer*/
      );
      $ajaxUtils.sendGetRequest(
        ZEALOT.apiRoot + "countTickets" + "?t=2" + "&idO=" + ZEALOT.idOperatorForStats + "&idS=" + ZEALOT.idSectorForStats + "&nc=" + ZEALOT.nc,
        function(responseArray, status) {
          ZEALOT.s2 = responseArray;
          sync = sync + 1;
          if (sync == 4) ZEALOT.ssAux(false, ZEALOT.nc);
        },
        true /*, ZEALOT.bearer*/
      );
      $ajaxUtils.sendGetRequest(
        ZEALOT.apiRoot + "countTickets" + "?t=3" + "&idO=" + ZEALOT.idOperatorForStats + "&idS=" + ZEALOT.idSectorForStats + "&nc=" + ZEALOT.nc,
        function(responseArray, status) {
          ZEALOT.s3 = responseArray;
          sync = sync + 1;
          if (sync == 4) ZEALOT.ssAux(false, ZEALOT.nc);
        },
        true /*, ZEALOT.bearer*/
      );
    }
  };

  ZEALOT.searchNC = function(e) {
    if ($(e).prop("checked") == true) {
      $(".search-nc-status").html("NEOBRAĐENI");
      ZEALOT.nc = true;
    } else {
      $(".search-nc-status").html("OBRAĐENI");
      ZEALOT.nc = false;
    }
  };

  ZEALOT.loadSidebarStats = function() {
    ZEALOT.idOperatorForStats = ZEALOT.adminPrivilegesGranted ? 0 : ZEALOT.userInfo.idOperator;
    ZEALOT.idSectorForStats = 0;
    ZEALOT.nc = false;
    var popupStatsHtml = `
      <div class="popup-stats">
        <div class="popup-bar unhoverable">
          <button class="popup-button" onclick="$ZEALOT.statsSearch();"><i class="fa fa-search"></i></button >
        </div>
        <h2 class="oswald-dark-blue-normal">Vrsta</h2>
        <div class="open-sans-dark-normal bump tabbed unhoverable"><div class="search-nc-status">OBRAĐENI</div><div class="num switch-num"><label class="switch"><input class="search-nc" type="checkbox" onclick="$ZEALOT.searchNC(this);"></input><span class="slider"></span></label></div></div>
    `;
    if (ZEALOT.adminPrivilegesGranted) {
      popupStatsHtml += `
        <h2 class="oswald-dark-blue-normal">Po sektoru</h2>
        <div class="open-sans-dark-normal bump tabbed s-all" onclick="$ZEALOT.statsSectorSelect(this, 0);">SVI<div class="num fa fa-check-circle stats-radio"></div></div>
      `;
      for (var i = 0; i < ZEALOT.allSectors.length; i++) {
        popupStatsHtml += `
        <div class="open-sans-dark-normal bump tabbed" onclick="$ZEALOT.statsSectorSelect(this, ` + ZEALOT.allSectors[i].idSc + `);">` + ZEALOT.allSectors[i].scn + `<div class="num fa fa-circle-o stats-radio"></div></div>
        `;
      }
      popupStatsHtml += `
        <h2 class="oswald-dark-blue-normal">Po operateru</h2>
        <div class="operator-select-container bump tabbed unhoverable">
          <input id="operator-select" type="search" list="select-operator" oninput = "$ZEALOT.statsOperatorSelect(this);">
          <datalist id="select-operator">
      `;
      for (var i = 0; i < ZEALOT.allOperators.length; i++) {
        if (ZEALOT.allOperators[i].idSc != null)
          popupStatsHtml += `
            <option value="` + ZEALOT.allOperators[i].onm + `"><div value="` + ZEALOT.allOperators[i].idO + `" id="val"></div></option>
          `;
      }
      popupStatsHtml += `
          </datalist>
        </div>
      `;
    }
    popupStatsHtml += `
      </div>
    `;
    insertHtml(".sidebar-popup-content", popupStatsHtml);
  };

  global.$ZEALOT = ZEALOT;

  /*
  $ajaxUtils.sendGetRequest(
    ZEALOT.apiRoot + "allOperators",
    function (responseArray, status) {
      //
    },
    true /*, ZEALOT.bearer
  );
  */

})(window);