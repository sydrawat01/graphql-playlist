# Adding a front-end

So this is how our project looks currently:

![alt text](../assets/proj-overview.png 'Project Overview')

We have our `express app` and `graphql server` built on `nodejs`, and we've hooked this up with `mongodb`. So, when we make test requests from the front-end tool `graphiql`, it sends it to the `server`, and the `resolve()` functions go to `mongodb` and return the data to the `server`, which is then determining what data to send back to client via `graphql` query.

We'll replace `Graphiql` with `React` and `Apollo`.

`Apollo` is a graphql `client` we use to bind `graphql` to our application which is written in a JS framework (in our case, a library: React).

![alt text](../assets/react-app.png 'The React App with Apollo GraphQL Client')

## `create-react-app`

Let's start creating the `client` side front-end.

We'll use `create-react-app` template to create a boilerplate for us to start with.

- Go to `graphql-playlist` folder root.
- On the terminal, type `npx create-react-app client` and hit <kbd>Enter</kbd>.
- We give the name `client` to this react app because it will contain all of out front-end code.

### Running client-server

We need to host our server on port `4000` continuously and our front-end on port `3000` during development.

- Server: Go to `server/` and run `npm run dev`
- Client: Go to `client/` and run `npm start`

## Book List Component

Let's create a basic unordered-list component which will contain our list of books.

- Create a folder `components/` inside the `src/` folder.
- `touch BookList.js`

In this file, we'll create a `component` using a function : `functional components`.

```js
import React from 'react';

function BookList() {
  return (
    <div>
      <ul id="book-list">
        <li>Book Name</li>
      </ul>
    </div>
  );
}

export default BookList;
```

We need to import this in our `App.js` to use it as a component:

```js
import BookList from './components/BookList';

function App() {
  //code
  return (
    <div>
      <BookList />
    </div>
  );
}
```

## Apollo Client Developer

> NOTE: Apollo Client Developer Tools is not available on FireFox. Currently it has support only for Chrome. For more details, check [this issue](https://github.com/apollographql/apollo-client-devtools/issues/73).

Just as we use Axios to fetch data from an API, we use Apollo to fetch data from a GraphQL server. The [Apollo Client Devtools](https://github.com/apollographql/apollo-client-devtools/) is available [here for Chrome](https://chrome.google.com/webstore/detail/apollo-client-developer-t/jdkknkkbebbapilgoeccciglkfbmbnfm).

It does not matter what front-end tech we use.

So, this is like a middleware that connects the front-end with the GraphQL server.

## Apollo Client Setup

To get started with React and Apollo, [see this](https://www.apollographql.com/docs/react/get-started/).

Run the following command to install Apollo:

`npm install apollo-boost @apollo/react-hooks graphql`

- Import `ApolloClient` from `apollo-boost`:
- Create a new `client` to make define the endpoint where we a=make our graphql queries to.
- We need to wrap our app inside the `ApolloProvider`. The `@apollo/react-hooks` binds apollo to react. It helps react understand apollo and what it's doing.
- So whatever data we receive from the server, will be injected into the `ApolloProvider` and thus into our application.

```js
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
});

function App() {
  //code
  return (
    <ApolloProvider client={client}>
      {
        //App Components
      }
    </ApolloProvider>
  );
}
```

## Making Queries from React

To make queries from within a component, we use `gql` from `apollo-boost`.

### Construct the query

```js
import { gql } from 'apollo-boost';

// construct the query

const GET_BOOKS = gql`
  {
    books {
      name
      id
    }
  }
`;
```

Note how we place the GraphQL query within the template string just after `gql`.

### Bind the query to the component

We need the help of another package.

This is going to be used at the end where we export the component.

```js
import { useQuery } from '@apollo/react-hooks';

function BookList() {
  const data = useQuery(GET_BOOKS);
  console.log(data);
  // component code
}

export default BookList;
```

Note that `useQuery` is a function which takes in the query we need to bind to this component.

We'll also add `cors` as a dependency to allow cross-origin requests.

```js
const cors = require('cors');

const app = express();

app.use(cors());
```

If we refresh the front-end endpoint [localhost:3000](http://localhost:3000), we can see that our data, i.e the result from our query has been logged successfully.

![alt text](../assets/query-log.png 'Log query result')

## Rendering data in component

We'll use the latest [`useQuery`](https://www.apollographql.com/docs/react/data/queries/#executing-a-query) function to execute our `gql` query as seen in the previous section. Now to render dynamic data:

```js
function BookList() {
  const { loading, error, data } = useQuery(GEET_BOOKS);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  return (
    <div>
      <ul id="book-list">
        {data.books.map(book => {
          return <li key={book.id}>{book.name}</li>;
        })}
      </ul>
    </div>
  );
}
```

## Add book component using author

This is similar to the `BookList` component.

But before adding the `AddBook` component, we'll move all our queries in another folder and into a new file.

- Create `queries/` inside `src/`.
- Create `queries.js`

In `queries.js`:

```js
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
```

> NOTE: After doing so, please update the imports in `BookList.js`.

Now, for the `AddBook` component:

```js
import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_AUTHORS } from '../queries/queries';

function AddBook() {
  const { loading, error, data } = useQuery(GET_AUTHORS);
  if (loading) return <div>Loading Authors...</div>;
  if (error) return <div>Error!</div>;

  return (
    <div>
      <form id="add-book">
        <div className="field">
          <label htmlFor="bookName">Book Name:</label>
          <input name="bookName" type="text" />
        </div>
        <div className="field">
          <label htmlFor="genre">Genre:</label>
          <input name="genre" type="text" />
        </div>
        <div className="field">
          <label htmlFor="authorID">Author:</label>
          <select name="authorID">
            <option value="">--Select Author--</option>
          </select>
        </div>
        <button>+</button>
      </form>
    </div>
  );
}

export default AddBook;
```

After adding 2 components to our `<App />` component, this is what our app looks like:

![alt text](../assets/components.png 'App after 2 components')

## Updating component state

We'll use [React Hooks](https://reactjs.org/docs/hooks-intro.html) in functional components.

```js
import React, { useState } from 'react';

function AddBook() {
  //previous code

  //declare the state and setState() functions
  const [formData, setFormData] = useState({
    bookName: '',
    genre: '',
    authorID: '',
  });

  //event handler for form data
  const handleEvent = e => {
    e.persist();
    setFormData(formData => ({
      ...formData,
      [e.target.name]: e.target.value,
    }));
  };

  //on submit of form
  const submitForm = e => {
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
            {data.authors.map(author => (
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
```

> NOTE: We use `event.persist()` in updating our state since the `setState` function here returns a function, which will update the states in a synchronous way, but we are accessing the data from the eventListner on the elements of the form in an **asynchronous way**. To access these properties in an asynchronous way rather than in a synchronous way that `setState` does, we need to use `e.persist()` here. [reference](https://reactjs.org/docs/events.html)

Finally, we should be able to see the resultant object on our console:

```json
{ "bookName": "The Road to Levinshire", "genre": "Sci-Fi", "authorID": "5eba7f419d1ddb1356b79abe" }
```

## Queries with variables

Let's create a query to add the book using the form details from the previous section.

```js
const ADD_BOOK = gql`
  mutation($name: String!, $genre: String!, $authorID: ID!) {
    addBook(name: $name, genre: $genre, authorID: $authorID) {
      name
      id
    }
  }
`;
```

> NOTE: We do not use the initial `{}` braces in this query. For more details, [reference](https://github.com/apollographql/graphql-tag/issues/180#issuecomment-386540792).

Now, we need to add the book data to our database on form submit. Let's see how we do that:

```js
import { useQuery, useMutation } from '@apollo/react-hooks';
import { GET_AUTHORS, ADD_BOOK } from '../queries/queries';

function AddBook() {
  // previous code
  const [addBook] = useMutation(ADD_BOOK);
  // previous code
  const submitForm = e => {
    e.preventDefault();
    addBook({
      variables: {
        name: formData.name,
        genre: formData.genre,
        authorID: formData.authorID,
      },
    });
  };
}
```

And we're done! On clicking the `+` button or hitting <kbd>Enter</kbd> on the form,our data is added to the database.

We'll add a few things later to display the latest books on the frontend as well.

![alt text](../assets/form.png 'form data that is saved to the db')

If we refresh the frontend at [localhost:3000](http://localhost:3000), we can see that the data has been added to the books list.

![alt text](../assets/books-list.png 'Latest addition is seen in the books list')

## Refetching queries

We can also refetch queries to update the data in our components! So let's update the list of books when we submit the form with book data.

```js
import { GET_AUTHORS, ADD_BOOK, GET_BOOKS } from '../queries/queries';
// previous code
const submitForm = e => {
  e.preventDefault();
  addBook({
    variables: {
      name: formData.bookName,
      genre: formData.genre,
      authorID: formData.authorID,
    },
    refetchQueries: [{ query: GET_BOOKS }],
  });
};
```

We use the `refetchQuery` option to refetch the query `GET_BOOKS` when the form is submitted on click of the `+` button, because of which, the component rendering data from this query gets updated!

## Book details component

When we click on a book, we want to show all the details related to that book to the user. So, when we click on a book, we need to query that single book from the GraphQL server, and display the data of that book onto the `BookDetail` component.

First, we'll need to add the `onClick` event handler in `BookList` component. I have also refactored the code for a bit more clarity.

```js
import React, { useState } from 'react';
function BookList() {
  //previous code
  const [selected, setSelected] = useState('');

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
```

Next, let's create the `BookDetail` component.

```js
import React, { useState } from 'react';
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
```

And there we have it! All the functionalities are working just fine!

![alt text](../assets/book-deets.png 'Display book details on cliking a particular book')

## Styling the app

Add the appropriate styles to the component in `index.css`. YUS! We're officially done! We've come a long way, and this is how our app currently looks like:

![alt text](../assets/app.png 'Final App')
