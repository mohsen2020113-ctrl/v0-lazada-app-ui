export interface Category {
  id: number
  name: string
  slug: string
  children?: Category[]
}
export const CATEGORIES: Category[] = [
  {id:1,name:"Women's Fashion",slug:"womens-fashion",children:[
    {id:11,name:"Women's Clothing",slug:"womens-clothing",children:[{id:111,name:"Dresses",slug:"dresses"},{id:112,name:"Tops",slug:"tops"},{id:113,name:"Pants",slug:"pants"},{id:114,name:"Skirts",slug:"skirts"},{id:115,name:"Lingerie",slug:"lingerie"},{id:116,name:"Swimwear",slug:"swimwear"},{id:117,name:"Casual Wear",slug:"casual-wear"},{id:118,name:"Office Wear",slug:"office-wear"}]},
    {id:12,name:"Women's Shoes",slug:"womens-shoes",children:[{id:121,name:"Heels",slug:"heels"},{id:122,name:"Sneakers",slug:"womens-sneakers"},{id:123,name:"Sandals",slug:"womens-sandals"},{id:124,name:"Boots",slug:"boots"}]},
    {id:13,name:"Women's Bags",slug:"womens-bags",children:[{id:131,name:"Shoulder Bags",slug:"shoulder-bags"},{id:132,name:"Handbags",slug:"handbags"},{id:133,name:"Backpacks",slug:"womens-backpacks"},{id:134,name:"Wallets",slug:"womens-wallets"}]},
    {id:14,name:"Accessories",slug:"womens-accessories",children:[{id:141,name:"Watches",slug:"womens-watches"},{id:142,name:"Fashion Jewelry",slug:"fashion-jewelry"},{id:143,name:"Eyewear",slug:"eyewear"},{id:144,name:"Scarves",slug:"scarves"}]}]},
  {id:2,name:"Men's Fashion",slug:"mens-fashion",children:[
    {id:21,name:"Men's Clothing",slug:"mens-clothing",children:[{id:211,name:"T-Shirts",slug:"t-shirts"},{id:212,name:"Shirts",slug:"shirts"},{id:213,name:"Pants",slug:"mens-pants"},{id:214,name:"Jeans",slug:"jeans"},{id:215,name:"Underwear",slug:"underwear"},{id:216,name:"Sportswear",slug:"sportswear"}]},
    {id:22,name:"Men's Shoes",slug:"mens-shoes",children:[{id:221,name:"Sneakers",slug:"mens-sneakers"},{id:222,name:"Loafers",slug:"loafers"},{id:223,name:"Sandals",slug:"mens-sandals"}]},
    {id:23,name:"Men's Bags",slug:"mens-bags",children:[{id:231,name:"Backpacks",slug:"mens-backpacks"},{id:232,name:"Messenger Bags",slug:"messenger-bags"},{id:233,name:"Wallets",slug:"mens-wallets"}]},
    {id:24,name:"Men's Watches",slug:"mens-watches"}]},
  {id:3,name:"Mobiles & Gadgets",slug:"mobiles-gadgets",children:[
    {id:31,name:"Mobile Phones",slug:"mobile-phones",children:[{id:311,name:"iPhone",slug:"iphone"},{id:312,name:"Samsung",slug:"samsung-phones"},{id:313,name:"OPPO",slug:"oppo"},{id:314,name:"Xiaomi",slug:"xiaomi"},{id:315,name:"Realme",slug:"realme"}]},
    {id:32,name:"Tablets",slug:"tablets",children:[{id:321,name:"iPad",slug:"ipad"},{id:322,name:"Samsung Galaxy Tab",slug:"samsung-tab"}]},
    {id:33,name:"Mobile Accessories",slug:"mobile-accessories",children:[{id:331,name:"Cases",slug:"phone-cases"},{id:332,name:"Screen Protectors",slug:"screen-protectors"},{id:333,name:"Earphones",slug:"earphones"},{id:334,name:"Cables",slug:"cables"},{id:335,name:"Power Banks",slug:"power-banks"}]},
    {id:34,name:"Smartwatches",slug:"smartwatches"}]},
  {id:4,name:"Electronics",slug:"electronics",children:[
    {id:41,name:"Computers",slug:"computers",children:[{id:411,name:"Laptops",slug:"laptops"},{id:412,name:"Desktops",slug:"desktops"},{id:413,name:"Accessories",slug:"computer-accessories"}]},
    {id:42,name:"Cameras & Drones",slug:"cameras-drones",children:[{id:421,name:"DSLR & Mirrorless",slug:"dslr-mirrorless"},{id:422,name:"Action Cameras",slug:"action-cameras"},{id:423,name:"Drones",slug:"drones"}]},
    {id:43,name:"Home Appliances",slug:"home-appliances",children:[{id:431,name:"Vacuum Cleaners",slug:"vacuum-cleaners"},{id:432,name:"Air Fryers",slug:"air-fryers"},{id:433,name:"Fans",slug:"fans"},{id:434,name:"Air Purifiers",slug:"air-purifiers"}]},
    {id:44,name:"TVs & Audio",slug:"tvs-audio",children:[{id:441,name:"TVs",slug:"tvs"},{id:442,name:"Speakers",slug:"speakers"},{id:443,name:"Soundbars",slug:"soundbars"}]}]},
  {id:5,name:"Home & Living",slug:"home-living",children:[
    {id:51,name:"Furniture",slug:"furniture",children:[{id:511,name:"Tables",slug:"tables"},{id:512,name:"Chairs",slug:"chairs"},{id:513,name:"Cabinets",slug:"cabinets"},{id:514,name:"Beds",slug:"beds"}]},
    {id:52,name:"Home Decor",slug:"home-decor",children:[{id:521,name:"Rugs",slug:"rugs"},{id:522,name:"Curtains",slug:"curtains"},{id:523,name:"Wall Art",slug:"wall-art"}]},
    {id:53,name:"Kitchen & Dining",slug:"kitchen-dining",children:[{id:531,name:"Cookware",slug:"cookware"},{id:532,name:"Dinnerware",slug:"dinnerware"}]},
    {id:54,name:"Bedding & Bath",slug:"bedding-bath",children:[{id:541,name:"Bed Sheets",slug:"bed-sheets"},{id:542,name:"Pillows",slug:"pillows"}]},
    {id:55,name:"Garden & Outdoor",slug:"garden-outdoor"}]},
  {id:6,name:"Kids & Toys",slug:"kids-toys",children:[
    {id:61,name:"Kids Clothing",slug:"kids-clothing"},
    {id:62,name:"Toys",slug:"toys",children:[{id:621,name:"Dolls",slug:"dolls"},{id:622,name:"Toy Cars",slug:"toy-cars"},{id:623,name:"Building Blocks",slug:"building-blocks"}]},
    {id:63,name:"Baby Gear",slug:"baby-gear",children:[{id:631,name:"Strollers",slug:"strollers"},{id:632,name:"Car Seats",slug:"car-seats"}]},
    {id:64,name:"Diapers",slug:"diapers"}]},
  {id:7,name:"Health & Beauty",slug:"health-beauty",children:[
    {id:71,name:"Skincare",slug:"skincare",children:[{id:711,name:"Moisturizers",slug:"moisturizers"},{id:712,name:"Serums",slug:"serums"},{id:713,name:"Sunscreen",slug:"sunscreen"}]},
    {id:72,name:"Makeup",slug:"makeup",children:[{id:721,name:"Lipstick",slug:"lipstick"},{id:722,name:"Foundation",slug:"foundation"}]},
    {id:73,name:"Fragrances",slug:"fragrances"},{id:74,name:"Supplements",slug:"supplements"}]},
  {id:8,name:"Food & Beverages",slug:"food-beverages",children:[
    {id:81,name:"Dry Food",slug:"dry-food"},{id:82,name:"Beverages",slug:"beverages"},{id:83,name:"Snacks",slug:"snacks"},{id:84,name:"Fresh Food",slug:"fresh-food"}]},
  {id:9,name:"Sports & Travel",slug:"sports-travel",children:[
    {id:91,name:"Sports Equipment",slug:"sports-equipment",children:[{id:911,name:"Fitness",slug:"fitness"},{id:912,name:"Yoga",slug:"yoga"},{id:913,name:"Bicycles",slug:"bicycles"}]},
    {id:92,name:"Luggage",slug:"luggage"},{id:93,name:"Sports Shoes",slug:"sports-shoes"}]},
  {id:10,name:"Automotive & Industrial",slug:"automotive",children:[
    {id:101,name:"Tires",slug:"tires"},{id:102,name:"Engine Oil",slug:"engine-oil"},{id:103,name:"Car Accessories",slug:"car-accessories"}]},
]
export function getCategoryBySlug(slug:string):Category|undefined{function s(cats:Category[]):Category|undefined{for(const c of cats){if(c.slug===slug)return c;if(c.children){const f=s(c.children);if(f)return f;}}}return s(CATEGORIES)}
