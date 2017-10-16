const express = require('express');
const app = express();

const path = require('path');
const fs = require('fs');

const exphbs = require('express-handlebars');

const bcrypt = require('bcrypt-nodejs');
const saltRounds = 2;

const bodyParser = require('body-parser');

var session_email = "";
var session_hash;

var user_obj = {};
var user_logged_in = false;
user_auth = function(user_logged_in, res) {
    if (!user_logged_in) {
        return false;
    } else {
        return true;
    }
}

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
//    res.sendFile(path.join(__dirname + '/public/index.html'))
})
app.get('/logout', function(req, res){
    user_logged_in = false;
    res.redirect('/');
})
app.get('/test', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/test.html'));
})
app.get('/hbs-test', function(req, res){
    var someData = "HEY IM SOME DDATA";
    var coolCompanyname = "facebook";
    res.render('page/page', {
        helpers: {
            data: function(){
                return someData;
            },
            myCompanyName: function(){
                return coolCompanyname;
            }
        }
    })
})

/* API ROUTES */
// Returns all users
app.get('/api/users', function(req, res){
    user_auth(user_logged_in, res);
    con.query('select * from users;', function(err, result){
        if (err) throw err;
        res.json({data: result});
    });
})
// Returns a single user
app.get('/api/users/:id', function(req, res){
    user_auth(user_logged_in, res);
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
    user_auth(user_logged_in, res);
    res.json({data: 'put request on user'});
})
app.get('/register', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/setup/setup.html'))
})
app.post('/register', function(req, res){
    var valueObj = req.body;
    var hashedPass = "";
    for (var obj in valueObj) {
        if (valueObj[obj] == '') {
            valueObj[obj] = null;
        }
    }

    hashedPass = bcrypt.hashSync(valueObj['password']);
    session_hash = hashedPass;
    session_email = ""
    valueObj['password'] = hashedPass;

    var industry_array_string = "[";
    if (valueObj.industry.constructor === Array){
        for (var i = 0; i < valueObj.industry.length; i++){
            if (i + 1 == valueObj.industry.length){
                industry_array_string += '"' + valueObj.industry[i] + '"';
            } else {
                industry_array_string += '"' + valueObj.industry[i] + '", ';
            }
        }
        industry_array_string += "]";
    } else {
        industry_array_string += '"' + valueObj.industry + '"]';
    }
    console.log(industry_array_string);
    valueObj.industry = industry_array_string;

    con.query('insert into users set ?', valueObj, function(err, results){
        if (err) throw err;
        console.log("SUCCESSFULLY ADDED USER");

        res.redirect('/');
    });

})

app.get('/profile', function(req, res) {
    if (!user_auth(user_logged_in, res)) {
        return res.redirect('/login');
    }
    var industries_raw = user_obj.industry;
    console.log(industries_raw);
    var industry = JSON.parse(industries_raw);
    res.render('profile/profile', {
        user_data: user_obj,
        stage_one: user_obj.stage == 1 ? 'checked' : '',
        stage_two: user_obj.stage == 2 ? 'checked' : '',
        stage_three: user_obj.stage == 3 ? 'checked' : '',
        industry: {
            health: industry.includes('Health') ? 'checked' : '',
            technology: industry.includes('Technology') ? 'checked' : '',
            engineering: industry.includes('Engineering') ? 'checked': '',
            education: industry.includes('Education') ? 'checked' : '',
            business: industry.includes('Business') ? 'checked' : '',
            design_arts: industry.includes('Design/Arts') ? 'checked' : '',
            communication: industry.includes('Communications') ? 'checked' : '',
            agriculture_environment: industry.includes('Agriculture/Environment') ? 'checked' : ''
        }
    })
})

app.post('/profile', function(req, res){
    var stage = req.body.status;

    var industry_array_string = "[";
    if (req.body.industry.constructor === Array){
        for (var i = 0; i < req.body.industry.length; i++){
            if (i + 1 == req.body.industry.length){
                industry_array_string += '"' + req.body.industry[i] + '"';
            } else {
                industry_array_string += '"' + req.body.industry[i] + '", ';
            }
        }
        industry_array_string += "]";
    } else {
        industry_array_string += '"' + req.body.industry + '"]';
    }

    con.query("update users set stage = " + stage + ", industry = ? where id = " + user_obj.id + ';', industry_array_string, function(err, result){
        if (err) throw err;
        // return res.redirect('/profile');
        console.log("Successfully updated user information");
    })
    con.query("select * from users where id = ?", user_obj.id, function(err, result){
        user_obj = result[0];
        user_obj.letter = result[0].name.charAt(0);
        return res.redirect('/profile');
    })
})

app.get('/login', function(req, res) {
    // console.log(req.sessx);
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
            if (bcrypt.compareSync(pass, result[0].password) == true){
                console.log("Successfully logging in: " + result[0]);
                user_obj = result[0];
                user_obj.letter = result[0].name.charAt(0);
                user_logged_in = true;
                res.redirect('/profile');
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
            } // end hash compare
        }
    }) // end con.query
}) // post /login

app.get('/launchlines', function(req, res) {
    // res.sendFile(path.join(__dirname + '/public/launch-lines/launchlines.html'))
    res.render('launchlines/launchlines',{
      card_content: [
          {
            // “Anderson Hall and Fairchild Hall Kansas State University” by Max Stinnett is licensed under CC BY 2.0
            img: "/images/ksu.png",
            title: "On your campus",
            description: "Find resources."
          },
          {
            img: "/images/resume.png",
            title: "Resumes and Cover Letters",
            description: "Prepare for job applications."
          },
          {
            img: "/images/interview.png",
            title: "Interviews",
            description: "Prepare for the interview."
          },
          {
            img: "/images/activities.png",
            title: "Clubs",
            description: "Get involved."
          }
        ],

      company_content: [
            {
              companyName: "Sponsored: Apple",
              companyLocation: "Kansas City, MO",
              website: "apple.com",
              industry: "technology"
              // boolean sponsored
            },
            {
              companyName: "Federal Reserve Bank of Kansas City",
              companyLocation: "Kansas City, MO",
              website: "kansascityfed.org",
              industry: "business"
            },
            {
              companyName: "Cerner",
              companyLocation: "Kansas City, MO",
              website: "cerner.com",
              industry: "health"
            }
          ],

      event_content: [
            {
              name: "Event 1",
              location: "Kansas City, MO",
              date: "10/1/17",
              time: "12:00pm",
              industry: "technology"
            },
            {
              name: "Event 2",
              location: "Manhattan, KS",
              date: "11/10/17",
              time: "3:00pm",
              industry: "design/art"
            },
            {
              name: "Event 3",
              location: "Kansas City, MO",
              date: "12/8/17",
              time: "5:00pm",
              industry: "business"
            }
          ],
      employed_content: [
            {
              name: "Event 1",
              location: "Minneapolis, MN",
              date: "10/1/17",
              time: "12:00pm",
              industry: "business"
            },
            {
              name: "Event 2",
              location: "St.Paul, MN",
              date: "11/5/17",
              time: "3:00pm",
              industry: "engineering"
            },
            {
              name: "Sponsored: Event 3",
              location: "Minneapolis, MN",
              date: "12/8/17",
              time: "5:00pm",
              industry: "engineering"
            },
            {
              name: "Event 4",
              location: "Minneapolis, MN",
              date: "1/1/18",
              time: "12:00pm",
              industry: "engineering"
            },
            {
              name: "Event 5",
              location: "St.Paul, MN",
              date: "2/2/18",
              time: "3:00pm",
              industry: "engineering"
            },
            {
              name: "Event 6",
              location: "Minneapolis, MN",
              date: "12/8/17",
              time: "5:00pm",
              industry: "engineering"
            }
          ],
      helpers: {
        test: function(){
          return "hello";
        }
      } // end helpers
    })
})

/* LAUNCH THE SERVER */
app.listen(3000, function() {
    console.log('Listening on 3000');
})
