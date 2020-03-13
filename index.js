var express = require('express');
var cors = require('cors');
const kafka = require('kafka-node');

var app = express();

app.use(cors());

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


app.listen(8080);