// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://2f46b4911955ec1421fd32f516d83b28@o578586.ingest.us.sentry.io/4509227787157504',

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
});
