var mongoose = require('mongoose');
const User = require('./models/user');
const Poll = require('./models/poll');


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


function seedDb(){
	// remove all
	Poll.remove({}, function(err) {
		if (err) {
			console.log(err);
		} else {
			console.log('polls removed!')
			// add polls
			polls.forEach(function (poll) {
				Poll.create(poll, function(err, addedPoll){
					if (err) {
						console.log(err);
					} else {
						console.log(addedPoll.title, "added");

					}
				});
			});
		}
	});


}

module.exports = seedDb;
