import * as React from 'react';
import { BookForm, BookFormMode } from './BookForm.js';
export default class BookComponent extends React.Component {
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
            return React.createElement(BookForm, { onBookSubmit: this.props.onUpdate, mode: BookFormMode.Update, initial: this.props.book, canselUpdate: this.onEdit });
        }
        else {
            return React.createElement("tr", null,
                React.createElement("td", null, this.props.book.id),
                React.createElement("td", null,
                    this.props.book.name,
                    " ",
                    this.props.logged && React.createElement("p", { className: "edit-link", onClick: this.onEdit }, "edit")),
                React.createElement("td", null, this.props.book.year),
                React.createElement("td", null, this.props.book.genre),
                React.createElement("td", null, this.props.book.author),
                React.createElement("td", null,
                    React.createElement("input", { type: "checkbox", onChange: e => this.props.onSelect(e, this.props.book.id), checked: this.props.book.selected })));
        }
    }
}
//# sourceMappingURL=BookComponent.js.map