const { ApolloServer } = require('apollo-server');

// import graphql tools for schema
import { importSchema } from 'graphql-import'
import { makeExecutableSchema } from 'graphql-tools';

// import schema
const typeDefs = importSchema('./src/schema.graphql');

import db from './db';
import Query from './resolvers/Query';
import Mutation from './resolvers/Mutation';
import User from './resolvers/User';
import Post from './resolvers/Post';
import Comment from './resolvers/Comment';

//resolvers
const resolvers = {
    Query,
    Mutation,
    User,
    Post,
    Comment
};

// sync schema and resolvers to be executable using graphql tools
const schemaWithResolvers = makeExecutableSchema({ typeDefs, resolvers })

// apollo server with schema and resolvers
const server = new ApolloServer({
  schema: schemaWithResolvers,
  context: {
    db: db
  }
});

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });