# OpenTok Accelerator TextChat for JavaScript

[![Build Status](https://travis-ci.org/opentok/accelerator-textchat-js.svg?branch=main)](https://travis-ci.org/opentok/accelerator-textchat-js) 
[![npm](https://img.shields.io/npm/v/opentok-text-chat.svg)](https://www.npmjs.com/package/opentok-text-chat) 
[![license MIT](https://img.shields.io/github/license/opentok/accelerator-textchat-js.svg)](./.github/LICENSE)

<img src="https://assets.tokbox.com/img/vonage/Vonage_VideoAPI_black.svg" height="48px" alt="Tokbox is now known as Vonage" />

The OpenTok Text Chat Accelerator Pack for JavaScript provides functionality you can add to your OpenTok applications that enables users to exchange text messages between mobile or browser-based devices.

## Quick start

This section shows you how to use the accelerator pack.

### Prerequisites

The dependencies for this library are listed in the `package.json`:

- jquery.
- kuende-livestamp.
- moment.
- opentok-solutions-logging.
- underscore.

### Installation

Start by installing the dependencies:

```bash
npm install --save opentok-text-chat
```

#### Using a module bundler

If using a bundler like browserify or webpack:

```javascript
const textChat = require('opentok-text-chat');
```

#### Without a module bundler

If you are not using a module bundler, include the accelerator pack in your html as well as the installed dependencies:

```html
<script src="node_modules/opentok-text-chat/dist/opentok-text-chat.js"></script>
<script src="node_modules/opentok-solutions-logging/dist/opentok-solutions-logging.js"></script>
<script src="https://static.opentok.com/v2/js/opentok.min.js"></script>
<script src="your/path/to/underscore-min.js"></script>
<script src="your/path/to/jquery.min.js"></script>
<script src="your/path/to/moment.min.js"></script>
<script src="your/path/to/livestamp.min.js"></script>
```

Also, as our [Sample Application](#sample-application) demonstrates, you can specify some of the requirements to be sourced from cloudfare:

```javascript
  <script src="https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.17.1/moment.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/livestamp/1.1.2/livestamp.min.js"></script>
```

## Usage

The text chat module will be available in global scope as `TextChatAccPack`

_**NOTE**: Click [here](https://www.npmjs.com/search?q=opentok-acc-pack) for a list of all OpenTok accelerator packs._

## Exploring the code

The `TextChatAccPack` class in `opentok-text-chat.js` is the backbone of the text chat communication features for the app.

This class sets up the text chat UI views and events, and provides functions for sending, receiving, and rendering individual chat messages.

### Initialization

The following `options` fields are used in the `TextChatAccPack` constructor:

| Feature                                                                                               | Field                   |
| ----------------------------------------------------------------------------------------------------- | ----------------------- |
| Set the session.                                                                                      | `session`               |
| Set the id and name for the user.                                                                     | `sender`                |
| Set the chat container.                                                                               | `textChatContainer`     |
| Sets the position of the element that displays the information for the character count within the UI. | `controlsContainer`     |
| Set the maximum message length.                                                                       | `limitCharacterMessage` |
| Set the sender alias and the sender ID of the outgoing messages.                                      | `sender`                |
| Set the text chat container to automatically be displayed.                                            | `alwaysOpen`            |
| Set the chat button to be added to UI or not                                                          | `appendControl`         |
| Custom message to display while waiting for other users to join.                                      | `waitingMessage`        |

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
   alwaysOpen: true,
   appendControl: true
 };

 const textChat = new TextChatAccPack(textChatOptions);
  ```

### TextChatAccPack Methods

The `TextChat` component defines the following methods:

| Method                    | Description                                                |
| ------------------------- | ---------------------------------------------------------- |
| `showTextChat()`          | Show the text chat view.                                   |
| `hideTextChat()`          | Hide the text chat view.                                   |
| `isDisplayed()`           | Determines if the text chat accelerator pack is displayed. |
| `isEnabled()`             | Determines if the text chat accelerator pack is enabled.   |
| `deliverUnsentMessages()` | Deliver all prior messages to new participants.            |

For example, this line determines whether the text chat accelerator pack is displayed:

  ```javascript
  const displayed = textChat.isDisplayed();
  ```

### Events

The `TextChat` component emits the following events:

| Method                 | Description                               |
| ---------------------- | ----------------------------------------- |
| `messageReceived `     | A new message has been received.          |
| `messageSent `         | A new message has been sent.              |
| `errorSendingMessage ` | An error occurred when sending a message. |

The following code shows how to subscribe to these events using [opentok-accelerator-core](https://github.com/opentok/accelerator-core-js):

```javascript
otCore.on('messageReceived', event =>  . . .)
otCore.on('messageSent', event =>  . . .)
otCore.on('errorSendingMessage', error =>  . . .)
```

### Sample Application

- **[Multiparty video communication sample app using the Accelerator TextChat with best-practices for Javascript](https://github.com/opentok/accelerator-sample-apps-js)**

## Development and Contributing

Interested in contributing? We :heart: pull requests! See the [Contribution](CONTRIBUTING.md) guidelines.

## Getting Help

We love to hear from you so if you have questions, comments or find a bug in the project, let us know! You can either:

- Open an issue on this repository
- See <https://support.tokbox.com/> for support options
- Tweet at us! We're [@VonageDev](https://twitter.com/VonageDev) on Twitter
- Or [join the Vonage Developer Community Slack](https://developer.nexmo.com/community/slack)

## Further Reading

- Check out the Developer Documentation at <https://tokbox.com/developer/>
