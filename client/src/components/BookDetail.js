import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_BOOK_DETAIL } from '../queries/queries';

function BookDetail({ bookID }) {
  const { loading, error, data } = useQuery(GET_BOOK_DETAIL, {
    skip: !bookID,
    variables: { id: bookID },
  });
  let content;
  if (loading) content = <p>Loading...</p>;
  else if (error) content = <p>Error</p>;
  else if (!bookID) content = <p>No book selected</p>;
  else {
    const {
      book: { name, genre, authorID },
    } = data;
    const books = authorID.books.map(({ id, name }) => {
      return <li key={id}>{name}</li>;
    });

    content = (
      <>
        <h2>{name}</h2>
        <p>{genre}</p>
        <p>{authorID.name}</p>
        <p>All books by this author:</p>
        <ul className="other-books">{books}</ul>
      </>
    );
  }

  return <div id="book-details">{content}</div>;
}

export default BookDetail;
