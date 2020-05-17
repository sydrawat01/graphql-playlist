import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';

const GET_BOOKS = gql`
  {
    books {
      name
      genre
    }
  }
`;

function BookList() {
  const data = useQuery(GET_BOOKS);
  console.log(data);
  return (
    <div>
      <ul id="book-list">
        <li>Book Name</li>
      </ul>
    </div>
  );
}

export default BookList;
