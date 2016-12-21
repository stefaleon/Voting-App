const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const dbURL = process.env.dbURL || 'mongodb://localhost/polls';
const methodOverride = require('method-override');

const SECRET = process.env.SECRET || 'my secret combination';
const passport = require('passport');
const LocalStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');

const User = require('./models/user');
const Poll = require('./models/poll');

mongoose.connect(dbURL);



app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));

// auth setup
app.use(require('express-session')({
	secret: SECRET,
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// passport's "req.user" contains the authenticated user
// middleware for passing the current user to the views
app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	next();
});


// ROUTES
//=============================================================

// main route
app.get('/', (req, res) => {
	 res.redirect('/polls');
});

// new poll form
app.get('/newpoll', (req, res) => {
	res.render('polls/new');
});


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


// DESTROY
//=============================================================
// delete a poll
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



app.listen(PORT, process.env.IP, () => {
    console.log('Server started on port', PORT);
});
