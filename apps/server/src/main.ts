import { startStandaloneServer } from '@apollo/server/standalone';
import { createApolloTestingServer, getHttpServers } from './graphql/graphql.server.utils';
import bodyParser from 'body-parser';
import cors from 'cors';
import { expressMiddleware } from '@apollo/server/express4';

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
async function startServer() {
  const server = createApolloTestingServer();
  await server.start();
  const PORT = 4000;

  // Now that our HTTP server is fully set up, actually listen.
  const { httpServer, app } = getHttpServers();
  app.use('/graphql', cors<cors.CorsRequest>(), bodyParser.json(), expressMiddleware(server));
  httpServer.listen(PORT, () => {
    console.log(`🚀 Query endpoint ready at http://localhost:${PORT}/graphql`);
    console.log(`🚀 Subscription endpoint ready at ws://localhost:${PORT}/graphql`);
  });
  // const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });
  // console.log(`🚀 Server listening at: ${url}`);
}
startServer();
