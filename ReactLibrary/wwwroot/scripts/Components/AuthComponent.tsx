import * as React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { RouteComponentProps } from 'react-router';
import { Console } from 'console';
import { decode } from 'punycode';

interface MatchParams {
    method: string;
}

interface Props extends RouteComponentProps<MatchParams> {
}

export interface match<P> {
    params: P;
    isExact: boolean;
    path: string;
    url: string;
}
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

        this.onLogin = this.onLogin.bind(this);
        this.onLogout = this.onLogout.bind(this);
        this.onRegister = this.onRegister.bind(this);
    }
    validateLogin(login: string) {
        return login.length >= 2;
    }
    validatePassword(pass: string) {
        return pass.length > 6;
    }
    onLogin() {
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
                    localStorage.setItem('username', data.username);
                    localStorage.setItem('token', data.access_token);
                    this.setState({ errorText: "" });
                }
                else {
                    this.setState({ errorText: data.errorText });
                }

                this.props.onAuth();
            });
    }
    onLogout() {
        localStorage.removeItem('token');
        this.setState({});
        this.props.onAuth();
    }
    onRegister() {
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
                    localStorage.setItem('username', data.username);
                    localStorage.setItem('token', data.access_token);
                    this.setState({ errorText: "" });
                }
                else {
                    this.setState({ errorText: data.errorText });
                }
       
                this.props.onAuth();
            });       
    }

    render() {
        let method = this.state.method;
        let reverseMethod = method == AuthMethod.Login ? AuthMethod.Register : AuthMethod.Login;

        var loginColor = this.validateLogin(this.login.current.value) === true ? "green" : "red";
        var passColor = this.validatePassword(this.password.current.value) === true ? "green" : "red";
        let token = localStorage.getItem('token');
       
        if (!token || isExpired(token)) {
            return <form>
                <p>
                    <label>Login:</label><br />
                    <input type="text" ref={this.login} style={{ borderColor: loginColor }} />
                </p>
                <p>
                    <label>Password:</label><br />
                    <input type="password" ref={this.password} style={{ borderColor: passColor }} />
                </p>
                <p>{this.state.errorText}</p>
                <button type="button" className="btn btn-light" onClick={e => method == AuthMethod.Login ? this.onLogin() : this.onRegister()}>{method == AuthMethod.Login ? "Login" : "Register"}</button>
                <button type="button" className="btn btn-light" onClick={e => this.setState({ method: reverseMethod })} > {"to " + AuthMethod[reverseMethod]}</button>
            </form>
        }
        return <p>
            You are logged as {localStorage.getItem('username')}
            <button type="button" className="btn btn-light" onClick={e => this.onLogout()}>Logout</button>
        </p>
    }
}

export function isExpired(jwt: string): boolean {
    if (!jwt)
        return null;
    const decoded = JSON.parse(atob(jwt.split('.')[1]));
    let exp = decoded && decoded.exp && decoded.exp * 1000 || null;
    return Date.now() > exp;
}