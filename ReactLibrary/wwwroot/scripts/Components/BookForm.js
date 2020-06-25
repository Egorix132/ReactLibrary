import * as React from 'react';
export var BookFormMode;
(function (BookFormMode) {
    BookFormMode[BookFormMode["Add"] = 0] = "Add";
    BookFormMode[BookFormMode["Update"] = 1] = "Update";
})(BookFormMode || (BookFormMode = {}));
export class BookForm extends React.Component {
    constructor(props) {
        var _a, _b, _c, _d, _e;
        super(props);
        this.name = React.createRef();
        this.year = React.createRef();
        this.genre = React.createRef();
        this.author = React.createRef();
        this.state = {
            id: ((_a = this.props.initial) === null || _a === void 0 ? void 0 : _a.id) || 0,
            name: ((_b = this.props.initial) === null || _b === void 0 ? void 0 : _b.name) || "",
            year: ((_c = this.props.initial) === null || _c === void 0 ? void 0 : _c.year) || 0,
            genre: ((_d = this.props.initial) === null || _d === void 0 ? void 0 : _d.genre) || "",
            author: ((_e = this.props.initial) === null || _e === void 0 ? void 0 : _e.author) || ""
        };
        this.onSubmit = this.onSubmit.bind(this);
    }
    onSubmit(e) {
        e.preventDefault();
        let bookName = this.name.current.value.trim();
        let bookAuthor = this.name.current.value;
        if (!bookName || !bookAuthor) {
            return;
        }
        this.props.onBookSubmit({
            id: this.state.id,
            name: bookName,
            year: this.year.current.valueAsNumber,
            genre: this.genre.current.value,
            author: bookAuthor
        });
        if (this.props.mode == BookFormMode.Update)
            this.props.canselUpdate();
        else {
            this.setState({ name: "", year: 0, genre: "", author: "" });
        }
    }
    render() {
        var _a, _b, _c, _d;
        return React.createElement("tr", null,
            React.createElement("td", null, this.state.id),
            React.createElement("td", null,
                React.createElement("input", { ref: this.name, placeholder: "Name", type: "text", defaultValue: ((_a = this.props.initial) === null || _a === void 0 ? void 0 : _a.name) || "" })),
            React.createElement("td", null,
                React.createElement("input", { ref: this.year, placeholder: "Year", type: "number", defaultValue: ((_b = this.props.initial) === null || _b === void 0 ? void 0 : _b.year) || 0 })),
            React.createElement("td", null,
                React.createElement("input", { ref: this.genre, placeholder: "Genre", type: "text", defaultValue: ((_c = this.props.initial) === null || _c === void 0 ? void 0 : _c.genre) || "" })),
            React.createElement("td", null,
                React.createElement("input", { ref: this.author, placeholder: "Author", type: "text", defaultValue: ((_d = this.props.initial) === null || _d === void 0 ? void 0 : _d.author) || "" })),
            React.createElement("td", null,
                React.createElement("button", { type: "button", className: "btn btn-light", onClick: this.onSubmit }, BookFormMode[this.props.mode]),
                this.props.mode == BookFormMode.Update &&
                    React.createElement("button", { type: "button", className: "btn btn-light", onClick: this.props.canselUpdate }, "Cansel")));
    }
}
//# sourceMappingURL=BookForm.js.map