import React from 'react';
import { AuthContext, AuthConsumer } from './context/AuthContext';
import { AuthProvider } from './context/AuthProvider';
import AuthenticatedApp from './AuthenticatedApp';
import UnauthenticatedApp from './UnauthenticatedApp';

import './App.css';

//const AuthenticatedApp = React.lazy(() => import('./AuthenticatedApp'))
//const UnauthenticatedApp = React.lazy(() => import('./UnauthenticatedApp'))

class App extends React.Component<{}> {

  constructor(props: any){
    super(props);
    //8546
  }

  render() {
    //let app 
    return (
      //<AuthenticatedApp />
      // /*
      <AuthProvider>
      <AuthConsumer>
      {({ isAuth, username, token, login, logout }) => {
          // => ({
          //isAuth === true ? <AuthenticatedApp /> : <UnauthenticatedApp />
          //token !== '' ? <AuthenticatedApp /> : <UnauthenticatedApp />
          console.log("isAuth " + isAuth);
          console.log("username " + username);
          if (isAuth === true) {
            return <AuthenticatedApp />
            
            //<React.Suspense fallback={<FullPageSpinner />}>
              //<AuthenticatedApp />
            //</React.Suspense>
          }

          //return <AuthenticatedApp />
          return <UnauthenticatedApp />
        }
        //)}
      }
      </AuthConsumer>
      </AuthProvider>
      // */
    );
  }
}

export default App;