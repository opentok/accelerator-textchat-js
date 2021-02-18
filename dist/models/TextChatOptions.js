"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextChatOptions = void 0;
var TextChatOptions = /** @class */ (function () {
    function TextChatOptions(session, core, controlsContainer, appendControl, streamContainers, sender, textChatContainer, waitingMessage, limitCharacterMessage, alwaysOpen) {
        if (waitingMessage === void 0) { waitingMessage = 'Messages will be delivered once your contact arrives'; }
        if (limitCharacterMessage === void 0) { limitCharacterMessage = 160; }
        this.session = session;
        this.core = core;
        this.controlsContainer = controlsContainer;
        this.appendControl = appendControl;
        this.streamContainers = streamContainers;
        this.sender = sender;
        this.textChatContainer = textChatContainer;
        this.waitingMessage = waitingMessage;
        this.limitCharacterMessage = limitCharacterMessage;
        this.alwaysOpen = alwaysOpen;
    }
    return TextChatOptions;
}());
exports.TextChatOptions = TextChatOptions;
//# sourceMappingURL=TextChatOptions.js.map