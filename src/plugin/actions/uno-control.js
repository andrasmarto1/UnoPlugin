var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
import { action, } from "@elgato/streamdeck";
import { SingletonAction } from "@elgato/streamdeck";
/**
 * An example action class that displays a count that increments by one each time the button is pressed.
 */
let UnoControl = (() => {
    let _classDecorators = [action({ UUID: "uno.overlays.v2.uno-control" })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = SingletonAction;
    var UnoControl = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            UnoControl = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        settings = {
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
        onWillAppear(ev) {
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
        async onKeyDown(ev) {
            console.log("Key down");
            if (ev.payload.settings === undefined || ev.payload.settings.appToken === "") {
                ev.action.showAlert();
                console.log("Empty token");
                return;
            }
            this.sendCommandToApp(ev, ev.payload.settings);
        }
        onDidReceiveSettings(ev) {
            console.log(`didReceiveSettings: settings = ${JSON.stringify(ev.payload.settings)}`);
            ev.action.setSettings(ev.payload.settings);
        }
        async onSendToPlugin(ev) {
            console.log(`sendToPlugin: settings = ${JSON.stringify(ev.payload)}`);
        }
        sendCommandToApp(ev, settings) {
            console.log(`[sendCommandToApp]: options = ${JSON.stringify(settings)}`);
            let payload = {
                command: "",
                id: "",
                fieldId: "",
                value: "",
                content: "",
            };
            let command = settings.appCommandObject;
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
                    }
                    else if (command.command === "ChangeCustomizationField") {
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
                    }
                    else {
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
                                        let content = "";
                                        try {
                                            content = JSON.parse(settings.appPayload);
                                        }
                                        catch (error) {
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
                }
                else {
                    // we only have a command
                    if ("command" in command) {
                        payload.command = command.command;
                    }
                }
            }
            const options = {
                method: "PUT",
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(payload),
            };
            const url = "https://app.overlays.uno/apiv2/controlapps/" +
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
    };
    return UnoControl = _classThis;
})();
export { UnoControl };
