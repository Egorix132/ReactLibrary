import * as React from 'react';
import * as ReactDOM from 'react-dom';
import BookList from './Components/BookList';
ReactDOM.render(React.createElement(BookList, { apiUrl: "/book" }), document.getElementById("content"));
//# sourceMappingURL=app.js.map