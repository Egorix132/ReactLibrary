import * as React from 'react';
import Book from '../Book.js';
import {BookForm, BookFormMode}  from './BookForm.js';
import BookComponent from './BookComponent.js';
import AuthComponent from './AuthComponent.js';
import { getToken } from '../tokenApi.js';

interface BookListState {
    Books: Book[];
    selected: Map<number, boolean>;
    logged: Boolean;
}

export default class BookList extends React.Component<{ apiUrl: string }, BookListState> {

    constructor(props) {
        super(props);
        this.state = { Books: [], selected: new Map<number, boolean>(), logged: getToken() ? true : false };

        this.onSelect = this.onSelect.bind(this);
        this.onSelectAll = this.onSelectAll.bind(this);
        this.onAdd = this.onAdd.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
        this.onRemove = this.onRemove.bind(this);
        this.updateBooks = this.updateBooks.bind(this);
    }
    onSelect(e: React.FormEvent<HTMLInputElement>, id: number) {
        this.setState(prevState => ({
            selected: prevState.selected.set(id, e.currentTarget.checked)
        }));
    }
    onSelectAll(e: React.FormEvent<HTMLInputElement>) {
        this.state.selected.forEach((v, k) => this.state.selected.set(k, e.currentTarget.checked));
        this.setState({ selected: this.state.selected });
    }
    updateBooks(books: Book[]) {
        books.forEach(b => {
            this.state.selected.set(b.id, this.state.selected[b.id] ?? false);
        });
        this.setState({ Books: books, selected: this.state.selected });
    }
    loadData() {
        fetch(this.props.apiUrl)
            .then(response => response.json())
            .then(data => this.updateBooks(data));
    }
    componentDidMount() {
        this.loadData();
    }
    onAdd(Book: Book) {
        if (Book) {
            fetch(this.props.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + getToken()
                },
                body: JSON.stringify(Book)
            }).then(
                function (response) {
                    if (response.ok) {
                        this.loadData();
                    }
                }.bind(this)
            );
        }
    }
    onUpdate(Book: Book) {
        if (Book) {
            fetch(this.props.apiUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + getToken()
                },
                body: JSON.stringify(Book)
            }).then(
                function (response) {
                    if (response.ok) {
                        this.loadData();
                    }
                }.bind(this)
            );
        }
    }
    onRemove() {
        let bookIds = this.state.Books.filter(b => this.state.selected.get(b.id)).map(b => b.id);
        if (bookIds.length > 0) {
            fetch(this.props.apiUrl, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + getToken()
                },
                body: JSON.stringify(bookIds)
            }).then(
                function (response) {
                    if (response.ok) {
                        this.loadData();
                    }
                }.bind(this)
            );
        }
    }
    render() {
        return <div>
            <div className="container">                
                <h2>Library</h2>
                <AuthComponent authApi="/auth" onAuth={() => this.setState({})} />
                {
                    this.state.logged && <button type="button" className="btn btn-light" onClick={this.onRemove}>Delete selected</button>
                }
                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Year</th>
                            <th>Genre</th>
                            <th>Author</th>
                            <th>
                                <div className="form-check">
                                    <label className="form-check-label">
                                        <input type="checkbox" className="form-check-input" onChange={this.onSelectAll} />
                                    Select All
                                </label>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.logged && <BookForm onBookSubmit={this.onAdd} mode={BookFormMode.Add} />
                        }
                        {                         
                            this.state.Books.map(function (book) {
                                return <BookComponent
                                    key={book.id}
                                    book={book}
                                    selected={this.state.selected.get(book.id)}
                                    logged={this.state.logged}
                                    onSelect={this.onSelect}
                                    onUpdate={this.onUpdate} />
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>;
    }
}