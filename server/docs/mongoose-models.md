# Mongoose Models

## Create `author` and `book` models

Now that we have connected our db with mongoDB, we'll go ahead and create the data `models` for `author` and `book` in `models/` directory.

[author.js]

```js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const authorSchema = new Schema({
  name: String,
  age: Number,
});

module.exports = mongoose.model('Author', authorSchema);
```

[book.js]

```js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const bookSchema = new Schema({
  name: String,
  genre: String,
  authorID: String,
});

module.exports = mongoose.model('Book', bookSchema);
```

## Mutations

Mutation here means adding, deleting, updating, reading data from the db. It encompasses the basic CRUD methods.
CRUD stands for **C**reate, **R**ead, **U**pdate and **D**elete.

We'll create a `Mutation GraphQLObject` with fields as below:

```js
const Author = require('../models/author');

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addAuthor: {
      type: AuthorType,
      args: {
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
      },
      resolve(parent, args) {
        let author = new Author({
          name: args.name,
          age: args.age,
        });
        author.save();
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
```

Let's start up our app and check the mutation!

Run the command : `npm run dev`

Check the graphiql tool here : [localhost:4000/graphql](localhost:4000/graphql).

In the query section, provide the query:

```graphql
mutation {
  addAuthor(name: "Siddharth", age: 25) {
    name
    age
  }
}
```

![alt text](../assets/mutation-1.png "Adding an author and retriving it's name and age: problem")

On [mongodb cloud](https://cloud.mongodb.com), when we click collections in our cluster, we can see `authors` collection is created successfully.

![alt text](../assets/cluster-collection.png "Cluster contains authors collection)

So why aren't we receiving that same data in our `Graphiql` tool?

This is because we did not return the object after it was stored in the collection. When we call the `save()` function, mongo will return an object, and we can return this object.

So all we need to add in our `Mutation` object is:

```js
return author.save();
```

So now when we run our server and request the query from graphql, we get the desired result:

```json
{
  "data": {
    "addAuthor": {
      "name": "Siddharth",
      "age": 25
    }
  }
}
```

![alt text](../assets/mutation-res.png 'query returning the object properly')

I've added 3 different authors on my db:

![alt text](../assets/authors-clouddb.png 'authors collection with records')

Let's do the same for books:

```js
const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    // addAuthor

    addBook: {
      type: BookType,
      args: {
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        authorID: { type: GraphQLID },
      },
      resolve(parent, args) {
        let book = new Book({
          name: args.name,
          genre: args.genre,
          authorID: args.authorID,
        });
        return book.save();
      },
    },
  },
});
```

On the Graphiql tool, run the following query:

```graphql
mutation {
  addBook(name: "The Long Earth", genre: "Sci-Fi", authorID: "5eba7f6e9d1ddb1356b79ac0") {
    name
    genre
  }
}
```

This will result:

```json
{
  "data": {
    "addBook": {
      "name": "The Long Earth",
      "genre": "Sci-Fi"
    }
  }
}
```

To check if the mutation to add books has been done to the `books` collection, we can check it on the [mongo cloud](https://cloud.mongodb.com).

![alt text](../assets/books-collection.png 'books collection updated with nutation')
