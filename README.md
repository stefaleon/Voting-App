## Voting App v.1.0.1
#### Configure *mongoose* and models

* Install *mongoose*, require it, set *dbURL* and connect.

```
	"mongoose": "^4.7.4"
```
```
	const mongoose = require('mongoose');
	const dbURL = process.env.dbURL || 'mongodb://localhost/polls';

	mongoose.connect(dbURL);
```

* Add the *User* and *Poll* models, in *models/user.js* and *models/poll.js* respectively.

```
const userSchema = new mongoose.Schema({
    username:  {
		type: String,
		required: true,
		minlength: 4,
		trim: true
	},
    password:  {
		type: String,
		minlength: 4,
		trim: true
	}
});

const User = mongoose.model('User', userSchema);

module.exports = User;
```

```
const pollSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		minlength: 1,
		trim: true
	},
	user: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
		username: {
			type: String,
			default: 'admin'
		}
	},
	options: [{
		opId: String,
		opName: String,
		opVotes: {
			type: Number,
			default: 0
		}
	}]
});

const Poll = mongoose.model('Poll', pollSchema);

module.exports = Poll;
```
```
const User = require('./models/user');
const Poll = require('./models/poll');
```
#### Connect the routes to the db
* Update the routes in *server.js* to make use of the database.

```
// CREATE
//=============================================================
// create a poll
app.post('/polls', (req, res) => {
	var newOptionsNames = req.body.pOptions.split('\n');
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
		title: req.body.pTitle,
		options: newOptions
	};
	Poll.create(newPoll, (err, newlyCreated) => {
		if (err) {
			console.log(err.message);
			res.status(400).send(err.message);
		} else {
			console.log('Poll Created Succesfully!');
			res.redirect('/polls');
		}
	});
});


// READ
//=============================================================

// show all polls
app.get('/polls', (req, res) => {
	Poll.find({}, (err, allPolls) => {
		if (err) {
			console.log(err);
		} else {
			res.render('main', {polls: allPolls});
		}
	});
});

// show my polls, (temporarily admin's polls only)
app.get('/mypolls', (req, res) => {
	Poll.find({'user.username': 'admin'}, (err, mypolls) => {
		if (err) {
			console.log(err);
		} else {
			res.render('mypolls', {mypolls});
		}
	});
});

// show one poll
app.get('/polls/:id', (req, res) => {
	var customOption = false;	// used for adding a custom option in the poll
	// find the poll
	Poll.findById(req.params.id, (err, poll) => {
		if (err) {
			console.log(err);
			res.sendStatus(404);
		} else {		//if a poll is found

			// when a vote is cast, update vote count
			// if req.query.choice is a valid opId, then increase votes by one
			poll.options.forEach((option) => {
				if (req.query.choice === option.opId) {
					option.opVotes += 1;
					poll.save();
				}
			});

			// in case the new option choice is selected
			if (req.query.choice === 'newOption') {
				// show a new option add form instead of the dropdown in show.ejs
				customOption = true;
			} else {
				customOption = false;
			}

			// if a new option is requested, add it to the poll options array
			if (req.query.newOptionNameEntered)	{
				poll.options.push({
					opId: (poll.options.length + 1).toString(),
					opName: req.query.newOptionNameEntered,
					opVotes: 1
				});
				poll.save();
			}

			// eventually show poll
			res.render('polls/show', {poll, customOption});
		}
	});
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

* mongoose


* bootstrap/3.3.7
* Chart.js/2.4.0
