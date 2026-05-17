import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Bell, ShoppingCart, Heart, ChevronLeft, ChevronRight, Zap, Star, Camera, Mic } from 'lucide-react';
import { getProducts, ShopifyProduct, getProductImageUrl, getProductPrice, getCompareAtPrice, getDiscountPercent } from '../lib/shopify';
import { PageId, NavigationParams } from '../App';

const BANNERS = [
  { id:1, tag:'SALE', tagColor:'#f97316', title:'MEGA SALE', subtitle:'SHOP & SAVE BIG', percent:'UP TO 70%', desc:'Electronics, Fashion & More', btn:'Shop Now', btnColor:'#f97316', img:'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800' },
  { id:2, tag:'KIDS', tagColor:'#ec4899', title:'BABY & KIDS', subtitle:'FOR YOUR LITTLE ONES', percent:'UP TO 60%', desc:'Toys, Clothes & Essentials', btn:'Shop Now', btnColor:'#ec4899', img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800' },
  { id:3, tag:'FASHION', tagColor:'#8b5cf6', title:'NEW SEASON', subtitle:'STYLE YOUR LOOK', percent:'UP TO 50%', desc:'Trending Styles & Collections', btn:'Explore', btnColor:'#8b5cf6', img:'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800' },
  { id:4, tag:'HOME', tagColor:'#10b981', title:'HOME & LIVING', subtitle:'REFRESH YOUR SPACE', percent:'UP TO 40%', desc:'Furniture, Decor & Appliances', btn:'Shop Now', btnColor:'#10b981', img:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800' },
  { id:5, tag:'TECH', tagColor:'#3b82f6', title:'TECH DEALS', subtitle:'GADGETS & DEVICES', percent:'UP TO 55%', desc:'Phones, Laptops & Accessories', btn:'Grab Now', btnColor:'#3b82f6', img:'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800' },
];
const CATEGORIES=[
  {id:'mall',label:'LEEMall',icon:'🏬',bg:'#ef4444'},{id:'leeland',label:'LEELand',icon:'📍',bg:'#10b981'},
  {id:'leemart',label:'LEEMart',icon:'🏪',bg:'#3b82f6'},{id:'leelive',label:'LEELive',icon:'▶',bg:'#8b5cf6'},
  {id:'flash',label:'Flash Sale',icon:'⚡',bg:'#f97316'},{id:'fashion',label:'Fashion',icon:'👗',bg:'#ec4899'},
  {id:'electronics',label:'Electronics',icon:'💻',bg:'#6366f1'},{id:'mobiles',label:'Mobiles',icon:'📱',bg:'#0ea5e9'},
  {id:'home',label:'Home',icon:'🏠',bg:'#14b8a6'},{id:'gaming',label:'Gaming',icon:'🎮',bg:'#84cc16'},
  {id:'sports',label:'Sports',icon:'⚽',bg:'#f59e0b'},{id:'beauty',label:'Beauty',icon:'💄',bg:'#f43f5e'},
  {id:'food',label:'Food',icon:'🍔',bg:'#a855f7'},{id:'vouchers',label:'Vouchers',icon:'🎁',bg:'#f97316'},
  {id:'more',label:'More',icon:'···',bg:'#6b7280'},
];
interface HomePageProps{navigate:(page:PageId,params?:NavigationParams)=>void;params:NavigationParams;}
export default function HomePage({navigate}:HomePageProps){
  const [bannerIndex,setBannerIndex]=useState(0);
  const [flashProducts,setFlashProducts]=useState<ShopifyProduct[]>([]);
  const [feedProducts,setFeedProducts]=useState<ShopifyProduct[]>([]);
  const [loadingFeed,setLoadingFeed]=useState(false);
  const [hasMore,setHasMore]=useState(true);
  const [cursor,setCursor]=useState<string|null>(null);
  const [flashTime,setFlashTime]=useState({h:2,m:34,s:59});
  const loaderRef=useRef<HTMLDivElement>(null);
  const bannerTimer=useRef<ReturnType<typeof setInterval>|null>(null);
  useEffect(()=>{bannerTimer.current=setInterval(()=>{setBannerIndex(prev=>(prev+1)%BANNERS.length);},4000);return()=>{if(bannerTimer.current)clearInterval(bannerTimer.current);};},[]);
  useEffect(()=>{const t=setInterval(()=>{setFlashTime(prev=>{let{h,m,s}=prev;s--;if(s<0){s=59;m--;}if(m<0){m=59;h--;}if(h<0){h=2;m=34;s=59;}return{h,m,s};});},1000);return()=>clearInterval(t);},[]);
  useEffect(()=>{getProducts(6).then(r=>setFlashProducts(r.products));},[]);
  const loadMore=useCallback(async()=>{if(loadingFeed||!hasMore)return;setLoadingFeed(true);try{const r=await getProducts(8,cursor??undefined);setFeedProducts(prev=>[...prev,...r.products]);setCursor(r.pageInfo.endCursor);setHasMore(r.pageInfo.hasNextPage);}finally{setLoadingFeed(false);}},[loadingFeed,hasMore,cursor]);
  useEffect(()=>{loadMore();},[]);
  useEffect(()=>{const el=loaderRef.current;if(!el)return;const obs=new IntersectionObserver(entries=>{if(entries[0].isIntersecting)loadMore();},{threshold:0.1});obs.observe(el);return()=>obs.disconnect();},[loadMore]);
  const pad=(n:number)=>String(n).padStart(2,'0');
  const banner=BANNERS[bannerIndex];
  return(
    <div className="flex flex-col bg-gray-50 min-h-screen pb-20">
      <div className="sticky top-0 z-30 bg-white px-3 py-2 flex items-center gap-2 shadow-sm">
        <Bell size={22} className="text-gray-600 flex-shrink-0" onClick={()=>navigate('notifications')} />
        <div className="flex-1 flex items-center bg-gray-100 rounded-full px-3 py-1.5 gap-2">
          <Search size={15} className="text-gray-400" />
          <input className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400" placeholder="Search products..." onFocus={()=>navigate('search')} readOnly />
          <Camera size={16} className="text-gray-400" />
          <Mic size={16} className="text-gray-400" />
        </div>
        <button className="flex-shrink-0 text-white text-sm font-semibold px-3 py-1.5 rounded-full" style={{backgroundColor:'#f97316'}} onClick={()=>navigate('search')}>Search</button>
        <ShoppingCart size={22} className="text-gray-600 flex-shrink-0" onClick={()=>navigate('cart')} />
      </div>
      <div className="relative overflow-hidden" style={{height:'220px'}}>
        <img src={banner.img} alt={banner.title} className="w-full h-full object-cover transition-all duration-500" />
        <div className="absolute inset-0" style={{background:'linear-gradient(to right,rgba(0,0,0,0.72) 0%,rgba(0,0,0,0.28) 60%,rgba(0,0,0,0.05) 100%)'}} />
        <div className="absolute inset-0 flex flex-col justify-center px-5 gap-1">
          <span className="text-white text-xs font-bold px-2 py-0.5 rounded self-start" style={{backgroundColor:banner.tagColor}}>{banner.tag}</span>
          <div className="text-white text-xl font-black leading-tight">{banner.title}</div>
          <div className="text-white text-xs font-medium opacity-90">{banner.subtitle}</div>
          <div className="text-white text-2xl font-black" style={{color:banner.tagColor}}>{banner.percent}</div>
          <div className="text-white text-xs opacity-80">{banner.desc}</div>
          <button className="mt-2 self-start text-white text-xs font-bold px-4 py-1.5 rounded-full" style={{backgroundColor:banner.btnColor}}>{banner.btn}</button>
        </div>
        <button className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 rounded-full p-1" onClick={()=>setBannerIndex(prev=>(prev-1+BANNERS.length)%BANNERS.length)}><ChevronLeft size={18} className="text-white" /></button>
        <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-40 rounded-full p-1" onClick={()=>setBannerIndex(prev=>(prev+1)%BANNERS.length)}><ChevronRight size={18} className="text-white" /></button>
        <div className="absolute bottom-2 right-3 bg-black bg-opacity-50 text-white text-xs px-2 py-0.5 rounded-full">{bannerIndex+1}/{BANNERS.length}</div>
        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">{BANNERS.map((_,i)=>(<div key={i} className="rounded-full transition-all duration-300" style={{width:i===bannerIndex?16:6,height:6,backgroundColor:i===bannerIndex?'#ffffff':'rgba(255,255,255,0.5)'}} />))}</div>
      </div>
      <div className="flex items-center justify-center gap-3 py-2 px-4" style={{backgroundColor:'#1e1b4b'}}>
        <span className="text-white text-xs font-black px-2 py-0.5 rounded" style={{backgroundColor:'#f97316'}}>FREE</span>
        <span className="text-white text-xs font-medium">Free Shipping</span>
        <span className="text-gray-400 text-xs">|</span>
        <span className="text-white text-xs font-medium">Fast Delivery</span>
        <span className="text-gray-400 text-xs">|</span>
        <span className="text-white text-xs font-medium">Free Return</span>
      </div>
      <div className="bg-white pt-3 pb-2"><div className="flex overflow-x-auto px-3 gap-3" style={{scrollbarWidth:'none'}}>{CATEGORIES.map(cat=>(<div key={cat.id} className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer" onClick={()=>{if(cat.id==='flash')navigate('flash-sale');else if(cat.id==='vouchers')navigate('vouchers');else if(cat.id==='fashion')navigate('fashion');}}><div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm" style={{backgroundColor:cat.bg}}>{cat.icon}</div><span className="text-xs text-gray-600 text-center leading-tight" style={{maxWidth:56}}>{cat.label}</span></div>))}</div></div>
      <div className="mt-2 bg-white">
        <div className="flex items-center justify-between px-4 py-2" style={{background:'linear-gradient(90deg,#ef4444 0%,#f97316 100%)'}}>
          <div className="flex items-center gap-2"><Zap size={18} className="text-white" fill="white" /><span className="text-white font-black text-base">Flash Sale</span></div>
          <div className="flex items-center gap-1"><span className="text-white text-xs opacity-80">Ends in</span>{[pad(flashTime.h),pad(flashTime.m),pad(flashTime.s)].map((t,i)=>(<span key={i} className="flex items-center gap-1"><span className="bg-white text-red-600 text-xs font-black px-1.5 py-0.5 rounded">{t}</span>{i<2&&<span className="text-white font-black text-xs">:</span>}</span>))}</div>
        </div>
        <div className="flex overflow-x-auto px-3 py-3 gap-3" style={{scrollbarWidth:'none'}}>{flashProducts.map(p=>{const price=getProductPrice(p);const compare=getCompareAtPrice(p);const discount=getDiscountPercent(p);return(<div key={p.id} className="flex-shrink-0 w-32 cursor-pointer" onClick={()=>navigate('product',{productId:p.id})}><div className="relative rounded-xl overflow-hidden bg-gray-100" style={{height:128}}><img src={getProductImageUrl(p)} alt={p.title} className="w-full h-full object-cover" />{discount>0&&<div className="absolute top-1 left-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">-{discount}%</div>}</div><div className="mt-1 px-0.5"><div className="text-xs text-gray-700 line-clamp-1 font-medium">{p.title}</div><div className="flex items-center gap-1 mt-0.5"><span className="text-red-500 font-bold text-sm">{'$'}{price}</span>{compare&&<span className="text-gray-400 text-xs line-through">{'$'}{compare}</span>}</div></div></div>);})}</div>
      </div>
      <div className="mt-2 bg-white">
        <div className="px-4 py-3 border-b border-gray-100"><div className="font-black text-gray-900 text-base flex items-center gap-2"><Star size={16} className="text-yellow-400" fill="#facc15" />Just For You</div><div className="text-xs text-gray-500 mt-0.5">Recommended based on your activity</div></div>
        <div className="grid grid-cols-2 gap-0">{feedProducts.map(p=>{const price=getProductPrice(p);const compare=getCompareAtPrice(p);const discount=getDiscountPercent(p);return(<div key={p.id} className="border-b border-r border-gray-100 p-3 cursor-pointer" onClick={()=>navigate('product',{productId:p.id})}><div className="relative rounded-xl overflow-hidden bg-gray-100" style={{height:160}}><img src={getProductImageUrl(p)} alt={p.title} className="w-full h-full object-cover" />{discount>0&&<div className="absolute top-1 left-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded">-{discount}%</div>}<button className="absolute top-1 right-1 bg-white rounded-full p-1 shadow" onClick={e=>{e.stopPropagation();}}><Heart size={14} className="text-gray-400" /></button></div><div className="mt-2"><div className="text-xs text-gray-700 line-clamp-2 leading-snug">{p.title}</div><div className="flex items-center gap-1 mt-1"><span className="text-red-500 font-bold text-sm">{'$'}{price}</span>{compare&&<span className="text-gray-400 text-xs line-through">{'$'}{compare}</span>}</div><div className="flex items-center gap-0.5 mt-0.5">{[1,2,3,4,5].map(s=>(<Star key={s} size={10} className="text-yellow-400" fill="#facc15" />))}<span className="text-gray-400 text-xs ml-1">(128)</span></div></div></div>);})}</div>
        <div ref={loaderRef} className="py-4 flex justify-center">{loadingFeed&&<div className="flex gap-1">{[0,1,2].map(i=>(<div key={i} className="w-2 h-2 rounded-full bg-orange-400 animate-bounce" style={{animationDelay:i*0.15+'s'}} />))}</div>}{!hasMore&&!loadingFeed&&<span className="text-gray-400 text-xs">You've seen it all!</span>}</div>
      </div>
    </div>
  );
}
