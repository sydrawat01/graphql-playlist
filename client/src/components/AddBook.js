import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_AUTHORS } from '../queries/queries';

function AddBook() {
  const [formData, setFormData] = useState({
    bookName: '',
    genre: '',
    authorID: '',
  });
  const { loading, error, data } = useQuery(GET_AUTHORS);
  if (loading) return <div>Loading Authors...</div>;
  if (error) return <div>Error!</div>;

  const handleEvent = (e) => {
    e.persist();
    setFormData((formData) => ({
      ...formData,
      [e.target.name]: e.target.value,
    }));
  };

  const submitForm = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div>
      <form id="add-book" onSubmit={submitForm}>
        <div className="field">
          <label htmlFor="bookName">Book Name:</label>
          <input name="bookName" type="text" onChange={handleEvent} />
        </div>
        <div className="field">
          <label htmlFor="genre">Genre:</label>
          <input name="genre" type="text" onChange={handleEvent} />
        </div>
        <div className="field">
          <label htmlFor="authorID">Author:</label>
          <select name="authorID" onChange={handleEvent}>
            <option value="">--Select Author--</option>
            {data.authors.map((author) => (
              <option key={author.id} value={author.id}>
                {author.name}
              </option>
            ))}
          </select>
        </div>
        <button>+</button>
      </form>
    </div>
  );
}

export default AddBook;
