import * as React from 'react';
var AuthMethod;
(function (AuthMethod) {
    AuthMethod[AuthMethod["Login"] = 0] = "Login";
    AuthMethod[AuthMethod["Register"] = 1] = "Register";
})(AuthMethod || (AuthMethod = {}));
export default class AuthComponent extends React.Component {
    constructor(props) {
        super(props);
        this.login = React.createRef();
        this.password = React.createRef();
        this.state = { method: AuthMethod.Login, errorText: "" };
        this.onLogin = this.onLogin.bind(this);
        this.onLogout = this.onLogout.bind(this);
        this.onRegister = this.onRegister.bind(this);
    }
    validateLogin(login) {
        return login.length >= 2;
    }
    validatePassword(pass) {
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
            return React.createElement("form", null,
                React.createElement("p", null,
                    React.createElement("label", null, "Login:"),
                    React.createElement("br", null),
                    React.createElement("input", { type: "text", ref: this.login, style: { borderColor: loginColor } })),
                React.createElement("p", null,
                    React.createElement("label", null, "Password:"),
                    React.createElement("br", null),
                    React.createElement("input", { type: "password", ref: this.password, style: { borderColor: passColor } })),
                React.createElement("p", null, this.state.errorText),
                React.createElement("button", { type: "button", className: "btn btn-light", onClick: e => method == AuthMethod.Login ? this.onLogin() : this.onRegister() }, method == AuthMethod.Login ? "Login" : "Register"),
                React.createElement("button", { type: "button", className: "btn btn-light", onClick: e => this.setState({ method: reverseMethod }) },
                    " ",
                    "to " + AuthMethod[reverseMethod]));
        }
        return React.createElement("p", null,
            "You are logged as ",
            localStorage.getItem('username'),
            React.createElement("button", { type: "button", className: "btn btn-light", onClick: e => this.onLogout() }, "Logout"));
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