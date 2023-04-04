import json
from tweet import Tweet
from datetime import datetime
import tweepy
from fastapi import HTTPException
import re
from textblob import TextBlob
import pandas as pd
import snscrape.modules.twitter as sntwitter
import nltk

from nltk.tokenize import word_tokenize, sent_tokenize

# stopWords = set(stopwords.words("english"))

PATH_TO_SECRETS_JSON = "./secrets.json"


class Scraper:
    def __init__(self):
        self.initSecrets()
        self.initTweepy()
        self.data = {}
        self.parser = Tweet()
        self.file_name = ""

    def initSecrets(self):
        f = open(PATH_TO_SECRETS_JSON)
        data = json.load(f)
        self.API_key = data["API_key"]
        self.API_Key_Secret = data["API_Key_Secret"]
        self.access_token = data["access_token"]
        self.access_token_secret = data["access_token_secret"]
        f.close()

    def initTweepy(self):
        try:
            self.auth = tweepy.OAuthHandler(self.API_key, self.API_Key_Secret)
            self.auth.set_access_token(
                self.access_token, self.access_token_secret)
            self.api = tweepy.API(self.auth)
        except Exception as e:
            print(e)

    def getUserTimeline(self, screen_name, no_of_tweets=20):
        '''
        This function returns a tuple containing the name of the generated CSV file and a list of dictionaries representing the specified user's recent tweets. If the operation fails, the function returns None.

        Args:

        self: the instance of the current object.
        screen_name: the screen name of the user to retrieve tweets for.
        no_of_tweets: the maximum number of tweets to return (default is 20).
        Returns:

        If the operation is successful, a tuple with two elements:
        A string representing the name of the generated CSV file.
        A list of dictionaries, where each dictionary represents a tweet and contains the following keys:
        'created_at': the date and time when the tweet was created, in the format "YYYY-MM-DD HH:MM:SS"
        'id': the unique identifier for the tweet.
        'text': the text of the tweet.
        'favorite_count': the number of favorites the tweet has received.
        'retweet_count': the number of times the tweet has been retweeted.
        'user_id': the unique identifier for the user who posted the tweet.
        'user_name': the screen name of the user who posted the tweet.
        'user_location': the location specified by the user in their profile.
        If the operation fails, None is returned.
        '''
        no_of_tweets = int(no_of_tweets)
        try:
            statuses = []
            if (int(no_of_tweets) > 200):
                statuses = self.userTimelineCursor(screen_name, no_of_tweets)
            else:
                statuses = self.api.user_timeline(screen_name=screen_name,
                                                  count=no_of_tweets,
                                                  tweet_mode="extended")
            data = self.parser.parseTweet(statuses)
            current_time = datetime.now().strftime("%d%m%y%H%M%S")
            self.file_name = screen_name[:]+current_time+".csv"
            json.dump(data, open(
                './tmp/'+self.file_name[:-4]+".json", "w", encoding='utf-8'), indent=6)
            self.parser.dumpCSV("./data/"+self.file_name, data=data)
            return self.file_name, data
        except Exception as e:
            print(str(e))

    def getSearchQuery(self, search_query, no_of_tweets, geocode):
        '''
        This function searches for tweets matching the specified search query and location, and returns a tuple containing the name of the generated CSV file and a list of dictionaries representing the parsed tweets. If the search fails, a tuple containing the error code and the TweepError object is returned instead.

        Args:

        self: the instance of the current object.
        search_query: the search query to use.
        no_of_tweets: the maximum number of tweets to return.
        geocode: a string representing the location to search within, in the format "latitude,longitude,radius", where radius is in miles. Set this to an empty string to search within the default location (worldwide).
        
        Returns:

        If the search is successful, a tuple with two elements:
        A string representing the name of the generated CSV file.
        A list of dictionaries, where each dictionary represents a tweet and contains the following keys:
        'created_at': the date and time when the tweet was created, in the format "YYYY-MM-DD HH:MM:SS"
        'id': the unique identifier for the tweet.
        'text': the text of the tweet.
        'favorite_count': the number of favorites the tweet has received.
        'retweet_count': the number of times the tweet has been retweeted.
        'user_id': the unique identifier for the user who posted the tweet.
        'user_name': the screen name of the user who posted the tweet.
        'user_location': the location specified by the user in their profile.
        If the search fails, a tuple with two elements:
        An integer representing the error code.
        A TweepError object containing information about the error.
        '''
        no_of_tweets = int(no_of_tweets)
        try:
            tweets = []
            if (int(no_of_tweets) > 100):
                tweets = self.searchQueryCursor(
                    search_query, no_of_tweets, geocode)
            else:
                tweets = self.api.search_tweets(
                    q=search_query,
                    geocode=geocode,
                    count=int(no_of_tweets)
                )
            data = self.parser.parseTweet(tweets)
            current_time = datetime.now().strftime("%d%m%y%H%M%S")
            self.file_name = search_query+current_time+".csv"
            json.dump(data, open(
                './tmp/'+self.file_name[:-4]+".json", "w", encoding='utf-8'), indent=6)
            self.parser.dumpCSV("./data/"+self.file_name, data=data)
            return self.file_name, data
        except tweepy.TweepyException as e:
            print(e)
            return -1, e

    def cleanTweets(self, tweet):
        return ' '.join(re.sub("(@[A-Za-z0-9]+)|([^0-9A-Za-z \t])|(\w+:\/\/\S+)", " ", tweet).split())

    
    def getTweetSentiment(self, tweet):
        '''
        This function calculates the sentiment of the given tweet and returns 'positive', 'negative', or 'neutral' depending on the result.

        Args:

        self: the instance of the current object.
        tweet: the text of the tweet to analyze.
        Returns:

        A string representing the sentiment of the tweet, either 'positive', 'negative', or 'neutral'.
        '''
        # create TextBlob object of passed tweet text
        analysis = TextBlob(self.cleanTweets(tweet))
        # set sentiment
        if analysis.sentiment.polarity > 0:
            return 'positive'
        elif analysis.sentiment.polarity == 0:
            return 'neutral'
        else:
            return 'negative'

    def getSummary(self, filename):
        '''
        This function searches for tweets matching the specified search query and location, and returns a list of the most recent tweets up to a maximum of no_of_tweets.

        Args:

        self: the instance of the current object.
        search_query: the search query to use.
        no_of_tweets: the maximum number of tweets to return.
        geocode: a string representing the location to search within, in the format "latitude,longitude,radius", where radius is in miles. Set this to an empty string to search within the default location (worldwide).
        Returns:

        A list of Status objects, where each Status object represents a tweet and contains information such as the tweet text, creation time, number of likes, and more.
        '''
        with open(filename, encoding='utf-8') as fh:
            f = json.load(fh)
            tweet_data = []
            for tweeetId in f:
                TEXT_CLEANING_RE = "rt|https?:\S+|http?:\S"
                tweet_data.append(re.sub(TEXT_CLEANING_RE, ' ', str(
                    f[tweeetId]['text']).lower()).strip())
            text = ". ".join(tweet_data)
            words = word_tokenize(text)
            freqTable = dict()
            for word in words:
                word = word.lower()
                if word == "rt":
                    continue
                if word in freqTable:
                    freqTable[word] += 1
                else:
                    freqTable[word] = 1

            sentences = sent_tokenize(text)
            sentenceValue = dict()

            for sentence in sentences:
                for word, freq in freqTable.items():
                    if word in sentence.lower():
                        if sentence in sentenceValue:
                            sentenceValue[sentence] += freq
                        else:
                            sentenceValue[sentence] = freq

            sumValues = 0
            for sentence in sentenceValue:
                sumValues += sentenceValue[sentence]

            # Average value of a sentence from the original text
            average = int(sumValues / len(sentenceValue))

            alreadyDone = {}
            # Storing sentences into our summary.
            summary = ''
            for sentence in sentences:
                if (sentence in sentenceValue) and (sentenceValue[sentence] > (1.2 * average)) and sentence not in alreadyDone:
                    alreadyDone[sentence] = 1
                    summary += " " + sentence
            return summary

    def getSentiment(self, filename):
        '''
        This function calculates the sentiment of the tweets in the specified JSON file and adds a 'sentiment' key to each tweet in the file, with the value being either 'positive', 'negative', or 'neutral'.

        Args:

        self: the instance of the current object.
        filename: the name of the JSON file to process.
        
        Returns:

        A dictionary with the following structure:
        {
        tweet_id: {
        'created_at': str,
        'id': str,
        'text': str,
        'favorite_count': int,
        'retweet_count': int,
        'user_id': str,
        'user_name': str,
        'user_location': str,
        'sentiment': str
        },
        ...
        }
        Where:

        tweet_id: the unique identifier for the tweet.
        created_at: the date and time when the tweet was created, in the format "YYYY-MM-DD HH:MM:SS".
        id: the unique identifier for the tweet.
        text: the text of the tweet.
        favorite_count: the number of favorites the tweet has received.
        retweet_count: the number of times the tweet has been retweeted.
        user_id: the unique identifier for the user who posted the tweet.
        user_name: the screen name of the user who posted the tweet.
        user_location: the location specified by the user in their profile.
        sentiment: the sentiment of the tweet, either 'positive', 'negative', or 'neutral'.
        '''
        with open(filename, encoding='utf-8') as fh:
            f = json.load(fh)
            for tweeetId in f:
                f[tweeetId]['sentiment'] = self.getTweetSentiment(
                    f[tweeetId]['text'])
            return f

    def searchQueryCursor(self, search_query, no_of_tweets, geocode):
        '''
        This function searches for tweets matching the specified search query and location, and returns a list of the most recent tweets up to a maximum of no_of_tweets.

        Args:

        self: the instance of the current object.
        search_query: the search query to use.
        no_of_tweets: the maximum number of tweets to return.
        geocode: a string representing the location to search within, in the format "latitude,longitude,radius", where radius is in miles. Set this to an empty string to search within the default location (worldwide).
        
        Returns:

        A list of Status objects, where each Status object represents a tweet and contains information such as the tweet text, creation time, number of likes, and more.
        '''
        no_of_tweets = int(no_of_tweets)
        tweets = []
        for status in tweepy.Cursor(self.api.search_tweets, q=search_query, geocode=geocode).items(no_of_tweets):
            tweets.append(status)
        return tweets

    def userTimelineCursor(self, screen_name, no_of_tweets):
        '''
        This function returns a list of the most recent tweets posted by the specified user, up to a maximum of no_of_tweets.

        Args:

        self: the instance of the current object.
        screen_name: the screen name of the user to retrieve tweets for.
        no_of_tweets: the maximum number of tweets to return.

        Returns:

        A list of Status objects, where each Status object represents a tweet and contains information such as the tweet text, creation time, number of likes, and more.
        '''
        no_of_tweets = int(no_of_tweets)
        tweets = []
        for status in tweepy.Cursor(self.api.user_timeline, screen_name=screen_name, tweet_mode="extended").items(no_of_tweets):
            tweets.append(status)
        return tweets

    def getSearchQueryTimeBased(self, search_query, no_of_tweets, since, until, geocode):
        '''
        This function searches for tweets matching the specified search query within a given time period and location, and returns a tuple containing the name of the generated CSV file and a list of dictionaries representing the parsed tweets.

        Args:

        self: the instance of the current object.
        search_query: the search query to use. This should not include the 'since' or 'until' parameters.
        no_of_tweets: the maximum number of tweets to return.
        since: the start date for the search, in the format "YYYY-MM-DD".
        until: the end date for the search, in the format "YYYY-MM-DD".
        geocode: a string representing the location to search within, in the format "latitude,longitude,radius", where radius is in miles. Set this to an empty string to search within the default location (worldwide).
        Returns:

        A tuple with two elements:
        A string representing the name of the generated CSV file.
        A list of dictionaries, where each dictionary represents a tweet and contains the following keys:
        'created_at': the date and time when the tweet was created, in the format "YYYY-MM-DD HH:MM:SS"
        'id': the unique identifier for the tweet.
        'text': the text of the tweet.
        'favorite_count': the number of favorites the tweet has received.
        'retweet_count': the number of times the tweet has been retweeted.
        'user_id': the unique identifier for the user who posted the tweet.
        'user_name': the screen name of the user who posted the tweet.
        'user_location': the location specified by the user in their profile.

        '''
        no_of_tweets = int(no_of_tweets)
        tweets = []
        sq = search_query + " since:"+str(since)+" until:"+str(until)
        if geocode != "":
            sq += " " + 'geocode:"{}"'.format(geocode)
        for i, tweet in enumerate(sntwitter.TwitterSearchScraper(sq).get_items()):
            if i == int(no_of_tweets):
                break
            tweets.append(tweet)
        data = self.parser.parseSnscrapeTweet(tweets)
        current_time = datetime.now().strftime("%d%m%y%H%M%S")
        self.file_name = search_query+current_time+".csv"
        json.dump(data, open(
            './tmp/'+self.file_name[:-4]+".json", "w", encoding='utf-8'), indent=6)
        self.parser.dumpCSV("./data/"+self.file_name, data=data)
        return self.file_name, data

    def getUserTimelineTimeBased(self, username, no_of_tweets, since, until):
        '''
        This function gets the tweets made by a particular user within a given time range.

        Parameters:
        username (str): The username of the Twitter account.
        no_of_tweets (int): The maximum number of tweets to retrieve.
        since (str): The start date (inclusive) for the time range in the format "YYYY-MM-DD".
        until (str): The end date (exclusive) for the time range in the format "YYYY-MM-DD".

        Returns:
        tuple: A tuple containing the file name and data of the parsed tweets.
        file_name (str): The name of the file where the data is stored.
        data (list): A list of dictionaries containing the parsed tweet data.
        '''
        no_of_tweets = int(no_of_tweets)
        tweets = []
        for i, tweet in enumerate(sntwitter.TwitterSearchScraper('from:' + username[1:] + " since:"+str(since)+" until:"+str(until)).get_items()):
            if i == int(no_of_tweets):
                break
            tweets.append(tweet)
        data = self.parser.parseSnscrapeTweet(tweets)
        current_time = datetime.now().strftime("%d%m%y%H%M%S")
        self.file_name = username+current_time+".csv"
        json.dump(data, open(
            './tmp/'+self.file_name[:-4]+".json", "w", encoding='utf-8'), indent=6)
        self.parser.dumpCSV("./data/"+self.file_name, data=data)
        return self.file_name, data

    def getTrends(self, lat, long):
        '''
        getTrends(self, lat: float, long: float) -> Dict[str, Dict[str, Union[int, None]]]:

        This function returns a dictionary of current Twitter trends for the location nearest to the specified latitude and longitude.

        Args:

        self: the instance of the current object.
        lat: the latitude of the location to get trends for.
        long: the longitude of the location to get trends for.
        Returns:

        A dictionary with the following structure:
        {
        trend_name: {
        'tweetVolume': int or None
        },
        ...
        }
        Where:

        trend_name: a string representing the name of the trend.
        tweetVolume: an integer representing the number of tweets about the trend in the last 24 hours, or None if this information is not available.
        '''
        closest_loc = self.api.closest_trends(lat, long)
        trends = self.api.get_place_trends(closest_loc[0]["woeid"])
        trends = trends[0]["trends"]
        out = {}
        for trend in trends:
            name = trend['name']
            out[name] = {}
            out[name]['tweetVolume'] = 0
            if trend['tweet_volume']:
                out[name]['tweetVolume'] = trend['tweet_volume']
        tmp = out
        out = {}
        out['trends'] = tmp
        print(out)
        current_time = datetime.now().strftime("%d%m%y%H%M%S")
        self.file_name = str(lat)+'-'+str(long)+'-'+current_time+".csv"
        try:
            json.dump(out, open(
                './tmp/'+self.file_name[:-4]+".json", "w", encoding='utf-8'), indent=6)
        except Exception as e:
            print(e)
        out['filename'] = self.file_name
        self.parser.dumpTrendsCSV("./data/"+self.file_name, data=out['trends'])
        return out
