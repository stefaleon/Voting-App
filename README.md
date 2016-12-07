## Voting App v.0.0.2

* Add an array of polls for dev testing.  
For simplicity each poll now contains only a dummy id, a title and an array of options.


      var polls = [{
      	id: 1,
      	title: 'black or white?',
      	options: ['black', 'white']
      	}, {
      	id: 2,
      	title: 'best music artist?',
      	options: ['Metallica', 'Justin Bieber', 'Rick Astley']
      	}, {
      	id: 3,
      	title: 'cat or mouse?',
      	options: ['cat', 'mouse', 'dog']
      	}];

* Configure the INDEX route that displays all polls and redirect the main route there.

      // main route
      app.get('/', (req, res) => {
      	 res.redirect('/polls');
      });
      
      // INDEX - display all polls
      app.get('/polls', (req, res) => {
      	 res.render('main', { polls });
      });


By 

       res.render('main', { polls });

the polls array is passed to main.ejs, where the polls are listed by

      <% polls.forEach((poll) => { %>
      <li> <a href="/polls/<%= poll.id %>"> <%= poll.title %> </a> </li>
      <% }); %>
  
* Configure the SHOW route that shows a specific poll

      // SHOW - shows a specific poll
      app.get('/polls/:id', (req, res) => {
        var id = req.params.id;
        var notFound = true;
        polls.forEach((poll) => {
          if (poll.id.toString() === id) {
            notFound = false;
            res.render('polls/show', { poll });
          }
        });
        if (notFound) {
          res.sendStatus(404);
        }
      }); 

The requested poll is defined by

      var id = req.params.id;

The id is searched inside the polls array and if it is found the poll is passed to views/polls/show.ejs by

      res.render('polls/show', { poll })

There it is displayed by

      <h2> <%= poll.title %> </h2>	
      <hr />
      <% poll.options.forEach((option) => { %>
      <button> <%= option %></button>
      <% }); %>	






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
