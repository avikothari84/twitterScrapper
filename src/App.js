import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Keyword from "./pages/Keyword";
import Hashtag from "./pages/Hashtag";
import Handle from "./pages/Handle";
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Trend from "./pages/Trend";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Cookies from "js-cookie";
import { userDetails } from "./services/users";

const useStyles = makeStyles({
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
});

export const AuthApi = React.createContext();
export const TokenApi = React.createContext();
export const UserApi = React.createContext();


function App() {

  const [auth, setAuth] = useState(false);
  const [token, setToken] = useState("");
  const [username,setUsername] = useState(null)

  const [state, setState] = React.useState({
    left: false,
  });

  useEffect(() => {
    readCookie();
  }, []);

  const readCookie = () => {
    let token = Cookies.get("token");
    if (token) {
      setAuth(true);
      setToken(token);
      getUserDetails(token);
    }
  };

  const getUserDetails = (toke) => {
    userDetails(toke)
        .then((data) => {
            setUsername(data.username)
        })
  }

  const Protected = ({ auth, children }) => {
    if (!auth) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };
  const ProtectedLogin = ({ auth, children }) => {
    if (auth) {
      return <Navigate to="/dashboard" replace />;
    }
    return children
  };

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };


  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {['Hashtag', 'Keyword', 'Handle', "Trends", "Dashboard"].map((text, index) => (
          <ListItem button key={text} onClick={() => {
            if (index == 0)
              window.location = '/hashtag/'
            if (index == 1)
              window.location = '/keyword/'
            if (index == 2)
              window.location = '/handle/'
            if (index == 3)
              window.location = '/trends/'
            if (index == 4)
              window.location = '/dashboard/'
          }
          }>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <BrowserRouter>
      <AuthApi.Provider value={{ auth, setAuth }}>
        <TokenApi.Provider value={{ token, setToken }}>
          <UserApi.Provider value={{ username, setUsername }}>
          <Navbar 
          openDrawerHandler={toggleDrawer} 
          username={username}/>
          <Drawer anchor={'left'} open={state['left']} onClose={toggleDrawer('left', false)}>
            {list('left')}
          </Drawer>
          <Routes>
            <Route exact path="/" element={<Handle />} />
            <Route exact path="/handle" element={<Handle />} />
            <Route exact path="/hashtag" element={<Hashtag />} />
            <Route exact path="/keyword" element={<Keyword />} />
            <Route exact path="/trends" element={<Trend />} />
            <Route path="/dashboard" element={<Protected
              auth={auth}>
              <Dashboard />
            </Protected>} />
            <Route path="/login" element={<ProtectedLogin
              auth={auth}>
              <Login />
            </ProtectedLogin>} />
            <Route path="/signup" element={<ProtectedLogin
              auth={auth}>
              <SignUp />
            </ProtectedLogin>} />
          </Routes>
          </UserApi.Provider>
        </TokenApi.Provider>
      </AuthApi.Provider>
    </BrowserRouter>
  );
}
export default App;