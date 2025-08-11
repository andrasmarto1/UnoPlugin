var r={grad:.9,turn:360,rad:360/(2*Math.PI)},t=function(r){return "string"==typeof r?r.length>0:"number"==typeof r},n=function(r,t,n){return void 0===t&&(t=0),void 0===n&&(n=Math.pow(10,t)),Math.round(n*r)/n+0},e=function(r,t,n){return void 0===t&&(t=0),void 0===n&&(n=1),r>n?n:r>t?r:t},u=function(r){return (r=isFinite(r)?r%360:0)>0?r:r+360},a=function(r){return {r:e(r.r,0,255),g:e(r.g,0,255),b:e(r.b,0,255),a:e(r.a)}},o=function(r){return {r:n(r.r),g:n(r.g),b:n(r.b),a:n(r.a,3)}},i=/^#([0-9a-f]{3,8})$/i,s=function(r){var t=r.toString(16);return t.length<2?"0"+t:t},h=function(r){var t=r.r,n=r.g,e=r.b,u=r.a,a=Math.max(t,n,e),o=a-Math.min(t,n,e),i=o?a===t?(n-e)/o:a===n?2+(e-t)/o:4+(t-n)/o:0;return {h:60*(i<0?i+6:i),s:a?o/a*100:0,v:a/255*100,a:u}},b=function(r){var t=r.h,n=r.s,e=r.v,u=r.a;t=t/360*6,n/=100,e/=100;var a=Math.floor(t),o=e*(1-n),i=e*(1-(t-a)*n),s=e*(1-(1-t+a)*n),h=a%6;return {r:255*[e,i,o,o,s,e][h],g:255*[s,e,e,i,o,o][h],b:255*[o,o,s,e,e,i][h],a:u}},g=function(r){return {h:u(r.h),s:e(r.s,0,100),l:e(r.l,0,100),a:e(r.a)}},d=function(r){return {h:n(r.h),s:n(r.s),l:n(r.l),a:n(r.a,3)}},f=function(r){return b((n=(t=r).s,{h:t.h,s:(n*=((e=t.l)<50?e:100-e)/100)>0?2*n/(e+n)*100:0,v:e+n,a:t.a}));var t,n,e;},c=function(r){return {h:(t=h(r)).h,s:(u=(200-(n=t.s))*(e=t.v)/100)>0&&u<200?n*e/100/(u<=100?u:200-u)*100:0,l:u/2,a:t.a};var t,n,e,u;},l=/^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s*,\s*([+-]?\d*\.?\d+)%\s*,\s*([+-]?\d*\.?\d+)%\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i,p=/^hsla?\(\s*([+-]?\d*\.?\d+)(deg|rad|grad|turn)?\s+([+-]?\d*\.?\d+)%\s+([+-]?\d*\.?\d+)%\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i,v=/^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*,\s*([+-]?\d*\.?\d+)(%)?\s*(?:,\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i,m=/^rgba?\(\s*([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s+([+-]?\d*\.?\d+)(%)?\s*(?:\/\s*([+-]?\d*\.?\d+)(%)?\s*)?\)$/i,y={string:[[function(r){var t=i.exec(r);return t?(r=t[1]).length<=4?{r:parseInt(r[0]+r[0],16),g:parseInt(r[1]+r[1],16),b:parseInt(r[2]+r[2],16),a:4===r.length?n(parseInt(r[3]+r[3],16)/255,2):1}:6===r.length||8===r.length?{r:parseInt(r.substr(0,2),16),g:parseInt(r.substr(2,2),16),b:parseInt(r.substr(4,2),16),a:8===r.length?n(parseInt(r.substr(6,2),16)/255,2):1}:null:null},"hex"],[function(r){var t=v.exec(r)||m.exec(r);return t?t[2]!==t[4]||t[4]!==t[6]?null:a({r:Number(t[1])/(t[2]?100/255:1),g:Number(t[3])/(t[4]?100/255:1),b:Number(t[5])/(t[6]?100/255:1),a:void 0===t[7]?1:Number(t[7])/(t[8]?100:1)}):null},"rgb"],[function(t){var n=l.exec(t)||p.exec(t);if(!n)return null;var e,u,a=g({h:(e=n[1],u=n[2],void 0===u&&(u="deg"),Number(e)*(r[u]||1)),s:Number(n[3]),l:Number(n[4]),a:void 0===n[5]?1:Number(n[5])/(n[6]?100:1)});return f(a)},"hsl"]],object:[[function(r){var n=r.r,e=r.g,u=r.b,o=r.a,i=void 0===o?1:o;return t(n)&&t(e)&&t(u)?a({r:Number(n),g:Number(e),b:Number(u),a:Number(i)}):null},"rgb"],[function(r){var n=r.h,e=r.s,u=r.l,a=r.a,o=void 0===a?1:a;if(!t(n)||!t(e)||!t(u))return null;var i=g({h:Number(n),s:Number(e),l:Number(u),a:Number(o)});return f(i)},"hsl"],[function(r){var n=r.h,a=r.s,o=r.v,i=r.a,s=void 0===i?1:i;if(!t(n)||!t(a)||!t(o))return null;var h=function(r){return {h:u(r.h),s:e(r.s,0,100),v:e(r.v,0,100),a:e(r.a)}}({h:Number(n),s:Number(a),v:Number(o),a:Number(s)});return b(h)},"hsv"]]},N=function(r,t){for(var n=0;n<t.length;n++){var e=t[n][0](r);if(e)return [e,t[n][1]]}return [null,void 0]},x=function(r){return "string"==typeof r?N(r.trim(),y.string):"object"==typeof r&&null!==r?N(r,y.object):[null,void 0]},M=function(r,t){var n=c(r);return {h:n.h,s:e(n.s+100*t,0,100),l:n.l,a:n.a}},H=function(r){return (299*r.r+587*r.g+114*r.b)/1e3/255},$=function(r,t){var n=c(r);return {h:n.h,s:n.s,l:e(n.l+100*t,0,100),a:n.a}},j=function(){function r(r){this.parsed=x(r)[0],this.rgba=this.parsed||{r:0,g:0,b:0,a:1};}return r.prototype.isValid=function(){return null!==this.parsed},r.prototype.brightness=function(){return n(H(this.rgba),2)},r.prototype.isDark=function(){return H(this.rgba)<.5},r.prototype.isLight=function(){return H(this.rgba)>=.5},r.prototype.toHex=function(){return r=o(this.rgba),t=r.r,e=r.g,u=r.b,i=(a=r.a)<1?s(n(255*a)):"","#"+s(t)+s(e)+s(u)+i;var r,t,e,u,a,i;},r.prototype.toRgb=function(){return o(this.rgba)},r.prototype.toRgbString=function(){return r=o(this.rgba),t=r.r,n=r.g,e=r.b,(u=r.a)<1?"rgba("+t+", "+n+", "+e+", "+u+")":"rgb("+t+", "+n+", "+e+")";var r,t,n,e,u;},r.prototype.toHsl=function(){return d(c(this.rgba))},r.prototype.toHslString=function(){return r=d(c(this.rgba)),t=r.h,n=r.s,e=r.l,(u=r.a)<1?"hsla("+t+", "+n+"%, "+e+"%, "+u+")":"hsl("+t+", "+n+"%, "+e+"%)";var r,t,n,e,u;},r.prototype.toHsv=function(){return r=h(this.rgba),{h:n(r.h),s:n(r.s),v:n(r.v),a:n(r.a,3)};var r;},r.prototype.invert=function(){return w({r:255-(r=this.rgba).r,g:255-r.g,b:255-r.b,a:r.a});var r;},r.prototype.saturate=function(r){return void 0===r&&(r=.1),w(M(this.rgba,r))},r.prototype.desaturate=function(r){return void 0===r&&(r=.1),w(M(this.rgba,-r))},r.prototype.grayscale=function(){return w(M(this.rgba,-1))},r.prototype.lighten=function(r){return void 0===r&&(r=.1),w($(this.rgba,r))},r.prototype.darken=function(r){return void 0===r&&(r=.1),w($(this.rgba,-r))},r.prototype.rotate=function(r){return void 0===r&&(r=15),this.hue(this.hue()+r)},r.prototype.alpha=function(r){return "number"==typeof r?w({r:(t=this.rgba).r,g:t.g,b:t.b,a:r}):n(this.rgba.a,3);var t;},r.prototype.hue=function(r){var t=c(this.rgba);return "number"==typeof r?w({h:r,s:t.s,l:t.l,a:t.a}):n(t.h)},r.prototype.isEqual=function(r){return this.toHex()===w(r).toHex()},r}(),w=function(r){return r instanceof j?r:new j(r)};

let settings = {
    baseUrl: "https://app.overlays.uno/apiv2/controlapps/",
    appToken: "",
    appPayload: "",
    validateAppStatus: "ok",
    appName: "",
    appThumbnail: "",
    appDatastoreId: "",
    appCommandList: [],
    appOverlayList: [],
    hasOverlaySelection: false,
    appOverlayId: "",
    oldAppOverlayId: undefined,
    appCommandObject: {},
    fetchOverlayListStatus: "busy",
    fetchOverlayPayloadStatus: "ok",
    payloadUiElement: "",
    appCustomization: null,
    fetchCustomizationStatus: "busy",
    appOverlayFieldId: "",
    appOverlayFieldOperationValue: null,
    appOverlayFieldOperationId: "",
    appOverlayFieldOperationValueElement: null,
    commandMap: {}
};
window.SDPIComponents.streamDeckClient.getConnectionInfo().then(console.log, setup);
window.uno = {
    getAppJson,
    changeAppCommand,
    changeOverlay,
    changeOverlayField,
    changeOverlayFieldOperation,
    changeOverlayFieldOperationValue,
    changeAppPayload,
    refreshContent,
};
async function setup() {
    rebuildUI();
    if (settings.appToken !== "") {
        verifyToken();
        fetchAppCustomization();
        fetchAppOverlays();
        fetchAppOverlayPayload();
    }
    return;
}
function verifyToken() {
    settings.validateAppStatus = "busy";
    const url = settings.baseUrl + settings.appToken;
    console.log(url);
    fetch(url, {
        method: "GET",
        redirect: "follow",
    }).then((response) => {
        if (!response.ok) {
            propogateError(response.status);
            rebuildUI();
            return;
        }
        return response.json();
    }).then((json) => {
        console.log(json);
        settings.appName = json.name || "";
        settings.appThumbnail = json.thumbnail || "";
        settings.appDatastoreId = json.datastoreId || "";
    });
    if (settings.appThumbnail && settings.appThumbnail.indexOf("https://") === -1) {
        settings.appThumbnail = "https:" + settings.appThumbnail;
    }
    settings.validateAppStatus = "ok";
    fetchAppApi();
    rebuildUI();
    //sends data to analytics
    fetch(`https://app.singular.live/apiv2/controlapps/${settings.appToken}/analytics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            event: "streamdeckopened",
        }),
    });
}
function propogateError(status, reason) {
    settings.appCommandList = [];
    settings.validateAppStatus = "error";
    //Remember that most errors will be given with a status code, 
    //but -1 is for the general error case. This should just
    //result in a "showError" call.
}
function fetchAppApi() {
    const url = settings.baseUrl + settings.appToken + "/api/json";
    fetch(url, {
        method: "GET",
        redirect: "follow",
    })
        .then((response) => {
        if (!response.ok) {
            rebuildUI();
            propogateError(response.status);
        }
        return response.json();
    })
        .then((json) => {
        settings.appCommandList = json;
        // check if we have an overlay selection field.
        // If yes then we have to fetch the overlays from the API
        // this.hasOverlaySelection = this.appCommandList?.some(command =>
        // 	command.arguments?.some(argument => argument.type === "overlaySelection")  ASK HUBERT ABOUT THIS
        // ) ?? false;
        settings.hasOverlaySelection = false;
        if (settings.appCommandList && settings.appCommandList.length !== 0) {
            settings.appCommandList.forEach((command) => {
                if ("arguments" in command && command.arguments && command.arguments.length) {
                    command.arguments.forEach((argument) => {
                        if (argument.type === "overlaySelection") {
                            settings.hasOverlaySelection = true;
                        }
                    });
                }
            });
        }
        rebuildUI();
        fetchAppCustomization();
        fetchAppOverlays();
        return true;
    })
        .catch((error) => {
        propogateError();
        rebuildUI();
        return false;
    });
}
function fetchAppCustomization() {
    if (settings.appCustomization) {
        settings.fetchCustomizationStatus = "ok";
        rebuildUI();
        return;
    }
    const url = settings.baseUrl + `${settings.appToken}/api`;
    // const url = "http://localhost:4000/api";
    const options = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            command: "GetCustomizationModel",
        }),
    };
    settings.fetchCustomizationStatus = "busy";
    fetch(url, options)
        .then((response) => {
        if (!response.ok) {
            settings.appCustomization = null;
            rebuildUI();
            throw new Error("HTTP error, status = " + response.status);
        }
        return response.json();
    })
        .then((json) => {
        settings.appCustomization = json.payload;
        settings.fetchCustomizationStatus = "ok";
        rebuildUI();
        fetchAppOverlayPayload();
    })
        .catch((error) => {
        settings.fetchCustomizationStatus = "error";
        settings.appCustomization = null;
        rebuildUI();
    });
}
function getAppJson(event) {
    console.log("Getappjson");
    // we have to press enter or tab
    let checkToken = false;
    if (!event) {
        checkToken = true;
    }
    else {
        const keyPressed = event.key || event.code;
        if (keyPressed == "Tab" || keyPressed == "Enter") {
            checkToken = true;
        }
    }
    if (checkToken) {
        let el = document.getElementById("app-token");
        if (el !== null) {
            let token = el.value;
            if (settings.appToken != token) {
                settings.appToken = token;
                verifyToken();
                save();
            }
        }
    }
}
function refreshContent() {
    // this will force the fetch
    settings.oldAppOverlayId = undefined;
    fetchAppOverlayPayload();
}
function fetchAppOverlays() {
    if (settings.hasOverlaySelection === false) {
        settings.appOverlayList = [];
        settings.fetchOverlayListStatus = "ok";
        return;
    }
    const url = settings.baseUrl + `${settings.appToken}/api`;
    // const url = "http://localhost:4000/api";
    const options = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            command: "GetOverlayModels",
        }),
    };
    settings.fetchOverlayListStatus = "busy";
    fetch(url, options)
        .then((response) => {
        if (!response.ok) {
            settings.appOverlayList = [];
            rebuildUI();
            throw new Error("HTTP error, status = " + response.status);
        }
        return response.json();
    })
        .then((json) => {
        settings.appOverlayList = json.payload;
        settings.fetchOverlayListStatus = "ok";
        rebuildUI();
        fetchAppOverlayPayload();
    })
        .catch((error) => {
        settings.fetchOverlayListStatus = "error";
        settings.appOverlayList = [];
        rebuildUI();
    });
}
function rebuildUI() {
    // if (errorMessage) {
    // 	setElementContent("message-error-content", errorMessage);
    // 	showElement("message-error");
    // } else {
    // 	hideElement("message-error");
    // }
    console.log("Rebuild");
    removeAndAddClass("app-token-info-error", "", "hidden");
    removeAndAddClass("app-token-info-busy", "", "hidden");
    removeAndAddClass("app-token-info-ok", "", "hidden");
    if (settings.validateAppStatus === "busy") {
        removeAndAddClass("app-token-info-busy", "hidden", "");
    }
    else {
        if (settings.validateAppStatus === "ok") {
            removeAndAddClass("app-token-info-ok", "hidden", "");
        }
        else {
            removeAndAddClass("app-token-info-error", "hidden", "");
        }
    }
    // hide the field for now. We will show it later if needed
    hideElement("app-overlay-select-container");
    hideElement("app-overlay-select-element");
    hideElement("app-payload-select-field-container");
    hideElement("app-payload-select-field-element");
    hideElement("app-payload-select-field-message");
    hideElement("app-payload-select-field-operation-container");
    hideElement("app-payload-select-field-operation-value-container");
    hideElement("app-payload-select-field-operation-select-element");
    hideElement("app-payload-select-field-operation-text-element");
    hideElement("app-payload-select-field-operation-textarea-element");
    hideElement("app-payload-select-field-operation-color-element");
    hideElement("app-payload-select-field-operation-number-element");
    hideElement("app-payload-select-field-operation-checkbox-element");
    hideElement("app-payload-select-field-operation-checkbox-label");
    hideElement("app-payload-json-container");
    hideElement("app-payload-json");
    hideElement("app-payload-field-container");
    hideElement("app-payload-field-text");
    hideElement("app-payload-field-number");
    hideElement("app-payload-field-select");
    hideElement("app-payload-field-textarea");
    // validateAppStatus
    if (settings.appToken && settings.validateAppStatus === "ok") {
        setElementValue("app-token", settings.appToken);
        removeAndAddClass("app-token", "error", "");
        // hide the info
        hideElement("message-info");
        setElementContent("app-token-info-box-name", settings.appName);
        let el = document.getElementById("app-token-info-box-image");
        if (settings.appThumbnail && settings.appThumbnail.indexOf("https://") === -1) {
            settings.appThumbnail = "https:" + settings.appThumbnail;
        }
        // replace fit-in/150x150 with fit-in/200x200
        if (el !== null) {
            el.src = settings.appThumbnail.replace("fit-in/150x150", "fit-in/300x300");
        }
    }
    else {
        setElementValue("app-token", settings.appToken || "");
        if (settings.validateAppStatus === "error") {
            removeAndAddClass("app-token", "", "error");
        }
        hideElement("app-command-select-container");
        showElement("message-info");
        return;
    }
    // handle the command list
    rebuildCommandList();
    // should we show value of the action?
    if (settings.appCommandObject &&
        "arguments" in settings.appCommandObject &&
        settings.appCommandObject.arguments !== undefined) {
        // handle the special case of SetCustomizationContent and ChangeCustomizationField
        if (settings.appCommandObject.command === "SetCustomizationContent" ||
            settings.appCommandObject.command === "ChangeCustomizationField") {
            settings.appOverlayId = "root";
            // hasOverlaySelection = false;
        }
        settings.appCommandObject.arguments.forEach((property) => {
            let element;
            switch (property.type) {
                case "json":
                case "JSON":
                    showElement("app-payload-json-container");
                    if (settings.fetchOverlayPayloadStatus === "busy") {
                        showElement("app-payload-json");
                        setElementValue("app-payload-json", "Fetching content JSON...");
                    }
                    else {
                        element = "app-payload-json";
                    }
                    break;
                case "overlaySelection":
                    showElement("app-overlay-select-container");
                    rebuildOverlayList();
                    break;
                case "fieldSelection":
                    rebuildOverlayFieldList();
                    rebuildOverlayFieldOperationsList();
                    rebuildOverlayFieldOperationsValue();
                    break;
                case "string":
                case "textarea":
                    showElement("app-payload-field-container");
                    element = "app-payload-field-textarea";
                    break;
                case "text":
                    showElement("app-payload-field-container");
                    element = "app-payload-field-text";
                    break;
                case "number":
                case "counter":
                case "normalizednumber":
                    showElement("app-payload-field-container");
                    element = "app-payload-field-number";
                    break;
                case "selection":
                    showElement("app-payload-field-container");
                    element = "app-payload-field-select";
                    rebuildPayloadFieldSelection(property);
                    break;
                default:
                    showElement("app-payload-field-container");
                    element = "app-payload-field-text";
                    break;
            }
            if (element) {
                settings.payloadUiElement = element;
                if (!settings.appPayload) {
                    settings.appPayload = property.default;
                }
                if (!settings.appPayload) {
                    settings.appPayload = "";
                }
                showElement(element);
                setElementValue(element, settings.appPayload);
                // check if there is a valid JSON in the text field
                if (property.type === "JSON") {
                    if (settings.appPayload === "") {
                        settings.oldAppOverlayId = undefined;
                        fetchAppOverlayPayload();
                        return;
                    }
                    let isOK = false;
                    try {
                        JSON.parse(settings.appPayload);
                        isOK = true;
                    }
                    catch (error) { }
                    if (isOK) {
                        removeAndAddClass(element, "invalid", "valid");
                    }
                    else {
                        removeAndAddClass(element, "valid", "invalid");
                    }
                }
            }
        });
    }
}
function fetchAppOverlayPayload() {
    if (settings.appOverlayId == settings.oldAppOverlayId || settings.appOverlayId === undefined) {
        return;
    }
    settings.oldAppOverlayId = settings.appOverlayId;
    const url = settings.baseUrl + `${settings.appToken}/api`;
    // const url = "http://localhost:4000/api";
    const options = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            command: settings.appOverlayId === "root" ? "GetCustomization" : "GetOverlayContent",
            id: settings.appOverlayId
        }),
    };
    settings.fetchOverlayPayloadStatus = "busy";
    rebuildUI();
    fetch(url, options)
        .then((response) => {
        if (!response.ok) {
            settings.appPayload = "{}";
            rebuildUI();
            // throw new Error("HTTP error, status = " + response.status);
            // COME BACK TO THIS TO MAKE SURE THAT WE CALL PROPOGATE ERROR ______________________________________________________________________________________________
            //propogateError();
        }
        return response.json();
    })
        .then((json) => {
        settings.appPayload = JSON.stringify(json.payload, null, 2);
        save();
        settings.fetchOverlayPayloadStatus = "ok";
        rebuildUI();
    })
        .catch((error) => {
        settings.appPayload = "{}";
        settings.fetchOverlayPayloadStatus = "error";
        rebuildUI();
    });
}
function save() {
    console.log("saving...");
    let payload = {
        command: "",
        token: "",
        appPayload: "",
        appOverlay: "",
        appOverlayFieldId: "",
        appOverlayFieldOperationId: "",
        appOverlayFieldOpertationValue: "",
        appDatastoreId: ""
    };
    payload.token = settings.appToken;
    try {
        payload.command = JSON.stringify(settings.appCommandObject);
    }
    catch (error) {
        payload.command = "";
    }
    payload.appOverlay = settings.appOverlayId;
    if (settings.payloadUiElement && settings.appPayload !== undefined) {
        payload.appPayload = settings.appPayload;
    }
    else {
        payload.appPayload = "";
    }
    payload.appOverlayFieldId = settings.appOverlayFieldId;
    payload.appOverlayFieldOperationId = settings.appOverlayFieldOperationId;
    payload.appOverlayFieldOpertationValue =
        settings.appOverlayFieldOperationValue;
    payload.appDatastoreId = settings.appDatastoreId; //unfinished
    window.SDPIComponents.streamDeckClient.send("sendToPlugin", payload);
}
function rebuildCommandList() {
    const elSelect = document.getElementById("app-command-select-element");
    elSelect.innerHTML = "";
    elSelect.disabled = false;
    settings.commandMap = {};
    if (!settings.appCommandList || settings.appCommandList.length === 0) {
        // set the current command so we can see it in the UI while we load the API data from the server
        let option = document.createElement("option");
        if (settings.appCommandObject !== undefined && "command" in settings.appCommandObject) {
            option.value = settings.appCommandObject.command || "";
        }
        if (settings.appCommandObject !== undefined &&
            "title" in settings.appCommandObject &&
            settings.appCommandObject.title !== undefined) {
            option.text = settings.appCommandObject.title;
        }
        else {
            if (settings.validateAppStatus === "error") {
                option.text = "Cannot fetch API Info";
            }
            else {
                option.text = "Fetching API Info ...";
            }
        }
        // add the current value of the command and disable the drop down box.
        elSelect.appendChild(option);
        elSelect.disabled = true;
    }
    else {
        if (elSelect === null) {
            return;
        }
        elSelect.disabled = false;
        while (elSelect.firstChild) {
            elSelect.removeChild(elSelect.firstChild);
        }
        // populate the list and select the current command
        let selectedItem = undefined;
        let optgroup;
        let firstItem = undefined;
        settings.appCommandList.forEach((item) => {
            if (item !== undefined &&
                "group" in item &&
                item.group !== undefined) {
                optgroup = document.createElement("optgroup");
                optgroup.label = item.group;
                elSelect.add(optgroup, null);
            }
            else if (item !== undefined && ("command" in item || "title" in item)) {
                const option = document.createElement("option");
                option.value = JSON.stringify(item);
                if (item.title !== undefined) {
                    option.text = item.title;
                }
                else if (item.command !== undefined) {
                    option.text = item.command;
                }
                if (optgroup !== undefined) {
                    optgroup.appendChild(option);
                }
                else {
                    elSelect.add(option, null);
                }
                if (firstItem === undefined) {
                    firstItem = item;
                }
                // select the command that we use or, if no command was selected yet use the first
                if (settings.appCommandObject !== undefined &&
                    "command" in settings.appCommandObject &&
                    item.command === settings.appCommandObject.command) {
                    selectedItem = item;
                }
            }
        });
        if (selectedItem !== undefined &&
            "command" in selectedItem) {
            elSelect.value = JSON.stringify(selectedItem);
            settings.appCommandObject = selectedItem;
        }
        else {
            // this will make sure we skip the group header
            if (firstItem !== undefined) {
                elSelect.value = JSON.stringify(firstItem);
                settings.appCommandObject = firstItem;
            }
            else {
                elSelect.value = JSON.stringify(settings.appCommandList[0]);
                settings.appCommandObject = settings.appCommandList[0];
            }
        }
    }
    showElement("app-command-select-container");
}
function rebuildOverlayList() {
    const elSelect = document.getElementById("app-overlay-select-element");
    elSelect.querySelectorAll("option").forEach((option) => option.remove());
    if (!hasOverlays()) {
        // set the current command so we can see it in the UI while we load the API data from the server
        let option = document.createElement("option");
        option.value = settings.appOverlayId || "";
        if (settings.fetchOverlayListStatus === "error") {
            option.text = "Failed to fetch overlays";
        }
        else {
            option.text = "Fetching Overlays...";
        }
        // add the current value of the command and disable the drop down box.
        elSelect.add(option, null);
        elSelect.disabled = true;
    }
    else {
        elSelect.disabled = false;
        // check if our command needs a slot filter
        let filterSlots = false;
        if (settings.appCommandObject !== undefined &&
            "command" in settings.appCommandObject &&
            settings.appCommandObject &&
            settings.appCommandObject.command) {
            const c = settings.appCommandObject.command;
            if (c === "TakeOverlayFirstSlot" ||
                c === "TakeOverlayLastSlot" ||
                c === "TakeOverlayNextSlot" ||
                c === "TakeOverlayPreviousSlot" ||
                c === "TakeOverlaySlotName" ||
                c === "TakeOverlaySlotNumber") {
                filterSlots = true;
            }
        }
        // filter the list if needed
        const filteredAppOverlayList = filterSlots
            ? settings.appOverlayList.filter((item) => item.hasSlots)
            : settings.appOverlayList;
        // if there are no overlays with slots available, add a dummy entry
        if (!filteredAppOverlayList.length) {
            let option = document.createElement("option");
            option.value = "";
            option.text = "No overlays with slots available";
            settings.appOverlayId = "";
            elSelect.add(option, null);
        }
        else {
            // populate the list and select the current command
            let selectedId = undefined;
            filteredAppOverlayList.forEach((item) => {
                const option = document.createElement("option");
                option.value = item.id;
                option.text = item.name;
                elSelect.add(option, null);
                // select the overlay that we use or, if no overlay was selected yet use the first
                if (item.id == settings.appOverlayId) {
                    selectedId = item.id;
                }
            });
            if (selectedId !== undefined) {
                elSelect.value = selectedId;
            }
            else {
                elSelect.value = filteredAppOverlayList[0].id;
                settings.appOverlayId = filteredAppOverlayList[0].id;
            }
        }
    }
    showElement("app-overlay-select-element");
}
function rebuildOverlayFieldList() {
    if (!hasOverlays()) {
        return;
    }
    else {
        const elSelect = document.getElementById("app-payload-select-field-element");
        showElement("app-payload-select-field-container");
        // find the selected overlay
        let selectedOverlayModel = getSelectedOverlayModel();
        let selectedOverlayModelGroups = getSelectedOverlayModelGroups();
        // if we cannot find the selected overlay we return
        if (!selectedOverlayModel || !selectedOverlayModel.length) {
            showElement("app-payload-select-field-message");
            return;
        }
        // filter the fields of the model to only show the ones that are supported
        const supportedFields = selectedOverlayModel.filter((field) => {
            return (field.type === "text" ||
                field.type === "textarea" ||
                field.type === "number" ||
                field.type === "counter" ||
                field.type === "normalizednumber" ||
                field.type === "selection" ||
                field.type === "checkbox" ||
                field.type === "timecontrol" ||
                field.type === "image" ||
                field.type === "color" ||
                field.type === "gradient" ||
                field.type === "button");
        });
        // if there are no supported fields then return
        if (!supportedFields || !supportedFields.length) {
            showElement("app-payload-select-field-message");
            return;
        }
        elSelect.disabled = false;
        while (elSelect.firstChild && elSelect !== null) {
            elSelect.removeChild(elSelect.firstChild);
        }
        // sort the selected fields by index
        supportedFields.sort((a, b) => {
            return a.index - b.index;
        });
        const fieldTypeToName = (type) => {
            switch (type) {
                case "text":
                    return "Text";
                case "textarea":
                    return "Text Area";
                case "number":
                    return "Number";
                case "counter":
                    return "Counter";
                case "normalizednumber":
                    return "Normalized Number";
                case "selection":
                    return "Dropdown";
                case "checkbox":
                    return "Checkbox";
                case "timecontrol":
                    return "Time Control";
                case "image":
                    return "Image";
                case "color":
                case "gradient":
                    return "Color";
                case "button":
                    return "Button";
                default:
                    return "Unknown";
            }
        };
        // we have groups so list the elements in groups
        let selectedId = "";
        if (selectedOverlayModelGroups && selectedOverlayModelGroups.length) {
            // remember all field IDs
            const allFieldIds = supportedFields.map((field) => field.id);
            selectedOverlayModelGroups.forEach((group) => {
                if (!group.childIds || !group.childIds.length) {
                    return;
                }
                const optgroup = document.createElement("optgroup");
                optgroup.label = group.title;
                elSelect.add(optgroup, null);
                group.childIds.forEach((item) => {
                    const field = supportedFields.find((field) => field.id === item);
                    if (field) {
                        // remove the field from the list
                        const index = allFieldIds.indexOf(field.id);
                        if (index > -1) {
                            allFieldIds.splice(index, 1);
                        }
                        const option = document.createElement("option");
                        option.value = field.id;
                        option.text = fieldTypeToName(field.type) + " - " + field.title;
                        optgroup.appendChild(option);
                        // select the field that we use
                        if (field.id == settings.appOverlayFieldId) {
                            selectedId = field.id;
                        }
                    }
                });
            });
            // now create a group for the left over fields
            if (allFieldIds.length) {
                const optgroup = document.createElement("optgroup");
                optgroup.label = "Miscellaneous";
                elSelect.add(optgroup, null);
                allFieldIds.forEach((item) => {
                    const field = supportedFields.find((field) => field.id === item);
                    if (field) {
                        const option = document.createElement("option");
                        option.value = field.id;
                        option.text = fieldTypeToName(field.type) + " - " + field.title;
                        optgroup.appendChild(option);
                        // select the field that we use
                        if (field.id == settings.appOverlayFieldId) {
                            selectedId = field.id;
                        }
                    }
                });
            }
        }
        else {
            // populate the list and select the current command
            supportedFields.forEach((item) => {
                const option = document.createElement("option");
                option.value = item.id;
                option.text = fieldTypeToName(item.type) + " - " + item.title;
                elSelect.add(option, null);
                // select the field that we use
                if (item.id == settings.appOverlayFieldId) {
                    selectedId = item.id;
                }
            });
        }
        if (selectedId) {
            elSelect.value = selectedId;
        }
        else {
            elSelect.value = supportedFields[0].id;
            settings.appOverlayFieldId = supportedFields[0].id;
            // we changed the field so reset the value
            settings.appOverlayFieldOperationValue = null;
        }
        showElement("app-payload-select-field-element");
    }
}
function rebuildOverlayFieldOperationsList() {
    if (!hasOverlays()) {
        return;
    }
    const selectedField = getSelectedField();
    if (!selectedField) {
        return;
    }
    const elSelect = document.getElementById("app-payload-select-field-operation-element");
    showElement("app-payload-select-field-operation-container");
    let operations = [
        {
            id: "set",
            title: "Set",
        },
    ];
    if (selectedField.type === "button") {
        operations = [{ id: "buttonClick", title: "Click" }];
    }
    if (selectedField.type === "number" ||
        selectedField.type === "counter" ||
        selectedField.type === "normalizednumber") {
        operations.push({
            id: "numberIncrement",
            title: "Increment",
        });
        operations.push({
            id: "numberDecrement",
            title: "Decrement",
        });
    }
    if (selectedField.type === "checkbox") {
        operations.push({
            id: "checkboxToggle",
            title: "Toggle",
        });
    }
    if (selectedField.type === "timecontrol") {
        operations = [
            {
                id: "timecontrolStart",
                title: "Start",
            },
            {
                id: "timecontrolPause",
                title: "Pause",
            },
            {
                id: "timecontrolReset",
                title: "Reset",
            },
            {
                id: "timecontrolPlay",
                title: "Play",
            },
        ];
    }
    elSelect.disabled = false;
    elSelect.querySelectorAll("option").forEach((option) => option.remove());
    // populate the list and select the current command
    let selectedId = "";
    operations.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.id;
        option.text = item.title;
        elSelect.add(option, null);
        // select the operation that we use
        if (item.id == settings.appOverlayFieldOperationId) {
            selectedId = item.id;
        }
    });
    if (selectedId !== "") {
        elSelect.value = selectedId;
    }
    else {
        elSelect.value = operations[0].id;
        settings.appOverlayFieldOperationId = operations[0].id;
    }
}
function rebuildOverlayFieldOperationsValue() {
    if (!hasOverlays()) {
        return;
    }
    const selectedField = getSelectedField();
    if (!selectedField) {
        return;
    }
    const showContainerAndField = (fieldId) => {
        showElement("app-payload-select-field-operation-value-container");
        showElement(fieldId);
        settings.appOverlayFieldOperationValueElement = document.getElementById(fieldId);
        // we have an undefined value so we set it to the default value
        let displayValue = selectedField.defaultValue;
        if (settings.appOverlayFieldOperationValue === null) {
            settings.appOverlayFieldOperationValue = displayValue;
        }
        else {
            displayValue = settings.appOverlayFieldOperationValue;
        }
        // set the checked for checkbox and the value for the rest
        if (selectedField.type === "checkbox") {
            settings.appOverlayFieldOperationValueElement.checked =
                displayValue == undefined ? false : true;
        }
        else {
            // make sure that the color is a hex value
            if (selectedField.type === "color" || selectedField.type === "gradient") {
                if (settings.appOverlayFieldOperationValueElement === null)
                    return;
                settings.appOverlayFieldOperationValueElement.value =
                    w(displayValue).toHslString();
            }
            else {
                settings.appOverlayFieldOperationValueElement.value =
                    displayValue;
            }
        }
    };
    // show the value fields for the selected operation
    if (selectedField.type === "number" ||
        selectedField.type === "counter" ||
        selectedField.type === "normalizednumber") {
        // configure the number element
        const elNumber = document.getElementById("app-payload-select-field-operation-number-element");
        if (selectedField.min !== undefined && elNumber !== null) {
            elNumber.min = selectedField.min;
        }
        if (selectedField.max !== undefined) {
            elNumber.max = selectedField.max;
        }
        if (selectedField.step !== undefined) {
            elNumber.step = selectedField.step;
        }
        else {
            if (selectedField.type === "normalizednumber") {
                elNumber.step = "0.1";
            }
            else {
                elNumber.step = "1";
            }
        }
        showContainerAndField("app-payload-select-field-operation-number-element");
    }
    else if (selectedField.type === "checkbox") {
        // only show the checkbox if the operation is set
        if (settings.appOverlayFieldOperationId === "set") {
            showElement("app-payload-select-field-operation-checkbox-label");
            showContainerAndField("app-payload-select-field-operation-checkbox-element");
        }
    }
    else if (selectedField.type === "timecontrol") ;
    else if (selectedField.type === "color" ||
        selectedField.type === "gradient") {
        showContainerAndField("app-payload-select-field-operation-color-element");
    }
    else if (selectedField.type === "selection") {
        if (selectedField.source === "url" &&
            selectedField.sourceUrl &&
            selectedField.fetchingDataStatus === undefined) {
            // set a flag in the field that we are fetching the data
            selectedField.fetchingDataStatus = "busy";
            selectedField.selections = [];
            // check if the url starts with http and add it
            if (selectedField.sourceUrl.indexOf("//") === 0) {
                selectedField.sourceUrl = "https:" + selectedField.sourceUrl;
            }
            // fetch the data from the URL and put it into the selections field
            fetch(selectedField.sourceUrl)
                .then((response) => {
                if (!response.ok) {
                    // ____________________________________________________________________________________________ COME BACK TO THIS
                    //propogateError();
                    throw new Error("HTTP error, status = " + response.status);
                }
                return response.json();
            })
                .then((json) => {
                selectedField.fetchingDataStatus = "ok";
                selectedField.selections = json;
                rebuildOverlayFieldOperationsValue();
            })
                .catch((error) => {
                selectedField.fetchingDataStatus = "error";
                rebuildOverlayFieldOperationsValue();
            });
        }
        showContainerAndField("app-payload-select-field-operation-select-element");
        // configure the selection
        const elSelect = document.getElementById("app-payload-select-field-operation-select-element");
        elSelect.querySelectorAll("option").forEach((option) => option.remove());
        elSelect.disabled = false;
        if (selectedField.selections && selectedField.selections.length) {
            let selectedId;
            selectedField.selections.forEach((item) => {
                const option = document.createElement("option");
                option.value = item.id;
                option.text = item.title;
                elSelect.add(option, null);
                // select the overlay that we use or, if no overlay was selected yet use the first
                if (item.id == settings.appOverlayFieldOperationValue) {
                    selectedId = item.id;
                }
            });
            if (selectedId) {
                elSelect.value = selectedId;
            }
            else {
                elSelect.value = selectedField.selections[0].id;
                settings.appOverlayFieldOperationValue = selectedField.selections[0].id;
            }
        }
        else {
            const option = document.createElement("option");
            option.value = "";
            if (selectedField.fetchingDataStatus === "busy") {
                option.text = "Fetching data ...";
            }
            else if (selectedField.fetchingDataStatus === "error") {
                option.text = "Failed to fetch data";
            }
            else {
                option.text = "No selection available";
            }
            elSelect.add(option, null);
            elSelect.disabled = true;
            settings.appOverlayFieldOperationValue = null;
        }
    }
    else if (selectedField.type === "textarea") {
        showContainerAndField("app-payload-select-field-operation-textarea-element");
    }
    else if (selectedField.type === "color" ||
        selectedField.type === "gradient") {
        showContainerAndField("app-payload-select-field-operation-color-element");
    }
    else if (selectedField.type === "button") ;
    else {
        showContainerAndField("app-payload-select-field-operation-text-element");
    }
}
function getSelectedOverlayModel() {
    if (settings.appCommandObject) {
        if ("command" in settings.appCommandObject &&
            (settings.appCommandObject.command === "SetCustomizationContent" ||
                settings.appCommandObject.command === "ChangeCustomizationField")) {
            if (settings.appCustomization !== null) {
                return settings.appCustomization.model;
            }
            return;
        }
    }
    const result = settings.appOverlayList.find((item) => {
        return item.id == settings.appOverlayId;
    });
    if (result) {
        return result.model;
    }
}
function changeAppPayload() {
    let value = "";
    if (settings.payloadUiElement) {
        let el = document.getElementById(settings.payloadUiElement);
        value = el.value;
    }
    settings.appPayload = value;
    rebuildUI();
    save();
}
function changeAppCommand() {
    let cmd = undefined;
    console.log("ChangeAppCommand");
    console.log(document.getElementById("app-command-select-element").value);
    try {
        cmd = JSON.parse(document.getElementById("app-command-select-element").value);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("An error occurred: ", error.message);
        }
        else if (typeof error === "string") {
            console.error(error);
        }
    }
    console.log(cmd);
    if (cmd === undefined) {
        return;
    }
    settings.appCommandObject = cmd;
    settings.appPayload = "";
    rebuildUI();
    save();
}
function changeOverlay() {
    settings.appOverlayId = document.getElementById("app-overlay-select-element").value;
    if (settings.appCommandObject && "command" in settings.appCommandObject &&
        settings.appCommandObject.command === "SetOverlayContent") {
        fetchAppOverlayPayload();
    }
    else {
        settings.appPayload = "";
    }
    rebuildUI();
    save();
}
function changeOverlayField() {
    settings.appOverlayFieldId = document.getElementById("app-payload-select-field-element").value;
    settings.appOverlayFieldOperationValue = null;
    rebuildUI();
    save();
}
function changeOverlayFieldOperation() {
    settings.appOverlayFieldOperationId = document.getElementById("app-payload-select-field-operation-element").value;
    rebuildUI();
    save();
}
function changeOverlayFieldOperationValue() {
    if (settings.appOverlayFieldOperationValueElement.type === "checkbox") {
        settings.appOverlayFieldOperationValue =
            settings.appOverlayFieldOperationValueElement.checked;
    }
    else {
        settings.appOverlayFieldOperationValue =
            settings.appOverlayFieldOperationValueElement.value;
    }
    save();
    rebuildUI();
}
function rebuildPayloadFieldSelection(property) {
    const selections = property.selections;
    const elSelect = document.getElementById("app-payload-field-select");
    elSelect.querySelectorAll("option").forEach((option) => option.remove());
    if (!selections || !selections.length) {
        const option = document.createElement("option");
        option.value = "";
        option.text = "No selection available";
        elSelect.add(option, null);
        elSelect.disabled = true;
    }
    else {
        elSelect.disabled = false;
        let selectedId = undefined;
        selections.forEach((item) => {
            const option = document.createElement("option");
            option.value = item.id;
            option.text = item.title;
            elSelect.add(option, null);
            // select the overlay that we use or, if no overlay was selected yet use the first
            if (item.id == settings.appPayload) {
                selectedId = item.id;
            }
        });
        if (selectedId !== undefined) {
            elSelect.value = selectedId;
        }
        else {
            elSelect.value = selections[0].id;
            settings.appPayload = selections[0].id;
        }
    }
    showElement("app-payload-field-select");
}
function getSelectedOverlayModelGroups() {
    if (settings.appCommandObject) {
        if ("command" in settings.appCommandObject &&
            (settings.appCommandObject.command === "SetCustomizationContent" ||
                settings.appCommandObject.command === "ChangeCustomizationField")) {
            if (settings.appCustomization) {
                return settings.appCustomization.groups;
            }
            return;
        }
    }
    const result = settings.appOverlayList.find((item) => {
        return item.id == settings.appOverlayId;
    });
    if (result) {
        return result.groups;
    }
}
function removeAndAddClass(elementID, classRemove, classAdd) {
    let el = document.getElementById(elementID);
    if (!el) {
        console.log("Element not found: " + elementID);
        return;
    }
    if (classRemove) {
        el.classList.remove(classRemove);
    }
    if (classAdd) {
        el.classList.add(classAdd);
    }
}
function showElement(elementID) {
    removeAndAddClass(elementID, "hidden", "shown");
}
function hideElement(elementID) {
    removeAndAddClass(elementID, "shown", "hidden");
}
function setElementValue(elementID, value) {
    let el = document.getElementById(elementID);
    if (!el) {
        console.log("Element not found: " + elementID);
        return;
    }
    el.value = value;
}
function setElementContent(elementID, content) {
    let el = document.getElementById(elementID);
    if (!el) {
        console.log("Element not found: " + elementID);
        return;
    }
    el.textContent = content;
}
function hasOverlays() {
    if (settings.appOverlayList && settings.appOverlayList.length) {
        return true;
    }
    if (settings.appCommandObject !== undefined) {
        if ("command" in settings.appCommandObject &&
            (settings.appCommandObject.command === "SetCustomizationContent" ||
                settings.appCommandObject.command === "ChangeCustomizationField")) {
            return true;
        }
    }
    return false;
}
function getSelectedField() {
    const selectedOverlayModel = getSelectedOverlayModel();
    if (!selectedOverlayModel) {
        return;
    }
    return selectedOverlayModel.find((item) => {
        return item.id == settings.appOverlayFieldId;
    });
}
//# sourceMappingURL=pi.js.map
