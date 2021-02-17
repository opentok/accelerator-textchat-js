import {
  AccCore,
  ExtendedOTSession,
  StreamType
} from 'opentok-accelerator-core';
import { TextChatSender } from './TextChatSender';

export class TextChatOptions {
  constructor(
    public session: ExtendedOTSession,
    public core: AccCore,
    public controlsContainer: string | HTMLElement,
    public appendControl: boolean,
    public streamContainers: (
      pubSub: 'publisher' | 'subscriber',
      type: StreamType,
      data?: unknown,
      streamId?: string
    ) => string | Element,
    public sender: TextChatSender,
    public textChatContainer?: string | HTMLElement,
    public waitingMessage: string = 'Messages will be delivered once your contact arrives',
    public limitCharacterMessage: number = 160,
    public alwaysOpen?: boolean
  ) {}
}
