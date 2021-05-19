import React, {useContext} from 'react';
import { AuthContext, AuthConsumer, AuthContextProps } from '../context/AuthContext';
import { AuthProvider } from '../context/AuthProvider';

interface Props {
   // 
}

export class AuthComponent extends React.Component<Props> {
    //static authContext = AuthContext;

    constructor(props: Props){
        super(props);
        //this.authContext = useContext(AuthContext);
    }

    render(){
        return (
            <AuthConsumer> 
            {({ isAuth, username, token, changeUsername, login, logout }) => (
            <form onSubmit={login}>
            <h3>Login</h3>
            {/*console.log(isAuth)*/}
            {/*console.log(login)*/}

            <div className="form-group">
                <label>Email address</label>
                <input type="email" className="form-control" placeholder="Enter email" onChange={changeUsername /*(ev) => {username=ev.target.value}*/} />
            </div>

            <div className="form-group">
                <label>Password</label>
                <input type="password" className="form-control" placeholder="Enter password" />
            </div>

            <div className="form-group">
                <div className="custom-control custom-checkbox">
                    <input type="checkbox" className="custom-control-input" id="customCheck1" />
                    <label className="custom-control-label" htmlFor="customCheck1">Remember me</label>
                </div>
            </div>
            <button type="submit" className="btn btn-primary btn-block">Submit</button>
            {/*<button onClick={login} className="btn btn-primary btn-block">Submit</button>*/}

            <p className="forgot-password text-right">
                Forgot <a href="#">password?</a>
            </p>
            </form>
            )}
            </AuthConsumer>
        );
    }
}