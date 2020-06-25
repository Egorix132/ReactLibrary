import * as React from 'react';
import Book from '../Book.js';
import { BookForm, BookFormMode } from './BookForm.js';

interface BookComponentProps {
    book: Book;
    logged: boolean;
    onChoose: (e, id: number) => void;
    onUpdate: (Book: Book) => void;
}

export default class BookComponent extends React.Component<BookComponentProps, { editing: boolean }> {

    constructor(props) {
        super(props);
        this.state = { editing: false };

        this.onEdit = this.onEdit.bind(this);
    }
    onEdit() {
        this.setState({ editing: !this.state.editing });
    }
    render() {
        if (this.state.editing && this.props.logged) {
            return <BookForm onBookSubmit={this.props.onUpdate} mode={BookFormMode.Update} initial={this.props.book} canselUpdate={this.onEdit} />
        }
        else {
            return <tr>
                <td>{this.props.book.id}</td>
                <td>{this.props.book.name} {this.props.logged && <p className="edit-link" onClick={this.onEdit}>edit</p>}</td>
                <td>{this.props.book.year}</td>
                <td>{this.props.book.genre}</td>
                <td>{this.props.book.author}</td>
                <td>
                    <input type="checkbox" onChange={e => this.props.onChoose(e, this.props.book.id)} checked={this.props.book.choosed}></input>
                </td>
            </tr>;
        }      
    }
}