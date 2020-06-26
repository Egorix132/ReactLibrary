import * as React from 'react';
import Book from '../Book.js';
import {BookForm, BookFormMode}  from './BookForm.js';
import BookComponent from './BookComponent.js';
import AuthComponent from './AuthComponent.js';
import { getToken } from '../tokenApi.js';
import { strict } from 'assert';

export default class BookList extends React.Component<{ apiUrl: string }, { Books: Book[], selected: Map<number, boolean> }> {

    constructor(props) {
        super(props);
        this.state = { Books: [], selected: new Map<number, boolean>() };

        this.onSelect = this.onSelect.bind(this);
        this.onSelectAll = this.onSelectAll.bind(this);
        this.onAddBook = this.onAddBook.bind(this);
        this.onUpdateBook = this.onUpdateBook.bind(this);
        this.onRemoveBook = this.onRemoveBook.bind(this);
        this.updateStateBooks = this.updateStateBooks.bind(this);
    }
    onSelect(e: React.FormEvent<HTMLInputElement>, id: number) {
        this.state.selected.set(id, e.currentTarget.checked);
        this.setState({ selected: this.state.selected });
    }
    onSelectAll(e: React.FormEvent<HTMLInputElement>) {
        this.state.selected.forEach((v, k) => this.state.selected.set(k, e.currentTarget.checked));
        this.setState({ selected: this.state.selected });
    }
    updateStateBooks(books: Book[]) {
        books.forEach(b => {
            this.state.selected.set(b.id, this.state.selected[b.id] ?? false);
        });
        this.setState({ Books: books, selected: this.state.selected });
    }
    loadData() {
        fetch(this.props.apiUrl)
            .then(response => response.json())
            .then(data => this.updateStateBooks(data));
    }
    componentDidMount() {
        this.loadData();
    }
    onAddBook(Book: Book) {
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
    onUpdateBook(Book: Book) {
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
    onRemoveBook() {
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
        let selected = this.state.selected;
        let onSelect = this.onSelect;
        let update = this.onUpdateBook;
        let logged: boolean = getToken() ? true : false;
        return <div>
            <div className="container">                
                <h2>Library</h2>
                <AuthComponent authApi="/auth" onAuth={() => this.setState({})} />
                {
                    logged && <button type="button" className="btn btn-light" onClick={this.onRemoveBook}>Delete selected</button>
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
                            logged && <BookForm onBookSubmit={this.onAddBook} mode={BookFormMode.Add} />
                        }
                        {                         
                            this.state.Books.map(function (book) {
                                return <BookComponent key={book.id} book={book} selected={selected.get(book.id)} logged={logged} onSelect={onSelect} onUpdate={update} />
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>;
    }
}