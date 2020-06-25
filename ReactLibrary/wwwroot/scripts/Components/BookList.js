import * as React from 'react';
import { BookForm, BookFormMode } from './BookForm.js';
import BookComponent from './BookComponent.js';
import AuthComponent from './AuthComponent.js';
import { isExpired } from './AuthComponent.js';
export default class BookList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { Books: [] };
        this.onChoose = this.onChoose.bind(this);
        this.onChooseAll = this.onChooseAll.bind(this);
        this.onAddBook = this.onAddBook.bind(this);
        this.onUpdateBook = this.onUpdateBook.bind(this);
        this.onRemoveBook = this.onRemoveBook.bind(this);
    }
    onChoose(e, id) {
        this.state.Books[this.state.Books.findIndex(b => b.id == id)].choosed = e.currentTarget.checked;
        this.setState({ Books: this.state.Books });
    }
    onChooseAll(e) {
        this.state.Books.forEach(b => b.choosed = e.currentTarget.checked);
        this.setState({ Books: this.state.Books });
    }
    loadData() {
        fetch(this.props.apiUrl)
            .then(response => response.json())
            .then(function (data) {
            let books = data;
            this.setState({ Books: books });
        }.bind(this));
    }
    componentDidMount() {
        this.loadData();
    }
    onAddBook(Book) {
        if (Book) {
            console.log(typeof (Book.year));
            fetch(this.props.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify(Book)
            }).then(function (response) {
                if (response.ok) {
                    this.loadData();
                }
            }.bind(this));
        }
    }
    onUpdateBook(Book) {
        if (Book) {
            fetch(this.props.apiUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify(Book)
            }).then(function (response) {
                if (response.ok) {
                    this.loadData();
                }
            }.bind(this));
        }
    }
    onRemoveBook() {
        let bookIds = this.state.Books.filter(b => b.choosed).map(b => b.id);
        if (bookIds.length > 0) {
            fetch(this.props.apiUrl, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify(bookIds)
            }).then(function (response) {
                if (response.ok) {
                    this.loadData();
                }
            }.bind(this));
        }
    }
    render() {
        let choose = this.onChoose;
        let update = this.onUpdateBook;
        let token = localStorage.getItem('token');
        let logged = token && !isExpired(token);
        return React.createElement("div", null,
            React.createElement("div", { className: "container" },
                React.createElement("h2", null, "Library"),
                React.createElement(AuthComponent, { authApi: "/auth", onAuth: () => this.setState({}) }),
                logged && React.createElement("button", { type: "button", className: "btn btn-light", onClick: this.onRemoveBook }, "Delete selected"),
                React.createElement("table", { className: "table" },
                    React.createElement("thead", null,
                        React.createElement("tr", null,
                            React.createElement("th", null, "ID"),
                            React.createElement("th", null, "Name"),
                            React.createElement("th", null, "Year"),
                            React.createElement("th", null, "Genre"),
                            React.createElement("th", null, "Author"),
                            React.createElement("th", null,
                                React.createElement("div", { className: "form-check" },
                                    React.createElement("label", { className: "form-check-label" },
                                        React.createElement("input", { type: "checkbox", className: "form-check-input", onChange: this.onChooseAll }),
                                        "Choose All"))))),
                    React.createElement("tbody", null,
                        logged && React.createElement(BookForm, { onBookSubmit: this.onAddBook, mode: BookFormMode.Add }),
                        this.state.Books.map(function (book) {
                            return React.createElement(BookComponent, { key: book.id, book: book, logged: logged, onChoose: choose, onUpdate: update });
                        })))));
    }
}
//# sourceMappingURL=BookList.js.map