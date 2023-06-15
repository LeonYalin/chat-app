import { ApolloServer, GraphQLResponse } from '@apollo/server';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { ApolloServerErrorCode } from '@apollo/server/errors';
import { resolvers } from './resolvers';
import { typeDefs } from './typedefs';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { makeExecutableSchema } from '@graphql-tools/schema';

export function throwGqlError(text = 'Invalid argument value', code = ApolloServerErrorCode.BAD_USER_INPUT) {
  throw new GraphQLError(text, { extensions: { code } });
}

export function throwGqlDefaultError(text = 'Something happened on request handling') {
  throw new GraphQLError(text, {
    extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
  });
}

// Create schema, which will be used separately by ApolloServer and
// the WebSocket server.
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Create an Express app and HTTP server; we will attach the WebSocket
// server and the ApolloServer to this HTTP server.
const app = express();
const httpServer = createServer(app);

export function getHttpServers() {
  return { app, httpServer };
}

// Set up WebSocket server.
const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});
const serverCleanup = useServer({ schema }, wsServer);

export function createApolloTestingServer() {
  return new ApolloServer({
    // typeDefs: gql`
    //   ${typeDefs}
    // `,
    // resolvers,
    schema,
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),

      // Proper shutdown for the WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });
}

export function getResponseData<T>(response: GraphQLResponse) {
  const result = (response.body as any).singleResult;
  const data = result.data as T;
  const errors = result.errors as GraphQLError[];
  return { data, errors };
}
