import streamDeck, { LogLevel } from "@elgato/streamdeck";
import { UnoControl } from "./actions/uno-control";
import { UnoControlDial } from "./actions/uno-control-dial";
// We can enable "trace" logging so that all messages between the Stream Deck, and the plugin are recorded. When storing sensitive information
streamDeck.logger.setLevel(LogLevel.TRACE);
// Register the UnoControl and UnoDial actions
streamDeck.actions.registerAction(new UnoControl());
streamDeck.actions.registerAction(new UnoControlDial());
// Finally, connect to the Stream Deck.
streamDeck.connect();
