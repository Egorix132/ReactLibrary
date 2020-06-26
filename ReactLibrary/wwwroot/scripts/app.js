import 'jquery';
import 'popper.js';
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap/dist/css/bootstrap.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import BookList from './Components/BookList';
import '../styles/style.css';
ReactDOM.render(React.createElement(BookList, { apiUrl: "/book" }), document.getElementById("content"));
//# sourceMappingURL=app.js.map