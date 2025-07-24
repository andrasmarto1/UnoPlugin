import streamDeck, { action, JsonValue,  } from "@elgato/streamdeck";
import { Action, ActionContext, WillAppearEvent, DidReceiveSettingsEvent, SingletonAction, JsonObject, SendToPluginEvent, KeyDownEvent } from "@elgato/streamdeck";
import * as z from "zod";


/**
 * Settings for {@link UnoControl}.
 */
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
  appOverlayFieldOperationValueElement: any,

};

declare type DataSourcePayload = {
	event: string;
	items: DataSourceResult;
};

declare type DataSourceResult = DataSourceResultItem[];
declare type DataSourceResultItem = Item | ItemGroup;

declare type Item = {
    disabled?: boolean;
    label?: string;
    value: string;
};

declare type ItemGroup = {
    label?: string;
    children: Item[];
};

type CommandArgument = {
  id: string;
  title: string;
  type: string;
  default?: string;
  required: boolean;
  min?: number;
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

type OverlayModelField = {
  defaultValue: string;
  id: string;
  immediateUpdate: boolean;
  index: number;
  resetValue: string;
  title: string;
  type: "text" | "textarea" | string;
}

type OverlayModel = {
  id: string;
  name: string;
  model: OverlayModelField[];
  groups: string[];
  hasSlots: boolean;
}

type GetOverlayModelsResponse = {
  status: number;
  result: string;
  payload: OverlayModel[];
}

type appRequestPayload = {
	command?: string,
	id: string,
	fieldId: string,
	value: any,
	content: string,
}



/**
 * An example action class that displays a count that increments by one each time the button is pressed.
 */
@action({ UUID: "uno.overlays.v2.uno-control" })
export class UnoControl extends SingletonAction<ControlSettings> {
	private settings: ControlSettings = {
		baseUrl: "https://app.overlays.uno/apiv2/controlapps/",
		appToken: "",
		appPayload: undefined,
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


	/**
	 * The {@link SingletonAction.onWillAppear} event is useful for setting the visual representation of an action when it becomes visible. This could be due to the Stream Deck first
	 * starting up, or the user navigating between pages / folders etc.. There is also an inverse of this event in the form of {@link streamDeck.client.onWillDisappear}. In this example,
	 * we're setting the title to the "count" that is incremented in {@link UnoControl.onKeyDown}.
	 */
	override onWillAppear(ev: WillAppearEvent<ControlSettings>): void | Promise<void> {
		// should never happen, fallback code
		if (ev.action.controllerType !== 'Keypad') {
			return;
		}

	}

	/**
	 * Listens for the {@link SingletonAction.onKeyDown} event which is emitted by Stream Deck when an action is pressed. Stream Deck provides various events for tracking interaction
	 * with devices including key down/up, dial rotations, and device connectivity, etc. When triggered, {@link ev} object contains information about the event including any payloads
	 * and action information where applicable. In this example, our action will display a counter that increments by one each press. We track the current count on the action's persisted
	 * settings using `setSettings` and `getSettings`.
	 */
	override async onKeyDown(ev: KeyDownEvent<ControlSettings>): Promise<void> {
		console.log("Key down");
		if (ev.payload.settings === undefined || ev.payload.settings.appToken === "") {
			ev.action.showAlert();
			console.log("Empty token");
			return;
		}
		this.sendCommandToApp(ev, ev.payload.settings);
	}

	override onDidReceiveSettings?(ev: DidReceiveSettingsEvent): void | Promise<void> {
		console.log(`didReceiveSettings: settings = ${JSON.stringify(ev.payload.settings)}`);
		ev.action.setSettings(ev.payload.settings);
	}

	override async onSendToPlugin(ev: SendToPluginEvent<JsonValue, ControlSettings>): Promise<void> {
		console.log(`sendToPlugin: settings = ${JSON.stringify(ev.payload)}`);
	}

  sendCommandToApp(ev: KeyDownEvent<ControlSettings>, settings: ControlSettings): void {
		console.log(`[sendCommandToApp]: options = ${JSON.stringify(settings)}`);

    let payload: appRequestPayload = {
			command: "",
			id: "",
			fieldId: "",
			value: "",
			content: "",
		}

    let command: Entry = settings.appCommandObject;

    if (command !== undefined) {
      if ("arguments" in command && command.arguments !== undefined && command.arguments.length !== 0) {
        // this is a special case for the ChangeOverlayField an ChangeCustomizationField command
        if (command.command === "ChangeOverlayField") {
          payload.id = settings.appOverlayId || "";
          payload.fieldId = settings.appOverlayFieldId || "";

          let value = settings.appOverlayFieldOperationId || "";

          switch (settings.appOverlayFieldOperationId) {
            case "set":
              payload.command = "SetOverlayContentField";
              payload.value = value;
              break;
            case "numberIncrement":
              payload.command = "IncrementOverlayContentField";
              payload.value = value;
              break;
            case "numberDecrement":
              payload.command = "DecrementOverlayContentField";
              payload.value = value;
              break;
            case "checkboxToggle":
              payload.command = "ToggleOverlayContentField";
              break;
            case "timecontrolStart":
              payload.command = "ExecuteOverlayContentField";
              payload.value = "start";
              break;
            case "timecontrolPause":
              payload.command = "ExecuteOverlayContentField";
              payload.value = "pause";
              break;
            case "timecontrolReset":
              payload.command = "ExecuteOverlayContentField";
              payload.value = "reset";
              break;
            case "timecontrolPlay":
              payload.command = "ExecuteOverlayContentField";
              payload.value = "play";
              break;
            case "buttonClick":
              payload.command = "ExecuteOverlayContentField";
              payload.value = "execute";
              break;
          }
        } else if (command.command === "ChangeCustomizationField") {
          payload.fieldId = settings.appOverlayFieldId || "";

          let value = settings.appOverlayFieldOperationValue || "";

          switch (settings.appOverlayFieldOperationId) {
            case "set":
              payload.command = "SetCustomizationField";
              payload.value = value;
              break;
            case "numberIncrement":
              payload.command = "IncrementCustomizationField";
              payload.value = value;
              break;
            case "numberDecrement":
              payload.command = "DecrementCustomizationField";
              payload.value = value;
              break;
            case "checkboxToggle":
              payload.command = "ToggleCustomizationField";
              break;
            case "timecontrolStart":
              payload.command = "ExecuteCustomizationField";
              payload.value = "start";
              break;
            case "timecontrolPause":
              payload.command = "ExecuteCustomizationField";
              payload.value = "pause";
              break;
            case "timecontrolReset":
              payload.command = "ExecuteCustomizationField";
              payload.value = "reset";
              break;
            case "timecontrolPlay":
              payload.command = "ExecuteCustomizationField";
              payload.value = "play";
              break;
            case "buttonClick":
              payload.command = "ExecuteCustomizationField";
              payload.value = "execute";
              break;
          }
        } else {
          payload.command = command.command;
          command.arguments.forEach((item) => {
            switch (item.id) {
              case "value":
                payload.value = settings.appPayload || "";
                break;
              case "id":
                payload.id = settings.appOverlayId || "";
                break;
              case "content":
                {
                  let content: string = "";
                  try {
                    content = JSON.parse(settings.appPayload as string);
                  } catch (error) {
                    // error case, call propogate error here based on what is returned.
                    return;
                  }
                  payload.content = content;
                }
                break;
              default:
                payload.value = settings.appPayload || "";
                break;
            }
          });
        }
      } else {
        // we only have a command
        if ("command" in command) {payload.command = command.command;}
      }
    }

    const options = {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    const url =
      "https://app.overlays.uno/apiv2/controlapps/" +
      settings.appToken +
      "/api";

    fetch(url, options)
      .then((response) => {
        if (!response.ok) {
          throw new Error("HTTP error, status = " + response.status);
        }
        ev.action.showOk();
      })
      .catch((error) => {
				// Edit this later for more clarity on type of error message to show
				
        ev.action.showAlert();
      });
	}


}
