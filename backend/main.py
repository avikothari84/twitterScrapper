from fastapi import FastAPI, Request, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import Optional
from oauth import get_current_user
from hashing import Hash
from jwttoken import create_access_token
from scraper import Scraper
import urllib.parse
from pymongo import MongoClient
import os
import json

#app object
app = FastAPI()

origins = ['http://localhost:3000']

app.add_middleware(
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)

mongodb_uri = json.load(open('./secrets.json','r'))['mongodb_url']
print(mongodb_uri)
port = 8000
client = MongoClient(mongodb_uri, port)
db = client.twitter

class User(BaseModel):
    username: str
    password: str

class Login(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

@app.post('/v1/users/')
def listUser(current_user:User = Depends(get_current_user)):
    """
    This function retrieves the saved files for the currently logged in user and returns them in a dictionary.

    Args:

    current_user: the currently logged in user.
    Returns:

    A dictionary with a single key, 'data', whose value is a list of dictionaries representing the saved files. Each dictionary contains the following keys:
    'file_name': the name of the saved file.
    'date': the date the file was saved, in the format "YYYY-MM-DD".
    'time': the time the file was saved, in the format "HH:MM:SS".
    """
    user = db["users"].find_one({"username":current_user.username})
    return {'data':user['savedFiles'],'username':user['username']}

@app.post('/v1/users/addFile/{filename}')
def addFile(filename: str,current_user:User = Depends(get_current_user)):
    """
    This function adds the given file to the list of saved files for the currently logged in user.

    Args:

    filename: the name of the file to add.
    current_user: the currently logged in user.
    Returns:

    A dictionary with a single key, 'data', whose value is a list of the names of the saved files for the current user.
    """
    user = db["users"].find_one({"username":current_user.username})
    lst = user['savedFiles']
    if filename not in lst:
        lst.append(filename)
    db["users"].update_one({"username":current_user.username},{"$set": { "savedFiles": lst }})
    return {'data':user['savedFiles']}

@app.post('/v1/users/removeFile/{filename}')
def removeFIle(filename: str,current_user:User = Depends(get_current_user)):
    """
    This function removes the given file from the list of saved files for the currently logged in user.

    Args:

    filename: the name of the file to remove.
    current_user: the currently logged in user.
    Returns:

    A dictionary with a single key, 'data', whose value is a list of the names of the saved files for the current user.
    """
    user = db["users"].find_one({"username":current_user.username})
    lst = user['savedFiles']
    if filename in lst:
        lst.remove(filename)
    db["users"].update_one({"username":current_user.username},{"$set": { "savedFiles": lst }})
    return {'data':user['savedFiles']}

@app.post('/v1/register')
def create_user(request:User):
    """
    This function creates a new user in the database.

    Args:

    request: a User object containing the username and password for the new user.
    Returns:

    A dictionary with a single key, 'res', whose value is the string 'created'.
    Raises:

    HTTPException: if the given username is already in use.
    """
    user = db["users"].find_one({"username":request.username})
    if user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail = f'Username already exists: {request.username}.')
    hashed_pass = Hash.bcrypt(request.password)
    user_object = dict(request)
    user_object["password"] = hashed_pass
    user_object["savedFiles"] = ['']
    user_id = db["users"].insert_one(user_object)
    return {"res":'created'}

@app.post('/v1/login/')
def login(request:Login):
    """
    This function logs in a user and returns an access token for them.

    Args:

    request: a Login object containing the username and password to attempt to log in with.
    Returns:

    A dictionary with the following keys:
    'access_token': the JWT for the logged in user.
    'token_type': the type of token being returned, which is always 'bearer'.
    Raises:

    HTTPException: if the given username is not in the database or if the given password is incorrect.
    """
    user = db["users"].find_one({"username":request.username})
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail = f'No user found with this {request.username} username')
    if not Hash.verify(user["password"],request.password):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail = f'Wrong Username or password')
    access_token = create_access_token(data={"sub": user["username"] })
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/v1/getBySearchQuery")
async def getSearchQueryTweets(info : Request):
    """
    This function fetches tweets for a given search query, either within a given time range or the most recent tweets.

    Args:

    info: a FastAPI request object containing the following keys in the request body as a JSON object:
    'keyword': the search query to use.
    'count': the number of tweets to fetch.
    'since': the start date for the time range to search within, in the format 'YYYY-MM-DD'. (optional)
    'until': the end date for the time range to search within, in the format 'YYYY-MM-DD'. (optional)
    'geocode': a string representing a geographic area to filter the search by, in the format 'latitude,longitude,radius'. (optional)
    Returns:

    A dictionary containing the following keys:
    'filename': the name of the file containing the saved tweets.
    'data': a dictionary of tweet data, with tweet IDs as keys and tweet objects as values.
    Raises:

    HTTPException: if there is an error fetching the tweets. The detail field of the exception will contain the error message.
    """
    scarper = Scraper()
    data = await info.json()
    keyword = data['keyword']
    count = data['count']
    try:
        since = data['since']
        until = data['until']
    except:
        since = None
        until = None
    try:
        geocode = data['geocode']
    except:
        geocode = ""
    if since and until:
        status,out = scarper.getSearchQueryTimeBased(keyword,count,since,until,geocode)
    else:
        status,out = scarper.getSearchQuery(keyword,count,geocode)
    if status != -1:
        out['filename'] = urllib.parse.quote(status)
        return out
    else:
        raise HTTPException(status_code=404, detail=str(out))

@app.post("/v1/getTimeline")
async def getTimelineTweets(info : Request):
    """
    getTimelineTweets is an API endpoint that returns a list of tweets from the specified Twitter user's timeline.

    Input:
    - Request object that contains a JSON object with the following fields:
    - 'handle': string, required, Twitter handle of the user whose timeline tweets are to be retrieved
    - 'count': integer, optional, number of tweets to be retrieved from the timeline, default value is 20
    - 'since': string, optional, start date (in the format 'YYYY-MM-DD') from which tweets should be retrieved, default value is None
    - 'until': string, optional, end date (in the format 'YYYY-MM-DD') till which tweets should be retrieved, default value is None

    Output:
    - JSON object containing the following fields:
    - 'filename': string, file name of the csv file containing the retrieved tweets
    - 'tweets': list of dictionaries, each dictionary represents a tweet and contains the following fields:
    - 'tweetId': string, unique tweet identifier
    - 'username': string, Twitter handle of the user who posted the tweet
    - 'name': string, name of the user who posted the tweet
    - 'text': string, content of the tweet
    - 'time': string, time at which the tweet was posted (in the format 'YYYY-MM-DDTHH:mm:ss')
    - 'likes': integer, number of likes the tweet has received
    - 'retweets': integer, number of times the tweet has been retweeted
    - 'replies': integer, number of replies the tweet has received

    Errors:
    - If the specified Twitter handle does not exist, the API returns an HTTP 404 Not Found error.
    """
    scarper = Scraper()
    data = await info.json()
    handle = data['handle']
    count = int(data['count'])
    try:
        since = data['since']
        until = data['until']
    except:
        since = None
        until = None
    if since and until:
        status,out = scarper.getUserTimelineTimeBased(handle,count,since,until)
    else:
        status,out = scarper.getUserTimeline(handle,count)
    if status != -1:
        out['filename'] = urllib.parse.quote(status)
        return out
    else:
        raise HTTPException(status_code=404, detail=str(out))

@app.post("/v1/getTrends")
async def getTrends(info : Request):
    """
    Fetch the latest trends for a given location.

    Parameters:
    lat (float): The latitude of the location.
    long (float): The longitude of the location.

    Returns:
    A dictionary containing the trends and their corresponding tweet volume.
    The keys of the dictionary are the trend names (as strings) and the values are dictionaries
    with a single key-value pair of "tweetVolume" (as an integer) representing the tweet volume for that trend.
    If the trend does not have a tweet volume, it is set to 0.
    """
    scraper = Scraper()
    data = await info.json()
    lat = data['lat']
    long = data['long']
    try:
        out = scraper.getTrends(lat,long)
        return out
    except:
        raise HTTPException(status_code=404, detail=str("Error in fetching trends"))

@app.get("/v1/download/{filename}")
async def downloadFile(filename: str):
    """
    This function returns a file response object for the specified file.

    Args:
    filename (str): The name of the file to be downloaded.

    Returns:
    A file response object for the specified file.
    """
    file_path = os.getcwd() + "/data/" + urllib.parse.unquote(filename)
    return FileResponse(path=file_path, media_type='application/octet-stream', filename="data.csv")


@app.get("/v1/sentimentAnalysis/{filename}")
async def sentimentAnalysis(filename: str):
    """
    This function returns the sentiment analysis of the tweets stored in the specified file.

    Parameters:
    filename (str): The name of the file containing the tweets to be analyzed.

    Returns:
    dict: A dictionary containing the sentiment analysis of each tweet.
    """
    scarper = Scraper()
    file_path = os.getcwd() + "/tmp/" + urllib.parse.unquote(filename).split(".csv")[0]+ '.json'
    return scarper.getSentiment(file_path)
    
@app.get("/v1/getSummary/{filename}")
async def summary(filename: str):
    """
    getSummary returns a summary of a JSON file containing tweets.

    Args:
    filename (str): the name of the file to be summarized

    Returns:
    dict: a dictionary containing a summary of the tweets in the file
    """
    scarper = Scraper()
    file_path = os.getcwd() + "/tmp/" + urllib.parse.unquote(filename).split(".csv")[0]+ '.json'
    return scarper.getSummary(file_path)
    