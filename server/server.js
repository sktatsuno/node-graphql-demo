//require in modules
//build graphQL schema
//set up express server to listen for graphQL
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const schema = require('./schema');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.listen(PORT, () => console.log(`Listening on Port ${PORT}`));
