import { gql } from 'apollo-boost';

const GET_BOOKS = gql`
  {
    books {
      name
      id
    }
  }
`;

const GET_AUTHORS = gql`
  {
    authors {
      name
      id
    }
  }
`;

const ADD_BOOK = gql`
  mutation($name: String!, $genre: String!, $authorID: ID!) {
    addBook(name: $name, genre: $genre, authorID: $authorID) {
      name
      id
    }
  }
`;

const GET_BOOK_DETAIL = gql`
  query($id: ID!) {
    book(id: $id) {
      id
      name
      genre
      authorID {
        id
        name
        age
        books {
          name
          id
        }
      }
    }
  }
`;

export { GET_AUTHORS, GET_BOOKS, ADD_BOOK, GET_BOOK_DETAIL };
