## Voting App v.0.0.6

* Add the CDN link for *Chart.js* in the head section of */views/partials/header.ejs*.
```
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.4.0/Chart.bundle.min.js"></script>
```

* Add a canvas element in */views/polls/show.ejs*  to present the chart within:
```
<canvas id="myChart" width="400" height="400"></canvas>
```

* Add the chart creating script. After preparing the chart data, which are passed from the server via the *poll* object during the render of the *SHOW* route, a bar chart is instantiated as suggested in the Chart.js API documentation. Notice that the *poll.options* need to be passed inside the script as JSON stringified HTML code: ```<%- JSON.stringify(poll.options) %>```.
```
<script>
    // Random Hex Color Code Generator in JavaScript
    // Paul Irish, alman, nlogax, and temp01
    // 16777215 == ffffff in decimal
    // source: https://www.paulirish.com/2009/random-hex-color-code-snippets/ 
    function randomHexColorCodeGenerator(){        
        return '#'+Math.floor(Math.random()*16777215).toString(16);
    }

    // get the poll options from the "poll" object passed by the server
    var pollOptions = <%- JSON.stringify(poll.options) %>
    console.log(pollOptions);
        
    // prepare the chart data
    var labels = [];
    var votes = [];
    var backgroundColor = [];
    var borderColor = [];
    pollOptions.forEach((option) => {
        console.log(option.opName, option.opVotes);
        labels.push(option.opName);
        votes.push(option.opVotes);
        backgroundColor.push(randomHexColorCodeGenerator());
        borderColor.push(randomHexColorCodeGenerator());
    });
    console.log(backgroundColor);
    
    // instantiate a bar chart    
    var ctx = document.getElementById("myChart");
    var pollChart = new Chart(ctx, {
        type:'bar',
        data: {
            labels: labels,
            datasets: [{
                label:"Number of Votes",
                data: votes,
                backgroundColor: backgroundColor,
                borderColor: borderColor,
                borderWidth: 1,
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            }
        }
    });
</script>
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