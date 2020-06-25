import * as React from 'react';
import * as ReactDOM from 'react-dom';
import BookList from './Components/BookList';

ReactDOM.render(
    <BookList apiUrl="/book" />,
    document.getElementById("content")
);