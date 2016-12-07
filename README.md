## Voting App v.0.0.1

* Install dependencies

      "ejs": "^2.5.5",
      "express": "^4.14.0"

* Require express and assign it to app
 
      const express = require('express');
      const app = express();

* Set view engine to EJS
 
      app.set('view engine', 'ejs');

* Use public folder for static files 
 
      app.use(express.static(__dirname + '/public'));

* Set a proper port for the app to listen on
 
      const PORT = process.env.PORT || 3000;

      app.listen(PORT, process.env.IP, () => {
      console.log('Server started on port', PORT); 
      });

* Configure partial files in views, navbar in header 
* Configure dummy main.ejs and mypolls.ejs
* Apply basic bootstrap styling
* Finally add a couple of dummy routes

      // main route
      app.get('/', (req, res) => {
      	 res.render('main');
      });
      
      // list my polls
      app.get('/mypolls', (req, res) => {
      	res.render('mypolls');
      }); 




&nbsp;

### User Stories

All users can 
* see and vote on everyone's polls.
* see the results of polls in chart form.

Authenticated users can 
* keep their polls and come back later to access them.
* share their polls with their friends.
* see the aggregate results of their polls.
* delete polls that they don't want anymore.
* create a poll with any number of possible items. 
* create a new option on a poll.
  
&nbsp;
  
### Stack

* Express
* EJS
 
  
