import React, { useState } from "react";
import { Container } from "react-bootstrap";
import Button from '@material-ui/core/Button';
import { getTwitterTrends } from "../services/getTrends";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';
import { TextField } from "@material-ui/core";
import StickyHeadTableTrends from "../components/StickyHeadTableTrends";
import { addFile } from "../services/users";
import { AuthApi, TokenApi } from "../App";
import { useNavigate } from "react-router";

/*
This function displays a form to search for the latest trends on Twitter given a latitude and longitude. It also has a button to save the trend data to the user's profile if they are logged in. The trends data is displayed in a table.

The following dependencies are imported:

React and useState from 'react'
Container from 'react-bootstrap'
Button from '@material-ui/core/Button'
getTwitterTrends from '../services/getTrends'
Row and Col from 'react-bootstrap'
'bootstrap/dist/css/bootstrap.min.css'
TextField from '@material-ui/core'
StickyHeadTableTrends from '../components/StickyHeadTableTrends'
addFile from '../services/users'
AuthApi and TokenApi from '../App'
useNavigate from 'react-router'
*/
function Trend() {
  const navigate = useNavigate()
  const [lat, setLat] = useState("")
  const [long, setLong] = useState("")
  const onLatChange = (e) => setLat(e.target.value);
  const onLongChange = (e) => setLong(e.target.value);
  const [trends, setTrends] = useState();
  const [filename, setFilename] = useState();
  const Auth = React.useContext(AuthApi);
  const Token = React.useContext(TokenApi);
  let toke = Token.token;

  // Function to get the trends based on the lat and long.
  const getTrends = () => {
    var obj = {
      'lat': lat,
      'long': long
    }
    getTwitterTrends(obj)
      .then((data) => {
        setTrends(data.trends);
        setFilename(data.filename);
      })
  };
  // Function to save the trends data in profile.
  const saveFileName = () => {
    if (!Auth.auth) {
      navigate('/login')
      alert('Log In before saving a file.')
      return
    }
    addFile(toke, filename)
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
              Latest Trends
            </h1>
          </Col>
          <Col>
          </Col>
        </Row>
        <Row>
          <Col>
          </Col>
          <Col md={5} xs={12} className='mt-5' align="center">
            <TextField label="Latitude" value={lat} onChange={onLatChange}></TextField>
          </Col>
          <Col md={5} xs={12} className='mt-5' align="center">
            <TextField label="Longitude" value={long} onChange={onLongChange}></TextField>
          </Col>
          <Col>
          </Col>
        </Row>
        <Row>
          <Col>
          </Col>
          <Col xs={12} className='mt-5' align="center">
            <Button variant="contained" onClick={getTrends}>Get Trends</Button>
          </Col>
          <Col>
          </Col>
        </Row>
        <Row classname='mt-5'>
          <Col xs={12} className='mt-5' align="center">
            <Button variant="contained" onClick={saveFileName}>Save Data in Profile</Button>
          </Col>
        </Row>
        <Row>
          <Col></Col>
          <Col md={8} xs={12} className='mt-5 mb-5'>
            {<StickyHeadTableTrends data={trends} />}
          </Col>
          <Col></Col>
        </Row>
      </Container>
    </div>
  );
}
export default Trend;