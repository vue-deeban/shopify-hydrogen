import {
  json,
  type LoaderFunctionArgs,
  type ActionFunctionArgs,
} from '@shopify/remix-oxygen';
import {useLoaderData, type MetaFunction} from '@remix-run/react';
import {getPaginationVariables, Analytics} from '@shopify/hydrogen';
import {SearchForm} from '~/components/SearchForm';
import {SearchResults} from '~/components/SearchResults';
import {
  type RegularSearchReturn,
  type PredictiveSearchReturn,
  getEmptyPredictiveSearchResult,
} from '~/lib/search';

import {PortableText} from '@portabletext/react';
import type {SanityDocument} from '@sanity/client';
import {groq} from 'hydrogen-sanity/groq';

export const meta: MetaFunction = () => {
  return [{title: `Hydrogen | Support`}];
};

export async function loader({request, context}: LoaderFunctionArgs) {
  const query = groq`*[_type == "page"]{
        body
    }`;
  const initial = await context.sanity.loadQuery<SanityDocument>(query, {});
  console.log(initial);
  return json({initial});
}

export default function SupportPage() {
  const {initial} = useLoaderData<typeof loader>();
  console.log(initial);

  return (
    <div className="search">
      <h1>Support</h1>
      <PortableText value={initial.data[0].body} />
    </div>
  );
}
