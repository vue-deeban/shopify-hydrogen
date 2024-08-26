import {defineLocations} from 'sanity/presentation';

export const locations = {
  product: defineLocations({
    select: {
      title: 'store.title',
      slug: 'store.slug.current',
    },
    resolve: (doc) => ({
      locations: [
        {
          title: doc?.title || 'Untitled',
          href: `/products/${doc?.slug}`,
        },
        {title: 'Products', href: `/products`},
      ],
    }),
  }),
};
