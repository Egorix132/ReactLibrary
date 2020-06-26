import * as React from 'react';
import { getToken, updateTokens } from '../tokenApi';
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
        this.onSubmit = this.onSubmit.bind(this);
        this.onLogout = this.onLogout.bind(this);
    }
    validateLogin(login) {
        return login.length >= 2;
    }
    validatePassword(pass) {
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
            body: JSON.stringify({ Login: loginV, Password: passV })
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
        var _a, _b, _c, _d;
        let method = this.state.method;
        let reverseMethod = method == AuthMethod.Login ? AuthMethod.Register : AuthMethod.Login;
        var loginColor = this.validateLogin((_b = (_a = this.login.current) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : "") === true ? "green" : "red";
        var passColor = this.validatePassword((_d = (_c = this.password.current) === null || _c === void 0 ? void 0 : _c.value) !== null && _d !== void 0 ? _d : "") === true ? "green" : "red";
        if (!getToken()) {
            return React.createElement("form", null,
                React.createElement("p", null,
                    React.createElement("div", { className: "col-xs-2" },
                        React.createElement("label", null, "Login:"),
                        React.createElement("br", null),
                        React.createElement("input", { type: "text", className: "form-control", ref: this.login, style: { borderColor: loginColor }, defaultValue: "" }))),
                React.createElement("p", null,
                    React.createElement("div", { className: "col-xs-2" },
                        React.createElement("label", null, "Password:"),
                        React.createElement("br", null),
                        React.createElement("input", { type: "password", className: "form-control", ref: this.password, style: { borderColor: passColor }, defaultValue: "" }))),
                React.createElement("p", null, this.state.errorText),
                React.createElement("button", { type: "button", className: "btn btn-light", onClick: e => this.onSubmit() }, method == AuthMethod.Login ? "Login" : "Register"),
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
//# sourceMappingURL=AuthComponent.js.map