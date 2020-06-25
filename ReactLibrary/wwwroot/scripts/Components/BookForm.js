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
        this.state = {
            id: ((_a = this.props.initial) === null || _a === void 0 ? void 0 : _a.id) || 0,
            name: ((_b = this.props.initial) === null || _b === void 0 ? void 0 : _b.name) || "",
            year: ((_c = this.props.initial) === null || _c === void 0 ? void 0 : _c.year) || 0,
            genre: ((_d = this.props.initial) === null || _d === void 0 ? void 0 : _d.genre) || "",
            author: ((_e = this.props.initial) === null || _e === void 0 ? void 0 : _e.author) || ""
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.onYearChange = this.onYearChange.bind(this);
        this.onGenreChange = this.onGenreChange.bind(this);
        this.onAuthorChange = this.onAuthorChange.bind(this);
    }
    onNameChange(e) {
        this.setState({ name: e.target.value });
    }
    onYearChange(e) {
        this.setState({ year: e.target.value });
    }
    onGenreChange(e) {
        this.setState({ genre: e.target.value });
    }
    onAuthorChange(e) {
        this.setState({ author: e.target.value });
    }
    onSubmit(e) {
        e.preventDefault();
        let bookId = this.state.id;
        let bookName = this.state.name.trim();
        let bookYear = this.state.year;
        let bookGenre = this.state.genre;
        let bookAuthor = this.state.author;
        if (!bookName || !bookAuthor) {
            return;
        }
        this.props.onBookSubmit({ id: bookId, name: bookName, year: bookYear, genre: bookGenre, author: bookAuthor });
        if (this.props.mode == BookFormMode.Update)
            this.props.canselUpdate();
        else
            this.setState({ name: "", year: 0, genre: "", author: "" });
    }
    render() {
        return React.createElement("tr", null,
            React.createElement("td", null, this.state.id),
            React.createElement("td", null,
                React.createElement("input", { placeholder: "Name", value: this.state.name, onChange: this.onNameChange })),
            React.createElement("td", null,
                React.createElement("input", { placeholder: "Year", value: this.state.year, onChange: this.onYearChange })),
            React.createElement("td", null,
                React.createElement("input", { placeholder: "Genre", value: this.state.genre, onChange: this.onGenreChange })),
            React.createElement("td", null,
                React.createElement("input", { placeholder: "Author", value: this.state.author, onChange: this.onAuthorChange })),
            React.createElement("td", null,
                React.createElement("button", { type: "button", className: "btn btn-light", onClick: this.onSubmit }, BookFormMode[this.props.mode]),
                this.props.mode == BookFormMode.Update &&
                    React.createElement("button", { type: "button", className: "btn btn-light", onClick: this.props.canselUpdate }, "Cansel")));
    }
}
//# sourceMappingURL=BookForm.js.map