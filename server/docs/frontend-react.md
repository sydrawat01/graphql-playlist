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
