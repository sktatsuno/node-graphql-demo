const redis = require('redis');

const port = process.env.redisPort || 6379;

const client = redis.createClient({ port });

client
  .connect()
  .then(() => console.log(`Connected to Redis Client on Port ${port}...`))
  .catch((err) => console.log(`Error with Redis client Error: ${err}`));

const checkCache = async (req, res, next) => {
  const { query } = req.body;

  //see if the cache has the query as a key and respond with it if so
  //if it's a mutation, move on
  //if no key for the query, move on and set the key/value in cache in next MW
  try {
    if (query?.slice(0, 8) === 'mutation') {
      console.log('mutation');
      return next();
    }
    const value = await client.get(query);
    if (value === null) return next();
    else {
      console.log('Cached data returned');
      // console.log(value);
      const obj = JSON.parse(value);
      return res.status(200).json({ data: obj });
    }
  } catch (err) {
    console.log(err);
  }
};
module.exports = { checkCache, client };
