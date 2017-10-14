const express = require('express')
const app = express()
const path = require('path');

/* STATIC FILES LOCATION */
app.use(express.static(path.join(__dirname + '/public')))

/* ROUTES */
app.get('/', function(req, res) {
    res.send('Hello, world');
})
app.get('/test', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/test.html'))
})

/* LAUNCH THE SERVER */
app.listen(3000, function() {
    console.log('Listening on 3000');
})
