(function(global) {

  ZEALOT = {};

  ZEALOT.browserWidth;
  ZEALOT.browserHeight;
  ZEALOT.popupWidth;
  ZEALOT.mainWidthSmall;
  ZEALOT.mainWidthLarge;
  ZEALOT.x = 1;
  ZEALOT.adminPrivilegesGranted = false;
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

  ZEALOT.apiRoot = "https://localhost:50358/api/";
  ZEALOT.userInfo = "";
  ZEALOT.allOperators = "";
  ZEALOT.allSectors = "";
  ZEALOT.allTicketTypes = "";
  ZEALOT.allTicketStatuses = "";
  ZEALOT.allTicketPriorities = "";
  ZEALOT.s0 = "";
  ZEALOT.s1 = "";
  ZEALOT.s2 = "";
  ZEALOT.s3 = "";
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
    $(".stats-progress-bar").addClass("stats-progress-bar-loaded");
    $(e).remove();
  };

  ZEALOT.ticketsLoaded = function(e) {
    $('[data-toggle="tooltip"]').tooltip();
    $(e).remove();
  };

  ZEALOT.ticketLoaded = function(e) {
    console.log("ticket loaded");
    ZEALOT.idStatusForTicket = 0;
    ZEALOT.idTypeForTicket = 0;
    ZEALOT.idCompanyForTicket = 0;
    ZEALOT.clientNameForTicket = 0;
    ZEALOT.clientPhoneForTicket = 0;
    ZEALOT.idSectorForTicket = 0;
    ZEALOT.idOperatorForTicket = 0;
    ZEALOT.idPriorityForTicket = 0;
    $('#mail-editor').trumbowyg();
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
          "height": Math.round(ZEALOT.browserHeight * 0.64),
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
    $.confirm({
      theme: "material",
      title: "Potvrda akcije",
      content: "Da li želite da " + ($(e).hasClass("tc-hide") ? "sakrijete" : "otkrijete") + " tiket " + idT + "?",
      type: ($(e).hasClass("tc-hide") ? "red" : "green"),
      typeAnimated: true,
      buttons: {
        close: {
          text: "NE",
          action: function() {}
        },
        tryAgain: {
          text: "DA",
          btnClass: ($(e).hasClass("tc-hide") ? "btn-red" : "btn-green"),
          action: function() {
            if ($(e).hasClass("tc-hide")) {
              $ajaxUtils.sendGetRequest(
                ZEALOT.apiRoot + "hideTicket" + "?idT=" + idT,
                function(responseArray) {},
                true /*, ZEALOT.bearer*/
              );
            } else {
              $ajaxUtils.sendGetRequest(
                ZEALOT.apiRoot + "showTicket" + "?idT=" + idT,
                function(responseArray) {},
                true /*, ZEALOT.bearer*/
              );
            }
            $(e).parent().addClass("gone");
          }
        }
      }
    });
  };

  ZEALOT.ticketClicked = function(idT) {
    $ajaxUtils.sendGetRequest(
      ZEALOT.apiRoot + "getConversation" + "?idT=" + idT,
      function(responseArray) {
        var ticketHtml = `
          <div class="title-fixed oswald-blue-semibold">
            Tiket ` + idT + `
            <div class="title-bar"></div>
            <img class="ticket-loaded-helper" src="img/Z white.svg" onload="$ZEALOT.ticketLoaded(this);">
            <div class="ticket-options-container">
              <div class="toc-selection">
                <input id="selection-select-ticket" type="search" list="select-selection-ticket" placeholder="Podešavanje" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Podešavanje'" oninput="$ZEALOT.ticketSelectionSelect(this)">
                <datalist id="select-selection-ticket">
                    <option value="Status i tip"><div value="1" id="val"></div></option>
                    <option value="Kompanija i klijent"><div value="2" id="val"></div></option>
                    ` + (ZEALOT.adminPrivilegesGranted ? `
                    <option value="Sektor i operater"><div value="3" id="val"></div></option>
                    <option value="Prioritet"><div value="4" id="val"></div></option>
                    ` : ``) + `
                </datalist>
              </div>
              <div class="to-status gone">
                <input id="status-select-ticket" type="search" list="select-status-ticket" placeholder="Status" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Status'" oninput="$ZEALOT.ticketStatusSelect(this)">
                <datalist id="select-status-ticket">
                    <option value="STATUS 1"><div value="1" id="val"></div></option>
                    <option value="STATUS 2"><div value="2" id="val"></div></option>
                    <option value="STATUS 3"><div value="3" id="val"></div></option>
                    <option value="STATUS 4"><div value="4" id="val"></div></option>
                </datalist>
              </div>
              <div class="to-type gone">
                <input id="type-select-ticket" type="search" list="select-type-ticket" placeholder="Tip" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Tip'" oninput="$ZEALOT.ticketTypeSelect(this)">
                <datalist id="select-type-ticket">
                    <option value="TIP 1"><div value="1" id="val"></div></option>
                    <option value="TIP 2"><div value="2" id="val"></div></option>
                    <option value="TIP 3"><div value="3" id="val"></div></option>
                    <option value="TIP 4"><div value="4" id="val"></div></option>
                </datalist>
              </div>
              <div class="to-company gone">
                <input id="company-select-ticket" type="search" list="select-company-ticket" placeholder="Kompanija" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Kompanija'" oninput="$ZEALOT.ticketCompanySelect(this)">
                <datalist id="select-company-ticket">
                    <option value="Kompanija 1"><div value="1" id="val"></div></option>
                    <option value="Kompanija 2"><div value="2" id="val"></div></option>
                    <option value="Kompanija 3"><div value="3" id="val"></div></option>
                    <option value="Kompanija 4"><div value="4" id="val"></div></option>
                </datalist>
              </div>
              <div class="to-button-container to-add-company-button gone">
                <button class="to-button"><i class="fa fa-plus"></i></button>
              </div>
              <div class="to-client-name gone">
                <input type="text" placeholder="Ime klijenta" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Ime klijenta'"></input>
              </div>
              <div class="to-client-phone gone">
                <input type="text" placeholder="Telefon klijenta" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Telefon klijenta'"></input>
              </div>
              <div class="to-sector gone">
                <input id="sector-select-ticket" type="search" list="select-sector-ticket" placeholder="Sektor" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Sektor'" oninput="$ZEALOT.ticketSectorSelect(this)">
                <datalist id="select-sector-ticket">
                    <option value="Sektor 1"><div value="1" id="val"></div></option>
                    <option value="Sektor 2"><div value="2" id="val"></div></option>
                    <option value="Sektor 3"><div value="3" id="val"></div></option>
                    <option value="Sektor 4"><div value="4" id="val"></div></option>
                </datalist>
              </div>
              <div class="to-operator gone">
                <input id="operator-select-ticket" type="search" list="select-operator-ticket" placeholder="Operater" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Operater'" oninput="$ZEALOT.ticketOperatorSelect(this)">
                <datalist id="select-operator-ticket">
                    <option value="Ime Prezime 1"><div value="1" id="val"></div></option>
                    <option value="Ime Prezime 2"><div value="2" id="val"></div></option>
                    <option value="Ime Prezime 3"><div value="3" id="val"></div></option>
                    <option value="Ime Prezime 4"><div value="4" id="val"></div></option>
                </datalist>
              </div>
              <div class="to-priority gone">
                <input id="priority-select-ticket" type="search" list="select-priority-ticket" placeholder="Prioritet" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Prioritet'" oninput="$ZEALOT.ticketPrioritySelect(this)">
                <datalist id="select-priority-ticket">
                    <option value="PRIORITET 1"><div value="1" id="val"></div></option>
                    <option value="PRIORITET 2"><div value="2" id="val"></div></option>
                    <option value="PRIORITET 3"><div value="3" id="val"></div></option>
                    <option value="PRIORITET 4"><div value="4" id="val"></div></option>
                </datalist>
              </div>
              <div class="to-button-container to-save-button gone">
                <button class="to-button"><i class="fa fa-check"></i></button>
              </div>
            </div>
          </div>
          <div class="main-panel-ticket scrollable-hotfix container">
        `;
        for (var i = 0; i < responseArray.length; i++) {
          ticketHtml += `
            <div class="` + ((responseArray[i].side) ? ((responseArray[i].isInternal) ? `internal-message` : `operator-message`) : `client-message`) + `">
              ` + responseArray[i].body +
            ((responseArray[i].side) ? ((responseArray[i].isInternal) ? `` : `<div class="unselectable">◥</div>`) : `<div class="unselectable">◤</div>`) + `
            </div>
          `;
        }
        ticketHtml += `
          </div>
          <div class="mail-editor-container">
            <div class="mec-menu">
              <div class="mec-editor-toggle fa fa-chevron-up"></div>
              <div class="mec-send fa fa-send gone"></div>
              <div class="mec-internal fa fa-info-circle gone"></div>
            </div>
            <div class="mec-editor">
              <textarea id="mail-editor">
                <div id="mail-body" style="color: #011">
                  <br>
                  <br>
                  <br>
                  <div id="mail-signature" style="margin-left: 5px">
                    <!-- the two images need to have absolute path after migration to web -->
                    <img id="mail-signature-logo" src="img/dbs logo.png" alt="logo" style="width: 20vh; height: auto; display: block"></img>
                    <span id="mail-signature-name" style="font-size: 2.7vh; font-weight: bold; display: inline-block; margin-bottom: 10px; padding-top: 10px">` + ZEALOT.userInfo.operatorName + `</span>
                    <br><span style="font-style: italic; display: inline-block; min-width: 10vh; line-height: 1.2">sektor:</span><span id="mail-signature-sector">` + ZEALOT.userInfo.sectorName + `</span>
                    <br><span style="font-style: italic; display: inline-block; min-width: 10vh; line-height: 1.2">e-mail:</span><span id="mail-signature-email">` + ZEALOT.userInfo.username + `</span>
                    <br><span style="font-style: italic; display: inline-block; min-width: 10vh; line-height: 1.2">telefon:</span><span id="mail-signature-phone">` + ZEALOT.userInfo.phone + `</span>
                    <div id="mail-signature-eco" style="margin-top: 3vh; height: 3vh; position: relative">
                      <div id="mail-signature-leaf" alt="leaf" style="background: url('img/green leaf.png') no-repeat; height: 3vh; width: 3vh; background-size: auto 3vh; position: absolute"></div>
                      <div id="mail-signature-eco-notice" style="color: #00b3b3; font-size: 1.2vh; line-height: 1.5vh; position: absolute; left: 4vh">
                        Molimo Vas sa odštampate ovu poruku samo ukoliko je to neophodno.
                        <br>Please print this e-mail only if necessary.
                      </div>
                    </div>
                  </div>
                </div>
              </textarea>
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
      mainTicketsHtml += `
        <div class="ticket-container row` + ((messagesArray[i].isUnread) ? ` open-sans-dark-bold` : ``) + `" onclick="$ZEALOT.ticketClicked(` + messagesArray[i].idTicket + `);">
          <div class="tc-priority-` + messagesArray[i].idPriority + ` col-1 fa fa-circle" data-toggle="tooltip" data-placement="right" title="` + messagesArray[i].priorityName + ` PRIORITET"></div>
          <div class="tc-id-len col-2">` + messagesArray[i].idTicket + ` (` + messagesArray[i].conversationLength + `)</div>
          <div class="tc-sender col-3" data-toggle="tooltip" data-placement="right" title="` + messagesArray[i].clientName + `, ` + messagesArray[i].companyName + `">` + messagesArray[i].clientMail + `</div>
          <div class="tc-subject col-3">` + messagesArray[i].eMailSubject + `</div>
          <div class="tc-status col-1" data-toggle="tooltip" data-placement="left" title="` + messagesArray[i].statusName + `">&#` + (10101 + messagesArray[i].idStatus) + `;</div>
          <div class="tc-type col-1 fa ` + statusIcon + `" data-toggle="tooltip" data-placement="left" title="` + messagesArray[i].typeName + `"></div>
          <div class="` + ((messagesArray[i].isHidden) ? `tc-show` : `tc-hide`) + ` col-1 fa fa-trash ` + ((messagesArray[i].isUnread) ? `hidden` : ``) + `" data-toggle="tooltip" data-placement="left" title="` + ((messagesArray[i].isHidden) ? `OTKRIJ TIKET` : `SAKRIJ TIKET`) + `" onclick="$ZEALOT.hideOrShowTicket(this, ` + messagesArray[i].idTicket + `, ` + messagesArray[i].isUnread + `)"></div>
        </div>
      `;
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
        function(responseArray) {
          ZEALOT.ccAux(responseArray);
        },
        true /*, ZEALOT.bearer*/
      );
    } else if ($(e).hasClass("t-hidden")) {
      $ajaxUtils.sendGetRequest(
        ZEALOT.apiRoot + "allTickets" + "?idO=" + ((ZEALOT.adminPrivilegesGranted) ? 0 : ZEALOT.userInfo.idOperator) + "&hidden=true",
        function(responseArray) {
          ZEALOT.ccAux(responseArray);
        },
        true /*, ZEALOT.bearer*/
      );
    } else if ($(e).hasClass("t-priority")) {
      $ajaxUtils.sendGetRequest(
        ZEALOT.apiRoot + "allTicketsByPriority" + "?idO=" + ((ZEALOT.adminPrivilegesGranted) ? 0 : ZEALOT.userInfo.idOperator) + "&idP=" + $(e).attr("value"),
        function(responseArray) {
          ZEALOT.ccAux(responseArray);
        },
        true /*, ZEALOT.bearer*/
      );
    } else if ($(e).hasClass("t-status")) {
      $ajaxUtils.sendGetRequest(
        ZEALOT.apiRoot + "allTicketsByStatus" + "?idO=" + ((ZEALOT.adminPrivilegesGranted) ? 0 : ZEALOT.userInfo.idOperator) + "&idS=" + $(e).attr("value"),
        function(responseArray) {
          ZEALOT.ccAux(responseArray);
        },
        true /*, ZEALOT.bearer*/
      );
    } else if ($(e).hasClass("t-type")) {
      $ajaxUtils.sendGetRequest(
        ZEALOT.apiRoot + "allTicketsByType" + "?idO=" + ((ZEALOT.adminPrivilegesGranted) ? 0 : ZEALOT.userInfo.idOperator) + "&idT=" + $(e).attr("value"),
        function(responseArray) {
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
        function(responseArray) {
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
    $("#select-operator").html(datalistHtml);
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
    $ajaxUtils.sendGetRequest(
      ZEALOT.apiRoot + "login" + "?user=" + $("#username").val() + "&pass=" + $("#password").val(),
      function(responseArray) {
        if (responseArray.length == 0) $("#login-button").html("Sign In");
        else {
          ZEALOT.userInfo = responseArray[0];
          ZEALOT.adminPrivilegesGranted = ZEALOT.userInfo.isAdmin;
          ZEALOT.siAux();
          var sync = 0;
          $ajaxUtils.sendGetRequest(
            ZEALOT.apiRoot + "allOperators",
            function(responseArray) {
              ZEALOT.allOperators = responseArray;
              sync = sync + 1;
              if (sync == 5) ZEALOT.loadSidebarTickets();
            },
            true /*, ZEALOT.bearer*/
          );
          $ajaxUtils.sendGetRequest(
            ZEALOT.apiRoot + "allSectors",
            function(responseArray) {
              ZEALOT.allSectors = responseArray;
              sync = sync + 1;
              if (sync == 5) ZEALOT.loadSidebarTickets();
            },
            true /*, ZEALOT.bearer*/
          );
          $ajaxUtils.sendGetRequest(
            ZEALOT.apiRoot + "allTicketTypes",
            function(responseArray) {
              ZEALOT.allTicketTypes = responseArray;
              sync = sync + 1;
              if (sync == 5) ZEALOT.loadSidebarTickets();
            },
            true /*, ZEALOT.bearer*/
          );
          $ajaxUtils.sendGetRequest(
            ZEALOT.apiRoot + "allTicketStatuses",
            function(responseArray) {
              ZEALOT.allTicketStatuses = responseArray;
              sync = sync + 1;
              if (sync == 5) ZEALOT.loadSidebarTickets();
            },
            true /*, ZEALOT.bearer*/
          );
          $ajaxUtils.sendGetRequest(
            ZEALOT.apiRoot + "allTicketPriorities",
            function(responseArray) {
              ZEALOT.allTicketPriorities = responseArray;
              sync = sync + 1;
              if (sync == 5) ZEALOT.loadSidebarTickets();
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
      function(responseArray) {
        ZEALOT.allUnreadTicketsCount = responseArray[0].allUnreadTicketsCount;
        sync = sync + 1;
        if (sync == 4) ZEALOT.lstAux();
      },
      true /*, ZEALOT.bearer*/
    );
    for (var i = 0; i < ZEALOT.allTicketPriorities.length; i++) {
      $ajaxUtils.sendGetRequest(
        ZEALOT.apiRoot + "allUnreadTicketsByPriorityCount" + "?idO=" + ((ZEALOT.adminPrivilegesGranted) ? 0 : ZEALOT.userInfo.idOperator) + "&idP=" + ZEALOT.allTicketPriorities[i].idP + "&i=" + i,
        function(responseArray) {
          ZEALOT.allTicketPriorities[responseArray[0].i].unread = responseArray[0].allUnreadTicketsByPriorityCount;
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
        function(responseArray) {
          ZEALOT.allTicketStatuses[responseArray[0].i].unread = responseArray[0].allUnreadTicketsByStatusCount;
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
        function(responseArray) {
          ZEALOT.allTicketTypes[responseArray[0].i].unread = responseArray[0].allUnreadTicketsByTypeCount;
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
      function(responseArray) {
        ZEALOT.ccAux(responseArray);
      },
      true /*, ZEALOT.bearer*/
    );
  };

  ZEALOT.lstAux = function() {
    var popupTicketsHtml = `
      <div class="popup-ticket">
        <div class="popup-bar">
          <input type="text" id="search-terms" class="open-sans-dark-normal bump" placeholder="Pretraga" onfocus="this.placeholder = ''" onblur="this.placeholder = 'Pretraga'"></input>
          <button class="popup-button" onclick="$ZEALOT.searchTickets();"><i class="fa fa-search"></i></button>
        </div>
        <h2 class="oswald-dark-blue-normal">Svi tiketi</h2>
        <div class="` + ((ZEALOT.allUnreadTicketsCount > 0) ? `open-sans-dark-bold` : `open-sans-dark-normal`) + ` bump tabbed category t-visible" onclick="$ZEALOT.categoryClicked(this);">NESAKRIVENI<div class="num">` + ((ZEALOT.allUnreadTicketsCount > 0) ? ZEALOT.allUnreadTicketsCount : ``) + `</div><div class="fa fa-caret-right hidden"></div></div>
        <div class="open-sans-dark-normal bump tabbed category t-hidden" onclick="$ZEALOT.categoryClicked(this);">SAKRIVENI<div class="fa fa-caret-right hidden"></div></div>
    `;
    popupTicketsHtml += `<h2 class="oswald-dark-blue-normal">Po prioritetu</h2>`;
    for (var i = 0; i < ZEALOT.allTicketPriorities.length; i++) {
      popupTicketsHtml += `
        <div class="` + ((ZEALOT.allTicketPriorities[i].unread > 0) ? `open-sans-dark-bold` : `open-sans-dark-normal`) + ` bump tabbed category t-priority" value=` + ZEALOT.allTicketPriorities[i].idP + ` onclick="$ZEALOT.categoryClicked(this);">` + ZEALOT.allTicketPriorities[i].pn + `<div class="num">` + ((ZEALOT.allTicketPriorities[i].unread > 0) ? ZEALOT.allTicketPriorities[i].unread : ``) + `</div><div class="fa fa-caret-right hidden"></div></div>
      `;
    }
    popupTicketsHtml += `<h2 class="oswald-dark-blue-normal">Po statusu</h2>`;
    for (var i = 0; i < ZEALOT.allTicketStatuses.length; i++) {
      popupTicketsHtml += `
        <div class="` + ((ZEALOT.allTicketStatuses[i].unread > 0) ? `open-sans-dark-bold` : `open-sans-dark-normal`) + ` bump tabbed category t-status" value=` + ZEALOT.allTicketStatuses[i].idSt + ` onclick="$ZEALOT.categoryClicked(this);">` + ZEALOT.allTicketStatuses[i].stn + `<div class="num">` + ((ZEALOT.allTicketStatuses[i].unread > 0) ? ZEALOT.allTicketStatuses[i].unread : ``) + `</div><div class="fa fa-caret-right hidden"></div></div>
      `;
    }
    popupTicketsHtml += `<h2 class="oswald-dark-blue-normal">Po tipu</h2>`;
    for (var i = 0; i < ZEALOT.allTicketTypes.length; i++) {
      popupTicketsHtml += `
        <div class="` + ((ZEALOT.allTicketTypes[i].unread > 0) ? `open-sans-dark-bold` : `open-sans-dark-normal`) + ` bump tabbed category t-type" value=` + ZEALOT.allTicketTypes[i].idTtp + ` onclick="$ZEALOT.categoryClicked(this);">` + ZEALOT.allTicketTypes[i].ttpn + `<div class="num">` + ((ZEALOT.allTicketTypes[i].unread > 0) ? ZEALOT.allTicketTypes[i].unread : ``) + `</div><div class="fa fa-caret-right hidden"></div></div>
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
      function(responseArray) {},
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

  ZEALOT.ssAux = function() {
    var statsSearchHtml = `
      <div class="title-fixed oswald-blue-semibold">
        Statistika
        <div class="stats-progress-bar"></div>
        <div class="stats-progress-bar-gradient"></div>
        <img class="stats-loaded-helper" src="img/Z white.svg" onload="$ZEALOT.statsLoaded(this);">
      </div>
      <div class="main-panel-stats scrollable row">
    `;
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
            <div class="small-numbers-container">
    `;
    for (var i = 0; i < ZEALOT.s1.length; i++)
      statsSearchHtml += `<div class="small-number-` + (i + 1) + `">` + ZEALOT.s1[i].cnt + ` ` + ZEALOT.s1[i].pn + `</div>`;
    statsSearchHtml += `
            </div>
          </div>
        </div>
    `;
    statsSearchHtml += `
        <div class="stat col-12 col-md-6">
          <div class="stat-title oswald-blue-normal">Za poslednjih 7 dana:</div>
          <div class="stat-numbers">
            <div class="large-number oswald-dark-blue-normal">` + s2sum + `</div>
            <div class="small-numbers-container">
    `;
    for (var i = 0; i < ZEALOT.s2.length; i++)
      statsSearchHtml += `<div class="small-number-` + (i + 1) + `">` + ZEALOT.s2[i].cnt + ` ` + ZEALOT.s2[i].pn + `</div>`;
    statsSearchHtml += `
            </div>
          </div>
        </div>
    `;
    statsSearchHtml += `
        <div class="stat col-12 col-md-6">
          <div class="stat-title oswald-blue-normal">Za poslednjih 30 dana:</div>
          <div class="stat-numbers">
            <div class="large-number oswald-dark-blue-normal">` + s3sum + `</div>
            <div class="small-numbers-container">
    `;
    for (var i = 0; i < ZEALOT.s3.length; i++)
      statsSearchHtml += `<div class="small-number-` + (i + 1) + `">` + ZEALOT.s3[i].cnt + ` ` + ZEALOT.s3[i].pn + `</div>`;
    statsSearchHtml += `
            </div>
          </div>
        </div>
    `;
    statsSearchHtml += `
        <div class="stat col-12 col-md-6">
          <div class="stat-title oswald-blue-normal">Od početka evidentiranja:</div>
          <div class="stat-numbers">
            <div class="large-number oswald-dark-blue-normal">` + s0sum + `</div>
            <div class="small-numbers-container">
    `;
    for (var i = 0; i < ZEALOT.s0.length; i++)
      statsSearchHtml += `<div class="small-number-` + (i + 1) + `">` + ZEALOT.s0[i].cnt + ` ` + ZEALOT.s0[i].pn + `</div>`;
    statsSearchHtml += `
            </div>
          </div>
        </div>
    `;
    statsSearchHtml += `
      </div>
    `;
    insertHtml(".main-panel", statsSearchHtml);
  };

  ZEALOT.statsSearch = function() {
    var sync = 0;
    $ajaxUtils.sendGetRequest(
      ZEALOT.apiRoot + "countTickets" + "?t=0" + "&idO=" + ZEALOT.idOperatorForStats + "&idS=" + ZEALOT.idSectorForStats + "&nc=" + ZEALOT.nc,
      function(responseArray) {
        ZEALOT.s0 = responseArray;
        sync = sync + 1;
        if (sync == 4) ZEALOT.ssAux();
      },
      true /*, ZEALOT.bearer*/
    );
    $ajaxUtils.sendGetRequest(
      ZEALOT.apiRoot + "countTickets" + "?t=1" + "&idO=" + ZEALOT.idOperatorForStats + "&idS=" + ZEALOT.idSectorForStats + "&nc=" + ZEALOT.nc,
      function(responseArray) {
        ZEALOT.s1 = responseArray;
        sync = sync + 1;
        if (sync == 4) ZEALOT.ssAux();
      },
      true /*, ZEALOT.bearer*/
    );
    $ajaxUtils.sendGetRequest(
      ZEALOT.apiRoot + "countTickets" + "?t=2" + "&idO=" + ZEALOT.idOperatorForStats + "&idS=" + ZEALOT.idSectorForStats + "&nc=" + ZEALOT.nc,
      function(responseArray) {
        ZEALOT.s2 = responseArray;
        sync = sync + 1;
        if (sync == 4) ZEALOT.ssAux();
      },
      true /*, ZEALOT.bearer*/
    );
    $ajaxUtils.sendGetRequest(
      ZEALOT.apiRoot + "countTickets" + "?t=3" + "&idO=" + ZEALOT.idOperatorForStats + "&idS=" + ZEALOT.idSectorForStats + "&nc=" + ZEALOT.nc,
      function(responseArray) {
        ZEALOT.s3 = responseArray;
        sync = sync + 1;
        if (sync == 4) ZEALOT.ssAux();
      },
      true /*, ZEALOT.bearer*/
    );
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
    console.log("sidebar stats loading");
    var popupStatsHtml = `
      <div class="popup-stats">
        <div class="popup-bar unhoverable">
          <button class="popup-button" onclick="$ZEALOT.statsSearch();"><i class="fa fa-search"></i></button >
        </div>
        <h2 class="oswald-dark-blue-normal">Vrsta</h2>
        <div class="open-sans-dark-normal bump tabbed unhoverable"><div class="search-nc-status">OBRAĐENI</div><div class="num"><label class="switch"><input class="search-nc" type="checkbox" onclick="$ZEALOT.searchNC(this);"></input><span class="slider"></span></label></div></div>
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
    function (responseArray) {
      //
    },
    true /*, ZEALOT.bearer
  );
  */

})(window);
