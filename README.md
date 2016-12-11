## Voting App v.0.0.7

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


* bootstrap/3.3.7
* Chart.js/2.4.0