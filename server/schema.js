const {
  buildSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
} = require('graphql');
const { tests } = require('./dummyData');
const { client } = require('./caching');

function timeout(ms) {
  console.log('slowed down')
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const TestTypeSchema = {
  id: { type: GraphQLInt },
  message: { type: GraphQLString },
  text: { type: GraphQLString },
};

const TestType = new GraphQLObjectType({
  name: 'Test',
  fields: () => TestTypeSchema,
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    getAllTest: {
      type: new GraphQLList(TestType),
      //sets the query key on the cache with the query result and returns it
      resolve: async (parent, args, context) => {
        const { query } = context.body;
        const result = tests;
        await client.set(query, JSON.stringify(result));
        await timeout(1000); // artificial delay to simulate slow data getting
        return result;
      },
    },
    getOneTest: {
      type: TestType,
      args: {
        id: { type: GraphQLInt },
      },
      resolve: async (parent, args) => {
        //sets the query key on the cache with the query result and returns it
        console.log(args);
        const { query } = context.body;
        const result = tests.find((el) => el.id === args.id);
        await client.set(query, JSON.stringify(result));
        return result;
      },
    },
  },
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    createTest: {
      type: TestType,
      args: TestTypeSchema,
      resolve: (parent, args) => {
        console.log(args);
        tests.push({
          id: args.id,
          message: args.message,
          text: args.text,
        });
        return tests[tests.length - 1];
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});
