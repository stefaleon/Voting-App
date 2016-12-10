## Voting App v.0.0.5

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