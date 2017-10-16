What problem does our app solve?

  Transitioning from college to corporate can be difficult. There will be a lot of new adjustments to make and it can easily become overwhelming. Within this transition, it can be difficult to maintain a work/life balance and people can become disconnected from their sense of community. This is especially true if the person is taking on a new job pin an unfamiliar city. Overall, we aimed to solve the problem of someone coming out of college and being underprepared and disconnected in a new job or industry. Launchline helps students, recent graduates, and those recently employed gain guidance in this transition.

How does our app solve that problem?

  Our application provides users with a guide for navigating the transition from college to corporate. Launchline assists users in the process of taking on a new job either as a student, recent graduate, or someone recently employed. Upon registration, a user will choose which stage they are at in the process. This stage will then help Launchline to provide them with a personalized Launchpad. Users can update their stage at any time on the view profile page and they may view their progress on their myLaunchpad page. For students, Launchline provides tools to help with job applications including a checklist of resources for support in resume writing, the interview process, campus involvement, and more. The beauty of Launchline is that it can support a student throughout school and during their new job. Students may even look ahead at some features by changing their stage in the profile tab. For recent graduates, Launchline provides them with nearby companies and events that may be of interest to them. Through these companies, students may find a means of networking in their industry or even discover a mentor. Eventually, those recently hired users of Launchline could turn into mentors for the students on Launchline. In addition, companies may choose to sponsor events or listings in the app, to ensure that they reach prospective new hires. A recent graduate will also be provided with a checklist to help them find a job. In order to adjust to a new job, it is important that those recently hired can start to fit in with their company and surrounding community. Launchline provides recently hired people access to nearby events based on their industry of choice. This way they can become connected within the community. Finding community, can help user’s adjust to a working lifestyle. Launchline is run using Node JS.


 campus2corp
##### Get Up & Running:
1. Clone the repo with `git clone https://github.com/frb-wildcats-one/campus2corp.git && cd campus2corp`
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
