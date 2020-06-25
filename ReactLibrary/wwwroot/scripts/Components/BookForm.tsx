import * as React from 'react';
import Book from '../Book.js';
import { isExpired } from './AuthComponent.js';

export enum BookFormMode {
    Add,
    Update
}

interface BookFormProps {
    mode: BookFormMode;
    initial?: Book;
    onBookSubmit: (Book: Book) => void; 
    canselUpdate?: () => void;
}

export class BookForm extends React.Component<BookFormProps, Book> {
    private name = React.createRef<HTMLInputElement>();
    private year = React.createRef<HTMLInputElement>();
    private genre = React.createRef<HTMLInputElement>();
    private author = React.createRef<HTMLInputElement>();

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
    }

    onSubmit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
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
            return <tr>
                <td>{this.state.id}</td>
                <td><input ref={this.name} placeholder="Name" type="text" defaultValue={this.props.initial?.name || ""} /></td>
                <td><input ref={this.year} placeholder="Year" type="number" defaultValue={this.props.initial?.year || 0} /></td>
                <td><input ref={this.genre} placeholder="Genre" type="text" defaultValue={this.props.initial?.genre || ""} /></td>
                <td><input ref={this.author} placeholder="Author" type="text" defaultValue={this.props.initial?.author || ""} /></td>
                <td>
                    <button type="button" className="btn btn-light" onClick={this.onSubmit}>{BookFormMode[this.props.mode]}</button>
                    {this.props.mode == BookFormMode.Update &&
                        <button type="button" className="btn btn-light" onClick={this.props.canselUpdate}>Cansel</button>
                    }

                </td>
            </tr>; 
    }
}