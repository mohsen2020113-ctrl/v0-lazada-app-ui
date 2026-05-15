import { Metadata } from 'next';
import { getCollectionProducts } from '@/lib/shopify';

type Props = {
  params: Promise<{ handle: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params;
  const baseUrl = 'https://www.4leee.com';
  const categoryUrl = `${baseUrl}/category/${handle}`;
  const collection = await getCollectionProducts(handle, 1);

  if (!collection) {
    return {
      title: 'Category Not Found | LEE',
      description: 'The requested category could not be found.',
      alternates: {
        canonical: categoryUrl,
      },
    };
  }

  const imageUrl = collection.image?.url || '';

  return {
    title: `${collection.title} | LEE`,
    description: collection.description?.slice(0, 160) || `Shop ${collection.title} products at LEE`,
    openGraph: {
      type: 'website',
      url: categoryUrl,
      title: `${collection.title} | LEE`,
      description: collection.description?.slice(0, 160) || `Shop ${collection.title} products at LEE`,
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630, alt: collection.title }] : [],
      siteName: 'LEE',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${collection.title} | LEE`,
      description: collection.description?.slice(0, 160) || `Shop ${collection.title} products at LEE`,
      images: imageUrl ? [imageUrl] : [],
    },
    alternates: {
      canonical: categoryUrl,
    },
  };
}

export default function CategoryLayout({ children }: Props) {
  return <>{children}</>;
}

