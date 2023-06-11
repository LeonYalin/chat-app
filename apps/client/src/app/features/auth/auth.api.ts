import { gql } from '@apollo/client';
import gqlClient from '@client/utils/graphql.client.utils';
import { DeleteUserMutationStr, SignUpMutationStr } from '@shared/graphql/mutations';
import { SignInQueryStr } from '@shared/graphql/queries';
import { User } from '@shared/models/user.model';

export function signUpApi({ name, email, password }: { name: string; email: string; password: string }) {
  return gqlClient().mutate<{ signUp: User }>({
    mutation: gql`
      ${SignUpMutationStr}
    `,
    variables: { name, email, password },
  });
}

export function signInApi({ email, password }: { email: string; password: string }) {
  return gqlClient().query<{ signIn: User }>({
    query: gql`
      ${SignInQueryStr}
    `,
    variables: { email, password },
  });
}

export function deleteUserApi({ userEmail }: { userEmail: string }) {
  return gqlClient().mutate<{ deleteUser: string }>({
    mutation: gql`
      ${DeleteUserMutationStr}
    `,
    variables: { userEmail },
  });
}
