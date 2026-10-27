function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;	

	let earliest = tweet_array[0].time;
	let latest = tweet_array[0].time;

	for (let i = 0; i < tweet_array.length; i++)
	{
		if (tweet_array[i].time < earliest)
		{
			earliest = tweet_array[i].time;
		}
		if (tweet_array[i].time > latest)
		{
			latest = tweet_array[i].time;
		}
	}

	let dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
	document.getElementById('firstDate').innerText = earliest.toLocaleDateString('en-US', dateOptions);
	document.getElementById('lastDate').innerText = latest.toLocaleDateString('en-US', dateOptions);

	let completedCount = 0;
	let liveCount = 0;
	let achievementCount = 0;
	let miscCount = 0;

	for (let i = 0; i < tweet_array.length; i++)
	{
		if (tweet_array[i].source == "completed_event")
		{
			completedCount++;
		}
		if (tweet_array[i].source == "live_event")
		{
			liveCount++;
		}
		if (tweet_array[i].source == "achievement")
		{
			achievementCount++;
		}
		if (tweet_array[i].source == "miscellaneous")
		{
			miscCount++;
		}
	}

	let total = tweet_array.length;

	let completedSpans = document.getElementsByClassName('completedEvents');
	for (let i = 0; i < completedSpans.length; i++)
	{
		completedSpans[i].innerText = completedCount;
	}
	document.getElementsByClassName('completedEventsPct')[0].innerText = (completedCount / total * 100).toFixed(2) + "%";

	document.getElementsByClassName('liveEvents')[0].innerText = liveCount;
	document.getElementsByClassName('liveEventsPct')[0].innerText = (liveCount / total * 100).toFixed(2) + "%";

	document.getElementsByClassName('achievements')[0].innerText = achievementCount;
	document.getElementsByClassName('achievementsPct')[0].innerText = (achievementCount / total * 100).toFixed(2) + "%";

	document.getElementsByClassName('miscellaneous')[0].innerText = miscCount;
	document.getElementsByClassName('miscellaneousPct')[0].innerText = (miscCount / total * 100).toFixed(2) + "%";

	let writtenCount = 0;

	for (let i = 0; i < tweet_array.length; i++)
	{
		if (tweet_array[i].written == true)
		{
			writtenCount++;
		}
	}

	document.getElementsByClassName('written')[0].innerText = writtenCount;
	document.getElementsByClassName('writtenPct')[0].innerText = (writtenCount / completedCount * 100).toFixed(2) + "%";

}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});