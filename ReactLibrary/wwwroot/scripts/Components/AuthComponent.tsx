import * as React from 'react';
import { getToken, updateTokens } from '../tokenApi';

enum AuthMethod {
    Login,
    Register
}

interface AuthProps {
    authApi: string;
    onAuth: () => void;
}

interface AuthState {
    method: AuthMethod;
    errorText: string;
}

export default class AuthComponent extends React.Component<AuthProps, AuthState> {
    private login = React.createRef<HTMLInputElement>();
    private password = React.createRef<HTMLInputElement>();

    constructor(props) {
        super(props);
        this.state = { method: AuthMethod.Login, errorText: "" }

        this.onSubmit = this.onSubmit.bind(this);
        this.onLogout = this.onLogout.bind(this);
    }
    validateLogin(login: string) {
        return login.length >= 2;
    }
    validatePassword(pass: string) {
        return pass.length > 6;
    }
    onSubmit() {
        let loginV = this.login.current.value;
        let passV = this.password.current.value;

        if (!this.validateLogin(loginV) || !this.validatePassword(passV))
            return;  
        
        fetch(this.props.authApi + "/" + AuthMethod[this.state.method], {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([loginV, passV])
        })
            .then(response => response.json())
            .then(data => {
                if (data.access_token) {
                    updateTokens(data);
                    this.setState({ errorText: "" });
                }
                else {
                    this.setState({ errorText: data.errorText });
                }

                this.props.onAuth();
            });
    }
    onLogout() {
        localStorage.removeItem('refreshToken');
        sessionStorage.removeItem('token');
        this.setState({});
        this.props.onAuth();
    }

    render() {
        let method = this.state.method;
        let reverseMethod = method == AuthMethod.Login ? AuthMethod.Register : AuthMethod.Login;

        var loginColor = this.validateLogin(this.login.current?.value ?? "") === true ? "green" : "red";
        var passColor = this.validatePassword(this.password.current?.value ?? "") === true ? "green" : "red";
       
        if (!getToken()) {
            return <form>
                <p>
                    <label>Login:</label><br />
                    <input type="text" ref={this.login} style={{ borderColor: loginColor }} defaultValue="" />
                </p>
                <p>
                    <label>Password:</label><br />
                    <input type="password" ref={this.password} style={{ borderColor: passColor }} defaultValue="" />
                </p>
                <p>{this.state.errorText}</p>
                <button type="button" className="btn btn-light" onClick={e => this.onSubmit()}>{method == AuthMethod.Login ? "Login" : "Register"}</button>
                <button type="button" className="btn btn-light" onClick={e => this.setState({ method: reverseMethod })} > {"to " + AuthMethod[reverseMethod]}</button>
            </form>
        }
        return <p>
            You are logged as {localStorage.getItem('username')}
            <button type="button" className="btn btn-light" onClick={e => this.onLogout()}>Logout</button>
        </p>
    }
}

