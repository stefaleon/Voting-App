## Voting App v.0.0.3

* Transform polls.options property to array of objects. Each options object has now three properties, an id string, a name string and a votes number.

```
    var polls = [{
          id: 1,
          title: 'black or white?',
          options: [
            {opId: '1', opName: 'black', opVotes: 3},
            {opId: '2', opName: 'white', opVotes: 2}
            ]
          }, {
          id: 2,
          title: 'best music artist?',
          options: [
            {opId: '1', opName: 'Metallica', opVotes: 45}, 
            {opId: '2', opName: 'Justin Bieber', opVotes: 68},
            {opId: '3', opName: 'Rick Astley', opVotes: 231}
            ]
          }, {
          id: 3,
          title: 'cat or mouse?',
          options: [
            {opId: '1', opName: 'cat', opVotes: 1327},
            {opId: '2', opName: 'mouse', opVotes: 2868},
            {opId: '3', opName: 'dog', opVotes: 1145}
            ]
          }];
```

* In views/polls/show.ejs the votes number is displayed next to the respective poll option.

```
      <% poll.options.forEach((option) => { %>
        <p>           
          <span id="optionSpan">
            <%= option.opName %>
          </span>
            has been voted <%= option.opVotes %> times
        </p>
      <% }); %>
```

* A form containing a dropdown selection menu initiates the voting of the selected option by assigning the option id to the selection option value. The select name is "choice". An "add option" option is included before the submit type input.


```
      <form >
        <select name="choice" class="btn btn-default dropdown-toggle" id="voteSelect">
          <option disabled selected>Cast a vote for...</option>
          <% poll.options.forEach((option) => { %>      
              <option value="<%= option.opId %>"> <%= option.opName %> </option>
          <% }); %>
          <option value="newOption">Add a new option</option>       
          <input type="submit" class="btn btn-success" id="voteInput"> 
        </select>
      </form>     
      
```

* The selected option id is now available via the req.query.choice property in the request object. Control logic is added to the SHOW route in order to increase the vote count for the respective poll option. A check for "new option" query is also added before the "show poll" view is rendered.

```
// SHOW - shows a specific poll
app.get('/polls/:id', (req, res) => {
  var id = req.params.id;
  var notFound = true;
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
          // show a new option add form
          res.send('add new option');                     
        } else {
          res.render('polls/show', { poll });
        }     
    }
  }); 
  if (notFound) {
    res.sendStatus(404);
  } 
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
