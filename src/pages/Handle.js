import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { TextField } from "@material-ui/core";
import { downloadFile, getUserTimeline, getTweetsSentiment, getSummary } from '../services/getTweets';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import StickyHeadTable from '../components/StickyHeadTable';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import LineGraph from "../components/Linegraph";
import PieGraph from "../components/Piegraph";
import BarGraph from "../components/Bargraph";
import 'bootstrap/dist/css/bootstrap.min.css';
import StickyHeadTableSentiment from "../components/StickyHeadTableSentiment";
import BarGraphSentiment from "../components/BargraphSentiment";
import Checkbox from '@material-ui/core/Checkbox';
import { AuthApi, TokenApi } from "../App";
import { addFile } from "../services/users";
import { useNavigate } from "react-router";
import Loader from "../components/Loader";
/*
This function is a React component that allows users to search for and analyze tweets.
It provides several features such as input fields for the user to specify a 
Twitter handle and the number of tweets to search for, a checkbox to enable date filtering, 
date pickers to specify the start and end dates, and buttons to initiate the search, download the tweets,
and view various graphs and tables of the tweet data. 
It also allows the user to view a summary of the tweets and to filter the data by different criteria. 
The component utilizes several helper functions to make API calls to a backend server to retrieve
and process the tweets, and it uses the React context API to access authentication and token data.
*/
function Handle() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [filter, setFilter] = useState("week")
  const [handle, setHandle] = useState("")
  const [count, setCount] = useState("")
  const onHandleChange = (e) => setHandle(e.target.value);
  const onCountChange = (e) => setCount(e.target.value);
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [durationFilter, setDurationFilter] = useState(false)
  const handleDurationFilter = (e) => setDurationFilter(e.target.checked)
  const onStartDateChange = (e) => setStartDate(e.target.value);
  const onEndDateChange = (e) => setEndDate(e.target.value);
  const [tweets, setTweets] = useState();
  // This useState hook varibale stores the index of the active analysis type
  const [index, setIndex] = useState(-1);
  const [sentimentTweets, setSentimentTweets] = useState([]);
  const [summary, setSummary] = useState("")

  // Function to get the summary of tweets.
  const handleSummary = () => {
    getSummary(tweets['filename'])
      .then((data) => {
        setSummary(data)
      })
  }

  // Function to get the sentiment of tweets.
  const handleClickBySentiment = () => {
    getTweetsSentiment(tweets['filename'])
      .then((data) => {
        setSentimentTweets(data)
      })
  }

  // useEffect hook to update the index and it depends upon sentimentTweets
  useEffect(() => {
    setIndex(3);
  }, [sentimentTweets])

  // Function to call the get data api based on the filters applied.
  const getTweets = () => {
    setIsLoading(true)
    setSummary("")
    var obj = {
      'handle': handle,
      'count': count ? count : '2'
    }
    if (durationFilter) {
      obj = {
        'handle': handle,
        'count': count ? count : '2',
        'since': startDate,
        'until': endDate
      }
    }
    getUserTimeline(obj)
      .then((data) => {
        setTweets(data);
        setIsLoading(false)
      })
  };

  // Function to download the scraped data.
  const downFile = () => {
    downloadFile(tweets['filename'])
      .then((data) => {
      })
  };
  
  //Functions to change the index variable according to the selected analysis type
  const handleClickByLike = () => { setIndex(0) };
  const handleClickByTime = () => { setIndex(1) };
  const handleClickByType = () => { setIndex(2) };
  const handleFilter = (temp) => { setFilter(temp) };

  // Loading the context of Auth
  const Auth = React.useContext(AuthApi);
  // Loading the context of Token
  const Token = React.useContext(TokenApi);
  let toke = Token.token;

  // Function to call the api to save data in profile
  const saveFileName = () => {
    if (!Auth.auth) {
      navigate('/login')
      alert('Log In before saving a file.')
      return
    }
    addFile(toke, tweets['filename'])
      .then((data) => {
        if (data)
          alert("File Saved")
      })
  };

  return (
    <div>
      <Container >
        <Row>
          <Col>
          </Col>
          <Col align="center" className='mt-5' md={8} xs={12}>
            <h1>
              Scrape User Timeline
            </h1>
          </Col>
          <Col>
          </Col>
        </Row>
        <Row>
          <Col>
          </Col>
          <Col md={5} xs={12} className='mt-5' align="center">
            <TextField label="User Handle (@elonmusk)" value={handle} onChange={onHandleChange}></TextField>
          </Col>
          <Col md={5} xs={12} className='mt-5' align="center">
            <TextField label="Count of tweets" value={count} onChange={onCountChange}></TextField>
          </Col>
          <Col>
          </Col>
        </Row>
        <Row>
          <Col></Col>
          <Col md={5} xs={12} className='mt-5' align="center">
            Add Duration Filter
            <Checkbox
              checked={durationFilter}
              onChange={handleDurationFilter}
              color="primary" />
          </Col>
          <Col></Col>
        </Row>
        {durationFilter && <Row>
          <Col>
          </Col>
          <Col md={5} xs={12} className='mt-5' align="center">
            <form noValidate>
              <TextField
                id="date"
                label="Start Date"
                type="date"
                value={startDate}
                onChange={onStartDateChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </form>
          </Col>
          <Col md={5} xs={12} className='mt-5' align="center">
            <form noValidate>
              <TextField
                id="date"
                label="End Date"
                type="date"
                value={endDate}
                onChange={onEndDateChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </form>
          </Col>
          <Col>
          </Col>
        </Row>}
        <Row>
          <Col>
          </Col>
          <Col xs={12} className='mt-5' align="center">
            <Button variant="contained" onClick={getTweets}>Get Tweets</Button>
          </Col>
          <Col>
          </Col>
        </Row>
        <Row>
          {isLoading && <Col xs={12} className='mt-5 mb-5'> <Loader /> </Col>}
        </Row>
        <Row>
          <Col></Col>
          {!isLoading && <Col md={8} xs={12} className='mt-5 mb-5'><StickyHeadTable data={tweets} /> </Col>}
          <Col></Col>
        </Row>

        <Row classname='mt-5'>
          <Col xs={12} className='mt-5' align="center">
            <Button variant="contained" onClick={handleSummary}>Get Summary</Button>
          </Col>
          <Col xs={12} className='mt-5' align="center">
            {summary}
          </Col>
          <Col xs={12} className='mt-5' align="center">
            <Button variant="contained" onClick={saveFileName}>Save Data in Profile</Button>
          </Col>
          <Col xs={12} className='mt-5' align="center">
            <Button variant="contained" onClick={downFile}>Download Data</Button>
          </Col>
          <Col align="center" className='mt-5' md={12} xs={12}>
            <h3>
              Perform Analysis
            </h3>
          </Col>
          <Col md={12} xs={12} align="center" className='mt-5 mb-5'>
            <ButtonGroup variant="text" color="primary" aria-label="text primary button group">
              <Button
                onClick={handleClickByLike}
              >By Likes</Button>
              <Button
                onClick={handleClickByTime}
              >By Time</Button>
              <Button
                onClick={handleClickByType}
              >By Type</Button>
              <Button
                onClick={handleClickBySentiment}
              >By Sentiment</Button>
            </ButtonGroup>
          </Col>
          <Col>
          </Col>
        </Row>
        <Row>
          <Col>
          </Col>
          <Col md={8} xs={12} className='mt-5 mb-5' >
            {index == 0 && <LineGraph data={tweets} />}
            {index == 1 && <BarGraph data={tweets} type={filter} />}
            {index == 2 && <PieGraph data={tweets} />}
            {index == 3 && <StickyHeadTableSentiment data={sentimentTweets} />}
            {index == 3 && <BarGraphSentiment data={sentimentTweets} />}
          </Col>
          <Col>
          </Col>
        </Row>
        <Row>
          {index === 1 &&
            <Col md={12} xs={12} align="center" className='mt-5 mb-5'>
              <ButtonGroup variant="text" color="primary" aria-label="text primary button group">
                <Button
                  onClick={() => { handleFilter("year") }}
                >year</Button>
                <Button
                  onClick={() => { handleFilter("month") }}
                >month</Button>
                <Button
                  onClick={() => { handleFilter("week") }}
                >week</Button>
                <Button
                  onClick={() => { handleFilter("date") }}
                >date</Button>
                <Button
                  onClick={() => { handleFilter("hour") }}
                >hour</Button>
                <Button
                  onClick={() => { handleFilter("weekday") }}
                >weekday</Button>
              </ButtonGroup>
            </Col>}
        </Row>
      </Container>
    </div>
  );
}
export default Handle;