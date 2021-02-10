import { TextChatMessage } from './TextChatMessage';

export class TextChatError extends Error {
  constructor(public textChatMessage: TextChatMessage, public message: string) {
    super(message);
  }
}
