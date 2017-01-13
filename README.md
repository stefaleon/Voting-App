## Voting App v.2.0.2

&nbsp;

## User Stories

All users can
* see and vote on everyone's polls.
* see the results of polls in chart form.

Authenticated users can
* keep their polls and come back later to access them.
* share their polls with their friends.
* see the aggregate results of the polls.
* create a poll with any number of possible items.
* create a new option on a poll.

Authorized users can
* delete polls that they don't want anymore.

Discourage multiple votes
* Voting more than once in each poll is disallowed by checking the IP address of the user.


&nbsp;

## Current Stack

* Express
* EJS
* body-parser  

&nbsp;
* mongoose
* method-override

&nbsp;
* express-session
* passport
* passport-local
* passport-local-mongoose

&nbsp;
* bootstrap/3.3.7
* Chart.js/2.4.0



&nbsp;

## 2.0.1
## Discourage multiple votes

#### Disallow voting more than once in each poll by checking the IP address of the user

* In *server.js* add the following to the express initialization code.
```
app.enable('trust proxy');
```

* In *models/poll.js* update the polls' schema to include *IPs*, an array of strings.
```
const pollSchema = new mongoose.Schema({
	...
	...,
	IPs: [String]
});
```

* In the */polls/:id* route, where the polls' voting handling is implemented, assign *alreadyVoted* boolean initially to false, assign the user's IP address to the *currentIP* variable and check for a current IP match in the current poll's *IPs* field (if there is such) and set *alreadyVoted* accordingly.  
```
app.get('/polls/:id', (req, res) => {
	var customOption = false;	// used for adding a custom option in the poll
	var alreadyVoted = false;
	var currentIP = req.ip;		// used for dissalowing multiple votes
	// find the poll
	Poll.findById(req.params.id, (err, poll) => {
		if (err) {
			console.log(err);
			res.sendStatus(404);
		} else {		//if a poll is found

			console.log('Current IP is:', currentIP);
			// check in poll's "IPs" field if the current IP is matched
			if (poll.IPs) {
				poll.IPs.forEach((ip) => {
					if (ip === currentIP) {
						alreadyVoted = true;
					}
				});
			}
		...
```
* If the poll has not already been voted, go on with the appropriate logic and add the current IP to the *IPs* field array for the current poll before each save.
```
		...
		// if it has not already been voted...
		if (!alreadyVoted) {

				// when a vote is cast, update vote count
				// if req.query.choice is a valid opId, then increase votes by one
				poll.options.forEach((option) => {
					if (req.query.choice === option.opId) {
						option.opVotes += 1;
						// add current IP to the IPs field array for this poll
						poll.IPs.push(currentIP);
						// avoid showing the voting form in the next render
						alreadyVoted = true;
						// save poll in db
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
					// add current IP to the IPs field array for this poll
					poll.IPs.push(currentIP);
					// avoid showing the voting form in the next render
					alreadyVoted = true;
					// save poll in db
					poll.save();
				}

		} // end of already voted checking
		...
```
* Finally pass the *alreadyVoted* and *currentIP* parameters to the view along with the rest.
```
		...
			// ask for another confirmation in case of request to delete the poll
			if (req.query.deletePushed === 'deletePoll') {
				deletePoll = true;
			} else {
				deletePoll = false;
			}

			// eventually show poll
			res.render('polls/show', {alreadyVoted, currentIP, poll, customOption, deletePoll});
		}
	});
});
```

* In *views/show.ejs* display a message if the poll has already been voted, otherwise proceed normally to showing the voting form.
```
<% if (alreadyVoted) { %>
	<h3> Thank you for voting
		<br /> in this poll! </h3>
<% } else { %>
	<% if (customOption) { %>
		<h3>Cast a vote for...</h3>
		<form>
			<input name="newOptionNameEntered" required
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
				<% if (currentUser) { %>
					<option value="newOption">Add a new option</option>
				<% } %>
				<input type="submit" class="btn btn-success voteInput">
			</select>
		</form>
	<% } %>
<% } %>
```

## 2.0.2
#### Style the app
* Style the poll lists in *views/main.ejs* and *views/mypolls.ejs* with Bootstrap Listgroup items.
```
<div class="list-group">
	<% polls.forEach((poll) => { %>
		<a href="/polls/<%= poll.id %>" class="list-group-item"> <%= poll.title %> </a>
	<% }); %>
</div>
```

* Fix more issues for the overall app look, shadow of main title is the basic characteristic of each page.
```
.shadowtitletext {
    color: white;
    text-shadow: 1px 1px 2px black, 0 0 25px green, 0 0 5px darkgreen;    
	margin: 1.2em;
}
```
```
<div class="well wellmain">
	<h3 class="shadowtitletext"> Voting App: View, Vote, Make a Poll </h3>
	...
```
```
<div class="col-sm-6">
	<h2 class="shadowtitletext">Login</h2>
	...
```
```
etc
```
