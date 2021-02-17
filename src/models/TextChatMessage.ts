export class TextChatMessage {
  constructor(
    public senderId: string,
    public senderAlias: string,
    public messageClass: string,
    public message: string,
    public time: string,
    public recipient?: OT.Connection
  ) {}
}
