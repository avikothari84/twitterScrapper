# Social media tool

This Social media data capture and analysis tool can be used to explore the real time interactions in the world. This tool deals with storing, visualisation and analysing the data obtained from twitter. This tool is a web based tool and the data is stored in the cloud so that anyone can access the tool on their browsers. The data capturing and visualisation will be handled by two separate servers so that we can get real time visualisation as well as the analysis with a delay of 1-6 seconds. The data would be captured based on the keywords and hashtags which can be user defined or predefined based on the requirements. One of the major use cases of the tool will be to get the real time graphs of the number of tweets, likes, comments etc. for a given keyword and download and store the data for further analysis. This tool can also be used to get the trending tweets for a given location and visualise the current trends.

## How to run the frontend

Go to the project folder.

## Step 1

### `npm install`

This will install all the necessary files.

## Step 2

### `npm start`

Runs the tool.

## Step 3

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Extra Commands 

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

Your app is ready to be deployed!

## How to run the backend

## Step 1 (Set up Twitter Developer Account)

### Get Twitter API Credentials

`NOTE`
- Obtain the following API_key, API_Key_Secret, access_token, access_token_secret and update them in /backend/Secrets.json file.
- See the Dashboard.png for reference.

```
{
    "API_key": "",
    "API_Key_Secret": "",
    "access_token": "",
    "access_token_secret":""
}
```

https://developer.twitter.com/en/docs/twitter-api/getting-started/getting-access-to-the-twitter-api

### Apply for Elevated Access to scrape data from user timeline

https://twitter.com/login?redirect_after_login=https%3A%2F%2Fdeveloper.twitter.com%2Fen%2Fportal%2Fproducts%2Felevated


## Step 2 (Install python libraries using)

`NOTE`
-Make sure you are in /backend directory.

- Run the command
```
pip install -r requirements.txt
python -m textblob.download_corpora
```
- Run the file installNLTK.py 
```
python installNLTK.py
```

## Step 3 (Start the server)

`NOTE`
-Make sure you are in /backend directory.

- Run the command
```
uvicorn main:app --reload
```

To view the APIs docs open [http://localhost:8000/docs](http://localhost:8000/docs)

## Step 4 (Set up Mongo DB)

`NOTE`
- This is only first time set up.

- Login to the 'https://account.mongodb.com/account/login?_ga=2.58741229.1119610064.1672318076-1598339649.1672318076'.

- Creating the cluster:

- While setting up the cluster we can chose the FREE Shared plan.

- Chose the appropritae server location and region (Leave it to the default settings).

- Finally click the create cluster button.

- While logging in for the first time it will as to create the username and password, which can be later manged in the user section.

- After entering the username and password, create user and make sure to save the password as t would be required later in the mongodb url.

- After setting up the user, navigate to the database section from the side dashboard.

- Click on the connect button for the Cluster0.

- Select all from everwhere and click on add ip address.
![connecting](https://user-images.githubusercontent.com/39887841/209955193-1ca8cb5e-b9cc-41e5-9da2-d2fb90a4a1f0.PNG)
![connecting2](https://user-images.githubusercontent.com/39887841/209955219-b367ab02-e935-4e8f-9ae9-0ab613e1c71b.PNG)

- Finally click on the button choose a connection method and select connect your application.

- Copy the url, eg: 'mongodb+srv://johndoe:<password>@cluster0.7vcfedu.mongodb.net/?retryWrites=true&w=majority'
![Capture](https://user-images.githubusercontent.com/39887841/209955460-45f4b053-7f4c-499f-aaf9-61f7b14e341c.PNG)

- If the chosen password for user was YourPassword the url would become, 'mongodb+srv://johndoe:YourPassword@cluster0.7vcfedu.mongodb.net/?retryWrites=true&w=majority'

- The last step is to update this url for the mongodb_url variable inside the secrets.json file which is present inside the backend directory.

## Webapp Overview

These are the available pages which can be used in the webapp as of SMT-3 version.

- To scrape and analyse tweets from some user's timeline :  [http://localhost:3000/handle](http://localhost:3000/handle)

- To scrape and analyse tweets based on a keywords :    [http://localhost:3000/keyword](http://localhost:3000/keyword)

- To scrape and analyse tweets based on a hashtag : [http://localhost:3000/hashtag](http://localhost:3000/hashtag)

### Screenshots

- After entering the relevant user handle and the count, we can scape the tweets and view some basic info on this webpage.
- To download the tweets as a CSV file click the `DOWNLOAD DATA` button.

![Capture](https://user-images.githubusercontent.com/39887841/202891113-f5c026d4-b526-47a7-b8bd-a5b84a972dd6.PNG)

###  Anlaysis

One can also analyse tweets on the basis of likes, time, and the type of tweet (Retweet, Reply, Mention or a Normal tweet). <br />
Analysis based on the time:<br />

![Capture2](https://user-images.githubusercontent.com/39887841/202891245-1abd8167-7873-4ab7-99f8-618a14308a8d.PNG)<br />
Analysis based on the number likes:<br />

![Capture3](https://user-images.githubusercontent.com/39887841/202891246-ba81955c-0107-4469-9419-f287701485b5.PNG)<br />

Analysis based on the type of tweet:<br />

![Capture1](https://user-images.githubusercontent.com/39887841/202891247-f813b7ae-48b2-4788-a9a4-754215a6eb1f.PNG)<br />





