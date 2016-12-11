const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');

app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));

var polls = [{
	id: 1,
	title: 'black or white?',
	user: 'Joe',
	options: [
		{opId: '1', opName: 'black', opVotes: 6},
		{opId: '2', opName: 'white', opVotes: 2},
		{opId: '3', opName: 'red', opVotes: 7},
		{opId: '4', opName: 'green', opVotes: 3}
		]
	}, {
	id: 2,
	title: 'best music artist?',
	user: 'Jack',
	options: [
		{opId: '1', opName: 'Metallica', opVotes: 45}, 
		{opId: '2', opName: 'Justin Bieber', opVotes: 68},
		{opId: '3', opName: 'Rick Astley', opVotes: 231}
		]
	}, {
	id: 3,
	title: 'cat or mouse?',
	user: 'Averel',
	options: [
		{opId: '1', opName: 'cat', opVotes: 1327},
		{opId: '2', opName: 'mouse', opVotes: 2868},
		{opId: '3', opName: 'dog', opVotes: 1145}
		]
	}];

// main route
app.get('/', (req, res) => {
	 res.redirect('/polls');
});

// INDEX - display all polls
app.get('/polls', (req, res) => {
	 res.render('main', { polls });
});

// SHOW - shows a specific poll
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
		user: 'Averel',
		options: newOptions
	}
	polls.push(newPoll);
	res.redirect('/polls');
});

// NEW - show form to create new poll
app.get('/newpoll', (req, res) => {	
	res.render('polls/new');
});


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

app.listen(PORT, process.env.IP, () => {
    console.log('Server started on port', PORT);
});
