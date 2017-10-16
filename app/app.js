const express = require('express')
const app = express()
const path = require('path');
const fs = require('fs');

const exphbs = require('express-handlebars');

/* STATIC FILES LOCATION */
app.use(express.static(path.join(__dirname + '/public')))

/* SET UP HANDLEBARS */
exphbs({layoutsDir: path.join(__dirname + '/public')});
const hbs = exphbs.create({layoutsDir: path.join(__dirname + '/public')});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname + '/public/'));

/* ROUTES */
app.get('/', function(req, res) {
      // res.sendFile(path.join(__dirname + '/public/index.handlebars'))
      res.render('index',{
        // helpers: {
        //   myDataName: function(){
        //     return "a string or whatever";
        //   }
        // }
      })
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
