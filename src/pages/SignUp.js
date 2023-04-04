import React, { useState } from "react";
import { Container, Button } from "react-bootstrap";
import { TextField } from "@material-ui/core";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';
import { register } from "../services/auth";
import { useNavigate } from "react-router-dom";


/*
This is a function that allows a user to sign up for an account on a website. 
It has a form for the user to input their desired username and password, 
and a submit button to send a request to the server to register the new user. 
The function also has a link for users who already have an account to navigate to the login page. 
The function uses the useState hook from React to manage the state of the input fields and 
the register function from the auth service to send a request to the server to register the new user. 
It also uses the useNavigate hook from react-router-dom to navigate to the login page upon successful registration.
*/
function SignUp() {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const onUsernameChange = (e) => setUsername(e.target.value);
    const onPasswordChange = (e) => setPassword(e.target.value);
    const navigate = useNavigate();

  // Function to register the user in the backend
    const handleSubmit = () => {
        register({
            'username': username,
            'password': password
        })
            .then((response) => {
                if (response.status == 404) {
                    response.message.then((e) => {
                        alert(e.detail)
                        setUsername("")
                        setPassword("")
                    })
                    return;
                }
                navigate('/login')
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
                            Sign Up
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
                            Sign Up
                        </Button>
                    </Col>
                    <Col></Col>
                </Row>
                <Row className="mt-6">
                    <Col></Col>
                    <Col md={5} xs={12} className='mt-4' align="center">
                        <a href='/login'>
                            Already Have an Account ? Log In
                        </a >
                    </Col>
                    <Col></Col>
                </Row>
            </Container>
        </div>
    );
}
export default SignUp;