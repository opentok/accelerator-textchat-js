import { TextChatOptions } from './models';
export default class TextChatAccPack {
    private accCore;
    private analytics;
    private session;
    private options;
    private composer;
    private newMessages;
    private characterCount;
    private characterIcon;
    private sender;
    private lastMessage?;
    private displayed;
    private enabled;
    private initialized;
    private controlAdded;
    private futureMessageNotice;
    private sentMessageHistory;
    private remoteParticipant;
    constructor(options: TextChatOptions);
    isDisplayed(): boolean;
    isEnabled(): boolean;
    showTextChat(): void;
    hideTextChat(): void;
    deliverUnsentMessages(): void;
    /** PRIVATE METHODS **/
    /**
     * Logs events with OTAnalytics
     * @param action Event to log
     * @param variation Data to log
     */
    private log;
    /**
     * Triggers an event in the Accelerator Core
     * @param event Event triggered
     * @param data Payload to send with event
     */
    private triggerEvent;
    /**
     * Sends a message to the session or optionally a specific recipient
     * @param message Text message to send
     * @param recipient OpenTok connection of a recipient
     */
    private sendTextMessage;
    private initializeAnalytics;
    private escapeHtml;
    private renderUILayout;
    private getBubbleHtml;
    private setupUI;
    private renderChatMessage;
    private handleMessageSent;
    private shouldAppendMessage;
    private cleanComposer;
    private handleMessageError;
    private showWaitingMessage;
    private hideWaitingMessage;
    private sendMessage;
    private onIncomingMessage;
    private sendUnsentMessages;
    private openTextChat;
    private initTextChat;
    private closeTextChat;
    private registerEvents;
    private handleConnectionCreated;
    private handleStreamCreated;
    private handleStreamDestroyed;
    private appendControl;
    private uniqueString;
    private validateOptions;
    private addEventListeners;
}
