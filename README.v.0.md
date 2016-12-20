## 0.0.1
#### Basic Express & EJS configuration

* Install dependencies

```
      "ejs": "^2.5.5",
      "express": "^4.14.0"
```
* Require *express* and assign it to app

```
      const express = require('express');
      const app = express();
```

* Set view engine to *EJS*

```
      app.set('view engine', 'ejs');
```

* Use the *public* folder for static files

```
      app.use(express.static(__dirname + '/public'));
```

* Set a proper port for the app to listen on

```
      const PORT = process.env.PORT || 3000;

      app.listen(PORT, process.env.IP, () => {
      	console.log('Server started on port', PORT);
      });
```
* Configure partial files in *views*, *navbar* in *header*
* Configure dummy *main.ejs* and *mypolls.ejs*
* Apply basic *bootstrap* styling
* Finally add a couple of dummy routes

```
      // main route
      app.get('/', (req, res) => {
      	 res.render('main');
      });

      // list my polls
      app.get('/mypolls', (req, res) => {
      	res.render('mypolls');
      });
```



## 0.0.2
#### Configure the basic *READ* routes

* Add an array of polls for dev testing.  
For simplicity each poll now contains only a dummy id, a title and an array of options.

```
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
```
* Configure the *INDEX* route that displays all polls and redirect the main route there.

```
      // main route
      app.get('/', (req, res) => {
      	 res.redirect('/polls');
      });

      // INDEX - display all polls
      app.get('/polls', (req, res) => {
      	 res.render('main', { polls });
      });
```

By
```
       res.render('main', { polls });
```
the polls array is passed to *main.ejs*, where the polls are listed by

```
      <% polls.forEach((poll) => { %>
      	<li> <a href="/polls/<%= poll.id %>"> <%= poll.title %> </a> </li>
      <% }); %>
```

* Configure the *SHOW* route that shows a specific poll

```
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
```

The requested poll is defined by
```
      var id = req.params.id;
```
The id is searched inside the polls array and if it is found the poll is passed to *views/polls/show.ejs* by
```
      res.render('polls/show', { poll })
```
There it is displayed by

```
      <h2> <%= poll.title %> </h2>
      <hr />
      <% poll.options.forEach((option) => { %>
      	<button> <%= option %></button>
      <% }); %>
```


## 0.0.3
#### Configure poll options form and logic

* Transform *polls.options* property to an array of objects. Each *options* object has now three properties, an *id* string, a *name* string and a *votes* number.

```
    var polls = [{
          id: 1,
          title: 'black or white?',
          options: [
            {opId: '1', opName: 'black', opVotes: 3},
            {opId: '2', opName: 'white', opVotes: 2}
            ]
          }, {
          id: 2,
          title: 'best music artist?',
          options: [
            {opId: '1', opName: 'Metallica', opVotes: 45},
            {opId: '2', opName: 'Justin Bieber', opVotes: 68},
            {opId: '3', opName: 'Rick Astley', opVotes: 231}
            ]
          }, {
          id: 3,
          title: 'cat or mouse?',
          options: [
            {opId: '1', opName: 'cat', opVotes: 1327},
            {opId: '2', opName: 'mouse', opVotes: 2868},
            {opId: '3', opName: 'dog', opVotes: 1145}
            ]
          }];
```

* In *views/polls/show.ejs* the votes number is displayed next to the respective poll option.

```
      <% poll.options.forEach((option) => { %>
        <p>           
          <span id="optionSpan">
            <%= option.opName %>
          </span>
            has been voted <%= option.opVotes %> times
        </p>
      <% }); %>
```

* A form containing a dropdown selection menu initiates the voting of the selected option by assigning the option id to the selection option value. The select name is *"choice"*. An *"add option"* option is included before the *submit* type input.


```
      <form >
        <select name="choice" class="btn btn-default dropdown-toggle" id="voteSelect">
          <option disabled selected>Cast a vote for...</option>
          <% poll.options.forEach((option) => { %>      
              <option value="<%= option.opId %>"> <%= option.opName %> </option>
          <% }); %>
          <option value="newOption">Add a new option</option>       
          <input type="submit" class="btn btn-success" id="voteInput">
        </select>
      </form>     

```

#### Add and count votes

* The selected option id is now available via the *req.query.choice* property in the request object. Control logic is added to the *SHOW* route in order to increase the vote count for the respective poll option. A check for *"new option"* query is also added before the *"show poll"* view is rendered.

```
// SHOW - shows a specific poll
app.get('/polls/:id', (req, res) => {
  var id = req.params.id;
  var notFound = true;
  polls.forEach((poll) => {
    if (poll.id.toString() === id) {
      notFound = false;     
        // if req.query.choice is a valid opId, then increase votes by one        
        poll.options.forEach((option) => {              
          if (req.query.choice === option.opId) {           
            option.opVotes += 1;            
          }
        });
        if (req.query.choice === 'newOption') {
          // show a new option add form
          res.send('add new option');                     
        } else {
          res.render('polls/show', { poll });
        }     
    }
  });
  if (notFound) {
    res.sendStatus(404);
  }
});
```


## 0.0.4
#### Add the *New Poll* functionality

* Add the *POST* route, which creates new polls.

```
// CREATE - create new poll
app.post('/polls', (req, res) => {
	res.send('This is the POST route');
});
```

* Install, require and use *body-parser*.

```
$ npm install body-parser --save
```
```
const bodyParser = require('body-parser');
```
```
app.use(bodyParser.urlencoded({extended: true}));
```

* Add the *NEW* route, which shows a form to create a new poll.

```
// NEW - show form to create new poll
app.get('/newpoll', (req, res) => {
	res.render('polls/new');
});
```
Due to a conflict with the current configuration of the *SHOW* route, the RESTful convention has to be bypassed and the route is set to */newpoll* instead of */polls/new*.

* Configure the */views/polls/new.ejs* file, which will be rendered by the *NEW* route. This contains the following form:

```
<form action="/polls" method="POST">
	<div class="form-group">
		<input type="text" name="pTitle" class="form-control"
			placeholder="poll title" required/>
	</div>			
	<div class="form-group ">
		<label>Enter poll options in the textarea below. Separate with new line.</label>
		<textarea type="text" rows=10 name="pOptions"
			class="form-control" required></textarea>
	</div>		
	<div class="form-group">
		<input type="submit" value="Add" class="btn btn-success btn-block"/>
	</div>		
</form>
```
When a *POST* is made, the request object will contain the *req.body.pTitle* and *req.body.pOptions* properties, which can be accessed via *body-parser*.

#### Configure the *CREATE* route

* Now the *CREATE* route can be edited as below:

```
// CREATE - create new poll
app.post('/polls', (req, res) => {
	console.log(req.body);
	var newOptionsNames = req.body.pOptions.split('\n');
	console.log(newOptionsNames);
	var newOptions = [];
	var newOpId = 0;
	newOptionsNames.forEach((newOpName) => {
		newOpId += 1;
		newOptions.push({
			opId: newOpId.toString(),
			opName: newOpName,
			opVotes: 0
		})
	});
	var newPoll = {
		id: polls.length + 1,
		title: req.body.pTitle,
		options: newOptions
	}
	polls.push(newPoll);
	res.redirect('/polls');
});
```
The posted *req.body* properties are used to create a new poll object, which is subsequently pushed to the *polls* array.
The route redirects to the */polls* route, where the new poll object can be seen and used, as long as the server is not restarted. A database will be introduced for data persistance.



## 0.0.5
#### Add the *New Option* functionality on a poll

* The boolean type variable *customOption* is introduced and initialized to *false* in the *SHOW* route. The route is edited so that *customOption* is passed to */views/polls/show.ejs*.

```
// SHOW - shows a specific poll
app.get('/polls/:id', (req, res) => {
	var id = req.params.id;
	var notFound = true;
	var customOption = false;
	polls.forEach((poll) => {
		if (poll.id.toString() === id) {
			notFound = false;			
  			// if req.query.choice is a valid opId, then increase votes by one
  			poll.options.forEach((option) => {  	  				
  				if (req.query.choice === option.opId) {
  					option.opVotes += 1;  					
  				}
  			});
  			if (req.query.choice === 'newOption') {
  				// show a new option add form instead of the dropdown in show.ejs
  				customOption = true;
		  	} else {
		  		customOption = false;
		  	}
		res.render('polls/show', { poll, customOption });  			
		}
	});
	if (notFound) {
		res.sendStatus(404);
	}
});
```
If the *"Add a new option"* is voted, *req.query.choice* gets the *newOption* value and *customOption* is set to true.

* Edit */views/polls/show.ejs* so that the view will change accordingly to *customOption* value. If it is true, an input form will be receiving the custom vote option. Else the dropdown menu will be displayed as usual.

```
	<% if (customOption) { %>		
		<h3>Cast a vote for...</h3>
		<form>
			<input name="newOptionNameEntered"
				placeholder="custom option" class="btn btn-default" id="voteSelect" />
			<input type="submit" class="btn btn-success voteInput" value="Submit Vote">
		</form>

	<% } else { %>
		<form>
			<select name="choice" class="btn btn-default dropdown-toggle" id="voteSelect">
				<option disabled selected>Cast a vote for...</option>
				<% poll.options.forEach((option) => { %>			
		  			<option value="<%= option.opId %>"> <%= option.opName %> </option>
				<% }); %>
				<option value="newOption">Add a new option</option>
				<input type="submit" class="btn btn-success voteInput">
			</select>
	    </form>
	<% } %>
```
The input name is set to *newOptionNameEntered*. This sets a value to the *req.query.newOptionNameEntered* property when the input is submitted.

* The presence of *req.query.newOptionNameEntered* in the request object enables the new option assigning logic. The new option is added to the appropriate poll with a vote count of 1.

```
/ SHOW - shows a specific poll
app.get('/polls/:id', (req, res) => {
	var id = req.params.id;
	var notFound = true;
	var customOption = false;

	console.log(req.query);
	if (req.query.newOptionNameEntered)	{
		// add new option to options array in the appropriate poll
		polls.forEach((poll) => {
			if (poll.id.toString() === id) {
				poll.options.push({
					opId: (poll.options.length + 1).toString(),
					opName: req.query.newOptionNameEntered,
					opVotes: 1
				});
			}
		});
	}
	...
	...
	...
});

```

* The id assigning logic is faulty - can produce errors if the *DESTROY* route is added - but it is also temporary, since the ids will be being produced by the database.


## 0.0.6
#### Display the poll data in a chart

* Add the CDN link for *Chart.js* in the head section of */views/partials/header.ejs*.
```
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.4.0/Chart.bundle.min.js"></script>
```

* Add a canvas element in */views/polls/show.ejs*  to present the chart within:
```
<canvas id="myChart" width="400" height="400"></canvas>
```

* Add the chart creating script. After preparing the chart data, which are passed from the server via the *poll* object during the render of the *SHOW* route, a bar chart is instantiated as suggested in the Chart.js API documentation. Notice that the *poll.options* need to be passed inside the script as JSON stringified HTML code: ```<%- JSON.stringify(poll.options) %>```.
```
<script>
    // Random Hex Color Code Generator in JavaScript
    // Paul Irish, alman, nlogax, and temp01
    // 16777215 == ffffff in decimal
    // source: https://www.paulirish.com/2009/random-hex-color-code-snippets/
    function randomHexColorCodeGenerator(){        
        return '#'+Math.floor(Math.random()*16777215).toString(16);
    }

    // get the poll options from the "poll" object passed by the server
    var pollOptions = <%- JSON.stringify(poll.options) %>
    console.log(pollOptions);

    // prepare the chart data
    var labels = [];
    var votes = [];
    var backgroundColor = [];
    var borderColor = [];
    pollOptions.forEach((option) => {
        console.log(option.opName, option.opVotes);
        labels.push(option.opName);
        votes.push(option.opVotes);
        backgroundColor.push(randomHexColorCodeGenerator());
        borderColor.push(randomHexColorCodeGenerator());
    });
    console.log(backgroundColor);

    // instantiate a bar chart    
    var ctx = document.getElementById("myChart");
    var pollChart = new Chart(ctx, {
        type:'bar',
        data: {
            labels: labels,
            datasets: [{
                label:"Number of Votes",
                data: votes,
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                borderWidth: 1,
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });
</script>
```




## 0.0.7
#### Add the *My Polls* functionality

* Add a *user* property to each *poll* instance and implement the *mypolls* route.
```
var polls = [{
	id: 1,
	title: 'black or white?',
	user: 'Joe',
	options: [
		{opId: '1', opName: 'black', opVotes: 6},
		{opId: '2', opName: 'white', opVotes: 2},
		...]
...
```
```
// list my polls -- actually Averel's polls for the time being
app.get('/mypolls', (req, res) => {
	var mypolls = [];
	polls.forEach((poll) => {
		if (poll.user === 'Averel') {
				mypolls.push(poll);				
			}
		});
	res.render('mypolls', { mypolls });
});
```
Since user authentication has not yet been added, *mypolls* will be temporarily simulated with user *Averel*'s polls...  


* Edit *mypolls.ejs* accordingly:
```
<% mypolls.forEach((poll) => { %>
	<li> <a href="/polls/<%= poll.id %>"> <%= poll.title %> </a> </li>
<% }); %>			
```



* Edit the *CREATE* route so that the *user* property is added to new posts.
*Averel* simulates the currently logged-in user.
```
// CREATE - create new poll
app.post('/polls', (req, res) => {
	...
	...
	var newPoll = {
		id: polls.length + 1,
		title: req.body.pTitle,
		user: 'Averel',
		options: newOptions
	}
	polls.push(newPoll);
	res.redirect('/polls');
});
```

&nbsp;

## Final Project User Stories

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

## Current Stack

* Express
* EJS
* body-parser


* bootstrap/3.3.7
* Chart.js/2.4.0
