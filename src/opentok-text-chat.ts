import { OTError } from '@opentok/client';
import {
  AccCore,
  CommunicationEvents,
  LogVariation,
  ExtendedOTSession,
  OpenTokEvents
} from 'opentok-accelerator-core';
import OTKAnalytics from 'opentok-solutions-logging';
import { LogAction, TextChatEvents } from './enums';
import {
  OpenTokSignal,
  TextChatError,
  TextChatMessage,
  TextChatOptions
} from './models';

export default class TextChatAccPack {
  private accCore: AccCore;
  private analytics: OTKAnalytics;
  private session: ExtendedOTSession;

  private options: TextChatOptions;

  private composer: HTMLInputElement;
  private newMessages: HTMLElement;
  private characterCount: HTMLElement;
  private characterIcon: HTMLElement;

  private sender;
  private lastMessage?: TextChatMessage;
  private displayed: boolean;
  private enabled: boolean;
  private initialized: boolean;
  private controlAdded: boolean;
  private futureMessageNotice: boolean;
  private sentMessageHistory: TextChatMessage[] = [];
  private remoteParticipant: boolean;

  constructor(options: TextChatOptions) {
    // Validate provided options
    this.validateOptions(options);

    // Init the analytics logs
    this.initializeAnalytics();

    if (options.limitCharacterMessage) {
      this.log(LogAction.setMaxLength, LogVariation.success);
    }

    if (options.alwaysOpen) {
      this.initTextChat();
    }

    if (options.appendControl) {
      this.appendControl();
    }

    this.registerEvents();
    this.addEventListeners();
  }

  isDisplayed(): boolean {
    return this.displayed;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  showTextChat(): void {
    this.openTextChat();
  }

  hideTextChat(): void {
    this.closeTextChat();
  }

  deliverUnsentMessages(): void {
    this.sendUnsentMessages();
  }

  /** PRIVATE METHODS **/

  /**
   * Logs events with OTAnalytics
   * @param action Event to log
   * @param variation Data to log
   */
  private log(action, variation): void {
    const data = {
      action: action,
      variation: variation
    };
    this.analytics.logEvent(data);
  }

  /**
   * Triggers an event in the Accelerator Core
   * @param event Event triggered
   * @param data Payload to send with event
   */
  private triggerEvent(event: string, data?: unknown): void {
    this.accCore && this.accCore.triggerEvent(event, data);
  }

  /**
   * Sends a message to the session or optionally a specific recipient
   * @param message Text message to send
   * @param recipient OpenTok connection of a recipient
   */
  private async sendTextMessage(
    message: string,
    recipient?: OT.Connection
  ): Promise<void> {
    if (message && message.length > 0) {
      try {
        const sentMessage: TextChatMessage = await this.sendMessage(
          message,
          recipient
        );

        await this.handleMessageSent(sentMessage);
        if (this.futureMessageNotice) {
          this.futureMessageNotice = false;
        }
      } catch (error: unknown) {
        this.handleMessageError(error as TextChatError);
      }
    }
  }

  private initializeAnalytics(): void {
    // init the analytics logs
    const _source = window.location.href;

    const otAnalyticsData: Analytics.ConstructorConfig = {
      clientVersion: 'js-vsol-x.y.z', // x.y.z filled by npm build script
      source: _source,
      componentId: 'textChatAccPack',
      name: 'guidTextChatAccPack'
    };

    this.analytics = new OTKAnalytics(otAnalyticsData);

    const sessionInfo: Analytics.SessionInfo = {
      sessionId: this.session.sessionId,
      connectionId: this.session.connection.connectionId,
      partnerId: this.session.apiKey
    };

    this.analytics.addSessionInfo(sessionInfo);
  }

  private escapeHtml(text: string): string {
    const charactersMap = {
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;'
    };
    return (text || '').toString().replace(/[<>"']/gi, function (match) {
      return charactersMap[match];
    });
  }

  private renderUILayout(): string {
    return `
      <div class="ots-text-chat-container">
        <div class="ots-text-chat">
          <div class="ots-messages-header ots-hidden" id="chatHeader">
            <span>Chat with</span>
          </div>
          <div id="otsChatWrap">
            <div class="ots-messages-holder" id="messagesHolder">
              <div class="ots-messages-alert ots-hidden" id="messagesWaiting">
                ${this.escapeHtml(this.options.waitingMessage)}
              </div>
              <div class="ots-message-item ots-message-sent"></div>
            </div>
            <div class="ots-send-message-box">
              <input type="text" maxlength="${
                this.options.limitCharacterMessage
              }"
                class="ots-message-input" placeholder="Enter your message here" id="messageBox">
              <button class="ots-icon-check" id="sendMessage" type="submit"></button>
              <div class="ots-character-count">
                <span>
                  <span id="characterCount">0</span>/${
                    this.options.limitCharacterMessage
                  } characters
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>`;
  }

  private getBubbleHtml(
    message: TextChatMessage,
    isFailedMessage = false
  ): string {
    return `
      <div class="${this.escapeHtml(message.messageClass)}${
      isFailedMessage ? ' ots-message-failed' : ''
    }">
        <div class="ots-user-name-initial">
          ${this.escapeHtml(message.senderAlias[0])}
        </div>
        <div class="ots-item-timestamp">
          ${this.escapeHtml(message.senderAlias)},
          <span data-livestamp="${new Date(message.time)}"</span>
        </div>
        <div class="ots-item-text">
          <span>
            ${this.escapeHtml(message.message)}
          </span>
        </div>
      </div>
    `;
  }

  private setupUI(): void {
    // Add INITIALIZE success log event
    this.log(LogAction.initialize, LogVariation.attempt);

    const parent =
      document.querySelector(this.options.textChatContainer as string) ||
      document.body;

    const chatView = document.createElement('section');
    chatView.innerHTML = this.renderUILayout();

    this.composer = chatView.querySelector('#messageBox');
    this.newMessages = chatView.querySelector('#messagesHolder');
    this.characterCount = chatView.querySelector('#characterCount');
    this.characterIcon = chatView.querySelector('.ots-icon-check');

    this.composer.onkeyup = () => {
      const charLength = this.composer.getAttribute('value').length;
      this.characterCount.innerText = charLength.toString();
      if (charLength !== 0) {
        this.characterIcon.classList.add('active');
      } else {
        this.characterIcon.classList.remove('active');
      }
    };

    this.composer.onkeydown = (event) => {
      const isEnter = event.code === 'Enter';
      if (!event.shiftKey && isEnter) {
        event.preventDefault();
        this.sendTextMessage(this.composer.value);
      }
    };

    parent.appendChild(chatView);

    document.getElementById('sendMessage').onclick = () => {
      this.sendTextMessage(this.composer.value);
    };

    // Add INITIALIZE success log event
    this.log(LogAction.initialize, LogVariation.success);
  }

  private renderChatMessage(
    textChatMessage: TextChatMessage,
    isFailedMessage = false
  ): void {
    if (this.shouldAppendMessage(textChatMessage)) {
      const newMessage = `<span>${this.escapeHtml(
        textChatMessage.message
      )}</span>`;

      const _lastMessage = document.querySelector('ots-item-text:last-child');
      _lastMessage.innerHTML += newMessage;
    } else {
      textChatMessage.messageClass =
        this.sender.id === textChatMessage.senderId
          ? 'ots-message-item ots-message-sent'
          : 'ots-message-item';

      const view = this.getBubbleHtml(textChatMessage, isFailedMessage);
      this.newMessages.append(view);
    }

    this.newMessages.scrollTop = this.newMessages.scrollHeight;
  }

  private handleMessageSent(sentMessage: TextChatMessage): void {
    this.sentMessageHistory.push(sentMessage);
    this.cleanComposer();
    this.renderChatMessage(sentMessage);
    this.lastMessage = sentMessage;
    this.triggerEvent(TextChatEvents.MessageSent, sentMessage);
  }

  private shouldAppendMessage = (receivedMessage: TextChatMessage): boolean =>
    this.lastMessage && this.lastMessage.senderId === receivedMessage.senderId;

  private cleanComposer(): void {
    this.composer.value = '';
    this.characterCount.innerText = '0';
  }

  private handleMessageError(error: TextChatError): void {
    // Add an error message to the message view
    // that is standardized as far as classes
    this.renderChatMessage(error.textChatMessage, true);
    this.triggerEvent(TextChatEvents.ErrorSendingMessage, error);
  }

  private showWaitingMessage(): void {
    const el = document.getElementById('messagesWaiting');
    el && el.classList.remove('ots-hidden');
    const parent = document.getElementById('messagesHolder');
    parent && parent.classList.add('has-alert');
  }

  private hideWaitingMessage(): void {
    const el = document.getElementById('messagesWaiting');
    el && el.classList.add('ots-hidden');
    const parent = document.getElementById('messagesHolder');
    parent && parent.classList.add('has-alert');
  }

  private sendMessage = async (
    message: string,
    recipient?: OT.Connection
  ): Promise<TextChatMessage> => {
    const textChatMessage: TextChatMessage = new TextChatMessage(
      this.sender.id,
      this.sender.alias,
      null,
      message,
      Date.now().toString()
    );

    if (!this.remoteParticipant) {
      this.showWaitingMessage();
      return;
    } else {
      this.hideWaitingMessage();
    }

    // Add SEND_MESSAGE attempt log event
    this.log(LogAction.sendMessage, LogVariation.attempt);

    this.session.signal(
      {
        type: 'text-chat',
        data: JSON.stringify(textChatMessage),
        to: recipient
      },
      function (error: OTError) {
        if (error) {
          // Add SEND_MESSAGE failure log event
          this.log(LogAction.sendMessage, LogVariation.fail);
          const errorMessage = 'Error sending a message. ';

          throw new TextChatError(textChatMessage, errorMessage);
        }

        // Add SEND_MESSAGE success log event
        this.log(LogAction.sendMessage, LogVariation.success);
        return textChatMessage;
      }
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private onIncomingMessage(event: any): void {
    const signal = event.target as OpenTokSignal;
    const me = this.session.connection.connectionId;
    const from = signal.from.connectionId;
    if (from !== me) {
      this.log(LogAction.receiveMessage, LogVariation.attempt);
      const receivedTextChatMessage: TextChatMessage = JSON.parse(signal.data);
      this.renderChatMessage(receivedTextChatMessage);
      this.lastMessage = receivedTextChatMessage;

      this.log(LogAction.receiveMessage, LogVariation.success);

      this.triggerEvent(TextChatEvents.MessageReceived, signal);
    }
  }

  private sendUnsentMessages(): void {
    this.sentMessageHistory.forEach((message: TextChatMessage) => {
      this.sendMessage(message.message, message.recipient);
    });
    this.sentMessageHistory = [];
  }

  private openTextChat() {
    this.log(LogAction.open, LogVariation.attempt);
    document
      .querySelector(this.options.textChatContainer as string)
      .classList.remove('ots-hidden');
    this.displayed = true;
    this.triggerEvent(TextChatEvents.ShowTextChat);

    // Add OPEN success log event
    this.log(LogAction.open, LogVariation.success);
  }

  private initTextChat() {
    this.log(LogAction.start, LogVariation.attempt);
    this.enabled = true;
    this.displayed = true;
    this.initialized = true;
    this.setupUI();
    this.triggerEvent(TextChatEvents.ShowTextChat);
    this.session.on('signal:text-chat', this.onIncomingMessage);
    this.log(LogAction.start, LogVariation.success);
  }

  private closeTextChat() {
    this.log(LogAction.close, LogVariation.attempt);
    this.log(LogAction.end, LogVariation.attempt);
    document
      .querySelector(this.options.textChatContainer as string)
      .classList.add('ots-hidden');
    this.displayed = false;
    this.triggerEvent(TextChatEvents.HideTextChat);

    // Add CLOSE success log event
    this.log(LogAction.close, LogVariation.success);
    this.log(LogAction.end, LogVariation.success);
  }

  private registerEvents() {
    const events = Object.values(TextChatEvents);
    if (this.accCore) {
      this.accCore.registerEvents(events);
    }
  }

  private handleConnectionCreated(
    event: OT.Event<'connectionCreated', OT.Session> & {
      connection: OT.Connection;
    }
  ) {
    if (
      event &&
      event.connection.connectionId !== this.session.connection.connectionId
    ) {
      this.remoteParticipant = true;
      this.hideWaitingMessage();
    }
  }

  private handleStreamCreated(
    event?: OT.Event<'streamCreated', OT.Session> & { stream: OT.Stream }
  ) {
    if (
      event &&
      event.stream.connection.connectionId !==
        this.session.connection.connectionId
    ) {
      this.remoteParticipant = true;
      this.hideWaitingMessage();
    }
  }

  private handleStreamDestroyed() {
    if (this.session.streams.length < 2) {
      this.remoteParticipant = false;
    }
  }

  private appendControl() {
    const feedControls = document.querySelector(
      this.options.controlsContainer as string
    );

    const el = document.createElement('div');
    const enableTextChat = document.createElement('div');
    enableTextChat.classList.add(
      'ots-video-control',
      'circle',
      'text-chat',
      'enabled'
    );
    enableTextChat.id = 'enableTextChat';
    el.appendChild(enableTextChat);

    feedControls.appendChild(enableTextChat);

    this.controlAdded = true;

    enableTextChat.onclick = () => {
      if (!this.initialized) {
        this.initTextChat();
      } else if (!this.displayed) {
        this.openTextChat();
      } else {
        this.closeTextChat();
      }
    };
  }

  private uniqueString(length?: number): string {
    const len = length || 3;
    return Math.random().toString(36).substr(2, len);
  }

  private validateOptions(options: TextChatOptions): void {
    if (!options.session) {
      throw new Error(
        'Text Chat Accelerator Pack requires an OpenTok session.'
      );
    }

    this.session = options.session;
    this.accCore = options.core;

    /**
     * Create arbitrary values for sender id and alias if not received
     * in options hash.
     */
    this.sender = options.sender || {
      id: `${this.uniqueString()}${
        this.session.sessionId
      }${this.uniqueString()}`,
      alias: `User${this.uniqueString()}`
    };

    this.options = options;
  }

  private addEventListeners() {
    if (this.accCore) {
      this.accCore.on(OpenTokEvents.StreamCreated, this.handleStreamCreated);
      this.accCore.on(
        OpenTokEvents.StreamDestroyed,
        this.handleStreamDestroyed
      );

      this.accCore.on(CommunicationEvents.StartCall, function () {
        if (!this.options.alwaysOpen) {
          if (this.controlAdded) {
            document
              .querySelector('#enableTextChat')
              .classList.remove('ots-hidden');
          } else {
            this.options.appendControl && this.appendControl();
          }
        }
      });

      this.accCore.on(CommunicationEvents.EndCall, function () {
        if (!this.alwaysOpen) {
          document.getElementById('enableTextChat').classList.add('ots-hidden');
          if (this.displayed) {
            this.closeTextChat();
          }
        }
      });
    } else {
      this.session.on(OpenTokEvents.StreamCreated, this.handleStreamCreated);
      this.session.on(
        OpenTokEvents.StreamDestroyed,
        this.handleStreamDestroyed
      );
    }

    this.session.on('connectionCreated', this.handleConnectionCreated);

    /**
     * We need to check for remote participants in case we were the last party to join and
     * the session event fired before the text chat component was initialized.
     */
    this.handleStreamCreated();
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let window: any;
if (typeof window !== 'undefined') {
  window.TextChatAccPack = TextChatAccPack;
}
