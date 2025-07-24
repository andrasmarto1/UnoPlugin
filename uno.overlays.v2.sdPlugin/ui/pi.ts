import tinycolor, { ColorInput } from "tinycolor2";
import streamDeck from '@elgato/streamdeck';

/**
 * JSON object.
 */
type JsonObject = {
  [key: string]: JsonValue;
};
/**
* JSON primitive value.
*/
type JsonPrimitive = boolean | number | string | null | undefined;
/**
* JSON value.
*/
type JsonValue = JsonObject | JsonPrimitive | JsonValue[];

type appRequestPayload = {
	command?: string,
	id: string,
	fieldId: string,
	value: any,
	content: string,
  token: string,
}

type savePayload = {
  token: string,
  command: string,
  appOverlay: string,
  appPayload: string | undefined,
  appOverlayFieldId: string,
  appOverlayFieldOperationId: string | null,
  appOverlayFieldOpertationValue: string | number | boolean | { type: "solid"; solidColor: string } | null,
  appDatastoreId: string,
}

type ControlSettings = {
	baseUrl: string,
	appToken: string,
	appPayload: string | undefined,
	validateAppStatus: string,
	appName: string,
  appThumbnail: string,
  appDatastoreId: string,
	appCommandList: Entry[],
	appOverlayList: OverlayModel[],
	hasOverlaySelection?: boolean,
	appOverlayId: string,
	oldAppOverlayId: string | undefined,
	appCommandObject: Entry,
	fetchOverlayListStatus: string,
	fetchOverlayPayloadStatus: string,
	payloadUiElement: string,
  appCustomization: OverlayModel | null,
  fetchCustomizationStatus: string,
  appOverlayFieldId: string,
  appOverlayFieldOperationValue: string | number | boolean | { type: "solid"; solidColor: string } | null,
  appOverlayFieldOperationId: string | null,
  appOverlayFieldOperationValueElement: HTMLElement | null,

};

type CommandArgument = {
  id: string;
  title: string;
  type: string;
  default?: string;
  required: boolean;
  min?: number;
  max?: number;
  selections: OverlayModelGroup[];
};


type CommandEntry = {
  command?: string;
  title?: string;
  arguments?: CommandArgument[];
};

type GroupEntry = {
  group?: string;
};

type Entry = CommandEntry | GroupEntry;

type ColorValue = {
  a: number;
  r: number;
  g: number;
  b: number;
};

type ModelType = "number" | "color" | string;

type OverlayModelField = {
  selections: OverlayModelGroup[];
  defaultValue: string | number;
  id: string;
  immediateUpdate: boolean;
  index: number;
  resetValue: string | number | ColorValue;
  step?: string;
  title: string;
  type: ModelType;
  max: string;
  min: string;
  source: string;
  sourceUrl: string;
  fetchingDataStatus: string;
};

type OverlayModelGroup = {
  activeId: string;
  childIds: string[];
  id: string;
  presetSourceUrl: string;
  title: string;
  toolTip: string;
  usePreset: boolean;
  usePresetReload: boolean;
  width: string;
};

type OverlayModel = {
  id: string;
  name: string;
  model: OverlayModelField[];
  groups: OverlayModelGroup[];
  hasSlots: boolean;
};


let settings: ControlSettings = {
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
  appOverlayFieldOperationValueElement: null
};


function verifyToken(): void {
  settings.validateAppStatus = "busy";

  const url = settings.baseUrl + settings.appToken;

  fetch(url, {
    method: "GET",
    redirect: "follow",
  }).then((response) => {
    if (!response.ok) {
      propogateError(response.status, "Invalid API token");
      rebuildUI();
      return;
    }
    return response.json();
  }).then((json) => {
    settings.appName = json.name || "";
    settings.appThumbnail = json.thumbnail || "";
    settings.appDatastoreId = json.datastoreId || "";
  })

  if (settings.appThumbnail && settings.appThumbnail.indexOf("https://") === -1) {
    settings.appThumbnail = "https:" + settings.appThumbnail;
  }

  settings.validateAppStatus = "ok";
  fetchAppApi();
  rebuildUI();

  //sends data to analytics
  fetch(
    `https://app.singular.live/apiv2/controlapps/${settings.appToken}/analytics`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "streamdeckopened",
      }),
    }
  );
}

function propogateError(status: number, reason: string): void {
  settings.appCommandList = [];
  settings.validateAppStatus = "error";
  //Remember that most errors will be given with a status code, 
  //but -1 is for the general error case. This should just
  //result in a "showError" call.
}


function fetchAppApi(): void {
  const url = settings.baseUrl + settings.appToken + "/api/json";

  fetch(url, {
    method: "GET",
    redirect: "follow",
  })
    .then((response) => {
      if (!response.ok) {
        //rebuildUI();
        propogateError(response.status, "HTTP error");
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

      rebuildUI();
      fetchAppCustomization();
      fetchAppOverlays();
      return true;
    })
    .catch((error) => {
      propogateError(-1, "");
      rebuildUI();
      return false;
    });
};

function fetchAppCustomization(): void {
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
};

function getAppJson(event: KeyboardEvent): void {
  console.log("Getappjson");
  // we have to press enter or tab
  let checkToken: boolean = false;
  if (!event) {
    checkToken = true;
  } else {
    const keyPressed = event.key || event.code;
    if (keyPressed == "Tab" || keyPressed == "Enter") {
      checkToken = true;
    }
  }

  if (checkToken) {
    let el: HTMLElement | null = document.getElementById("app-token");
    if (el !== null) {
      let token = (el as HTMLInputElement).value;
      if (settings.appToken != token) {
        settings.appToken = token;
        verifyToken();
        save();
      }
    }
  }
};

function refreshContent(): void {
  // this will force the fetch
  settings.oldAppOverlayId = undefined;
  fetchAppOverlayPayload();
};

function fetchAppOverlays(): void {
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
};


function rebuildUI(): void {
  // if (errorMessage) {
  // 	setElementContent("message-error-content", errorMessage);
  // 	showElement("message-error");
  // } else {
  // 	hideElement("message-error");
  // }

  removeAndAddClass("app-token-info-error", "", "hidden");
  removeAndAddClass("app-token-info-busy", "", "hidden");
  removeAndAddClass("app-token-info-ok", "", "hidden");
  if (settings.validateAppStatus === "busy") {
    removeAndAddClass("app-token-info-busy", "hidden", "");
  } else {
    if (settings.validateAppStatus === "ok") {
      removeAndAddClass("app-token-info-ok", "hidden", "");
    } else {
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
    
    // replace fit-in/150x150 with fit-in/200x200
    if (el !== null) {
      (el as HTMLImageElement).src = settings.appThumbnail.replace("fit-in/150x150", "fit-in/300x300");
    }
  } else {
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
  if (
    settings.appCommandObject &&
    "arguments" in settings.appCommandObject &&
    settings.appCommandObject.arguments !== undefined
  ) {
    // handle the special case of SetCustomizationContent and ChangeCustomizationField
    if (
      settings.appCommandObject.command === "SetCustomizationContent" ||
      settings.appCommandObject.command === "ChangeCustomizationField"
    ) {
      settings.appOverlayId = "root";
      // hasOverlaySelection = false;
    }

    let displayOverlaySelection: boolean = false;
    settings.appCommandObject.arguments.forEach((property) => {
      // should we show the value field at the end?
      let showValue: boolean = false;
      // if we have an overlay selection then we need to check if we have an overlay selected
      if (displayOverlaySelection) {
        if (settings.appOverlayId && settings.fetchOverlayListStatus === "ok") {
          showValue = true;
        }
      } else {
        // if we don't have an overlay selection then we can show the value
        showValue = true;
      }

      let element;
      switch (property.type) {
        case "json":
        case "JSON":
          showElement("app-payload-json-container");
          if (settings.fetchOverlayPayloadStatus === "busy") {
            showElement("app-payload-json");
            setElementValue("app-payload-json", "Fetching content JSON...");
          } else {
            element = "app-payload-json";
          }
          break;
        case "overlaySelection":
          displayOverlaySelection = true;
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
          let isOK: boolean = false;
          try {
            JSON.parse(settings.appPayload);
            isOK = true;
          } catch (error) {}
          if (isOK) {
            removeAndAddClass(element, "invalid", "valid");
          } else {
            removeAndAddClass(element, "valid", "invalid");
          }
        }
      }
    });
  }
}


function fetchAppOverlayPayload(): void {
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
      command:
        settings.appOverlayId === "root" ? "GetCustomization" : "GetOverlayContent",
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
};

function save(): void {
  console.log("saving...");

  let payload: savePayload = {
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
  } catch (error) {
    payload.command = "";
  }
  payload.appOverlay= settings.appOverlayId;
  if (settings.payloadUiElement && settings.appPayload !== undefined) {
    payload.appPayload = settings.appPayload;
  } else {
    payload.appPayload = "";
  }
  payload.appOverlayFieldId = settings.appOverlayFieldId;
  payload.appOverlayFieldOperationId = settings.appOverlayFieldOperationId;
  payload.appOverlayFieldOpertationValue =
    settings.appOverlayFieldOperationValue;

  payload.appDatastoreId = settings.appDatastoreId; //unfinished

  streamDeck.plugin.sendToPlugin(payload);
};

function rebuildCommandList(): void {
  const elSelect = document.getElementById("app-command-select-element");
  if (!settings.appCommandList || !settings.appCommandList.length) {
    // set the current command so we can see it in the UI while we load the API data from the server
    let option: HTMLOptionElement = document.createElement("option");
    if(settings.appCommandObject !== undefined && "command" in settings.appCommandObject) {
      option.value = settings.appCommandObject.command || "";
    }
    if (settings.appCommandObject !== undefined && 
        "title" in settings.appCommandObject &&
        settings.appCommandObject.title !== undefined
    ) {
      option.text = settings.appCommandObject.title;
    } else {
      if (settings.validateAppStatus === "error") {
        option.text = "Cannot fetch API Info";
      } else {
        option.text = "Fetching API Info ...";
      }
    }

    // add the current value of the command and disable the drop down box.
    (elSelect as HTMLSelectElement).add(option, null);
    (elSelect as HTMLSelectElement).disabled = true;
  } else {
    if (elSelect === null) {
      return;
    }
    (elSelect as HTMLSelectElement).disabled = false;
    while (elSelect.firstChild) {
      elSelect.removeChild(elSelect.firstChild);
    }

    // populate the list and select the current command
    let selectedItem: Entry | undefined = undefined;
    let optgroup: HTMLOptGroupElement;
    let firstItem: JsonObject | undefined = undefined;
    settings.appCommandList.forEach((item) => {
      if (item !== undefined && 
          "group" in item &&
          item.group !== undefined
      ) {
        optgroup = document.createElement("optgroup");
        optgroup.label = item.group;
        (elSelect as HTMLSelectElement).add(optgroup, null);
      } else if (item !== undefined && ("command" in item || "title" in item)) {
        const option = document.createElement("option");
        option.value = JSON.stringify(item);
        if (item.title !== undefined) {
          option.text = item.title;
        } else if (item.command !== undefined) {
          option.text = item.command;
        }
        if (optgroup !== undefined) {
          optgroup.appendChild(option);
        } else {
          (elSelect as HTMLSelectElement).add(option, null);
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
        "group" in selectedItem
      ) 
    {
      (elSelect as HTMLSelectElement).value = JSON.stringify(selectedItem);
      settings.appCommandObject = selectedItem;
    } else {
      // this will make sure we skip the group header
      if (firstItem !== undefined) {
        (elSelect as HTMLSelectElement).value = JSON.stringify(firstItem);
        settings.appCommandObject = firstItem;
      } else {
        (elSelect as HTMLSelectElement).value = JSON.stringify(settings.appCommandList[0]);
        settings.appCommandObject = settings.appCommandList[0];
      }
    }
  }

  showElement("app-command-select-container");
};

function rebuildOverlayList(): void {
  const elSelect = document.getElementById("app-overlay-select-element");
  (elSelect as HTMLSelectElement).querySelectorAll("option").forEach((option) => option.remove());

  if (!hasOverlays()) {
    // set the current command so we can see it in the UI while we load the API data from the server
    let option: HTMLOptionElement = document.createElement("option");
    option.value = settings.appOverlayId || "";
    if (settings.fetchOverlayListStatus === "error") {
      option.text = "Failed to fetch overlays";
    } else {
      option.text = "Fetching Overlays...";
    }

    // add the current value of the command and disable the drop down box.
    (elSelect as HTMLSelectElement).add(option, null);
    (elSelect as HTMLSelectElement).disabled = true;
  } else {
    (elSelect as HTMLSelectElement).disabled = false;

    // check if our command needs a slot filter
    let filterSlots = false;
    if (settings.appCommandObject !== undefined &&
        "command" in settings.appCommandObject &&
        settings.appCommandObject && 
        settings.appCommandObject.command) 
      {
      const c: string = settings.appCommandObject.command;
      if (
        c === "TakeOverlayFirstSlot" ||
        c === "TakeOverlayLastSlot" ||
        c === "TakeOverlayNextSlot" ||
        c === "TakeOverlayPreviousSlot" ||
        c === "TakeOverlaySlotName" ||
        c === "TakeOverlaySlotNumber"
      ) {
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
      (elSelect as HTMLSelectElement).add(option, null);
    } else {
      // populate the list and select the current command
      let selectedId : string | undefined = undefined;
      filteredAppOverlayList.forEach((item: OverlayModel) => {
        const option = document.createElement("option");
        option.value = item.id;
        option.text = item.name;
        (elSelect as HTMLSelectElement).add(option, null);

        // select the overlay that we use or, if no overlay was selected yet use the first
        if (item.id == settings.appOverlayId) {
          selectedId = item.id;
        }
      });
      if (selectedId !== undefined) {
        (elSelect as HTMLSelectElement).value = selectedId;
      } else {
        (elSelect as HTMLSelectElement).value = filteredAppOverlayList[0].id;
        settings  .appOverlayId = filteredAppOverlayList[0].id;
      }
    }
  }
  showElement("app-overlay-select-element");
};

function rebuildOverlayFieldList(): void {
  if (!hasOverlays()) {
    return;
  } else {
    const elSelect = document.getElementById(
      "app-payload-select-field-element"
    );

    showElement("app-payload-select-field-container");

    // find the selected overlay
    let selectedOverlayModel: OverlayModelField[] | undefined = getSelectedOverlayModel();
    let selectedOverlayModelGroups = getSelectedOverlayModelGroups();

    // if we cannot find the selected overlay we return
    if (!selectedOverlayModel || !selectedOverlayModel.length) {
      showElement("app-payload-select-field-message");
      return;
    }

    // filter the fields of the model to only show the ones that are supported
    const supportedFields = selectedOverlayModel.filter((field: {type: string}) => {
      return (
        field.type === "text" ||
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
        field.type === "button"
      );
    });

    // if there are no supported fields then return
    if (!supportedFields || !supportedFields.length) {
      showElement("app-payload-select-field-message");
      return;
    }

    (elSelect as HTMLSelectElement).disabled = false;
    while ((elSelect as HTMLSelectElement).firstChild && elSelect !== null) {
      (elSelect as HTMLSelectElement).removeChild(elSelect.firstChild as ChildNode);
    }

    // sort the selected fields by index
    supportedFields.sort((a, b) => {
      return a.index - b.index;
    });

    const fieldTypeToName = (type: string) => {
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
    let selectedId: string = "";
    if (selectedOverlayModelGroups && selectedOverlayModelGroups.length) {
      // remember all field IDs
      const allFieldIds = supportedFields.map((field) => field.id);

      selectedOverlayModelGroups.forEach((group: OverlayModelGroup) => {
        if (!group.childIds || !group.childIds.length) {
          return;
        }

        const optgroup = document.createElement("optgroup");
        optgroup.label = group.title;
        (elSelect as HTMLSelectElement).add(optgroup, null);

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
        (elSelect as HTMLSelectElement).add(optgroup, null);

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
    } else {
      // populate the list and select the current command
      supportedFields.forEach((item) => {
        const option = document.createElement("option");
        option.value = item.id;
        option.text = fieldTypeToName(item.type) + " - " + item.title;
        (elSelect as HTMLSelectElement).add(option, null);

        // select the field that we use
        if (item.id == settings.appOverlayFieldId) {
          selectedId = item.id;
        }
      });
    }
    if (selectedId) {
      (elSelect as HTMLSelectElement).value = selectedId;
    } else {
      (elSelect as HTMLSelectElement).value = supportedFields[0].id;
      settings.appOverlayFieldId = supportedFields[0].id;
      // we changed the field so reset the value
      settings.appOverlayFieldOperationValue = null;
    }
    showElement("app-payload-select-field-element");
  }
};

function rebuildOverlayFieldOperationsList(): void {
  if (!hasOverlays()) {
    return;
  }
  const selectedField = getSelectedField();
  if (!selectedField) {
    return;
  }

  const elSelect = document.getElementById(
    "app-payload-select-field-operation-element"
  );
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
  if (
    selectedField.type === "number" ||
    selectedField.type === "counter" ||
    selectedField.type === "normalizednumber"
  ) {
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

  (elSelect as HTMLSelectElement).disabled = false;

  (elSelect as HTMLSelectElement).querySelectorAll("option").forEach((option) => option.remove());

  // populate the list and select the current command
  let selectedId: string = "";
  operations.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.id;
    option.text = item.title;
    (elSelect as HTMLSelectElement).add(option, null);

    // select the operation that we use
    if (item.id == settings.appOverlayFieldOperationId) {
      selectedId = item.id;
    }
  });
  if (selectedId !== "") {
    (elSelect as HTMLSelectElement).value = selectedId;
  } else {
    (elSelect as HTMLSelectElement).value = operations[0].id;
    settings.appOverlayFieldOperationId = operations[0].id;
  }
};

function rebuildOverlayFieldOperationsValue(): void {
  if (!hasOverlays()) {
    return;
  }
  const selectedField: OverlayModelField | undefined = getSelectedField();
  if (!selectedField) {
    return;
  }

  const showContainerAndField = (fieldId : string) => {
    showElement("app-payload-select-field-operation-value-container");
    showElement(fieldId);
    settings.appOverlayFieldOperationValueElement = document.getElementById(fieldId);

    // we have an undefined value so we set it to the default value
    let displayValue: string | boolean | { type: "solid"; solidColor: string }
          = selectedField.defaultValue as string;
    if (settings.appOverlayFieldOperationValue === null) {
      settings.appOverlayFieldOperationValue = displayValue as string;
    } else {
      displayValue = settings.appOverlayFieldOperationValue as string;
    }

    // set the checked for checkbox and the value for the rest
    if (selectedField.type === "checkbox") {
      (settings.appOverlayFieldOperationValueElement as HTMLInputElement).checked = 
        displayValue == undefined ? false : true;
    } else {
      // make sure that the color is a hex value
      if (selectedField.type === "color" || selectedField.type === "gradient") {
        if (settings.appOverlayFieldOperationValueElement === null) return;
        (settings.appOverlayFieldOperationValueElement as HTMLInputElement).value =
          tinycolor(displayValue as ColorInput).toHexString();
      } else {
        (settings.appOverlayFieldOperationValueElement as HTMLInputElement).value = 
          displayValue as string;
      }
    }
  };

  // show the value fields for the selected operation
  if (
    selectedField.type === "number" ||
    selectedField.type === "counter" ||
    selectedField.type === "normalizednumber"
  ) {
    // configure the number element
    const elNumber = document.getElementById(
      "app-payload-select-field-operation-number-element"
    );
    if (selectedField.min !== undefined && elNumber !== null) {
      (elNumber as HTMLInputElement).min = selectedField.min;
    }
    if (selectedField.max !== undefined) {
      (elNumber as HTMLInputElement).max = selectedField.max;
    }
    if (selectedField.step !== undefined) {
      (elNumber as HTMLInputElement).step = selectedField.step;
    } else {
      if (selectedField.type === "normalizednumber") {
        (elNumber as HTMLInputElement).step = "0.1";
      } else {
        (elNumber as HTMLInputElement).step = "1";
      }
    }
    showContainerAndField("app-payload-select-field-operation-number-element");
  } else if (selectedField.type === "checkbox") {
    // only show the checkbox if the operation is set
    if (settings.appOverlayFieldOperationId === "set") {
      showElement("app-payload-select-field-operation-checkbox-label");
      showContainerAndField(
        "app-payload-select-field-operation-checkbox-element"
      );
    }
  } else if (selectedField.type === "timecontrol") {
    // nothing for timecontrol
  } else if (
    selectedField.type === "color" ||
    selectedField.type === "gradient"
  ) {
    showContainerAndField("app-payload-select-field-operation-color-element");
  } else if (selectedField.type === "selection") {
    if (
      selectedField.source === "url" &&
      selectedField.sourceUrl &&
      selectedField.fetchingDataStatus === undefined
    ) {
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
    const elSelect = document.getElementById(
      "app-payload-select-field-operation-select-element"
    );
    (elSelect as HTMLSelectElement).querySelectorAll("option").forEach((option) => option.remove());
    (elSelect as HTMLSelectElement).disabled = false;
    if (selectedField.selections && selectedField.selections.length) {
      let selectedId;
      selectedField.selections.forEach((item) => {
        const option: HTMLOptionElement = document.createElement("option");
        option.value = item.id;
        option.text = item.title;
        (elSelect as HTMLSelectElement).add(option, null);

        // select the overlay that we use or, if no overlay was selected yet use the first
        if (item.id == settings.appOverlayFieldOperationValue) {
          selectedId = item.id;
        }
      });
      if (selectedId) {
        (elSelect as HTMLSelectElement).value = selectedId;
      } else {
        (elSelect as HTMLSelectElement).value = selectedField.selections[0].id;
        settings.appOverlayFieldOperationValue = selectedField.selections[0].id;
      }
    } else {
      const option = document.createElement("option");
      option.value = "";
      if (selectedField.fetchingDataStatus === "busy") {
        option.text = "Fetching data ...";
      } else if (selectedField.fetchingDataStatus === "error") {
        option.text = "Failed to fetch data";
      } else {
        option.text = "No selection available";
      }
      (elSelect as HTMLSelectElement).add(option, null);
      (elSelect as HTMLSelectElement).disabled = true;
      settings.appOverlayFieldOperationValue = null;
    }
  } else if (selectedField.type === "textarea") {
    showContainerAndField(
      "app-payload-select-field-operation-textarea-element"
    );
  } else if (
    selectedField.type === "color" ||
    selectedField.type === "gradient"
  ) {
    showContainerAndField("app-payload-select-field-operation-color-element");
  } else if (selectedField.type === "button") {
    // nothing for buttons
  } else {
    showContainerAndField("app-payload-select-field-operation-text-element");
  }
};

function getSelectedOverlayModel(): OverlayModelField[] | undefined {
  if (settings.appCommandObject) {
    if (
      "command" in settings.appCommandObject &&
      (settings.appCommandObject.command === "SetCustomizationContent" ||
      settings.appCommandObject.command === "ChangeCustomizationField")
    ) {
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
};

function changeAppPayload(): void {
  let value: string = "";
  if (settings.payloadUiElement) {
    let el = document.getElementById(settings.payloadUiElement);
    value = (el as HTMLInputElement).value;
  }
  settings.appPayload = value;
  rebuildUI();
  save();
};

function changeAppCommand(): void {
  let cmd: Entry | undefined = undefined;
  try {
    cmd = JSON.parse(
      (document.getElementById("app-command-select-element") as HTMLSelectElement).value
    );
  } catch {}

  if (cmd === undefined) {
    return;
  }
  settings.appCommandObject = cmd;
  settings.appPayload = "";

  rebuildUI();
  save();
}

function changeOverlay(): void {
  settings.appOverlayId = (document.getElementById("app-overlay-select-element") as HTMLSelectElement).value;
  if (settings.appCommandObject && "command" in settings.appCommandObject && 
      settings.appCommandObject.command === "SetOverlayContent") {
    fetchAppOverlayPayload();
  } else {
    settings.appPayload = "";
  }
  rebuildUI();
  save();
};

function changeOverlayField(): void {
  settings.appOverlayFieldId = (document.getElementById(
    "app-payload-select-field-element"
  ) as HTMLSelectElement).value;
  settings.appOverlayFieldOperationValue = null;
  rebuildUI();
  save();
};

function changeOverlayFieldOperation(): void {
  settings.appOverlayFieldOperationId = (document.getElementById(
    "app-payload-select-field-operation-element"
  ) as HTMLSelectElement).value;
  rebuildUI();
  save();
};

function changeOverlayFieldOperationValue(): void {
  if ((settings.appOverlayFieldOperationValueElement as HTMLInputElement).type === "checkbox") {
    settings.appOverlayFieldOperationValue =
      (settings.appOverlayFieldOperationValueElement as HTMLInputElement).checked;
  } else {
    settings.appOverlayFieldOperationValue = 
      (settings.appOverlayFieldOperationValueElement as HTMLInputElement).value;
  }
  save();
  rebuildUI();
};

function rebuildPayloadFieldSelection(property: CommandArgument): void {
  const selections = property.selections;

  const elSelect = document.getElementById("app-payload-field-select");
  (elSelect as HTMLSelectElement).querySelectorAll("option").forEach((option) => option.remove());

  if (!selections || !selections.length) {
    const option = document.createElement("option");
    option.value = "";
    option.text = "No selection available";
    (elSelect as HTMLSelectElement).add(option, null);
    (elSelect as HTMLSelectElement).disabled = true;
  } else {
    (elSelect as HTMLSelectElement).disabled = false;

    let selectedId: string | undefined = undefined;
    selections.forEach((item) => {
      const option = document.createElement("option");
      option.value = item.id;
      option.text = item.title;
      (elSelect as HTMLSelectElement).add(option, null);

      // select the overlay that we use or, if no overlay was selected yet use the first
      if (item.id == settings.appPayload) {
        selectedId = item.id;
      }
    });
    if (selectedId !== undefined) {
      (elSelect as HTMLSelectElement).value = selectedId;
    } else {
      (elSelect as HTMLSelectElement).value = selections[0].id;
      settings.appPayload = selections[0].id;
    }
  }

  showElement("app-payload-field-select");
};

function getSelectedOverlayModelGroups(): OverlayModelGroup[] | undefined {
  if (settings.appCommandObject) {
    if (
        "command" in settings.appCommandObject &&
        (settings.appCommandObject.command === "SetCustomizationContent" ||
        settings.appCommandObject.command === "ChangeCustomizationField")
    ) {
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
};


function removeAndAddClass(elementID: string , classRemove: string, classAdd: string): void {
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
};

function showElement(elementID: string): void {
  removeAndAddClass(elementID, "hidden", "shown");
};
function hideElement(elementID: string): void {
  removeAndAddClass(elementID, "shown", "hidden");
};
function setElementValue(elementID: string, value: string) {
  let el = document.getElementById(elementID);
  if (!el) {
    console.log("Element not found: " + elementID);
    return;
  }
  (el as HTMLInputElement).value = value;
}

function setElementContent(elementID: string, content: string): void {
  let el = document.getElementById(elementID);
  if (!el) {
    console.log("Element not found: " + elementID);
    return;
  }
  el.textContent = content;
}

function hasOverlays(): boolean {
  if (settings.appOverlayList && settings.appOverlayList.length) {
    return true;
  }
  if (settings.appCommandObject !== undefined) {
    if (
      "command"	in settings.appCommandObject &&
      (settings.appCommandObject.command === "SetCustomizationContent" ||
       settings.appCommandObject.command === "ChangeCustomizationField")
    ) {
      return true;
    }
  }
  return false;
};

function getSelectedField(): OverlayModelField | undefined {
  const selectedOverlayModel = getSelectedOverlayModel();
  if (!selectedOverlayModel) {
    return;
  }
  return selectedOverlayModel.find((item) => {
    return item.id == settings.appOverlayFieldId;
  });
};