export declare class TextChatMessage {
    senderId: string;
    senderAlias: string;
    messageClass: string;
    message: string;
    time: string;
    recipient?: OT.Connection;
    constructor(senderId: string, senderAlias: string, messageClass: string, message: string, time: string, recipient?: OT.Connection);
}
