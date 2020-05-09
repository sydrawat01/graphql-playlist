const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema')
const app = express();

app.use('/graphql', graphqlHTTP({
  // schema:schema, using ES6, only schema is enough
  schema
}));

app.listen(4000, () => {
  console.log('listening on localhost:4000');
});
