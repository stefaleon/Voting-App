const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');


app.use(express.static(__dirname + '/public'));

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
	// console.log(req.params.id);
	// res.send('got a poll!');	
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


// .... list my polls
app.get('/mypolls', (req, res) => {
	res.render('mypolls');
});

app.listen(PORT, process.env.IP, () => {
    console.log('Server started on port', PORT);
});
