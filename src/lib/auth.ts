import { AuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { env } from './env';

export const authOptions: AuthOptions = {
  providers: [
    Credentials({
      name: 'password',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // TODO: better auth
        if (
          credentials &&
          credentials.username === env.DASHBOARD_USER &&
          credentials.password === env.DASHBOARD_PASS
        ) {
          return {
            id: env.DASHBOARD_USER,
            name: env.DASHBOARD_USER,
          };
        } else {
          return null;
        }
      },
    }),
  ],
};
