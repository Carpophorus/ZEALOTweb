(function(global) {
  var ajaxUtils = {};

  function getRequestObject() {
    if (window.XMLHttpRequest) {
      return (new XMLHttpRequest());
    } else if (window.ActiveXObject) {
      return (new ActiveXObject("Microsoft.XMLHTTP"));
    } else {
      global.alert("Ajax is not supported!");
      return (null);
    }
  }

  ajaxUtils.sendGetRequest = function(requestUrl, responseHandler, isJsonResponse, bearer) {
    var request = getRequestObject();
    request.onreadystatechange = function() {
      handleResponse(request, responseHandler, isJsonResponse);
    };
    request.open("GET", requestUrl, true);
    request.setRequestHeader('Authorization', 'Bearer ' + bearer);
    request.send(null); //for POST only
  };

  ajaxUtils.sendPostRequest = function(requestUrl, responseHandler, isJsonResponse, bearer) {
    var request = getRequestObject();
    request.onreadystatechange = function() {
      handleResponse(request, responseHandler, isJsonResponse);
    };
    request.open("POST", requestUrl, true);
    request.setRequestHeader('Authorization', 'Bearer ' + bearer);
    request.send(null); //for POST only
  };

  function handleResponse(request, responseHandler, isJsonResponse) {
    if (request.readyState == 4) {
      if (request.status == 200) {
        if (isJsonResponse == undefined)
          isJsonResponse = true;
        if (isJsonResponse)
          responseHandler(JSON.parse(request.responseText), request.status);
        else
          responseHandler(request.responseText, request.status);
      } else {
        $("#login-button").html("Sign In");
        $.confirm({
          theme: "material",
          title: "Greška",
          content: "Desila se nepredviđena greška u sistemu, pokušajte ponovo kasnije.<br><br>Kontaktirajte sistemske administratore ukoliko se problem ponovo pojavi.",
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
      }
    }
  }

  global.$ajaxUtils = ajaxUtils;
})(window);
