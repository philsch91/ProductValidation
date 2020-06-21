import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './UnauthenticatedApp.css';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import { AuthComponent } from './components/AuthComponent';
import { SignupComponent } from './components/SignupComponent';
//import {useAuth} from './context/auth-context'
//import {useAsync} from './utils/hooks'

function App() {
  /*
  return (
    <h3>React Login and Sign Up Template</h3>
  );
  */
  return (
    <Router>
    <div className="App">
    <nav className="navbar navbar-expand-lg navbar-light fixed-top">
        <div className="container">
          <Link className="navbar-brand" to={"/sign-in"}>Login and Signup Template</Link>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link className="nav-link" to={"/sign-in"}>Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to={"/sign-up"}>Sign up</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="auth-wrapper">
        <div className="auth-inner">
          <Switch>
            <Route exact path='/' component={AuthComponent} />
            <Route path="/sign-in" component={AuthComponent} />
            <Route path="/sign-up" component={SignupComponent} />
          </Switch>
        </div>
      </div>
    </div>
    </Router>
  );
}

export default App;
