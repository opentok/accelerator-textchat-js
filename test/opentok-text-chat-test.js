
var expect = chai.expect;
var TextChatAccPack = TextChatAccPack;

var divmock = document.createElement('div');
divmock.innerHTML = '<div id="feedControls" />';
document.body.appendChild(divmock);

divmock = document.createElement('div');
divmock.innerHTML = '<div id="chatContainer" />';
document.body.appendChild(divmock);

var _textChat;
var _options;

if (!Function.prototype.bind) {
    Function.prototype.bind = function() {
        var fn = this,
            args = Array.prototype.slice.call(arguments),
            context = args.shift();
        return function() {
            fn.apply(context, args);
        };
    };
}

var _textchatConstructor = function(options){
    _textChat = new TextChatAccPack(options);
};

describe('TextChatSpec', function () {

  var _connection = {
    connectionId: "123",
  };
	var _session = {
    id: "123",
    connection: _connection,
    apiKey: "100",
    on: function(){}
  };
  var _accPack = {
    registerEvents: function(){ },
    registerEventListener: function(){ },
    triggerEvent: function(){ }
  };
  _options = {
    session: _session,
    accPack: _accPack
  };

  beforeEach(function (done) {

    setTimeout(function(){
      _textChat = new TextChatAccPack(_options);
      done();
    }, 50);

  });

  it('TextChat Initializer not to be null', function () {
    expect(_textChat).not.to.be.null;
  });

  it('TextChat Initializer not to be null', function () {
    expect(_textchatConstructor.bind(_textchatConstructor, null)).to.throw(TypeError, /Cannot read property 'session' of null/);
  });

  it('TextChat Initializer should not be null when accpack is missing or not valid', function () {
     var optNotValid = {
      session: _session,
    };
    _textChat = null;
    expect(_textchatConstructor.bind(_textchatConstructor, optNotValid)).not.to.throw(Error, /Text Chat Accelerator Pack requires an OpenTok session/);
    expect(_textChat).not.to.be.null;
    optNotValid = {
      session: _session,
      accPack: null
    };
    _textChat = null;
    expect(_textchatConstructor.bind(_textchatConstructor, optNotValid)).not.to.throw(TypeError, /Cannot read property 'session' of null/);
    expect(_textChat).not.to.be.null;
  });

  it('TextChat Initializer should be null when session is missing', function () {
     var optNotValid = {
      accPack: _accPack
    };
    _textChat = null;
    expect(_textchatConstructor.bind(_textchatConstructor, optNotValid)).to.throw(Error, /Text Chat Accelerator Pack requires an OpenTok session/);
    expect(_textChat).to.be.null;
    optNotValid = {
      session: null,
      accPack: _accPack
    };
    _textChat = null;
    expect(_textchatConstructor.bind(_textchatConstructor, optNotValid)).to.throw(Error, /Text Chat Accelerator Pack requires an OpenTok session/);
    expect(_textChat).to.be.null;
  });

  it('TextChat Initializer should not be null when session is not valid', function () {
    var sessionNotValid = {
      connection: _connection,
      apiKey: "100",
      on: function(){}
    };
     var optNotValid = {
      session: sessionNotValid,
      accPack: _accPack
    };
    _textChat = null;
    expect(_textchatConstructor.bind(_textchatConstructor, optNotValid)).to.throw(Error, /The sessionId field cannot be null in the log entry/);
    expect(_textChat).to.be.null;
    sessionNotValid = {
      id: "123",
      apiKey: "100",
      on: function(){}
    };
     optNotValid = {
      session: sessionNotValid,
      accPack: _accPack
    };
    _textChat = null;
    expect(_textchatConstructor.bind(_textchatConstructor, optNotValid)).to.throw(TypeError, /Cannot read property 'connectionId' of undefined/);
    expect(_textChat).to.be.null;
    sessionNotValid = {
      id: "123",
      connection: _connection,
      on: function(){}
    };
     optNotValid = {
      session: sessionNotValid,
      accPack: _accPack
    };
    _textChat = null;
    expect(_textchatConstructor.bind(_textchatConstructor, optNotValid)).not.to.throw();
    expect(_textChat).not.to.be.null;
  });

	it('TextChat not to be enabled', function () {
		expect(_textChat.isEnabled()).to.be.false;
	});

	it('Show text chat', function () {
		_textChat.showTextChat();
    expect(_textChat.isDisplayed()).to.be.true;
	});

	it('Hide text chat', function () {
		_textChat.hideTextChat();
    expect(_textChat.isDisplayed()).to.be.false;
	});

});
