import React from 'react';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';

const GET_AUTHORS = gql`
  {
    authors {
      name
      id
    }
  }
`;

function AddBook() {
  const { loading, error, data } = useQuery(GET_AUTHORS);
  if (loading) return <div disabled>Loading Authors...</div>;
  if (error) return <div>Error!</div>;

  return (
    <div>
      <form id="add-book">
        <div className="field">
          <label>Book Name:</label>
          <input type="text" />
        </div>
        <div className="field">
          <label>Genre:</label>
          <input type="text" />
        </div>
        <div className="field">
          <label>Author:</label>
          <select>
            {data.authors.map((author) => (
              <option key={author.id}>{author.name}</option>
            ))}
          </select>
        </div>
        <button>+</button>
      </form>
    </div>
  );
}

export default AddBook;
