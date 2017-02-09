
var MockBrowser = require('mock-browser').mocks.MockBrowser;
global.window = MockBrowser.createWindow();
global.document = MockBrowser.createDocument();

var divmock = global.document.createElement('div');
divmock.innerHTML = '<div id="feedControls" />';
global.document.body.appendChild(divmock);

divmock = global.document.createElement('div');
divmock.innerHTML = '<div id="chatContainer" />';
global.document.body.appendChild(divmock);

global.window.jasmine = require('jasmine');
var TextChatAccPack = require('../src/opentok-text-chat');


describe('TextChatSpec', function () {

  var _connection;
	var _session;
	var _textChat;
  beforeEach(function (done) {
		window.jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
		setTimeout(function () {
				done();
		}, 500);

		_connection = {
      connectionId: "123",
    };

		_session = {
			id: "123",
			connection: _connection,
			apiKey: "100"
		};

		_textChat = new TextChatAccPack({ session: _session });

  });

  it('TextChat Initializer not to be null', function () {
    // demonstrates use of custom matcher
    expect(_textChat).not.toBeNull();
  });

	it('TextChat not to be enabled', function () {
		expect(_textChat.isEnabled()).toBe(false);
	});

	it('Show text chat', function () {
		_textChat.showTextChat();
    expect(_textChat.isDisplayed()).toBe(true);
	});

	it('Hide text chat', function () {
		_textChat.hideTextChat();
    expect(_textChat.isDisplayed()).toBe(false);
	});

});
