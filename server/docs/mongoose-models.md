# Mongoose Models

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
  title: String,
  genre: String,
  authorID: String,
});

module.exports = mongoose.model('Book', bookSchema);
```
