/** Asynchrone Javascript Request - Aufruf der ServerMethode
 * @Param method anfordernde HTTP-Methode, wie GET und POST
 * @Param url wie "domain"/Pfad
 * @Param body Alles was im HTTP-Body steht
 * @Param onloadCallback eine JavaScriptmethode, die nach dem asyncRequest aufgerufen wird
 * @Param size Größe des Bodys
 * @Param contenttype der beschreibende Typ des Inhalts
 * */
function asyncRequest(method, url, body, onloadCallback, size = 0, contenttype = "")
{
    var xhr = new XMLHttpRequest();

    xhr.open(method, "/" + applicationname + url, true);
    if (contenttype.length > 0)
    {
        xhr.overrideMimeType(contenttype);
        xhr.setRequestHeader("Content-Type", contenttype);
        //xhr.overrideMimeType(contenttype);
    }

    //alert("Size:"+size);

    if (size > 0)
    {
        xhr.setRequestHeader("Content-Length", size.toString());
        xhr.setRequestHeader("Real-Shit-Size", size.toString());
    }


    xhr.onload = onloadCallback;
    xhr.send(body);
}

/**
 * HTML aus Response in gesuchtes Element einsetzen.
 * @Param dataResponse HTML-Response mit <... id="containerId"></...>
 * @Param containerId Id des Containers, der ersetzt werden soll.
 * */
function reloadContainerByResponse(dataResponse, containerId)
{
    var newContainer = dataResponse;
    //Baum überschreiben.
    if (newContainer.length > 0)
    {
        var htmlIndx = newContainer.indexOf("<html");

        if (htmlIndx >= 0)
        {
            while (i < newContainer.length && newContainer[htmlIndx] != '>')
            {
                htmlIndx++;
            }
            newContainer = newContainer.substring(htmlIndx, newContainer.indexOf("</html>"));
        }
        var index = newContainer.indexOf("id=\"" + containerId + "\"");
        if (index > 0 || containerId == "html")
        {
            if (containerId == "html")
            {
                var container = document.getElementsByTagName("html")[0];
                container.innerHTML = newContainer;
            }
            else
            {
                var dom = parseDOMelementExtractById(dataResponse, containerId);
                if (dom)
                {
                    var container = document.getElementById(containerId);
                    container.innerHTML = dom.innerHTML;
                }
                else
                {
                    var tagName = "";
                    var i = index;
                    while (i > 0 && newContainer[i] != '<')
                    {
                        i--;
                    }
                    var a = i;
                    while (i < newContainer.length && newContainer[i] != ' ' && newContainer[i] != '>')
                    {
                        i++;
                    }
                    tagName = newContainer.substring(a + 1, i);
                    while (i < newContainer.length && newContainer[i] != '>')
                    {
                        i++;
                    }
                    a = i;
                    i = newContainer.indexOf("</" + tagName);
                    //Letztes
                    while (newContainer.indexOf("</" + tagName, i + 1) > i)
                    {
                        i = newContainer.indexOf("</" + tagName, i + 1);
                    }
                    newContainer = newContainer.substring(a + 1, i - 1);
                    var container = document.getElementById(containerId);
                    container.innerHTML = newContainer;

                }
            }

        }
        else
        {
            console.log("Error reloadContainerByResponse")
        }
    }
    else
    {
        var updatedUrl = document.location.href.toString().replaceAll("#", "");
        if (updatedUrl.includes("?"))
        {
            updatedUrl = updatedUrl.substring(0, updatedUrl.indexOf("?"));
        }
        document.location.href = updatedUrl;
    }
}

/**
 * Ein Button mit type button verhält sich wie eine button submit, allerdings über asynkronen Request.
 * Asyncron
 */
function executeFormByMemberEvent(that = null, callBackEvent = null)
{
    if (that)
    {
        //Button finden
        if (that && that.localName != "button")
        {
            while (that && that.localName != "button" && that.localName != "html")
            {
                that = that.parentElement;
            }
        }

        if (that == null || that.localName != "button")
        {
            console.log("Error executeFormByMemberEvent: Button not found!");
            return;
        }

        var parent = that.parentElement;
        //FORM finden
        while (parent && parent.localName != "form" && parent.localName != "html")
        {
            parent = parent.parentElement;
        }
        if (parent && parent.localName == "form")
        {
            var method = parent.method;
            var url = parent.action;
            //Trennen von relativen Teil-URLs
            var relative = url.indexOf(":");
            if (relative >= 0)
            {
                var parts = url.split(":");
                parts = parts[parts.length - 1].split("/");
                url = "/";
                for (var i = 1; i < parts.length; i++)
                {
                    if (parts[i] != '.')
                    {
                        url += parts[i];
                        if (i + 1 < parts.length)
                        {
                            url += "/";
                        }
                    }
                }
            }
            if (url.startsWith("//"))
            {
                url = url.substr(1);
            }


            var inputs = parent.getElementsByTagName("input");
            var texts = parent.getElementsByTagName("textarea");
            var selects = parent.getElementsByTagName("select");
            var bodyParams = "";
            var attached = 0;
            //Inputs an body anhängen
            for (var i = 0; i < inputs.length; i++)
            {
                var inp = inputs[i];
                if (i > 0)
                {
                    bodyParams += "&";
                }
                bodyParams += decodeURI(inp.name) + "=" + decodeURI(inp.value);
                attached++;
            }
            for (var i = 0; i < selects.length; i++)
            {
                var inp = selects[i];
                if (i > 0 || attached > 0)
                {
                    bodyParams += "&";
                }
                bodyParams += decodeURI(inp.name) + "=" + decodeURI(inp.value);
                attached++;
            }
            for (var i = 0; i < texts.length; i++)
            {
                var inp = texts[i];
                if (inp.name && inp.name.length > 0)
                {
                    if (i > 0 || attached > 0)
                    {
                        bodyParams += "&";
                    }
                    bodyParams += decodeURI(inp.name) + "=" + decodeURI(inp.innerText);
                    attached++;
                }
            }
            if (callBackEvent)
            {
                showLoadingProgressSpinner(5);
                asyncRequest(method, url, bodyParams, callBackEvent);
            }
            else
            {
                asyncRequest(method, url, bodyParams);
            }

        }
        else
        {
            console.log("Error: executeFormByMemberEvent context is not inside a FORM-Element!");
        }
    }
    else
    {
        console.log("Warning: executeFormByMemberEvent parameter is null!");
    }
}

/**
 * Bestätigen, dass eine Funktion ausgeführt wird.
 * @param func function(){...}
 * @param confirmMsg Meldung-Text
 */
function askToExecute(func, confirmMsg)
{
    if (confirm(confirmMsg))
    {
        func();
    }
}

/**
 * Sleep
 * @param milliSeconds
 */
function sleepMilli(milliSeconds)
{
    var start = Date.now();
    var op = "";
    while ((Date.now() - start) < milliSeconds)
    {
        op = "abcde";
    }
}

/** Kopiert die Daten eines Eintrages der Auswahlliste in das Neue-Zeile-Formular. */
function copyValue_SelectionToEntry(Selection, idEntry)
{
    var e = document.getElementById(idEntry);
    e.setAttribute("value", Selection.value);

}

/** Extrahiert ein html-Element, das wie ein document verwendet werden kann, per Id aus einem String*/
function parseDOMelementExtractById(htmlString, elementId)
{
    var parser = new DOMParser();
    var xml = parser.parseFromString(htmlString.toString(), 'text/html');
    return xml.getElementById(elementId);
}

/** Sorgt dafür, dass alle <img>'s im Element mit der Id neu geladen werden*/
function reloadImagesInElement(elementId)
{
    var element = document.getElementById(elementId);
    if (element)
    {
        var imgs = element.getElementsByTagName('img');
        var customParam = "timestampforreloadimg";
        for (var i = 0; i < imgs.length; i++)
        {
            var imgsrc = imgs[i].src;
            var timestampIndex = imgsrc.indexOf(customParam);
            if (timestampIndex >= 0)
            {
                //Gefunden
                //Herausschneiden des vorherigen customParam
                var d = timestampIndex;
                while (imgsrc[d] != '&')
                {
                    if (d + 1 == imgsrc.length)
                    {
                        break;
                    }
                    d++;
                }
                if (d + 1 == imgsrc.length)
                {
                    //Das timestampIndex-1 folgt aus &timestampIndex oder ?timestampIndex
                    imgsrc = imgsrc.substr(0, timestampIndex - 1);
                }
                else
                {
                    var partA = imgsrc.substr(0, timestampIndex - 1);
                    var partB = imgsrc.substr(d);
                    imgsrc = partA + partB;
                }
            }

            //Die src wird verändert, damit sich das Bild neu geladen wird.
            if (imgsrc.indexOf('?') >= 0)
            {
                imgsrc += '&' + customParam + '=' + new Date().getTime();
            }
            else
            {
                imgsrc += '?' + customParam + '=' + new Date().getTime();
            }
            imgs[i].src = imgsrc;
        }
    }
}

function removeThisModal(element)
{
    var p = element.parentNode;
    var l = 0;
    while (!p.classList.contains("modal"))
    {
        p = p.parentNode;
        if (p == null || l > 20)
        {
            return;
        }
        l++;
    }
    p.remove();
}

function pushNotification(title, text, duration = 3000)
{
    var code = "<div aria-live=\"polite\" aria-atomic=\"true\" style=\"position: relative; min-height: 200px;\">\n" +
        "  <div class=\"toast\" style=\"position: absolute; top: 0; right: 0;\">\n" +
        "    <div class=\"toast-header\">\n" +
        "      <img src=\"...\" class=\"rounded mr-2\" alt=\"...\">\n" +
        "      <strong class=\"mr-auto\">" + title + "</strong>\n" +
        "      <button type=\"button\" class=\"ml-2 mb-1 close\" data-dismiss=\"toast\" aria-label=\"Close\">\n" +
        "        <span aria-hidden=\"true\">&times;</span>\n" +
        "      </button>\n" +
        "    </div>\n" +
        "    <div class=\"toast-body\">\n" +
        text +
        "    </div>\n" +
        "  </div>\n" +
        "</div>";

    var notification = document.createElement("div");
    notification.innerHTML = code;
    notification.id = "pushNotification";
    document.getElementsByTagName("body")[0].insertBefore(notification, document.getElementsByTagName("body")[0].children[0]);
    window.setTimeout(function rem()
    {
        document.getElementById("pushNotification").remove();
    }, duration);
}

