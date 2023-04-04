import csv

class Tweet:

    def parseTweet(self,data):
        dict = {}
        for status in data:
           
            id = status.id_str
            dict[id] = {}
            dict[id]["tweet_id"] = id
            dict[id]["user_name"] = status.user.name
            dict[id]["created_at"] = status.created_at.isoformat()
            try:
                dict[id]["text"] = status.full_text
            except:
                dict[id]["text"] = status.text
            dict[id]["source"] = status.source
            try:
                dict[id]["place"] = status.place.full_name
            except:
                dict[id]["place"] = status.place
            dict[id]["favorite_count"] = status.favorite_count
            dict[id]["favorited"] = status.favorited
            dict[id]["retweeted"] = status.retweeted
            dict[id]["in_reply_to_status_id_str"] = status.in_reply_to_status_id_str
            dict[id]["in_reply_to_user_id_str"] = status.in_reply_to_user_id_str
            dict[id]["in_reply_to_screen_name"] = status.in_reply_to_screen_name
        return dict

    def parseSnscrapeTweet(self,data):
        dict = {}
        for tweet in data:
            id = str(tweet.id)
            dict[id] = {}
            dict[id]["tweet_id"] = id
            dict[id]["user_name"] = tweet.user.username
            dict[id]["created_at"] = tweet.date.isoformat()
            dict[id]["text"] = tweet.content
            dict[id]["source"] = tweet.sourceLabel
            dict[id]["place"] = None
            if tweet.place:
                dict[id]["place"] = tweet.place.name
            dict[id]["favorite_count"] = tweet.likeCount
            dict[id]["retweeted"] = False
            if tweet.retweetedTweet:
                dict[id]["retweeted"] = True
            dict[id]["in_reply_to_status_id_str"] = str(tweet.inReplyToTweetId)
            try:
                dict[id]["in_reply_to_user_id_str"] = str(tweet.inReplyToUser.id)
            except:
                dict[id]["in_reply_to_user_id_str"] = None
            try:
                dict[id]["in_reply_to_screen_name"] = tweet.inReplyToUser.username
            except:
                dict[id]["in_reply_to_screen_name"] = None
        return dict

    def dumpCSV(self,filename,data):
        with open(filename, mode='w',encoding='utf-8') as csv_file:
            fieldnames = [
                'user_name',
                'tweet_id', 
                'created_at',
                'favorite_count', 
                'text', 
                'source', 
                'retweeted', 
                'favorited', 
                'place', 
                'in_reply_to_status_id_str', 
                'in_reply_to_user_id_str', 
                'in_reply_to_screen_name'
                ]
            writer = csv.DictWriter(csv_file, fieldnames=fieldnames,lineterminator='\n')
            writer.writeheader()
            for tweet in data:
                writer.writerow(data[tweet])
    
    def dumpTrendsCSV(self,filename,data):
        with open(filename, mode='w',encoding='utf-8') as csv_file:
            fieldnames = [
                'name',
                'tweetVolume', 
                ]
            writer = csv.DictWriter(csv_file, fieldnames=fieldnames,lineterminator='\n')
            writer.writeheader()
            for tweet in data:
                tmp = {
                    'name':tweet,
                    'tweetVolume':data[tweet]['tweetVolume']
                }
                writer.writerow(tmp)