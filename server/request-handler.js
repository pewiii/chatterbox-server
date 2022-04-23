var fs = require('fs');
var url = require('url');

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};
var sendFile = function(path, res, contentType = 'text/html') {
  var headers = Object.create(defaultCorsHeaders);
  //if (contentType) {
  headers['Content-Type'] = contentType;
  //}
  //console.log(__dirname + path);
  fs.readFile(__dirname + path, 'utf-8', (err, data) => {
    if (!err) {
      res.writeHead(200, headers);
      res.end(data);
    } else {
      console.error(err);
    }
  });
};

var _data = {results: []};

var requestHandler = function(request, response) {
  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  var statusCode = 200;
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = 'text/plain';
  var splitURL = request.url.split('/');
  var parsedURL = url.parse(request.url);
  if (parsedURL.pathname === '/') {
    sendFile('/../client/chatterbox.html', response, 'text/html');
  } else if (splitURL[1] === 'client') {
    if (splitURL[2] === 'images') {
      sendFile('/../client/images/' + splitURL[3], response, 'image/gif');
    } else if (splitURL[2] === 'styles') {
      sendFile('/../client/styles/' + splitURL[3], response, 'text/css');
    } else if (splitURL[2] === 'scripts') {
      sendFile('/../client/scripts/' + splitURL[3], response, 'text/javascript');
    }
  } else if (parsedURL.pathname === '/classes/messages' && request.method === 'GET') {
    //headers['Content-Type'] = 'application/json';
    response.writeHead(statusCode, headers);
    if (request.url.indexOf('order=-createdAt')) {
      var results = _data.results.slice();
      results.sort((a, b) => (Date.parse(a.createdAt) < Date.parse(b.createdAt)) ? 1 : -1);
      response.end(JSON.stringify({results}));
    } else {
      response.end(JSON.stringify(_data));
    }
  } else if (parsedURL.pathname === '/classes/messages' && request.method === 'POST') {
    var headers = Object.create(defaultCorsHeaders);
    headers['Content-Type'] = 'application/json';
    var body = '';
    request.on('data', (chunk) => {
      body += chunk;
    }).on('end', () => {
      response.writeHead(201, headers);
      body = JSON.parse(body);
      if (!body.username || !body.text) {
        response.writeHead(400, headers);
        response.end();
      } else {
        body.createdAt = new Date();
        //console.log(body);
        _data.results.push(body);
        console.log(JSON.stringify(body));
        response.end(JSON.stringify(body));
      }
    });
  } else if (parsedURL.pathname === '/classes/messages' && request.method === 'DELETE') {
    _data.results.pop();
    headers['Content-Type'] = 'application/json';
    response.writeHead(200, headers);
    response.end(JSON.stringify(_data));
  } else if (parsedURL.pathname === '/classes/messages' && request.method === 'OPTIONS') {
    response.writeHead(200, headers);
    response.end();
  } else {
    response.writeHead(404, headers);
    response.end();
  }
};


/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

// Request and Response come from node's http module.
//
// They include information about both the incoming request, such as
// headers and URL, and about the outgoing response, such as its status
// and content.
//
// Documentation for both request and response can be found in the HTTP section at
// http://nodejs.org/documentation/api/

// Do some basic logging.
//
// Adding more logging to your server can be an easy way to get passive
// debugging help, but you should always be careful about leaving stray
// console.logs in your code.
// See the note below about CORS headers.
// Tell the client we are sending them plain text.
//
// You will need to change this if you are sending something
// other than plain text, like JSON or HTML.
// .writeHead() writes to the request line and headers of the response,
// which includes the status and all headers.
// Make sure to always call response.end() - Node may not send
// anything back to the client until you do. The string you pass to
// response.end() will be the body of the response - i.e. what shows
// up in the browser.
//
// Calling .end "flushes" the response's internal buffer, forcing
// node to actually send all the data over to the client.

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.

module.exports.requestHandler = requestHandler;