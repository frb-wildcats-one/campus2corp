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
app.get('/register', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/Registration/setup.html'))
})
app.get('/login', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/login/loginpage.html'))
})
app.get('/profile', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/profile/profile.html'))
})
/* LAUNCH THE SERVER */
app.listen(3000, function() {
    console.log('Listening on 3000');
})
