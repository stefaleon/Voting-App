## Voting App v.1.0.3


## 1.0.1
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

## 1.0.2
#### Add the delete route

* Install *method-override*, require and use it.

```
"method-override": "^2.3.7"
```
```
const methodOverride = require('method-override');
```
```
app.use(methodOverride('_method'));
```


* Add the delete route.

```
app.delete('/polls/:id', (req, res) => {
	Poll.findByIdAndRemove(req.params.id, (err) => {
		if (err) {
			console.log(err);
			res.redirect('/polls/' + req.params.id);
		} else {
			console.log('Remove Successful!');
			res.redirect('/polls');
		}
	});
});
```
#### Add a two-step delete button
* A *delete* button is added in *views/polls/show.ejs*. Logic for a second step confirmation after the first button press is included.

```
	<% if (!deletePoll) { %>
		<form id='delete'>
			<button name="deletePushed" value="deletePoll" class="btn btn-danger">
				Delete "<%= poll.title %>"
			</button>
		</form>
	<% } else { %>
		<form id='delete' action='/polls/<%= poll._id %>?_method=DELETE' method='POST'>
			<button  class="btn btn-danger">
				Confirm Deletion of "<%= poll.title %>"
			</button>
		</form>
	<% } %>
```

* The required property passing logic is added in the *"show one poll"* route.

```
			...
			// ask for another confirmation in case of request to delete the poll
			if (req.query.deletePushed === 'deletePoll') {
				deletePoll = true;
			} else {
				deletePoll = false;
			}

			// eventually show poll
			res.render('polls/show', {poll, customOption, deletePoll});
		}
	});
});
```

## 1.0.3
#### Authentication setup

* Install and use *express-session*.

```
"express-session": "^1.14.2"
```
```
const SECRET = process.env.SECRET || 'my secret combination';
```
```
app.use(require('express-session')({
	secret: SECRET,
	resave: false,
	saveUninitialized: false
}));
```

* Install, require and use *passport*, *passport-local* and *passport-local-mongoose*.

```
"passport": "^0.3.2",
"passport-local": "^1.0.0",
"passport-local-mongoose": "^4.0.0"
```
```
const passport = require('passport');
const LocalStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
```
```
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
```

* Make the *passport-local-mongoose* methods available for the *User* model.

```
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    username:  {
		...
		...

userSchema.plugin(passportLocalMongoose);
	...
```

* Eventually, pass the authenticated user, provided by *passport* via *req.user*, to the views as *"currentUser"* via *res.locals* provided by *Express*.

```
// passport's "req.user" contains the authenticated user
// middleware for passing the current user to the views
app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	next();
});
```

#### Configure the authentication views
* Add the *Sign Up* and *Log In* views in *views/auth/register.ejs* and *views/auth/login.ejs* respectively.
```
	<form action='/signup' method='post'>
		<div class='form-group'>
			<input type='text' required name='username' pattern=".{4,}"
				placeholder="username, 4 chars minimum " class='form-control'/>
		</div>
		<div class='form-group'>
			<input type='password' required name='password' pattern=".{4,}"
				placeholder="password, 4 chars minimum" class='form-control' />
		</div>
		<div class="form-group">
			<input type="submit" value="Register" class="btn btn-success btn-block"/>
		</div>
	</form>
```
```
	<form action='/login' method='post'>
		<div class='form-group'>
			<input type='text' name='username' placeholder="username" class='form-control'/>
		</div>
		<div class='form-group'>
			<input type='password' name='password' placeholder="password" class='form-control' />
		</div>
		<div class="form-group">
			<input type="submit" value="Login" class="btn btn-success btn-block"/>
		</div>
	</form>
```

#### Configure the authentication routes

* Eventually, add the authentication routes.

```
// auth routes
//=============================================================

// new user form
app.get('/signup', (req, res) => {
	res.render('auth/register');
});

// CREATE a user
app.post('/signup', (req, res) => {
	var newUser = new User({username: req.body.username});
	// register method hashes the password
	User.register(newUser, req.body.password, (err, user) => {
		if (err) {
			console.log(err);
			return res.render('auth/register');
		}
		// if no error occurs, local strategy authentication takes place
		passport.authenticate('local')(req, res, () => {
			res.redirect('/');
		});
	});
});

// login form
app.get('/login', (req, res) => {
	res.render('auth/login');
});

// user login
app.post('/login', passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/login'
}), (req, res) => {
});

// user logout
app.get('/logout', (req, res) => {
	req.logout();
	res.redirect('/');
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
* method-override

* express-session
* passport
* passport-local
* passport-local-mongoose

* bootstrap/3.3.7
* Chart.js/2.4.0
