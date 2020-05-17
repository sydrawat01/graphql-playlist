const express = require('express');
const mongoose = require('mongoose');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const cors = require('cors');

// allow cross-origin requests
const app = express();
app.use(cors());

const URI =
  'mongodb+srv://sydrawat:DroseDreturn@cluster0-pyagm.mongodb.net/test?retryWrites=true&w=majority';

mongoose
  .connect(URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
  .then(() => {
    console.log('connected to mongoDB Atlas!');
  })
  .catch(err => {
    console.log('error:', err.message);
  });

//bind express with graphql
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  }),
);

app.listen(4000, () => {
  console.log('listening on http://localhost:4000/graphql');
});
