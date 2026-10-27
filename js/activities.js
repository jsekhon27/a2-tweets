function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.

	let activityNames = [];
	let activityCounts = [];

	for (let i = 0; i < tweet_array.length; i++) 
	{
		if (tweet_array[i].source == "completed_event") 
		{
			let name = tweet_array[i].activityType;
			let spot = activityNames.indexOf(name);

			if (spot == -1) 
			{
				activityNames.push(name);
				activityCounts.push(1);
			}
			else 
			{
				activityCounts[spot]++;
			}
		}
	}

	let activityData = [];
	for (let i = 0; i < activityNames.length; i++) 
	{
		activityData.push({ activity: activityNames[i], count: activityCounts[i] });
	}

	let tempCounts = activityCounts.slice();
	let topNames = [];

	for (let n = 0; n < 3; n++) {
		let bestSpot = 0;
		for (let i = 0; i < tempCounts.length; i++) 
		{
			if (tempCounts[i] > tempCounts[bestSpot]) 
			{
				bestSpot = i;
			}
		}
		topNames.push(activityNames[bestSpot]);
		tempCounts[bestSpot] = -1;
	}

	document.getElementById('numberActivities').innerText = activityNames.length;
	document.getElementById('firstMost').innerText = topNames[0];
	document.getElementById('secondMost').innerText = topNames[1];
	document.getElementById('thirdMost').innerText = topNames[2];

	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {
	    "values": activityData
	  },
	  	"mark": "bar",
		"encoding": {
			"x": { "field": "activity", "type": "nominal", "sort": "-y" },
			"y": { "field": "count", "type": "quantitative" }
		}

	  //TODO: Add mark and encoding
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.

	let dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	let distanceData = [];

	for (let i = 0; i < tweet_array.length; i++) 
	{
		if (tweet_array[i].source == "completed_event") 
		{
			let name = tweet_array[i].activityType;
			if (topNames.includes(name)) 
			{
				distanceData.push({
					activity: name,
					day: dayNames[tweet_array[i].time.getDay()],
					distance: tweet_array[i].distance
				});
			}
		}
	}

	distance_vis_spec = 
	{
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "Distance by day of the week for the three most tweeted activities.",
		"data": {
			"values": distanceData
		},
		"mark": "point",
		"encoding": {
			"x": { "field": "day", "type": "nominal", "sort": dayNames },
			"y": { "field": "distance", "type": "quantitative" },
			"color": { "field": "activity", "type": "nominal" }
		}
	};
	vegaEmbed('#distanceVis', distance_vis_spec, { actions: false });

	distance_vis_aggregated_spec =
	{
		"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
		"description": "Mean distance by day of the week for the three most tweeted activities.",
		"data": {
			"values": distanceData
		},
		"mark": { "type": "point", "filled": true, "size": 100 },
		"encoding": {
			"x": { "field": "day", "type": "nominal", "sort": dayNames },
			"y": { "aggregate": "mean", "field": "distance", "type": "quantitative", "title": "mean of distance" },
			"color": { "field": "activity", "type": "nominal" }
		}
	};
	vegaEmbed('#distanceVisAggregated', distance_vis_aggregated_spec, { actions: false });

	document.getElementById('distanceVisAggregated').style.display = "none";

	document.getElementById('aggregate').addEventListener('click', function () {
		let button = document.getElementById('aggregate');

		if (button.innerText == "Show means") {
			document.getElementById('distanceVis').style.display = "none";
			document.getElementById('distanceVisAggregated').style.display = "block";
			button.innerText = "Show all activities";
		}
		else {
			document.getElementById('distanceVis').style.display = "block";
			document.getElementById('distanceVisAggregated').style.display = "none";
			button.innerText = "Show means";
		}
	});

	document.getElementById('longestActivityType').innerText = "bike";
	document.getElementById('shortestActivityType').innerText = "walk";
	document.getElementById('weekdayOrWeekendLonger').innerText = "weekends";
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});