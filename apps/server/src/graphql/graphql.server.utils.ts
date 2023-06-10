import { ApolloServer, GraphQLResponse } from '@apollo/server';
import { GraphQLError } from 'graphql';
import gql from 'graphql-tag';
import { ApolloServerErrorCode } from '@apollo/server/errors';
import { resolvers } from './resolvers';
import { typeDefs } from './typedefs';

export function throwGqlError(text = 'Invalid argument value', code = ApolloServerErrorCode.BAD_USER_INPUT) {
  throw new GraphQLError(text, { extensions: { code } });
}

export function throwGqlDefaultError(text = 'Something happened on request handling') {
  throw new GraphQLError(text, {
    extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
  });
}

export function createApolloTestingServer() {
  return new ApolloServer({
    typeDefs: gql`
      ${typeDefs}
    `,
    resolvers,
  });
}

export function getResponseData<T>(response: GraphQLResponse) {
  const result = (response.body as any).singleResult;
  const data = result.data as T;
  const errors = result.errors as GraphQLError[];
  return { data, errors };
}
