"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var opentok_accelerator_core_1 = require("opentok-accelerator-core");
var opentok_solutions_logging_1 = __importDefault(require("opentok-solutions-logging"));
var enums_1 = require("./enums");
var models_1 = require("./models");
var TextChatAccPack = /** @class */ (function () {
    function TextChatAccPack(options) {
        var _this = this;
        this.sentMessageHistory = [];
        this.shouldAppendMessage = function (receivedMessage) {
            return _this.lastMessage && _this.lastMessage.senderId === receivedMessage.senderId;
        };
        this.sendMessage = function (message, recipient) { return __awaiter(_this, void 0, void 0, function () {
            var textChatMessage;
            return __generator(this, function (_a) {
                textChatMessage = new models_1.TextChatMessage(this.sender.id, this.sender.alias, null, message, Date.now().toString());
                if (!this.remoteParticipant) {
                    this.showWaitingMessage();
                    return [2 /*return*/];
                }
                else {
                    this.hideWaitingMessage();
                }
                // Add SEND_MESSAGE attempt log event
                this.log(enums_1.LogAction.sendMessage, opentok_accelerator_core_1.LogVariation.attempt);
                this.session.signal({
                    type: 'text-chat',
                    data: JSON.stringify(textChatMessage),
                    to: recipient
                }, function (error) {
                    if (error) {
                        // Add SEND_MESSAGE failure log event
                        this.log(enums_1.LogAction.sendMessage, opentok_accelerator_core_1.LogVariation.fail);
                        var errorMessage = 'Error sending a message. ';
                        throw new models_1.TextChatError(textChatMessage, errorMessage);
                    }
                    // Add SEND_MESSAGE success log event
                    this.log(enums_1.LogAction.sendMessage, opentok_accelerator_core_1.LogVariation.success);
                    return textChatMessage;
                });
                return [2 /*return*/];
            });
        }); };
        // Validate provided options
        this.validateOptions(options);
        // Init the analytics logs
        this.initializeAnalytics();
        if (options.limitCharacterMessage) {
            this.log(enums_1.LogAction.setMaxLength, opentok_accelerator_core_1.LogVariation.success);
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
    TextChatAccPack.prototype.isDisplayed = function () {
        return this.displayed;
    };
    TextChatAccPack.prototype.isEnabled = function () {
        return this.enabled;
    };
    TextChatAccPack.prototype.showTextChat = function () {
        this.openTextChat();
    };
    TextChatAccPack.prototype.hideTextChat = function () {
        this.closeTextChat();
    };
    TextChatAccPack.prototype.deliverUnsentMessages = function () {
        this.sendUnsentMessages();
    };
    /** PRIVATE METHODS **/
    /**
     * Logs events with OTAnalytics
     * @param action Event to log
     * @param variation Data to log
     */
    TextChatAccPack.prototype.log = function (action, variation) {
        var data = {
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
    TextChatAccPack.prototype.triggerEvent = function (event, data) {
        this.accCore && this.accCore.triggerEvent(event, data);
    };
    /**
     * Sends a message to the session or optionally a specific recipient
     * @param message Text message to send
     * @param recipient OpenTok connection of a recipient
     */
    TextChatAccPack.prototype.sendTextMessage = function (message, recipient) {
        return __awaiter(this, void 0, void 0, function () {
            var sentMessage, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(message && message.length > 0)) return [3 /*break*/, 5];
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, this.sendMessage(message, recipient)];
                    case 2:
                        sentMessage = _a.sent();
                        return [4 /*yield*/, this.handleMessageSent(sentMessage)];
                    case 3:
                        _a.sent();
                        if (this.futureMessageNotice) {
                            this.futureMessageNotice = false;
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        this.handleMessageError(error_1);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    TextChatAccPack.prototype.initializeAnalytics = function () {
        // init the analytics logs
        var _source = window.location.href;
        var otAnalyticsData = {
            clientVersion: 'js-vsol-x.y.z',
            source: _source,
            componentId: 'textChatAccPack',
            name: 'guidTextChatAccPack'
        };
        this.analytics = new opentok_solutions_logging_1.default(otAnalyticsData);
        var sessionInfo = {
            sessionId: this.session.sessionId,
            connectionId: this.session.connection.connectionId,
            partnerId: this.session.apiKey
        };
        this.analytics.addSessionInfo(sessionInfo);
    };
    TextChatAccPack.prototype.escapeHtml = function (text) {
        var charactersMap = {
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#x27;'
        };
        return (text || '').toString().replace(/[<>"']/gi, function (match) {
            return charactersMap[match];
        });
    };
    TextChatAccPack.prototype.renderUILayout = function () {
        return "\n      <div class=\"ots-text-chat-container\">\n        <div class=\"ots-text-chat\">\n          <div class=\"ots-messages-header ots-hidden\" id=\"chatHeader\">\n            <span>Chat with</span>\n          </div>\n          <div id=\"otsChatWrap\">\n            <div class=\"ots-messages-holder\" id=\"messagesHolder\">\n              <div class=\"ots-messages-alert ots-hidden\" id=\"messagesWaiting\">\n                " + this.escapeHtml(this.options.waitingMessage) + "\n              </div>\n              <div class=\"ots-message-item ots-message-sent\"></div>\n            </div>\n            <div class=\"ots-send-message-box\">\n              <input type=\"text\" maxlength=\"" + this.options.limitCharacterMessage + "\"\n                class=\"ots-message-input\" placeholder=\"Enter your message here\" id=\"messageBox\">\n              <button class=\"ots-icon-check\" id=\"sendMessage\" type=\"submit\"></button>\n              <div class=\"ots-character-count\">\n                <span>\n                  <span id=\"characterCount\">0</span>/" + this.options.limitCharacterMessage + " characters\n                </span>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>";
    };
    TextChatAccPack.prototype.getBubbleHtml = function (message, isFailedMessage) {
        if (isFailedMessage === void 0) { isFailedMessage = false; }
        return "\n      <div class=\"" + this.escapeHtml(message.messageClass) + (isFailedMessage ? ' ots-message-failed' : '') + "\">\n        <div class=\"ots-user-name-initial\">\n          " + this.escapeHtml(message.senderAlias[0]) + "\n        </div>\n        <div class=\"ots-item-timestamp\">\n          " + this.escapeHtml(message.senderAlias) + ",\n          <span data-livestamp=\"" + new Date(message.time) + "\"</span>\n        </div>\n        <div class=\"ots-item-text\">\n          <span>\n            " + this.escapeHtml(message.message) + "\n          </span>\n        </div>\n      </div>\n    ";
    };
    TextChatAccPack.prototype.setupUI = function () {
        var _this = this;
        // Add INITIALIZE success log event
        this.log(enums_1.LogAction.initialize, opentok_accelerator_core_1.LogVariation.attempt);
        var parent = document.querySelector(this.options.textChatContainer) ||
            document.body;
        var chatView = document.createElement('section');
        chatView.innerHTML = this.renderUILayout();
        this.composer = chatView.querySelector('#messageBox');
        this.newMessages = chatView.querySelector('#messagesHolder');
        this.characterCount = chatView.querySelector('#characterCount');
        this.characterIcon = chatView.querySelector('.ots-icon-check');
        this.composer.onkeyup = function () {
            var charLength = _this.composer.getAttribute('value').length;
            _this.characterCount.innerText = charLength.toString();
            if (charLength !== 0) {
                _this.characterIcon.classList.add('active');
            }
            else {
                _this.characterIcon.classList.remove('active');
            }
        };
        this.composer.onkeydown = function (event) {
            var isEnter = event.code === 'Enter';
            if (!event.shiftKey && isEnter) {
                event.preventDefault();
                _this.sendTextMessage(_this.composer.value);
            }
        };
        parent.appendChild(chatView);
        document.getElementById('sendMessage').onclick = function () {
            _this.sendTextMessage(_this.composer.value);
        };
        // Add INITIALIZE success log event
        this.log(enums_1.LogAction.initialize, opentok_accelerator_core_1.LogVariation.success);
    };
    TextChatAccPack.prototype.renderChatMessage = function (textChatMessage, isFailedMessage) {
        if (isFailedMessage === void 0) { isFailedMessage = false; }
        if (this.shouldAppendMessage(textChatMessage)) {
            var newMessage = "<span>" + this.escapeHtml(textChatMessage.message) + "</span>";
            var _lastMessage = document.querySelector('ots-item-text:last-child');
            _lastMessage.innerHTML += newMessage;
        }
        else {
            textChatMessage.messageClass =
                this.sender.id === textChatMessage.senderId
                    ? 'ots-message-item ots-message-sent'
                    : 'ots-message-item';
            var view = this.getBubbleHtml(textChatMessage, isFailedMessage);
            this.newMessages.append(view);
        }
        this.newMessages.scrollTop = this.newMessages.scrollHeight;
    };
    TextChatAccPack.prototype.handleMessageSent = function (sentMessage) {
        this.sentMessageHistory.push(sentMessage);
        this.cleanComposer();
        this.renderChatMessage(sentMessage);
        this.lastMessage = sentMessage;
        this.triggerEvent(enums_1.TextChatEvents.MessageSent, sentMessage);
    };
    TextChatAccPack.prototype.cleanComposer = function () {
        this.composer.value = '';
        this.characterCount.innerText = '0';
    };
    TextChatAccPack.prototype.handleMessageError = function (error) {
        // Add an error message to the message view
        // that is standardized as far as classes
        this.renderChatMessage(error.textChatMessage, true);
        this.triggerEvent(enums_1.TextChatEvents.ErrorSendingMessage, error);
    };
    TextChatAccPack.prototype.showWaitingMessage = function () {
        var el = document.getElementById('messagesWaiting');
        el && el.classList.remove('ots-hidden');
        var parent = document.getElementById('messagesHolder');
        parent && parent.classList.add('has-alert');
    };
    TextChatAccPack.prototype.hideWaitingMessage = function () {
        var el = document.getElementById('messagesWaiting');
        el && el.classList.add('ots-hidden');
        var parent = document.getElementById('messagesHolder');
        parent && parent.classList.add('has-alert');
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    TextChatAccPack.prototype.onIncomingMessage = function (event) {
        var signal = event.target;
        var me = this.session.connection.connectionId;
        var from = signal.from.connectionId;
        if (from !== me) {
            this.log(enums_1.LogAction.receiveMessage, opentok_accelerator_core_1.LogVariation.attempt);
            var receivedTextChatMessage = JSON.parse(signal.data);
            this.renderChatMessage(receivedTextChatMessage);
            this.lastMessage = receivedTextChatMessage;
            this.log(enums_1.LogAction.receiveMessage, opentok_accelerator_core_1.LogVariation.success);
            this.triggerEvent(enums_1.TextChatEvents.MessageReceived, signal);
        }
    };
    TextChatAccPack.prototype.sendUnsentMessages = function () {
        var _this = this;
        this.sentMessageHistory.forEach(function (message) {
            _this.sendMessage(message.message, message.recipient);
        });
        this.sentMessageHistory = [];
    };
    TextChatAccPack.prototype.openTextChat = function () {
        this.log(enums_1.LogAction.open, opentok_accelerator_core_1.LogVariation.attempt);
        document
            .querySelector(this.options.textChatContainer)
            .classList.remove('ots-hidden');
        this.displayed = true;
        this.triggerEvent(enums_1.TextChatEvents.ShowTextChat);
        // Add OPEN success log event
        this.log(enums_1.LogAction.open, opentok_accelerator_core_1.LogVariation.success);
    };
    TextChatAccPack.prototype.initTextChat = function () {
        this.log(enums_1.LogAction.start, opentok_accelerator_core_1.LogVariation.attempt);
        this.enabled = true;
        this.displayed = true;
        this.initialized = true;
        this.setupUI();
        this.triggerEvent(enums_1.TextChatEvents.ShowTextChat);
        this.session.on('signal:text-chat', this.onIncomingMessage);
        this.log(enums_1.LogAction.start, opentok_accelerator_core_1.LogVariation.success);
    };
    TextChatAccPack.prototype.closeTextChat = function () {
        this.log(enums_1.LogAction.close, opentok_accelerator_core_1.LogVariation.attempt);
        this.log(enums_1.LogAction.end, opentok_accelerator_core_1.LogVariation.attempt);
        document
            .querySelector(this.options.textChatContainer)
            .classList.add('ots-hidden');
        this.displayed = false;
        this.triggerEvent(enums_1.TextChatEvents.HideTextChat);
        // Add CLOSE success log event
        this.log(enums_1.LogAction.close, opentok_accelerator_core_1.LogVariation.success);
        this.log(enums_1.LogAction.end, opentok_accelerator_core_1.LogVariation.success);
    };
    TextChatAccPack.prototype.registerEvents = function () {
        var events = Object.values(enums_1.TextChatEvents);
        if (this.accCore) {
            this.accCore.registerEvents(events);
        }
    };
    TextChatAccPack.prototype.handleConnectionCreated = function (event) {
        if (event &&
            event.connection.connectionId !== this.session.connection.connectionId) {
            this.remoteParticipant = true;
            this.hideWaitingMessage();
        }
    };
    TextChatAccPack.prototype.handleStreamCreated = function (event) {
        if (event &&
            event.stream.connection.connectionId !==
                this.session.connection.connectionId) {
            this.remoteParticipant = true;
            this.hideWaitingMessage();
        }
    };
    TextChatAccPack.prototype.handleStreamDestroyed = function () {
        if (this.session.streams.length < 2) {
            this.remoteParticipant = false;
        }
    };
    TextChatAccPack.prototype.appendControl = function () {
        var _this = this;
        var feedControls = document.querySelector(this.options.controlsContainer);
        var el = document.createElement('div');
        var enableTextChat = document.createElement('div');
        enableTextChat.classList.add('ots-video-control', 'circle', 'text-chat', 'enabled');
        enableTextChat.id = 'enableTextChat';
        el.appendChild(enableTextChat);
        feedControls.appendChild(enableTextChat);
        this.controlAdded = true;
        enableTextChat.onclick = function () {
            if (!_this.initialized) {
                _this.initTextChat();
            }
            else if (!_this.displayed) {
                _this.openTextChat();
            }
            else {
                _this.closeTextChat();
            }
        };
    };
    TextChatAccPack.prototype.uniqueString = function (length) {
        var len = length || 3;
        return Math.random().toString(36).substr(2, len);
    };
    TextChatAccPack.prototype.validateOptions = function (options) {
        if (!options.session) {
            throw new Error('Text Chat Accelerator Pack requires an OpenTok session.');
        }
        this.session = options.session;
        this.accCore = options.core;
        /**
         * Create arbitrary values for sender id and alias if not received
         * in options hash.
         */
        this.sender = options.sender || {
            id: "" + this.uniqueString() + this.session.sessionId + this.uniqueString(),
            alias: "User" + this.uniqueString()
        };
        this.options = options;
    };
    TextChatAccPack.prototype.addEventListeners = function () {
        if (this.accCore) {
            this.accCore.on(opentok_accelerator_core_1.OpenTokEvents.StreamCreated, this.handleStreamCreated);
            this.accCore.on(opentok_accelerator_core_1.OpenTokEvents.StreamDestroyed, this.handleStreamDestroyed);
            this.accCore.on(opentok_accelerator_core_1.CommunicationEvents.StartCall, function () {
                if (!this.options.alwaysOpen) {
                    if (this.controlAdded) {
                        document
                            .querySelector('#enableTextChat')
                            .classList.remove('ots-hidden');
                    }
                    else {
                        this.options.appendControl && this.appendControl();
                    }
                }
            });
            this.accCore.on(opentok_accelerator_core_1.CommunicationEvents.EndCall, function () {
                if (!this.alwaysOpen) {
                    document.getElementById('enableTextChat').classList.add('ots-hidden');
                    if (this.displayed) {
                        this.closeTextChat();
                    }
                }
            });
        }
        else {
            this.session.on(opentok_accelerator_core_1.OpenTokEvents.StreamCreated, this.handleStreamCreated);
            this.session.on(opentok_accelerator_core_1.OpenTokEvents.StreamDestroyed, this.handleStreamDestroyed);
        }
        this.session.on('connectionCreated', this.handleConnectionCreated);
        /**
         * We need to check for remote participants in case we were the last party to join and
         * the session event fired before the text chat component was initialized.
         */
        this.handleStreamCreated();
    };
    return TextChatAccPack;
}());
exports.default = TextChatAccPack;
if (typeof window !== 'undefined') {
    window.TextChatAccPack = TextChatAccPack;
}
//# sourceMappingURL=opentok-text-chat.js.map