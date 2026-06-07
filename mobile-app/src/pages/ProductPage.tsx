import { useState, useEffect } from 'react';
import { ChevronLeft, Heart, Share2, ShoppingCart, Star, Plus, Minus, Check } from 'lucide-react';
import { getProductByHandle, formatMoney, getDiscountPercent, type ShopifyProduct, type ShopifyVariant } from '../lib/shopify';
import { useCart } from '../context/CartContext';
import type { PageId, NavigationParams } from '../App';

interface Props { navigate: (page: PageId, params?: NavigationParams) => void; params: NavigationParams; }

export default function ProductPage({ navigate, params }: Props) {
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<ShopifyVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [wishListed, setWishListed] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addItem, loading: cartLoading } = useCart();
  const handle = params.productHandle as string;

  useEffect(() => {
    if (!handle) { navigate('home'); return; }
    getProductByHandle(handle).aeen(p => {
      setProduct(p);
      if (p?.variants.edges.length) setSelectedVariant(p.variants.edges[0].node);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [handle]);

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    await addItem(selectedVariant.id, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (loading) return (
    <div className="min-h-screen bg-white">
      <div className="aspect-square skeleton" />
      <div className="p-4 space-y-3"><div className="h-5 skeleton rounded w-3/4" /><div className="h-6 skeleton rounded w-1/3" /><div className="h-20 skeleton rounded" /></div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <p className="text-gray-500">Product not found</p>
      <button onClick={() => navigate('fashion')} className="mt-4 btn-primary">Browse Products</button>
    </div>
  );

  const discount = getDiscountPercent(product);
  const images = product.images.edges.map(e => e.node);
  const variantOptions = product.variants.edges.map(e => e.node);

  return (
    <div className="bg-white min-h-screen">
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 pt-12 pb-3">
        <button onClick={() => navigate('fashion')} className="w-9 h-9 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-sm"><ChevronLeft size={20} /></button>
        <div className="flex gap-2">
          <button onClick={() => setWishListed(w => !w)} className={`w-9 h-9 rounded-full flex items-center justify-center shadow-sm backdrop-blur ${wishListed ? 'bg-red-500' : 'bg-white/80'}`}>
            <Heart size={18} fill={wishListed ? 'white' : 'none'} color={wishListed ? 'white' : 'currentColor'} />
          </button>
          <button className="w-9 h-9 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-sm"><Share2 size={18} /></button>
        </div>
      </div>

      <div className="aspect-square bg-gray-100 relative overflow-hidden">
        {images.length > 0 ? (<img src={images[activeImageIndex]?.url} alt={product.title} className="w-full h-full object-cover" />) : (<div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>)}
        {discount && <span className="absolute bottom-4 left-4 discount-badge text-sm px-2 py-1">-{discount}%</span>}
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 px-4 py-2 overflow-x-auto">
          {images.map((img, i) => (
            <button key={i} onClick={() => setActiveImageIndex(i)} className={`flex-none w-14 h-14 rounded-lg overflow-hidden border-2 ${i === activeImageIndex ? 'border-orange-500' : 'border-gray-200'}`}>
              <img src={img.url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="px-4 py-4">
        <p className="text-xs text-gray-400 mb-1">{product.vendor}</p>
        <h1 className="text-xl font-bold text-gray-900 mb-2">{product.title}</h1>
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl font-bold text-orange-500">{formatMoney(selectedVariant?.price.amount ?? product.priceRange.minVariantPrice.amount, selectedVariant?.price.currencyCode ?? 'USD')}</span>
          {selectedVariant?.compareAtPrice && (<span className="compare-price">{formatMoney(selectedVariant.compareAtPrice.amount, selectedVariant.compareAtPrice.currencyCode)}</span>)}
          <div className="flex items-center gap-1 ml-auto"><Star size={14} fill="orange" color="orange" /><span className="text-sm font-medium">4.8</span><span className="text-xs text-gray-400">(128)</span></div>
        </div>

        {variantOptions.length > 1 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Options</p>
            <div className="flex flex-wrap gap-2">
              {variantOptions.map(v => (
                <button key={v.id} onClick={() => setSelectedVariant(v)} disabled={!v.availableForSale}
                  className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${selectedVariant?.id === v.id ? 'border-orange-500 bg-orange-50 text-orange-600' : v.availableForSale ? 'border-gray-200 text-gray-700' : 'border-gray-100 text-gray-300 line-through'}`}>
                  {v.title}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 mb-4">
          <p className="text-sm font-medium text-gray-700">Quantity</p>
          <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-2 text-gray-600 active:bg-gray-100"><Minus size={16} /></button>
            <span className="w-10 text-center text-sm font-medium">{quantity}</span>
            <button onClick={() => setQuantity(q => q + 1)} className="px-3 py-2 text-gray-600 active:bg-gray-100"><Plus size={16} /></button>
          </div>
        </div>

        {product.description && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Description</p>
            <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 px-4 py-4">
        <button onClick={handleAddToCart} disabled={!product.availableForSale || cartLoading || !selectedVariant}
          className={`w-full py-3.5 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all ${addedToCart ? 'bg-green-500 text-white' : 'bg-orange-500 text-white active:bg-orange-600'} disabled:opacity-50`}>
          {addedToCart ? (<><Check size={20} /> Added to Cart!</>) : (<><ShoppingCart size={20} /> {product.availableForSale ? 'Add to Cart' : 'Sold Out'}</>)}
        </button>
      </div>
      <div className="h-20" />
    </div>
  );
}
