import { AccCore, ExtendedOTSession, StreamType } from 'opentok-accelerator-core';
import { TextChatSender } from './TextChatSender';
export declare class TextChatOptions {
    session: ExtendedOTSession;
    core: AccCore;
    controlsContainer: string | HTMLElement;
    appendControl: boolean;
    streamContainers: (pubSub: 'publisher' | 'subscriber', type: StreamType, data?: unknown, streamId?: string) => string | Element;
    sender: TextChatSender;
    textChatContainer?: string | HTMLElement;
    waitingMessage: string;
    limitCharacterMessage: number;
    alwaysOpen?: boolean;
    constructor(session: ExtendedOTSession, core: AccCore, controlsContainer: string | HTMLElement, appendControl: boolean, streamContainers: (pubSub: 'publisher' | 'subscriber', type: StreamType, data?: unknown, streamId?: string) => string | Element, sender: TextChatSender, textChatContainer?: string | HTMLElement, waitingMessage?: string, limitCharacterMessage?: number, alwaysOpen?: boolean);
}
