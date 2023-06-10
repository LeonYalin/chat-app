import { startStandaloneServer } from '@apollo/server/standalone';
import { createApolloTestingServer } from './graphql/graphql.server.utils';


// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
async function startServer() {
  const { url } = await startStandaloneServer(createApolloTestingServer(), { listen: { port: 4000 } });
  console.log(`🚀 Server listening at: ${url}`);
}
startServer();
