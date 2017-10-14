# campus2corp
##### Get Up & Running:
1. Clone the repo with `git clone https://github.com/frb-wildcats-one/campus2corp.git`
2. Install dependencies with `npm i`
3. Run the app with `npm start`
4. Open `localhost:3000`

##### Adding a Web Page
- Pages are served via expressjs (https://expressjs.com/)
1. Add the web pages and directories to the `/app/public` folder
2. Add a route for the page in `app.js`. For example to add a page called "test" use the form:
    ``` javascript
    app.get('/test', function(req, res) {
        res.sendFile(path.join(__dirname + '/public/test.html'))  
    }
    ```
