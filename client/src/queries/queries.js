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

export { GET_AUTHORS, GET_BOOKS };
