import * as React from 'react';
import Book from '../Book.js';
import { isExpired } from './AuthComponent.js';

export enum BookFormMode {
    Add,
    Update
}

interface BookFormProps {
    mode: BookFormMode;
    onBookSubmit: (Book: Book) => void;
    initial?: Book;
    canselUpdate?: () => void;
}

export class BookForm extends React.Component<BookFormProps, Book> {

    constructor(props) {
        super(props);
        this.state = {
            id: this.props.initial?.id || 0,
            name: this.props.initial?.name || "",
            year: this.props.initial?.year || 0,
            genre: this.props.initial?.genre || "",
            author: this.props.initial?.author || ""
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
            return <tr>
                <td>{this.state.id}</td>
                <td><input placeholder="Name" value={this.state.name} onChange={this.onNameChange} /></td>
                <td><input placeholder="Year" value={this.state.year} onChange={this.onYearChange} /></td>
                <td><input placeholder="Genre" value={this.state.genre} onChange={this.onGenreChange} /></td>
                <td><input placeholder="Author" value={this.state.author} onChange={this.onAuthorChange} /></td>
                <td>
                    <button type="button" className="btn btn-light" onClick={this.onSubmit}>{BookFormMode[this.props.mode]}</button>
                    {this.props.mode == BookFormMode.Update &&
                        <button type="button" className="btn btn-light" onClick={this.props.canselUpdate}>Cansel</button>
                    }

                </td>
            </tr>; 
    }
}