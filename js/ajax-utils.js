(function (global) {
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

    ajaxUtils.sendGetRequest = function (requestUrl, responseHandler, isJsonResponse, bearer) {
        var request = getRequestObject();
        request.onreadystatechange = function () {
            handleResponse(request, responseHandler, isJsonResponse);
        };
        request.open("GET", requestUrl, true);
        request.setRequestHeader('Authorization', 'Bearer ' + bearer);
        request.send(null); //for POST only
    };

    ajaxUtils.sendPostRequest = function (requestUrl, responseHandler, isJsonResponse, bearer) {
        var request = getRequestObject();
        request.onreadystatechange = function () {
            handleResponse(request, responseHandler, isJsonResponse);
        };
        request.open("POST", requestUrl, true);
        request.setRequestHeader('Authorization', 'Bearer ' + bearer);
        request.send(null); //for POST only
    };

    function handleResponse(request, responseHandler, isJsonResponse) {
        if ((request.readyState == 4) &&
            (request.status == 200)) {

            if (isJsonResponse == undefined) {
                isJsonResponse = true;
            }

            if (isJsonResponse) {
                responseHandler(JSON.parse(request.responseText));
            } else {
                responseHandler(request.responseText);
            }
        }
    }

    global.$ajaxUtils = ajaxUtils;
})(window);