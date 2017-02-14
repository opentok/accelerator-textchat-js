![logo](tokbox-logo.png)

[![Build Status](https://travis-ci.org/opentok/accelerator-text-chat-js.svg?branch=master)](https://travis-ci.org/opentok/accelerator-text-chat-js)
[![GitHub release](https://img.shields.io/github/release/qubyte/rubidium.svg)](./README.md)
[![license MIT](https://img.shields.io/github/license/mashape/apistatus.svg)](./.github/LICENSE)
[![npm](https://img.shields.io/npm/v/npm.svg)](https://www.npmjs.com/package/opentok-text-chat)

-----

# Accelerator TextChat for Javascript<br/>

## Quick start

The OpenTok Text Chat Accelerator Pack provides functionality you can add to your OpenTok applications that enables users to exchange text messages between mobile or browser-based devices.

This section shows you how to use the accelerator pack.

## Install

```bash
$ npm install --save opentok-text-chat
```

If using browserify or webpack:

```javascript
const textChat = require('opentok-text-chat');
```

Otherwise, include the accelerator pack in your html:

```html
<script src="../your/path/to/opentok-text-chat.js"></script>
```
 . . . and it will be available in global scope as `TextChatAccPack`

-----------------

Click [here](https://www.npmjs.com/search?q=opentok-acc-pack) for a list of all OpenTok accelerator packs.


## Exploring the code

The `TextChatAccPack` class in text-chat-acc-pack.js is the backbone of the text chat communication features for the app.

This class sets up the text chat UI views and events, and provides functions for sending, receiving, and rendering individual chat messages.

### Initialization

The following `options` fields are used in the `TextChatAccPack` constructor:<br/>

| Feature        | Field  |
| ------------- | ------------- |
| Set the session. | `session`  |
| Set the id and name for the user. | `sender`  |
| Set the chat container. | `textChatContainer`  |
| Sets the position of the element that displays the information for the character count within the UI. | `controlsContainer`  |
| Set the maximum message length. | `limitCharacterMessage`  |
| Set the sender alias and the sender ID of the outgoing messages. | `sender`  |
| Set the text chat container to automatically be displayed. | `alwaysOpen`  |
| Custom message to display while waiting for other users to join. | `waitingMessage`  |


If you're using a bundler like webpack or Browserify, you can install the the text chat component with [npm](https://www.npmjs.com/package/opentok-text-chat), and import into your application:

  ```javascript
  const TextChatAccPack = require('opentok-text-chat');
  const textChat = new TextChatAccPack(options);
  ```


Otherwise, the package will need to be in `global` scope to be initialized:

  ```javascript
  const textChatOptions = {
   session: session,
   sender: {
     id: 'myCustomIdentifier',
     alias: 'David',
   },
   limitCharacterMessage: 160,
   controlsContainer: '#feedControls',
   textChatContainer: '#chatContainer',
   alwaysOpen: true
 };

 const textChat = new TextChatAccPack(textChatOptions);
  ```


### TextChatAccPack Methods

The `TextChat` component defines the following methods:

| Method        | Description  |
| ------------- | ------------- |
| `showTextChat()` | Show the text chat view.  |
| `hideTextChat()` | Hide the text chat view.  |
| `isDisplayed()` | Determines if the text chat accelerator pack is displayed.  |
| `isEnabled()` | Determines if the text chat accelerator pack is enabled.  |
| `deliverUnsentMessages()` | Deliver all prior messages to new participants.  |


For example, this line determines whether the text chat accelerator pack is displayed:

  ```javascript
  const displayed = textChat.isDisplayed();
  ```

### Events

The `TextChat` component emits the following events:

| Method        | Description  |
| ------------- | ------------- |
| `messageReceived ` | A new message has been received.  |
| `messageSent ` | A new message has been sent.  |
| `errorSendingMessage ` | An error occurred when sending a message.  |


The following code shows how to subscribe to these events using [opentok-accelerator-core](https://github.com/opentok/accelerator-core-js):

```javascript
otCore.on('messageReceived', event =>  . . .)
otCore.on('messageSent', event =>  . . .)
otCore.on('errorSendingMessage', error =>  . . .)
```

####*One-to-one sample app using the Accelerator TextChat with best-practices for Javascript is available [here](https://github.com/opentok/one-to-one-textchat-sample-apps).*
