import React, { useState, useEffect } from "react";
import { Button, Container } from "react-bootstrap";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthApi, TokenApi, UserApi} from "../App";
import Cookies from "js-cookie";
import { getSavedFiles } from "../services/users";
import StickyHeadTableButton from "../components/StickyHeadTableButton";
/*
This is a functional component that renders a dashboard for a user after they have logged in. 
The dashboard displays a list of saved files that the user has uploaded and provides a button to log the user out. 
The component makes use of the React context API to access the user's authentication status, JWT token, and username. 
It also uses the getSavedFiles function from the users service to retrieve a list of the user's saved files from the backend.
The StickyHeadTableButton component is used to display the saved files in a table.
*/
function Dashboard() {
    // Context for getting information about Auth
    const Auth = React.useContext(AuthApi);
    // Context for getting information about token
    const Token = React.useContext(TokenApi);
    // Context for getting information about user
    const User = React.useContext(UserApi);

    let toke = Token.token;
    // useState hook to initialize an empty array for saved files
    const [savedFiles, setSavedfiles] = useState([])
    // Function to handle logout method
    const handleLogout = () => {
        Auth.setAuth(false);
        User.setUsername(null);
        Cookies.remove("token");
    }
    // Function to get saved files
    const getData = () => {
        getSavedFiles(toke)
            .then((data) => {
                setSavedfiles(data.data)
            })
    }
    // useEffect hook to get saved files.
    useEffect(() => {
        getData();
    }, [])

    return (
        <div>
            <Container >
                <Row>
                    <Col>
                    </Col>
                    <Col align="center" className='mt-5' md={8} xs={12}>
                        <h1>
                            Saved Files
                        </h1>
                    </Col>
                    <Col>
                    </Col>
                </Row>
                <Row>
                    <Col>
                    </Col>
                    <Col align="center" className='mt-5 mb-5' md={8} xs={12}>
                        <Button
                            onClick={handleLogout}
                        >
                            LogOut
                        </Button>
                    </Col>
                    <Col>
                    </Col>
                </Row>
                <Row>
                    <StickyHeadTableButton data={savedFiles} token={toke} />
                </Row>
            </Container>
        </div>
    );
}
export default Dashboard;