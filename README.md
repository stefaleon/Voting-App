## Voting App v.2.0.1

## Disallow double voting by checking user-ip


* In *server.js* add the following) to the express initialization code.
```
app.enable('trust proxy');
```

* Check if the user-id is correctly passed to the view.  

* Configure the */polls/:id* route so that a poll can be updated with a new vote only if it has not been voted before.
```
app.get('/polls/:id', (req, res) => {
	var customOption = false;	// used for adding a custom option in the poll

	var ip = req.ip;

	// find the poll
	Poll.findById(req.params.id, (err, poll) => {
		if (err) {
			console.log(err);
			res.sendStatus(404);
		} else {		//if a poll is found

				console.log('ip is:', ip);
				...
				...

			// eventually show poll
			res.render('polls/show', {ip, poll, customOption, deletePoll});
		}
	});
});				
```
* In *show.ejs* show the user-ip.
```
...
<p>user-ip is: <%= ip %></p>
<% if (poll.user.username) { %>
   <br /> <p> Added by: <%= poll.user.username %> </p>
<% } %>
...
```


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


&nbsp;
## TODO
* flash messages
* auth with email/fb/twitter...
* vote once: auth/local storage/cookies...
