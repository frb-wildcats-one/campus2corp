const express = require('express');
const app = express();

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
//    res.sendFile(path.join(__dirname + '/public/index.html'))
})
app.get('/test', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/test.html'))
})
app.get('/register', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/setup/setup.html'))
})
app.get('/login', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/login/loginpage.html'))
})
app.get('/profile', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/profile/profile.html'))
})
app.get('/launchlines', function(req, res) {
    // res.sendFile(path.join(__dirname + '/public/launch-lines/launchlines.html'))
    res.render('launchlines/launchlines',{
      card_content: [
          {
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
              time: "12:00pm"
            },
            {
              name: "Event 2",
              location: "Manhattan, KS",
              date: "11/10/17",
              time: "3:00pm"
            },
            {
              name: "Event 3",
              location: "Kansas City, MO",
              date: "12/8/17",
              time: "5:00pm"
            }
          ],
      employed_content: [
            {
              name: "Event 1",
              location: "Minneapolis, MN",
              date: "10/1/17",
              time: "12:00pm"
            },
            {
              name: "Event 2",
              location: "St.Paul, MN",
              date: "11/5/17",
              time: "3:00pm"
            },
            {
              name: "Sponsored: Event 3",
              location: "Minneapolis, MN",
              date: "12/8/17",
              time: "5:00pm"
            },
            {
              name: "Event 4",
              location: "Minneapolis, MN",
              date: "1/1/18",
              time: "12:00pm"
            },
            {
              name: "Event 5",
              location: "St.Paul, MN",
              date: "2/2/18",
              time: "3:00pm"
            },
            {
              name: "Event 6",
              location: "Minneapolis, MN",
              date: "12/8/17",
              time: "5:00pm"
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
