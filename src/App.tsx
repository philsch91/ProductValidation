import React from 'react';
import AuthenticatedApp from './AuthenticatedApp';

import './App.css';

//const AuthenticatedApp = React.lazy(() => import('./AuthenticatedApp'))
//const UnauthenticatedApp = React.lazy(() => import('./UnauthenticatedApp'))

class App extends React.Component<{}> {

  render() {
    //let app 
    return (
      <AuthenticatedApp />
      /*
      <AuthConsumer> 
        {({ isAuth }) => {
        //=> ({
          
          //isAuth === true ? <AuthenticatedApp /> : <UnauthenticatedApp />
          //token !== '' ? <AuthenticatedApp /> : <UnauthenticatedApp />
        
          if (isAuth === true) {
            return <AuthenticatedApp />
            
            //<React.Suspense fallback={<FullPageSpinner />}>
              //<AuthenticatedApp />
            //</React.Suspense>
          }

          return <AuthenticatedApp />
          //return <UnauthenticatedApp /> 
        }
        //)}
        }
      </AuthConsumer>
      */
    );
  }
}

export default App;