//require in modules
//build graphQL schema
//set up express server to listen for graphQL
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const schema = require('./schema');
const { checkCache, client } = require('./caching');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  return res.redirect('/graphql');
});

app.use(
  '/graphql',
  //cache middleware here to check
  checkCache,
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

//deletes redis cache
app.get('/delete', async (req, res) => {
  await client.flushAll();
  return res.status(200).send('<div><h1>Deleted Redis Cache</h1></div>');
});

app.listen(PORT, () => console.log(`Listening on Port ${PORT}`));
