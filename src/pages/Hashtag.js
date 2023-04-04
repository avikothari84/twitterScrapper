import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Container } from "react-bootstrap";
import { TextField } from "@material-ui/core";
import { downloadFile, getTweetsByHashtag, getTweetsSentiment, getSummary } from "../services/getTweets";
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
The Hashtag function is a React component that allows a user to search for tweets by a hashtag and visualize them in various ways. 
It displays a form for the user to input a hashtag, number of tweets to retrieve, and optional filters such as start and end dates and location. 
The user can also choose to view the tweets in a table, line graph, pie chart, or bar chart. 
The tweets can also be viewed by sentiment by clicking the "View by Sentiment" button. 
The user can download the tweets as a CSV file by clicking the "Download" button. 
The component also has the ability to display a summary of the tweets by clicking the "Get Summary" button.
*/

function Hashtag() {
  const [filter, setFilter] = useState("week")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const [handle, setHandle] = useState("")
  const [count, setCount] = useState("")
  const onHandleChange = (e) => setHandle(e.target.value);
  const onCountChange = (e) => setCount(e.target.value);
  const [tweets, setTweets] = useState();
  // This useState hook varibale stores the index of the active analysis type
  const [index, setIndex] = useState(-1);
  const [sentimentTweets, setSentimentTweets] = useState([]);
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [lat, setLat] = useState("")
  const [long, setLong] = useState("")
  const [radius, setRadius] = useState("")
  const [geocode, setGeocode] = useState("")
  const [locationFilter, setLocationFilter] = useState(false)
  const [durationFilter, setDurationFilter] = useState(false)
  // Functions to handle the text input 
  const handleDurationFilter = (e) => setDurationFilter(e.target.checked)
  const onStartDateChange = (e) => setStartDate(e.target.value);
  const onEndDateChange = (e) => setEndDate(e.target.value);
  const onLatChange = (e) => setLat(e.target.value);
  const onLongChange = (e) => setLong(e.target.value);
  const onRadiusChange = (e) => setRadius(e.target.value);
  const handleLocationFilter = (e) => {
    setLocationFilter(e.target.checked)
    if (!e.target.checked)
      setGeocode("")
    else {
      setGeocode("")
      setLat("")
      setLong("")
      setRadius("")
    }
  }

  // Function to get the sentiment of tweets.
  const handleClickBySentiment = () => {
    getTweetsSentiment(tweets['filename'])
      .then((data) => {
        setSentimentTweets(data)
      })
  }
  // useEffect hook to update the geocodes and it depends upon lat,long and radius.
  useEffect(() => {
    if (locationFilter)
      setGeocode(lat + ',' + long + ',' + radius + 'km');
  }, [lat, long, radius])

  // useEffect hook to update the index and it depends upon sentimentTweets
  useEffect(() => {
    setIndex(3);
  }, [sentimentTweets])
  
  //Functions to change the index variable according to the selected analysis type
  const handleClickByLike = () => { setIndex(0) };
  const handleClickByTime = () => { setIndex(1) };
  const handleClickByType = () => { setIndex(2) };
  const handleFilter = (temp) => { setFilter(temp) };
  const [summary, setSummary] = useState("")

  // Function to get the summary of tweets.
  const handleSummary = () => {
    getSummary(tweets['filename'])
      .then((data) => {
        setSummary(data)
      })
  }

  // Function to call the get data api based on the filters applied.
  const getTweets = () => {
    setIsLoading(true)
    setSummary("")
    var obj = {
      'keyword': handle,
      'count': count ? count : '2',
      'geocode': geocode
    }
    if (durationFilter) {
      obj = {
        'keyword': handle,
        'count': count ? count : '2',
        'since': startDate,
        'until': endDate,
        'geocode': geocode
      }
    }
    getTweetsByHashtag(obj)
      .then((data) => {
        setTweets(data)
        setIsLoading(false)
      })
  };

  // Function to download the scraped data.
  const downFile = () => {
    downloadFile(tweets['filename'])
      .then((data) => {
      })
  };
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
              Scrape using Hashtag
            </h1>
          </Col>
          <Col>
          </Col>
        </Row>
        <Row>
          <Col>
          </Col>
          <Col md={5} xs={12} className='mt-5' align="center">
            <TextField label="Hashtag ( #twitter)" value={handle} onChange={onHandleChange}></TextField>
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
          <Col></Col>
          <Col md={5} xs={12} className='mt-5' align="center">
            Add Location Filter
            <Checkbox
              checked={locationFilter}
              onChange={handleLocationFilter}
              color="primary" />
          </Col>
          <Col></Col>
        </Row>
        {locationFilter && <Row>
          <Col md={4} xs={12} className='mt-5' align="center">
            <form noValidate>
              <TextField
                id="date"
                label="Latitude ( eg: 51.5072)"
                value={lat}
                onChange={onLatChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </form>
          </Col>
          <Col md={4} xs={12} className='mt-5' align="center">
            <form noValidate>
              <TextField
                id="date"
                label="Longitude ( eg: 0.1276)"
                value={long}
                onChange={onLongChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </form>
          </Col>
          <Col md={4} xs={12} className='mt-5' align="center">
            <form noValidate>
              <TextField
                id="date"
                label="Radius in Km (eg: 5)"
                value={radius}
                onChange={onRadiusChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </form>
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
export default Hashtag;