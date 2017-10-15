const express = require('express');
const app = express();

const path = require('path');
const fs = require('fs');

const exphbs = require('express-handlebars');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

/* STATIC FILES LOCATION */
app.use(express.static(path.join(__dirname + '/public')))

/* SET UP HANDLEBARS */
exphbs({layoutsDir: path.join(__dirname + '/public')});
const hbs = exphbs.create({layoutsDir: path.join(__dirname + '/public')});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname + '/public/'));

/* MySQL Connection */
const mysql = require('mysql');
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "campus2corp",
    password: "localrootpass"
})
con.connect(function(err){
    if (err) throw err;
    console.log("Connection established!");
})


/* ROUTES */
app.get('/', function(req, res) {
    res.send('Hello, world');
})
app.get('/test', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/test.html'));
})
app.get('/hbs-test', function(req, res){
    var someData = "HEY IM SOME DDATA";
    res.render('page/page', {
        helpers: {
            data: function(){
                return someData;
            }
        }
    })
})

/* API ROUTES */
// Returns all users
app.get('/api/users', function(req, res){
    con.query('select * from users;', function(err, result){
        if (err) throw err;
        res.json({data: result});
    });
})
// Returns a single user
app.get('/api/users/:id', function(req, res){
    // con.query('select * from users where id =' + req.params.id + ';', function(err, result){
    con.query('select id, name, city, state, school, stage from users where id =' + req.params.id + ';', function(err, result){
        if (err) throw err;
        res.json({data: result});
    })
})
// create user
app.post('/api/users', function(req, res){
    var email = req.param('email') || null;
    var name = req.param('name') || null;
    var city = req.param('city') || null;
    var state = req.param('state') || null;
    var school = req.param('school') || null;
    var company = req.param('company') || null;
    var company_city = req.param('company_city') || null;
    var company_state = req.param('company_state') || null;
    var stage = req.param('stage') || null;

    var params = {
        email: email,
        name: name,
        city: city,
        state: state,
        school: school,
        company: company,
        company_city: company_city,
        company_state: company_state,
        stage: stage
    };

    con.query('insert into users set ?', params, function(err, results, fields){
        if (err) throw err;
        console.log("SUCCESSFULLY ADDED USER");
        res.json({data: params});
    })
})
// update user
app.put('/api/users', function(req, res){
    res.json({data: 'put request on user'});
})
app.get('/register', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/Registration/setup.html'))
})
app.get('/login', function(req, res) {
    // res.sendFile(path.join(__dirname + '/public/login/loginpage.html'))
    res.render('login/loginpage', {
        helpers: {
            incorrect_pass: function(){
                return "none";
            },
            incorrect_email: function(){
                return "none";
            }
        }
    })
})
app.post('/login', function(req, res){
    var email = req.body.email;
    var pass = req.body.password;

    // bcrypt.hash(pass, saltRounds).then(function(hash){
    //     hashed = hash;
    //     console.log('hash: ' + hash);
    // });

    // check if email exists and if the password matches the bashed pass
    con.query('select * from users where email = ?', email, function(err, result){
        if (err) throw err;
        if (result.length == 0){
            console.log("No Results");
            res.render('login/loginpage', {
                helpers: {
                    incorrect_pass: function() {
                        return "none";
                    },
                    incorrect_email: function(){
                        return "block";
                    }
                }
            })
        } else {
            // check password
            bcrypt.compare(pass, result[0].password, function(err, validPassword){
                if (validPassword == true){
                    console.log("Successfully logging in: " + result[0]);
                    res.redirect('/');
                } else {
                    console.log("INCORRECT PASSWORD");
                    res.render('login/loginpage', {
                        helpers: {
                            incorrect_pass: function(){
                                return "block";
                            },
                            incorrect_email: function(){
                                return "none";
                            }
                        }
                    })
                }
            }) // end bcrypt.compare
        }
    }) // end con.query
}) // post /login


/* LAUNCH THE SERVER */
app.listen(3000, function() {
    console.log('Listening on 3000');
})
