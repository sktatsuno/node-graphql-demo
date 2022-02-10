const {
  buildSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
} = require('graphql');

const tests = [
  {
    //dummy data
    id: 1,
    message: 'hello world',
    text: 'just seeing if it works',
  },
  {
    id: 2,
    message: 'hello worlds',
    text: 'text2',
  },
];
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
      resolve() {
        return tests;
      },
    },
    getOneTest: {
      type: TestType,
      args: {
        id: { type: GraphQLInt },
      },
      resolve(parent, args) {
        console.log(args);
        return tests.find((el) => el.id === args.id);
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
      resolve(parent, args) {
        console.log(args);
        tests.push({
          id: args.id,
          message: args.message,
          text: args.text,
        });
        return tests[tests.length - 1];
      },
      // deleteTest:{
      //   type: GraphQLString
      // }
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});
