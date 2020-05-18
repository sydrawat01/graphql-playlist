import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_BOOKS } from '../queries/queries';
import BookDetail from './BookDetail';

function BookList() {
  const [selected, setSelected] = useState('');
  const { loading, error, data } = useQuery(GET_BOOKS);

  if (loading) return <div>Loading Books...</div>;
  if (error) return <div>Error</div>;

  const { books } = data;
  const bookListItems = books.map(({ id, name }) => (
    <li key={id} onClick={() => setSelected(id)}>
      {name}
    </li>
  ));
  return (
    <div>
      <ul id="book-list">{bookListItems}</ul>
      <BookDetail bookID={selected} />
    </div>
  );
}

export default BookList;
