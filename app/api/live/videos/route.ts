import { NextResponse } from 'next/server';

interface LiveVideo {
  id: string;
  title: string;
  vendor: string;
  thumbnail: string;
  views: number;
  likes: number;
  products: number;
  duration: string;
}

const mockVideos: LiveVideo[] = [
  {
    id: 'vid_001',
    title: 'Summer Fashion Haul & Styling Tips',
    vendor: 'Fashion Forward',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=500&fit=crop',
    views: 12500,
    likes: 3200,
    products: 8,
    duration: '24:35',
  },
  {
    id: 'vid_002',
    title: 'Best Gadgets Under AED 200 Review',
    vendor: 'Tech Hub',
    thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
    views: 8900,
    likes: 2100,
    products: 6,
    duration: '18:12',
  },
  {
    id: 'vid_003',
    title: 'Home Decor Transformation Series',
    vendor: 'Home & Living',
    thumbnail: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=500&fit=crop',
    views: 15300,
    likes: 4500,
    products: 12,
    duration: '31:45',
  },
  {
    id: 'vid_004',
    title: 'Makeup Tutorial for Beginners',
    vendor: 'Beauty Essentials',
    thumbnail: 'https://images.unsplash.com/photo-1596462502278-af3c6106e68a?w=500&h=500&fit=crop',
    views: 22100,
    likes: 6800,
    products: 10,
    duration: '22:18',
  },
  {
    id: 'vid_005',
    title: 'Kitchen Gadgets That Changed My Life',
    vendor: 'Living Essentials',
    thumbnail: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df?w=500&h=500&fit=crop',
    views: 9700,
    likes: 2900,
    products: 7,
    duration: '19:42',
  },
];

export async function GET() {
  try {
    return NextResponse.json(mockVideos);
  } catch (error) {
    console.error('[v0] Error fetching videos:', error);
    return NextResponse.json([], { status: 500 });
  }
}
