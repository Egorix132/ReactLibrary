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

export default class AuthComponent extends React.Component<{ authApi: string, onAuth: () => void }, { method: AuthMethod, login: string, password: string, loginValid: boolean, passValid: boolean, }> {

    constructor(props) {
        super(props);
        this.state = { method: AuthMethod.Login, login: "", password: "", loginValid: false, passValid: false }

        this.onLogin = this.onLogin.bind(this);
        this.onRegister = this.onRegister.bind(this);
        this.onLoginChange = this.onLoginChange.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
    }
    validateLogin(login: string) {
        return login.length >= 2;
    }
    validatePassword(pass: string) {
        return pass.length > 6;
    }
    onLogin() {
        if (!this.state.loginValid || !this.state.passValid)
            return;
        let login = this.state.login;
        let password = this.state.password;
        fetch(this.props.authApi + "/" + AuthMethod[this.state.method], {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([login, password])
        })
            .then(response => response.json())
            .then(data => {
                if (data.access_token) {
                    localStorage.setItem('username', data.username);
                    localStorage.setItem('token', data.access_token);
                }
                this.setState({});
                this.props.onAuth();
            });
    }
    onRegister() {
        let login = this.state.login;
        let password = this.state.password;
        fetch(this.props.authApi + "/" + AuthMethod[this.state.method], {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([login, password])
        })
            .then(response => response.json())
            .then(data => {
                if (data.access_token) {
                    localStorage.setItem('username', data.username);
                    localStorage.setItem('token', data.access_token);
                }

                this.setState({});
                this.props.onAuth();
            });       
    }
    onLoginChange(e) {
        let val = e.target.value;
        let valid = this.validateLogin(val);
        this.setState({ login: val, loginValid: valid });
    }
    onPasswordChange(e) {
        let val = e.target.value;
        let valid = this.validatePassword(val);
        this.setState({ password: val, passValid: valid });
    }

    render() {
        let method = this.state.method;
        let reverseMethod = method == AuthMethod.Login ? AuthMethod.Register : AuthMethod.Login;

        var loginColor = this.state.loginValid === true ? "green" : "red";
        var passColor = this.state.passValid === true ? "green" : "red";
        let token = localStorage.getItem('token');

        if (!token || isExpired(token)) {
            return <form>
                <p>
                    <label>Login:</label><br />
                    <input type="text" value={this.state.login} onChange={this.onLoginChange} style={{ borderColor: loginColor }} />
                </p>
                <p>
                    <label>Password:</label><br />
                    <input type="password" value={this.state.password} onChange={this.onPasswordChange} style={{ borderColor: passColor }} />
                </p>
                <button type="button" className="btn btn-light" onClick={e => method == AuthMethod.Login ? this.onLogin() : this.onRegister()}>{method == AuthMethod.Login ? "Login" : "Register"}</button>
                <button type="button" className="btn btn-light" onClick={e => this.setState({ method: reverseMethod })} > {"to " + AuthMethod[reverseMethod]}</button>
            </form>
        }
        return <p>You are logged as {localStorage.getItem('username')}</p>
    }
}

export function isExpired(jwt: string): boolean {
    if (!jwt)
        return null;
    const decoded = JSON.parse(atob(jwt.split('.')[1]));
    let exp = decoded && decoded.exp && decoded.exp * 1000 || null;
    return Date.now() > exp;
}