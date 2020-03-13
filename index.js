var express = require('express');
var kafka = require('kafka-node');

var app = express();

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
    res.send('hello world')
  })

// Called once for each new client. Note, this response is left open!
app.get('/wikipedia_counter', function (req, res) {
    req.socket.setTimeout(Number.MAX_VALUE);
    while(True){
        res.writeHead(200, {
            'Content-Type': 'text/event-stream', // <- Important headers
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });
        res.write('Sample message');
    }
});

app.listen()