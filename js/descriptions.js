let writtenTweets = [];

function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	//TODO: Filter to just the written tweets
	tweet_array = runkeeper_tweets.map(function (tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	for (let i = 0; i < tweet_array.length; i++) {
		if (tweet_array[i].written == true) {
			writtenTweets.push(tweet_array[i]);
		}
	}
}

function addEventHandlerForSearch() {
	//TODO: Search the written tweets as text is entered into the search box, and add them to the table
	document.getElementById('textFilter').addEventListener('input', function () {
		let typedText = document.getElementById('textFilter').value;
		let searchWord = typedText.toLowerCase();
		let matchCount = 0;
		let tableHTML = "";

		if (searchWord != "") {
			for (let i = 0; i < writtenTweets.length; i++) {
				if (writtenTweets[i].writtenText.toLowerCase().includes(searchWord)) {
					matchCount++;
					tableHTML += writtenTweets[i].getHTMLTableRow(matchCount);
				}
			}
		}

		document.getElementById('searchText').innerText = typedText;
		document.getElementById('searchCount').innerText = matchCount;
		document.getElementById('tweetTable').innerHTML = tableHTML;
	});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	addEventHandlerForSearch();
	loadSavedRunkeeperTweets().then(parseTweets);
});