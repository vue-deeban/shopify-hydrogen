/* eslint-disable prettier/prettier */
import {createHydrogenContext, createWithCache} from '@shopify/hydrogen';
import {AppSession} from '~/lib/session';
import {CART_QUERY_FRAGMENT} from '~/lib/fragments';
import {createSanityLoader} from 'hydrogen-sanity';

/**
 * The context implementation is separate from server.ts
 * so that type can be extracted for AppLoadContext
 * */
export async function createAppLoadContext(
  request: Request,
  env: Env,
  executionContext: ExecutionContext,
) {
  /**
   * Open a cache instance in the worker and a custom session instance.
   */
  if (!env?.SESSION_SECRET) {
    throw new Error('SESSION_SECRET environment variable is not set');
  }

  const waitUntil = executionContext.waitUntil.bind(executionContext);
  const [cache, session] = await Promise.all([
    caches.open('hydrogen'),
    AppSession.init(request, [env.SESSION_SECRET]),
  ]);

  const withCache = createWithCache({
    cache,
    waitUntil,
    request,
  });

  const sanity = createSanityLoader({
    // Required:
    withCache,

    // Required:
    // Pass configuration options for Sanity client or an instantialized client
    client: {
      projectId: env.SANITY_PROJECT_ID,
      dataset: env.SANITY_DATASET,
      apiVersion: env.SANITY_API_VERSION || '2023-06-27',
      useCdn: process.env.NODE_ENV === 'production',
    },
    preview: env.SANITY_API_TOKEN
      ? {
          // ...and the condition for when to enable it
          enabled: true,
          token: env.SANITY_API_TOKEN,
          studioUrl: 'http://localhost:3333',
        }
      : undefined,
  });

  const hydrogenContext = createHydrogenContext({
    env,
    request,
    cache,
    waitUntil,
    session,
    i18n: {language: 'EN', country: 'US'},
    cart: {
      queryFragment: CART_QUERY_FRAGMENT,
    },
  });

  return {
    ...hydrogenContext,
    sanity,
    // declare additional Remix loader context
  };
}
