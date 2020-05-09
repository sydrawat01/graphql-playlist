# GraphQL server with ExpressJS

We will host our GraphQL server with express.

First, we'll create a folder called `server`, which will container the express and graphql schema code, along with other things.

## Express app setup

Install `express` as a dependency:

`npm i -S express`

In the `app.js` file:

```js
const express = require('express');
const app = express();

app.listen(4000, () => {
  console.log('app listening on localhost:4000');
});
```

## GraphQL setup

Install `graphql` and `express-grapql` dependencies:

`npm i -S graphql express-graphql`

In the `app.js` file:

Bind express with graphql.

```js
const graphqlHTTP = require('express-graphql');

app.use('/graphql', graphqlHTTP({}));
```

In the `graphqlHTTP` function, we're passing an empty object for now. Later, we will send the graphql schema into this object.

## GraphQL schema

The graph which defines how the data is to be strucutred is written in the schema.

For this, we'll make another folder called `schema/`, in which we'll add a `schema.js` file:

```js
const graphql = require('graphql);

const {GraphQLObjectType, GraphQLString, GraphQLSchema} = graphql;

// schema object
const BookType = new GraphqLObjectType({
    name: 'book',
    fields: ()=>({
        id:{type: GraphQLString},
        name: {type: GraphQLString},
        genre: {type: GraphQLString}
    })
});
```

## Root Query

The root query is the one via which the API will get the entry point to fetch the data from the db with graphql as the middleware.

So, in the `schema.js` file, add the following root query:

```js
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: {
      type: BookType,//book obj defined previously
      args: {id: {type: GraphQLString}}
      resolve(parent, args){
          //code to get data from db/source
          //this is the place where we query the db
      }
    },
  },
});
```

## `resolve()` to test a query

We'll create a dummy database of 3 books in the `schema.js` file:

```js
var books = [
  { name: 'books of the wild', genre: 'fiction', id: '123' },
  { name: 'books of the city', genre: 'fact', id: '420' },
  { name: 'books of the galaxy', genre: 'sci-fi', id: '69' },
];
```

Now, to find a book with a particular `id`, we'll have to query this schema. So the in the resolve function, we'll do the following:

> Note: We'll use `lodash` to find the book with a particular `id` from the `books` array.

Before we jump in, we need to install `lodash` as a dependency.

`npm i -S lodash`

```js
const _ = require('lodash');

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: {
      type: BookType, //book obj defined previously
      args: { id: { type: GraphQLString } },
      resolve(parent, args) {
        return _.find(books, { id: args.id });
      },
    },
  },
});
```

## Testing the query with `GraphiQL`

We'll use the `graphiql` tool which is built-in with graphql to view our schema and create a query to see the results:

First, we'll need to export our schema. We'll do that in `schema.js`:

```js
module.exports = new GraphQLSchema({
  query: RootQuery,
});
```

Next, we need to get this schema in out express server app. We'll do this in the `app.js` file:

```js
const schema = require('./schema/schema');

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  }),
);
```

AND we're ready yo test out our first query!

Start the server from the `server/` using:

`npm run dev`

This will start our server at `localhost:4000`.

You can see the `graphiql` tool by visiting [localhost:4000/graphql](localhost:4000/graphql)

We can run the following query on the left-most panel of the window to get the query results.

### Query

```json
{
  book(id:"420"){
    name,
    genre,
    id
  }
}
```

### Result

```json
{
  "data": {
    "book": {
      "name": "books of the city",
      "genre": "fact",
      "id": "420"
    }
  }
}
```

![alt text](assets/graphiql.png 'graphiql tool')

The `Docs` field on the right-most panel displays the structure of the `RootQueryType`, which can be browsed by clicking on the property.
