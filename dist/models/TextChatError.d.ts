import { TextChatMessage } from './TextChatMessage';
export declare class TextChatError extends Error {
    textChatMessage: TextChatMessage;
    message: string;
    constructor(textChatMessage: TextChatMessage, message: string);
}
