## Voting App v.0.0.4

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



&nbsp;
  
### Final Project User Stories

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
  
### Current Stack

* Express
* EJS
* body-parser