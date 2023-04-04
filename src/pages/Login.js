import React, { useState } from "react";
import { Container, Button } from "react-bootstrap";
import { TextField } from "@material-ui/core";
import Cookies from "js-cookie";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';
import { login } from "../services/auth";

/*
Login is a React functional component that allows users to enter their username and password and submit a login request to the server. 
It also provides a link to the signup page for users who do not have an account.
On successful login, the server returns an access token that is stored in a cookie, 
and the page is reloaded to reflect the logged in status. 
In case of invalid credentials, an alert is displayed and the username and password fields are reset.
*/
function Login() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    // Functions to handle the input text.
    const onUsernameChange = (e) => setUsername(e.target.value);
    const onPasswordChange = (e) => setPassword(e.target.value);
    // Function to login the user and set the cookies.
    const handleSubmit = () => {
        login({
            'username': username,
            'password': password
        })
            .then((response) => {
                if (response.access_token) {
                    Cookies.set("token", response.access_token);
                    window.location.reload();
                    return
                }
                alert("Invalid Credentials")
                setUsername("");
                setPassword("");
                return response;
            })
    }


    return (
        <div>
            <Container >
                <Row>
                    <Col>
                    </Col>
                    <Col align="center" className='mt-5' md={8} xs={12}>
                        <h1>
                            Login
                        </h1>
                    </Col>
                    <Col>
                    </Col>
                </Row>
                <Row>
                    <Col>
                    </Col>
                    <Col md={5} xs={12} className='mt-5' align="center">
                        <TextField label="Username" value={username} onChange={onUsernameChange}></TextField>
                    </Col>

                    <Col>
                    </Col>
                </Row>
                <Row>
                    <Col>
                    </Col>
                    <Col md={5} xs={12} className='mt-5' align="center">
                        <TextField type="password" label="Password" value={password} onChange={onPasswordChange}></TextField>
                    </Col>
                    <Col>
                    </Col>
                </Row>
                <Row>
                    <Col></Col>
                    <Col md={5} xs={12} className='mt-5' align="center">
                        <Button
                            onClick={handleSubmit}
                            color='primary'>
                            LOGIN
                        </Button>
                    </Col>
                    <Col></Col>
                </Row>
                <Row className="mt-6">
                    <Col></Col>
                    <Col md={5} xs={12} className='mt-4' align="center">
                        <a href='/signup'>
                            Dont Have an Account ? Sing Up
                        </a >
                    </Col>
                    <Col></Col>
                </Row>
            </Container>
        </div>
    );
}
export default Login;