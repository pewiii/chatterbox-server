var handler = require('../request-handler');
var expect = require('chai').expect;
var stubs = require('./Stubs');

describe('Node Server Request Listener Function', function() {
  it('Should answer GET requests for /classes/messages with a 200 status code', function() {
    // This is a fake server request. Normally, the server would provide this,
    // but we want to test our function's behavior totally independent of the server code
    var req = new stubs.request('/classes/messages', 'GET');
    var res = new stubs.response();

    handler.requestHandler(req, res);

    expect(res._responseCode).to.equal(200);
    expect(res._ended).to.equal(true);
  });

  it('Should send back parsable stringified JSON', function() {
    var req = new stubs.request('/classes/messages', 'GET');
    var res = new stubs.response();

    handler.requestHandler(req, res);

    expect(JSON.parse.bind(this, res._data)).to.not.throw();
    expect(res._ended).to.equal(true);
  });

  it('Should send back an object', function() {
    var req = new stubs.request('/classes/messages', 'GET');
    var res = new stubs.response();

    handler.requestHandler(req, res);

    var parsedBody = JSON.parse(res._data);
    expect(parsedBody).to.be.an('object');
    expect(res._ended).to.equal(true);
  });

  it('Should send an object containing a `results` array', function() {
    var req = new stubs.request('/classes/messages', 'GET');
    var res = new stubs.response();

    handler.requestHandler(req, res);

    var parsedBody = JSON.parse(res._data);
    expect(parsedBody).to.have.property('results');
    expect(parsedBody.results).to.be.an('array');
    expect(res._ended).to.equal(true);
  });

  it('Should accept posts to /classes/messages', function() {
    var stubMsg = {
      username: 'Jono',
      text: 'Do my bidding!'
    };
    var req = new stubs.request('/classes/messages', 'POST', stubMsg);
    var res = new stubs.response();

    handler.requestHandler(req, res);

    // Expect 201 Created response status
    expect(res._responseCode).to.equal(201);

    // Testing for a newline isn't a valid test
    // TODO: Replace with with a valid test
    // expect(res._data).to.equal(JSON.stringify('\n'));
    expect(res._ended).to.equal(true);
  });

  it('Should respond with messages that were previously posted', function() {
    var stubMsg = {
      username: 'Jono',
      text: 'Do my bidding!'
    };
    var req = new stubs.request('/classes/messages', 'POST', stubMsg);
    var res = new stubs.response();

    handler.requestHandler(req, res);

    expect(res._responseCode).to.equal(201);

    // Now if we request the log for that room the message we posted should be there:
    req = new stubs.request('/classes/messages', 'GET');
    res = new stubs.response();

    handler.requestHandler(req, res);

    expect(res._responseCode).to.equal(200);
    var messages = JSON.parse(res._data).results;
    expect(messages.length).to.be.above(0);
    expect(messages[0].username).to.equal('Jono');
    expect(messages[0].text).to.equal('Do my bidding!');
    expect(res._ended).to.equal(true);
  });

  it('Should 404 when asked for a nonexistent file', function() {
    var req = new stubs.request('/arglebargle', 'GET');
    var res = new stubs.response();


    handler.requestHandler(req, res);

    expect(res._responseCode).to.equal(404);
    expect(res._ended).to.equal(true);
  });
});

describe('Node Server Request Listener Function', function() {
  var req = new stubs.request('/', 'GET');
  var res = new stubs.response();
  before(() => {
    return new Promise( (resolve, reject) => {
      handler.requestHandler(req, res);
      setTimeout(() => {
        resolve();
      }, 1500);
    });
  });

  it('Should 200 when asked for / and have text/html content type', function() {
    //console.log(res._data);
    expect(res._responseCode).to.equal(200);
    expect(res._headers['Content-Type']).to.equal('text/html');
  });

  it('Should 200 for "/classes/messages" with an OPTIONS request', function() {
    var req = new stubs.request('/classes/messages', 'OPTIONS');
    var res = new stubs.response();
    handler.requestHandler(req, res);

    expect(res._responseCode).to.equal(200);
    expect(res._headers['access-control-allow-methods']).to.equal('GET, POST, PUT, DELETE, OPTIONS');
  });

  it('Should sort results array when given order options', function() {
    var req = new stubs.request('/classes/messages?order=-createdAt', 'GET');
    var res = new stubs.response();
    handler.requestHandler(req, res);

    var msg = JSON.parse(res._data).results;
    var date1 = Date.parse(msg[0].createdAt);
    var date2 = Date.parse(msg[1].createdAt);

    expect(date1 > date2).to.be.true;
  });

  it('should return 400 for bad message format when a POST is made', function() {
    var badMsg = {};
    var req = new stubs.request('/classes/messages', 'POST', badMsg);
    var res = new stubs.response();
    handler.requestHandler(req, res);

    expect(res._responseCode).to.equal(400);
  });

  it('should delete most recent message when a DELETE is made', function() {
    var req = new stubs.request('/classes/messages', 'DELETE');
    var res = new stubs.response();
    handler.requestHandler(req, res);
    var data = JSON.parse(res._data);
    expect(data.results.length).to.equal(1);
  });

});