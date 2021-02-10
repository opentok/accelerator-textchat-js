import { OTError } from '@opentok/client';
import { AccCore, LogVariation } from 'opentok-accelerator-core';
import OTKAnalytics from 'opentok-solutions-logging';
import { LogAction, TextChatEvents } from './enums';
import { OpenTokSignal, TextChatError, TextChatMessage, TextChatOptions } from './models';

export default class TextChatAccPack {
  private accCore: AccCore;
  private analytics: OTKAnalytics;
  private session: OT.Session;

  private waitingMessage: string;
  private limitCharacterMessage: number;
  private textChatContainer: string;

  private composer: HTMLInputElement;
  private newMessages: HTMLElement;
  private characterCount: HTMLElement;
  private characterIcon: HTMLElement;

  private sender;
  private lastMessage?: TextChatMessage;
  private futureMessageNotice: boolean = false;
  private sentMessageHistory: TextChatMessage[] = [];
  private remoteParticipant: boolean = false;

  constructor(options: TextChatOptions) {
    this.accCore = options.core;
    this.session = options.session;
    this.waitingMessage = options.waitingMessage;
    this.limitCharacterMessage = options.limitCharacterMessage;
    this.textChatContainer = options.textChatContainer;

    this.initializeAnalytics();
  }

  /**
   * Logs events with OTAnalytics
   * @param action Event to log
   * @param variation Data to log
   */
  log(action, variation): void {
    const data = {
      action: action,
      variation: variation
    };
    this.analytics.logEvent(data);
  };

  /**
   * Triggers an event in the Accelerator Core
   * @param event Event triggered
   * @param data Payload to send with event
   */
  triggerEvent(event: string, data: unknown): void {
    this.accCore && this.accCore.triggerEvent(event, data);
  };

  /**
   * Sends a message to the session or optionally a specific recipient
   * @param message Text message to send
   * @param recipient OpenTok connection of a recipient
   */
  async sendTextMessage(message: string, recipient?: OT.Connection): Promise<void> {
    if (message && message.length > 0) {

      try {
        const sentMessage: TextChatMessage = await this.sendMessage(message,recipient);

        await this.handleMessageSent(sentMessage);
        if (this.futureMessageNotice) {
          this.futureMessageNotice = false;
        }
      }
      catch (error: TextChatMessage) {
        this.handleMessageError(error);
      }
    }
  };

  /**** PRIVATE METHODS ****/

  private initializeAnalytics(): void {
    // init the analytics logs
    const _source = window.location.href;

    const otAnalyticsData: Analytics.ConstructorConfig = {
      clientVersion: _logEventData.clientVersion,
      source: _source,
      componentId: _logEventData.componentId,
      name: _logEventData.name
    };

    this.analytics = new OTKAnalytics(otAnalyticsData);

    const sessionInfo: Analytics.SessionInfo = {
      sessionId: this.session.sessionId,
      connectionId: this.session.connection.connectionId,
      partnerId: _session.apiKey
    };

    this.analytics.addSessionInfo(sessionInfo);
  };

  private escapeHtml (text: string): string {
    const charactersMap = {
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;'
    };
    return (text || '').toString().replace(/[<>"']/gi, function (match) {
      return charactersMap[match];
    });
  };

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
                ${this.escapeHtml(this.waitingMessage)}
              </div>
              <div class="ots-message-item ots-message-sent"></div>
            </div>
            <div class="ots-send-message-box">
              <input type="text" maxlength="${this.limitCharacterMessage}"
                class="ots-message-input" placeholder="Enter your message here" id="messageBox">
              <button class="ots-icon-check" id="sendMessage" type="submit"></button>
              <div class="ots-character-count">
                <span>
                  <span id="characterCount">0</span>/${this.limitCharacterMessage} characters
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>`;
  };

  private getBubbleHtml(message: TextChatMessage, isFailedMessage: boolean = false): string {
    return `
      <div class="${this.escapeHtml(message.messageClass)}${isFailedMessage ? ' ots-message-failed' : ''}">
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
  };

  private setupUI(): void {

    // Add INITIALIZE success log event
    this.log(LogAction.initialize, LogVariation.attempt);

    const parent =
      document.querySelector(this.textChatContainer) || document.body;

    const chatView = document.createElement('section');
    chatView.innerHTML = this.renderUILayout();

    this.composer = chatView.querySelector('#messageBox') ;
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
  };

  private renderChatMessage(textChatMessage: TextChatMessage, isFailedMessage: boolean = false): void {

    if (this.shouldAppendMessage(textChatMessage)) {
      const newMessage = `<span>${this.escapeHtml(textChatMessage.message)}</span>`;

      const _lastMessage = document.querySelector('ots-item-text:last-child');
      _lastMessage.innerHTML += newMessage;
    } else {
      textChatMessage.messageClass = (this.sender.id === textChatMessage.senderId
        ? 'ots-message-item ots-message-sent'
        : 'ots-message-item');

      const view = this.getBubbleHtml(textChatMessage, isFailedMessage);
      this.newMessages.append(view);
    }

    this.newMessages.scrollTop = this.newMessages.scrollHeight;
  };

  private handleMessageSent(sentMessage: TextChatMessage): void {

    this.sentMessageHistory.push(sentMessage);

    this.cleanComposer();

    this.renderChatMessage(sentMessage);
    this.lastMessage = sentMessage;

    this.triggerEvent(TextChatEvents.MessageSent, sentMessage);
  };

  private shouldAppendMessage = (receivedMessage: TextChatMessage): boolean =>
     this.lastMessage && this.lastMessage.senderId === receivedMessage.senderId;

  private cleanComposer(): void {
    this.composer.value = '';
    this.characterCount.innerText = '0';
  };

  private handleMessageError(error: TextChatError): void {
    // Add an error message to the message view
    // that is standardized as far as classes
    this.renderChatMessage(error.textChatMessage, true);
    this.triggerEvent(TextChatEvents.ErrorSendingMessage, error);
  };

  private showWaitingMessage(): void {
    const el = document.getElementById('messagesWaiting');
    el && el.classList.remove('ots-hidden');
    const parent = document.getElementById('messagesHolder');
    parent && parent.classList.add('has-alert');
  };

  private hideWaitingMessage(): void {
    const el = document.getElementById('messagesWaiting');
    el && el.classList.add('ots-hidden');
    const parent = document.getElementById('messagesHolder');
    parent && parent.classList.add('has-alert');
  };

  private sendMessage = async (message: string, recipient?: OT.Connection): Promise<TextChatMessage> => {

    const textChatMessage: TextChatMessage = new TextChatMessage(this.sender.id, this.sender.alias, null, message, Date.now().toString());

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
          let errorMessage = 'Error sending a message. ';

          throw(new TextChatError(textChatMessage, errorMessage));
        }

        // Add SEND_MESSAGE success log event
        this.log(LogAction.sendMessage, LogVariation.success);
        return textChatMessage;
      }
    );
  };

  private onIncomingMessage(signal: OpenTokSignal): void {

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

  private deliverUnsentMessages(): void {
    this.sentMessageHistory.forEach(function (message: TextChatMessage) {
      this.sendMessage(message.recipient, message.message);
    });
    this.sentMessageHistory = [];
  };

}

/* global OTKAnalytics define */
(function () {
  /** Include external dependencies */

  let _;
  let $;
  let OTKAnalytics;

  if (typeof module === 'object' && typeof module.exports === 'object') {
    /* eslint-disable import/no-unresolved */
    _ = require('underscore');
    $ = require('jquery');
    window.jQuery = $;
    window.moment = require('moment');
    require('kuende-livestamp');
    OTKAnalytics = ;
    /* eslint-enable import/no-unresolved */
  } else {
    _ = this._;
    $ = this.$;
    window.jQuery = $;
    window.moment = this.moment;
    OTKAnalytics = this.OTKAnalytics;
  }

  // Reference to instance of TextChatAccPack
  let _this;
  let _session;

  /** Analytics */
  let _otkanalytics;

  const _logEventData = {
    // vars for the analytics logs. Internal use
    componentId: 'textChatAccPack',
    name: 'guidTextChatAccPack',

    clientVersion: 'js-vsol-x.y.z', // x.y.z filled by npm build script
  };



  /** End Analytics */

  // State vars
  let _enabled = false;
  let _displayed = false;
  let _initialized = false;
  let _controlAdded = false;

  // Reference to Accelerator Pack Common Layer
  let _accPack;















  const _initTextChat = function () {
    _log(_logEventData.actionStart, _logEventData.variationAttempt);
    _enabled = true;
    _displayed = true;
    _initialized = true;
    _setupUI();
    _triggerEvent('showTextChat');
    _session.on('signal:text-chat', _handleTextChat);
    _log(_logEventData.actionStart, _logEventData.variationSuccess);
  };

  const _showTextChat = function () {
    _log(_logEventData.actionOpen, _logEventData.variationAttempt);
    document
      .querySelector(_this.options.textChatContainer)
      .classList.remove('ots-hidden');
    _displayed = true;
    _triggerEvent('showTextChat');

    // Add OPEN success log event
    _log(_logEventData.actionOpen, _logEventData.variationSuccess);
  };

  const _hideTextChat = function () {
    _log(_logEventData.actionClose, _logEventData.variationAttempt);
    _log(_logEventData.actionEnd, _logEventData.variationAttempt);
    document
      .querySelector(_this.options.textChatContainer)
      .classList.add('ots-hidden');
    _displayed = false;
    _triggerEvent('hideTextChat');

    // Add CLOSE success log event
    _log(_logEventData.actionClose, _logEventData.variationSuccess);
    _log(_logEventData.actionEnd, _logEventData.variationSuccess);
  };

  const _appendControl = function () {
    const feedControls = document.querySelector(
      _this.options.controlsContainer
    );

    const el = document.createElement('div');
    el.innerHTML =
      '<div class="ots-video-control circle text-chat enabled" id="enableTextChat"></div>';

    const enableTextChat = el.firstChild;
    feedControls.appendChild(enableTextChat);

    _controlAdded = true;

    enableTextChat.onclick = function () {
      if (!_initialized) {
        _initTextChat();
      } else if (!_displayed) {
        _showTextChat();
      } else {
        _hideTextChat();
      }
    };
  };

  const _validateOptions = function (options) {
    if (!options.session) {
      throw new Error(
        'Text Chat Accelerator Pack requires an OpenTok session.'
      );
    }

    // Generates a random alpha-numeric string of n length
    const uniqueString = function (length) {
      const len = length || 3;
      return Math.random().toString(36).substr(2, len);
    };

    // Returns session id prepended and appended with unique strings
    const generateUserId = function () {
      return [uniqueString(), _session.id, uniqueString()].join('');
    };

    _session = _.property('session')(options);
    _accPack = _.property('accPack')(options);

    /**
     * Create arbitary values for sender id and alias if not recieved
     * in options hash.
     */
    _sender = _.defaults(options.sender || {}, {
      id: generateUserId(),
      alias: ['User', uniqueString()].join(' ')
    });

    return _.defaults(_.omit(options, ['accPack', '_sender']), {
      limitCharacterMessage: 160,
      controlsContainer: '#feedControls',
      textChatContainer: '#chatContainer',
      alwaysOpen: false,
      appendControl: true
    });
  };

  const _registerEvents = function () {
    const events = [
      'showTextChat',
      'hideTextChat',
      'messageSent',
      'errorSendingMessage',
      'messageReceived'
    ];
    _accPack && _accPack.registerEvents(events);
  };

  const _handleConnectionCreated = function (event) {
    if (
      event &&
      event.connection.connectionId !== _session.connection.connectionId
    ) {
      _remoteParticipant = true;
      _hideWaitingMessage();
    }
  };

  const _handleStreamCreated = function (event) {
    if (
      event &&
      event.stream.connection.connectionId !== _session.connection.connectionId
    ) {
      _remoteParticipant = true;
      _hideWaitingMessage();
    }
  };

  const _handleStreamDestroyed = function () {
    if (_session.streams.length() < 2) {
      _remoteParticipant = false;
    }
  };

  const _addEventListeners = function () {
    if (_accPack) {
      _accPack.registerEventListener('streamCreated', _handleStreamCreated);
      _accPack.registerEventListener('streamDestroyed', _handleStreamDestroyed);

      _accPack.registerEventListener('startCall', function () {
        if (!_this.options.alwaysOpen) {
          if (_controlAdded) {
            document
              .querySelector('#enableTextChat')
              .classList.remove('ots-hidden');
          } else {
            _this.options.appendControl && _appendControl();
          }
        }
      });

      _accPack.registerEventListener('endCall', function () {
        if (!_this.options.alwaysOpen) {
          document.getElementById('enableTextChat').classList.add('ots-hidden');
          if (_displayed) {
            _hideTextChat();
          }
        }
      });
    } else {
      _session.on('streamCreated', _handleStreamCreated);
      _session.on('streamDestroyed', _handleStreamDestroyed);
    }

    _session.on('connectionCreated', _handleConnectionCreated);

    /**
     * We need to check for remote participants in case we were the last party to join and
     * the session event fired before the text chat component was initialized.
     */
    _handleStreamCreated();
  };

  // Constructor
  const TextChatAccPack = function (options) {
    // Save a reference to this
    _this = this;

    // Extend instance and set private vars
    _this.options = _validateOptions(options);

    // Init the analytics logs
    _logAnalytics();

    if (_.property('_this.options.limitCharacterMessage')(options)) {
      _log(_logEventData.actionSetMaxLength, _logEventData.variationSuccess);
    }

    if (_this.options.alwaysOpen) {
      _initTextChat();
    }

    if (_this.options.appendControl) {
      _appendControl();
    }

    _registerEvents();
    _addEventListeners();
  };

  TextChatAccPack.prototype = {
    constructor: TextChatAccPack,
    isEnabled: function () {
      return _enabled;
    },
    isDisplayed: function () {
      return _displayed;
    },
    showTextChat: function () {
      _showTextChat();
    },
    hideTextChat: function () {
      _hideTextChat();
    },
    deliverUnsentMessages: function () {
      _deliverUnsentMessages();
    }
  };

  if (typeof exports === 'object') {
    module.exports = TextChatAccPack;
  } else if (typeof define === 'function' && define.amd) {
    define(function () {
      return TextChatAccPack;
    });
  } else {
    this.TextChatAccPack = TextChatAccPack;
  }
}.call(this));
