import { MetadataRoute } from 'next';
import { fetchAllProducts, getCollections } from '@/lib/shopify';

const BASE_URL = 'https://www.4leee.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/search`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/wishlist`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/cart`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ];

  // Fetch products and collections
  let productPages: MetadataRoute.Sitemap = [];
  let collectionPages: MetadataRoute.Sitemap = [];

  try {
    const { products } = await fetchAllProducts();
    productPages = products.slice(0, 500).filter((product) => product?.handle).map((product) => ({
      url: `${BASE_URL}/product/${product.handle}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error('[v0] Sitemap: Error fetching products:', error);
  }

  try {
    const collections = await getCollections();
    collectionPages = collections.filter((collection) => collection?.node?.handle).map((collection) => ({
      url: `${BASE_URL}/category/${collection.node.handle}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error('[v0] Sitemap: Error fetching collections:', error);
  }

  return [...staticPages, ...collectionPages, ...productPages];
}
