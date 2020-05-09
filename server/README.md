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

#### Query: Book

> NOTE: Always use double quotes, single-qoutes do not work in graphiql

```graphql
{
  book(id: "420") {
    name
    genre
    id
  }
}
```

#### Result: Book

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

Notice, if we don't want all the properties of `book`, we can remove it, and GraphQL will take care of the result likewise.
So, if we remove the `genre` from the query, the result will not show the `genre` field.

## GraphQL ID type

In our present schema, we are using a string to represent the book `id`. However, if in our query, we pass a number in the book id as such (without the double quotes):

```graphql
{
  book(id: 420) {
    name
    genre
    id
  }
}
```

We would get an error in the result panel.
To avoid this, we'll use a type called `GraphQLID`.

We can assign this using the destructuring done before:

```js
const { GraphQLObjectType, GraphQLString, GraphQLSchema, GraphQLID } = graphql;
```

At all places where ever we've defined `id:{type:GraphQLString}`, replace it with `GraphQLID`.

And Voilà! We're done.

Now if we run the same query as above (without the double quotes in `id`), we'll get a proper response back.

Even if we do provide double-quotes to the `id`, we still get back a proper result.

So it works with/without string.

> NOTE: This is only for graphql's reference.

One major question now is, in our dummy data array of `books`, we had `id` as a string:

```js
var books = [{ name: 'books of the wild', genre: 'fiction', id: '123' }];
```

So how are we going to find a book that intially had an `id` which was `string`, and now is `GraphQLID`?

Well, simple answer: Javascript does not have a type of `ID`, and the `id` will always be a `string`. Only for GraphQL's reference, we change the type of `id` to GraphQLID.

Proof? Do the following in the `resolve()` function of the root query:

```js
console.log(typeof args.id);
```

Check the terminal for the result! It will be a `string`!

## Adding the `Author` type

Another entry point to the db query would be via the `Author` data.

So, we'll have to create another type called `AuthorType`:

```js
const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
  }),
});
```

Notice we use `GraphQLInt` for the `age` of the author, so remember to declare that as well:

```js
const { ___, ___, GraphQLInt } = graphql;
```

Now to add the query entry point to the root query:

```js
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: {
      //previous book root query
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return _.find(authors, { id: args.id });
      },
    },
  },
});
```

![alt text](assets/author.png 'Author root query added')

Now, we can see the `RootQueryType` has two objects that we can use to query the db. If we click on `Author`, we can see it's properties : `name`, `age` and `id`. We need to provide the `author` `(id: ID)` to query the db using this entry point like so:

#### Query: Author

```graphql
{
  author(id: 3) {
    name
    age
    id
  }
}
```

#### Result: Author

We get the following result:

```json
{
  "data": {
    "author": {
      "name": "Terry Pratchett"
    }
  }
}
```

## Type Relations

Every book has an author, and every author has a collection of books. So, we need to translate this idea into our graphql schema.

When a user queries a book from the front-end and wants to know the author of the book, we can send that data as well.

Right now, graphql does not know which books belong to which author.

We'll add `authorID` to the `books` array to correspond to whichever ID of that paricular book. So when we query the `book`, we'll get back the `authorID`, which can then be used to get the `name` of the author.

Suppose we have the following query where we want to get a `book` with `id:2` and also the `name` of the `author`:

```graphql
{
  book(id: 2) {
    name
    genre
    authorID {
      name
    }
  }
}
```

Notice how we have a query(author query) nested inside another query(book query).

This is where the `parent` parameter of the `resolve()` function comes into play.

When we have nested data, we aleady have the `parent` data of the `book` with `id:2`. So now from the `parent` object, we need to use the `authorID` to get that particular author `name`.

So, in our `schema.js` file:

```js
var books = [
  { name: 'books of the wild', genre: 'fiction', id: '123', authorID: '1' },
  { name: 'books of the city', genre: 'fact', id: '420', authorID: '2' },
  { name: 'books of the galaxy', genre: 'sci-fi', id: '69', authorID: '3' },
];

//added authorID field in BookType
const BookType = new GraphQLObjectType({
  name: 'Book',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    genre: { type: GraphQLString },
    authorID: {
      type: AuthorType,
      resolve(parent, args) {
        console.log(parent);
        return _.find(authors, { id: parent.authorID });
      },
    },
  }),
});
```

The `console.log(parent)` will result:

```json
{ "name": "books of the city", "genre": "fact", "id": "420", "authorID": "2" }
```

Now when we run the query to fetch a book with the (nested) author name, we see the result:

```json
{
  "data": {
    "book": {
      "genre": "fact",
      "name": "books of the city",
      "authorID": {
        "name": "Brandon Sanderson"
      }
    }
  }
}
```

![alt text](assets/type-relation.png 'Type Relations')

## GraphQL Lists

What if we want to query all the books written by an author? A query something like this:

```graphql
author(id: 3) {
  name,
  age,
  books {
    name,
    genre
  }
}
```

In the above nested query, the `books` query will have a `LIST` of books, and not one `BookType`.
For this, we need to grab another type from `graphql` called `GraphQLList`.

```js
const { ___, ___, GraphQLList } = graphql;
```

The `GraphQLList()` will have objects of type `BookType` in the list. So:

```js
books: {
  type: GraphQLList(BookType);
}
```

Now in the `AuthorType` object, we need to define a `books` query where we `filter` out the books written by that particular author.

```js
const AuthorType = new GraphQLObjectType({
  name: 'Author',
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    age: { type: GraphQLInt },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        // console.log(parent);
        return _.filter(books, { authorID: parent.id });
      },
    },
  }),
});
```

Added a few more books to the `books` array:

```js
var books = [
  { name: 'books of the wild', genre: 'Fantasy', id: '123', authorID: '1' },
  { name: 'books of the city', genre: 'Fact', id: '420', authorID: '2' },
  { name: 'books of the galaxy', genre: 'Sci-Fi', id: '69', authorID: '2' },
  { name: 'piano for beginners', genre: 'Self-Development', id: '9', authorID: '3' },
  { name: 'javascript for dummies', geenre: 'Technology', id: '32', authorID: '3' },
];
```

Running the query, we get the results:

![alt text](assets/graphqllist.png 'GraphQL Lists')

Why are the `fields:()=>{}` in the object types `BookType` and `AuthorType` a function? Let's see why:

The code defined for `BookType` and `AuthorType` is compiled from top to bottom. So if we remove the `fields:()=>{}` function:

```js
const BookType = new ___({
  ___,
  fields: {
    //here we usetype: AuthorType
  },
});

const AuthorType = new ___({
  ___,
  fields: {
    //here we use type: BookType
  },
});
```

In the above code skeleton, we can see `AuthorType` will function correctly without the `fields:()=>{}` function, since `BookType` is already defined above. But the problem arises when we're accessing `AuthorType` in `BookType` before `AuthorType` is even defined.

If you're wondering what if we interchange their places, well , it's gong to change the error from pointing it from `AuthorType` to `BookType`.
What essentially is hapenning is that the `fields:{}` is being executed as soon as it gets compiled from top to bottom. Hence these errors are thrown. To avoid running the `fields{}` at the time of compilation, we use `fields:()=>{}` function so that it can be run at a later time, and not at compile time.

This is why we wrap these fields inside a function.

## More on RootQuery

Now, after this initial setup, we can define our root queries on _all books_ and _all authors_ as well. This is pretty straight forward now, and GraphQL does all the heavy lifting for us from now.

Have a look here:

```js
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return _.find(books, { id: args.id });
      },
    },
    author: {
      type: AuthorType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return_.find(authors, { id: args.id });
      },
    },
    books: {
      type: new GraphQLList(BookType),
      resolve(parent, args) {
        return books;
      },
    },
    authors: {
      type: new GraphQLList(AuthorType),
      resolve(parent, args) {
        return authors;
      },
    },
  },
});
```

After adding the `authors` and `books` fields in our root query, we can query all the books and all the authors now.

#### Querying all the books nested with author details for each book

##### QUERY

```graphql
{
  books {
    name
    id
    genre
    authorID {
      name
      age
    }
  }
}
```

![alt text](assets/books.png 'books query with nested author details')

###### RESULT

```json
{
  "data": {
    "books": [
      {
        "name": "books of the wild",
        "id": "123",
        "genre": "Fantasy",
        "authorID": {
          "name": "Patrick Rothfuss",
          "age": 44
        }
      },
      {
        "name": "books of the city",
        "id": "420",
        "genre": "Fact",
        "authorID": {
          "name": "Brandon Sanderson",
          "age": 42
        }
      },
      {
        "name": "books of the galaxy",
        "id": "69",
        "genre": "Sci-Fi",
        "authorID": {
          "name": "Brandon Sanderson",
          "age": 42
        }
      },
      {
        "name": "piano for beginners",
        "id": "9",
        "genre": "Self-Development",
        "authorID": {
          "name": "Terry Pratchett",
          "age": 66
        }
      },
      {
        "name": "javascript for dummies",
        "id": "32",
        "genre": null,
        "authorID": {
          "name": "Terry Pratchett",
          "age": 66
        }
      }
    ]
  }
}
```

#### Querying all the authors nested with book details for each author

We can also query for all the authors and all the books written by them in a nested fashion.

##### QUERY

```graphql
{
  authors {
    name
    age
    books {
      name
      id
    }
  }
}
```

![alt text](assets/authors.png 'authors query with nested books details')

##### RESULT

```json
{
  "data": {
    "authors": [
      {
        "name": "Patrick Rothfuss",
        "age": 44,
        "books": [
          {
            "name": "books of the wild",
            "id": "123"
          }
        ]
      },
      {
        "name": "Brandon Sanderson",
        "age": 42,
        "books": [
          {
            "name": "books of the city",
            "id": "420"
          },
          {
            "name": "books of the galaxy",
            "id": "69"
          }
        ]
      },
      {
        "name": "Terry Pratchett",
        "age": 66,
        "books": [
          {
            "name": "piano for beginners",
            "id": "9"
          },
          {
            "name": "javascript for dummies",
            "id": "32"
          }
        ]
      }
    ]
  }
}
```
