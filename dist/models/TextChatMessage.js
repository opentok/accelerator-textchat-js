"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextChatMessage = void 0;
var TextChatMessage = /** @class */ (function () {
    function TextChatMessage(senderId, senderAlias, messageClass, message, time, recipient) {
        this.senderId = senderId;
        this.senderAlias = senderAlias;
        this.messageClass = messageClass;
        this.message = message;
        this.time = time;
        this.recipient = recipient;
    }
    return TextChatMessage;
}());
exports.TextChatMessage = TextChatMessage;
//# sourceMappingURL=TextChatMessage.js.map