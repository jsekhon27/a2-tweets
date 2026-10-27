class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

    get source():string {
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.
        let lowerText = this.text.toLowerCase();

        if (lowerText.startsWith("just completed") || lowerText.startsWith("just posted")) 
        {
            return "completed_event";
        }
        if (lowerText.startsWith("watch my")) 
        {
            return "live_event";
        }
        if (lowerText.startsWith("achieved") || lowerText.includes("i just set a goal")) 
        {
            return "achievement";
        }
        return "miscellaneous";
    }

    get written():boolean {
        //TODO: identify whether the tweet is written
        if (this.source != "completed_event")
        {
            return false;
        }
        if (this.text.includes("Check it out!")) 
        {
            return false;
        }
        if (this.text.includes("TomTom MySports Watch")) 
        {
            return false;
        }
        return true;
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        //TODO: parse the written text from the tweet
        let cleaned = this.text;

        let linkStart = cleaned.indexOf("https://t.co");
        if (linkStart != -1)
        {
            cleaned = cleaned.substring(0, linkStart);
        }
        cleaned = cleaned.replace("#Runkeeper", "");
        cleaned = cleaned.replace("#RunKeeper", "");

        let dashSpot = cleaned.indexOf(" - ");
        if (dashSpot != -1)
        {
            cleaned = cleaned.substring(dashSpot + 3);
        }

        return cleaned.trim();
    }

    get activityType():string {
        if (this.source != 'completed_event') 
        {
            return "unknown";
        }

        let words = this.text.split(" ");

        if (words[4] == "km" || words[4] == "mi") 
        {
            return words[5];
        }
        return words[3];

    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        let words = this.text.split(" ");

        if (words[4] == "km") 
        {
            return parseFloat(words[3]) / 1.609;
        }
        if (words[4] == "mi") 
        {
            return parseFloat(words[3]);
        }
        return 0;

    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        let linkStart = this.text.indexOf("https://t.co");
        let linkEnd = this.text.indexOf(" ", linkStart);
        if (linkEnd == -1) {
            linkEnd = this.text.length;
        }

        let link = this.text.substring(linkStart, linkEnd);
        let tweetHTML = this.text.replace(link, "<a href='" + link + "'>" + link + "</a>");

        return "<tr><td>" + rowNumber + "</td><td>" + this.activityType + "</td><td>" + tweetHTML + "</td></tr>";
    }
}