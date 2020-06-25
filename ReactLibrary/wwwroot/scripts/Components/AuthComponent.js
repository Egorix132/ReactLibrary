import * as React from 'react';
var AuthMethod;
(function (AuthMethod) {
    AuthMethod[AuthMethod["Login"] = 0] = "Login";
    AuthMethod[AuthMethod["Register"] = 1] = "Register";
})(AuthMethod || (AuthMethod = {}));
export default class AuthComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = { method: AuthMethod.Login, login: "", password: "", loginValid: false, passValid: false };
        this.onLogin = this.onLogin.bind(this);
        this.onRegister = this.onRegister.bind(this);
        this.onLoginChange = this.onLoginChange.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
    }
    validateLogin(login) {
        return login.length >= 2;
    }
    validatePassword(pass) {
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
            return React.createElement("form", null,
                React.createElement("p", null,
                    React.createElement("label", null, "Login:"),
                    React.createElement("br", null),
                    React.createElement("input", { type: "text", value: this.state.login, onChange: this.onLoginChange, style: { borderColor: loginColor } })),
                React.createElement("p", null,
                    React.createElement("label", null, "Password:"),
                    React.createElement("br", null),
                    React.createElement("input", { type: "password", value: this.state.password, onChange: this.onPasswordChange, style: { borderColor: passColor } })),
                React.createElement("button", { type: "button", className: "btn btn-light", onClick: e => method == AuthMethod.Login ? this.onLogin() : this.onRegister() }, method == AuthMethod.Login ? "Login" : "Register"),
                React.createElement("button", { type: "button", className: "btn btn-light", onClick: e => this.setState({ method: reverseMethod }) },
                    " ",
                    "to " + AuthMethod[reverseMethod]));
        }
        return React.createElement("p", null,
            "You are logged as ",
            localStorage.getItem('username'));
    }
}
export function isExpired(jwt) {
    if (!jwt)
        return null;
    const decoded = JSON.parse(atob(jwt.split('.')[1]));
    let exp = decoded && decoded.exp && decoded.exp * 1000 || null;
    return Date.now() > exp;
}
//# sourceMappingURL=AuthComponent.js.map