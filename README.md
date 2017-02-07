![logo](../tokbox-logo.png)

# OpenTok Text Chat Accelerator Pack for JavaScript<br/>Version 2.0.0

## Quick start

This section shows you how to use the accelerator pack.

## Quick start

To get up and running quickly with your app, go through the following steps in the tutorial provided below:

1. [Configuring the App](#configuring-the-app)
2. [Deploying and running](#deploying-and-running)

To learn more about the best practices used to design this app, see [Exploring the code](#exploring-the-code).


### Configuring the app

Now you are ready to add the configuration detail to your app. These will include the **Session ID**, **Token**, and **API Key** you retrieved earlier (see [Prerequisites](#prerequisites)).

In **app.js**, replace the following empty strings with the required detail:


   ```javascript
    apiKey: '',    // Replace with your OpenTok API Key
    sessionId: '', // Replace with a generated Session ID
    token: '',     // Replace with a generated token (from the dashboard or using an OpenTok server SDK)
   ```

_At this point you can try running the app! See [Deploying and running](#deploying-and-running) for more information._


### Deploying and running

The web page that loads the sample app for JavaScript must be served over HTTP/HTTPS. Browser security limitations prevent you from publishing video using a `file://` path, as discussed in the OpenTok.js [Release Notes](https://www.tokbox.com/developer/sdks/js/release-notes.html#knownIssues). To support clients running [Chrome 47 or later](https://groups.google.com/forum/#!topic/discuss-webrtc/sq5CVmY69sc), HTTPS is required. A web server such as [MAMP](https://www.mamp.info/) or [XAMPP](https://www.apachefriends.org/index.html) will work, or you can use a cloud service such as [Heroku](https://www.heroku.com/) to host the application.


## Exploring the code

This section describes how the sample app code design uses recommended best practices to deploy the text chat communication features. The sample app design extends the [OpenTok One-to-One Communication Sample App](https://github.com/opentok/one-to-one-sample-apps/tree/master/one-to-one-sample-app/) by adding logic using the `TextChatAccPack` class defined in `opentok-text-chat.js`.

For detail about the APIs used to develop this sample, see the [OpenTok.js Reference](https://tokbox.com/developer/sdks/js/reference/).

  - [Web page design](#web-page-design)
  - [Text Chat Accelerator Pack](#text-chat-accelerator-pack)

_**NOTE:** The sample app contains logic used for logging. This is used to submit anonymous usage data for internal TokBox purposes only. We request that you do not modify or remove any logging code in your use of this sample application._

### Web page design

While TokBox hosts [OpenTok.js](https://tokbox.com/developer/sdks/js/), you must host the sample app yourself. This allows you to customize the app as desired. The sample app has the following design, focusing primarily on the text chat features. For details about the one-to-one communication audio-video aspects of the design, see the [OpenTok One-to-One Communication Sample App](https://github.com/opentok/one-to-one-sample-apps/tree/master/one-to-one-sample-app/js).

* **[accelerator-pack.js](./sample-app/public/js/components/accelerator-pack.js)**: The TokBox Common Accelerator Session Pack is a common layer that permits all accelerators to share the same OpenTok session, API Key and other related information, and is required whenever you use any of the OpenTok accelerators. This layer handles communication between the client and the components.

* **acc-pack-text-chat.js**:  _(Available in the Text Chat Accelerator Pack)._ Manages the client text chat UI views and events, builds and validates individual text chat messages, and makes the chat UI available for placement.

* **acc-pack-communication.js**: _(Available in the Text Chat Accelerator Pack)._ Manages the client audio/video communication.

* **text-chat-acc-pack.js**: _(Available in the Text Chat Accelerator Pack)._ Minified JS file which contains **acc-pack-communication.js** , **acc-pack-text-chat.js**. These files appear on your system after running `build-sample.sh`.

* **[app.js](./sample-app/public/js/app.js)**: Stores the information required to configure the session and authorize the app to make requests to the backend server, manages the client connection to the OpenTok session, manages the UI responses to call events, and sets up and manages the local and remote media UI elements.

* **[CSS files](./opentok.js-text-chat/css/)**: Defines the client UI style.

* **[index.html](./sample-app/public/index.html)**: This web page provides you with a quick start if you don't already have a web page making calls against OpenTok.js (via accelerator-pack.js) and text-chat-acc-pack.js. Its `<head>` element loads the OpenTok.js library, Text Chat library, and other dependencies, and its `<body>` element implements the UI container for the controls on your own page. It contains the tag script to load the otkanalytics.js file.

```javascript

    <!-- CSS -->
    <link rel="stylesheet" href="css/theme.css">

    <!--JS-->
    <script src="https://assets.tokbox.com/otkanalytics.js" type="text/javascript" defer></script>
    <script src="js/components/text-chat-acc-pack.js" type="text/javascript" defer></script>
    <script src="js/components/accelerator-pack.js" type="text/javascript" defer></script>

```

### Text Chat Accelerator Pack

The `TextChatAccPack` class in text-chat-acc-pack.js is the backbone of the text chat communication features for the app.

This class sets up the text chat UI views and events, and provides functions for sending, receiving, and rendering individual chat messages.

#### Initialization

The following `options` fields are used in the `TextChatAccPack` constructor:<br/>

| Feature        | Field  |
| ------------- | ------------- |
| Set the session. | `session`  |
| Set the chat container. | `textChatContainer`  |
| Sets the position of the element that displays the information for the character count within the UI. | `controlsContainer`  |
| Set the maximum chat text length. | `limitCharacterMessage`  |
| Set the sender alias and the sender ID of the outgoing messages. | `sender`  |
| Set the text chat container to automatically be displayed. | `alwaysOpen`  |


If you're using a bundler like webpack or Browserify, you can install the the text chat component with [npm](https://www.npmjs.com/package/opentok-text-chat), and import into your application:

  ```javascript
  const TextChatAccPack = require('opentok-text-chat');
  const textChat = new TextChatAccPack(options);
  ```


Otherwise, the package will need to be in `global` scope to be initialized:

  ```javascript
      var _options = {
        textChat: {
          sender: {
            alias: 'David',
          },
          limitCharacterMessage: 160,
          controlsContainer: '#feedControls',
          textChatContainer: '#chatContainer',
          alwaysOpen: true
        }
      };

      var textChatOptions = {
       accPack: _this,
       session: _session,
       sender: _options.textChat.sender,
       limitCharacterMessage: _options.textChat.limitCharacterMessage,
       controlsContainer: _options.textChat.controlsContainer,
       textChatContainer: _options.textChat.textChatContainer,
       alwaysOpen: _options.textChat.alwaysOpen
     };

     _components.textChat = new TextChatAccPack(textChatOptions);
  ```


#### TextChatAccPack Methods

The `TextChat` component defines the following methods:

| Method        | Description  |
| ------------- | ------------- |
| `showTextChat()` | Show the text chat view.  |
| `hideTextChat()` | Hide the text chat view.  |
| `isDisplayed()` | Determines if the text chat accelerator pack is displayed.  |
| `isEnabled()` | Determines if the text chat accelerator pack is enabled.  |


For example, this line determines whether the text chat accelerator pack is displayed:

  ```javascript
  var displayed = _textChat.isDisplayed();
  ```

#### Events

The `TextChat` component emits the following events:

| Method        | Description  |
| ------------- | ------------- |
| `messageReceived ` | A new message has been received.  |
| `messageSent ` | A new message has been sent.  |
| `errorSendingMessage ` | An error occurred when sending a message.  |


The following code shows how to subscribe to these events:

  ```javascript
      _accPack.registerEventListener('messageReceived', function() {
        . . .
      });

      _accPack.registerEventListener('messageSent', function() {
        . . .
      });

      _accPack.registerEventListener('errorSendingMessage', function() {
        . . .
      });
  ```

  ## Requirements

  To develop your text chat app:

  1. Review the [OpenTok.js](https://tokbox.com/developer/sdks/js/) requirements.
  2. Your project must include [jQuery](https://jquery.com/), [Moment.js](http://momentjs.com/), [timeago](http://timeago.yarp.com/), and [Underscore](http://underscorejs.org/).
  3. There are several ways to install the Text Chat Accelerator Pack. <ol><li>Install the text chat component with [npm](https://www.npmjs.com/package/opentok-text-chat).</li><li>Run the [build.sh script](./build.sh) to install the text chat and one-to-one communication components.</li><li>Download and extract the text chat and one-to-one communication components from the [zip](https://s3.amazonaws.com/artifact.tokbox.com/solution/rel/textchat-acc-pack/JS/opentok-js-text-chat-acc-pack-2.0.0.zip) file provided by TokBox.</li></ol>
