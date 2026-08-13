 require('dns').setServers(['8.8.8.8', '8.8.4.4']);

const path = require('path');
const dotenv = require('dotenv');

dotenv.config({
  path: path.join(__dirname, '..', '..', '.env')
});

const connectDB = require('../config/db');
const Product = require('../models/Product');
const products = [

  // =========================================================
  // MEN - 12 PRODUCTS
  // =========================================================

  {
    name: 'Classic Crew Neck T-Shirt',
    description: 'Soft premium cotton crew neck t-shirt for everyday casual wear.',
    category: 'Men',
    subCategory: 'T-Shirts',
    price: 599,
    originalPrice: 999,
    discount: 40,
    rating: 4.5,
    numReviews: 128,
    stock: 50,
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    isFeatured: true,
    isNewArrival: false
  },

  {
    name: 'Slim Fit Formal Shirt',
    description: 'Elegant slim fit shirt made for office and formal occasions.',
    category: 'Men',
    subCategory: 'Shirts',
    price: 1299,
    originalPrice: 1899,
    discount: 32,
    rating: 4.6,
    numReviews: 87,
    stock: 40,
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    isFeatured: true,
    isNewArrival: true
  },

  {
    name: 'Premium Blue Denim Jeans',
    description: 'Modern slim fit blue denim jeans with comfortable stretch fabric.',
    category: 'Men',
    subCategory: 'Jeans',
    price: 1799,
    originalPrice: 2499,
    discount: 28,
    rating: 4.5,
    numReviews: 156,
    stock: 60,
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800'
    ],
    sizes: ['28', '30', '32', '34', '36'],
    isFeatured: true,
    isNewArrival: false
  },

  {
    name: 'Classic Black Hoodie',
    description: 'Warm cotton fleece hoodie with a comfortable relaxed fit.',
    category: 'Men',
    subCategory: 'Hoodies',
    price: 1499,
    originalPrice: 2199,
    discount: 32,
    rating: 4.7,
    numReviews: 203,
    stock: 45,
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    isFeatured: true,
    isNewArrival: true
  },

  {
    name: 'Urban Bomber Jacket',
    description: 'Stylish lightweight bomber jacket for a modern streetwear look.',
    category: 'Men',
    subCategory: 'Jackets',
    price: 2499,
    originalPrice: 3499,
    discount: 29,
    rating: 4.5,
    numReviews: 64,
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800'
    ],
    sizes: ['M', 'L', 'XL'],
    isFeatured: false,
    isNewArrival: true
  },

  {
    name: 'Casual Chino Trousers',
    description: 'Comfortable tapered chinos for smart casual everyday outfits.',
    category: 'Men',
    subCategory: 'Trousers',
    price: 1399,
    originalPrice: 1999,
    discount: 30,
    rating: 4.3,
    numReviews: 51,
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800'
    ],
    sizes: ['30', '32', '34', '36'],
    isFeatured: false,
    isNewArrival: false
  },

  {
    name: 'Oversized White T-Shirt',
    description: 'Relaxed oversized cotton t-shirt with a clean minimal design.',
    category: 'Men',
    subCategory: 'T-Shirts',
    price: 699,
    originalPrice: 1099,
    discount: 36,
    rating: 4.4,
    numReviews: 98,
    stock: 55,
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    isFeatured: false,
    isNewArrival: true
  },

  {
    name: 'Premium Oxford Shirt',
    description: 'Classic Oxford shirt with a polished look for work and weekends.',
    category: 'Men',
    subCategory: 'Shirts',
    price: 1499,
    originalPrice: 2199,
    discount: 32,
    rating: 4.6,
    numReviews: 73,
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    isFeatured: false,
    isNewArrival: false
  },

  {
    name: 'Dark Wash Denim',
    description: 'Classic dark wash denim jeans with a comfortable modern fit.',
    category: 'Men',
    subCategory: 'Jeans',
    price: 1899,
    originalPrice: 2699,
    discount: 30,
    rating: 4.5,
    numReviews: 119,
    stock: 42,
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800'
    ],
    sizes: ['28', '30', '32', '34', '36'],
    isFeatured: true,
    isNewArrival: false
  },

  {
    name: 'Essential Grey Hoodie',
    description: 'Minimal grey hoodie designed for everyday comfort.',
    category: 'Men',
    subCategory: 'Hoodies',
    price: 1599,
    originalPrice: 2299,
    discount: 30,
    rating: 4.6,
    numReviews: 144,
    stock: 38,
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    isFeatured: false,
    isNewArrival: true
  },

  {
    name: 'Street Style Jacket',
    description: 'Contemporary casual jacket designed for everyday street style.',
    category: 'Men',
    subCategory: 'Jackets',
    price: 2299,
    originalPrice: 3299,
    discount: 30,
    rating: 4.4,
    numReviews: 68,
    stock: 28,
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800'
    ],
    sizes: ['M', 'L', 'XL'],
    isFeatured: true,
    isNewArrival: false
  },

  {
    name: 'Slim Khaki Trousers',
    description: 'Smart slim-fit khaki trousers for office and casual styling.',
    category: 'Men',
    subCategory: 'Trousers',
    price: 1299,
    originalPrice: 1799,
    discount: 28,
    rating: 4.2,
    numReviews: 45,
    stock: 40,
    images: [
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800'
    ],
    sizes: ['30', '32', '34', '36'],
    isFeatured: false,
    isNewArrival: false
  },


  // =========================================================
  // WOMEN - 13 PRODUCTS
  // =========================================================

  {
    name: 'Floral Wrap Dress',
    description: 'Elegant floral wrap dress with a flattering silhouette.',
    category: 'Women',
    subCategory: 'Dresses',
    price: 1899,
    originalPrice: 2799,
    discount: 32,
    rating: 4.7,
    numReviews: 176,
    stock: 40,
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    isFeatured: true,
    isNewArrival: true
  },

  {
    name: 'Ribbed Knit Top',
    description: 'Soft ribbed knit top perfect for everyday styling.',
    category: 'Women',
    subCategory: 'Tops',
    price: 799,
    originalPrice: 1199,
    discount: 33,
    rating: 4.4,
    numReviews: 92,
    stock: 55,
    images: [
      'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=800'
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    isFeatured: false,
    isNewArrival: true
  },

  {
    name: 'High Waist Skinny Jeans',
    description: 'Comfortable high waist stretch denim jeans.',
    category: 'Women',
    subCategory: 'Jeans',
    price: 1699,
    originalPrice: 2399,
    discount: 29,
    rating: 4.5,
    numReviews: 210,
    stock: 50,
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800'
    ],
    sizes: ['26', '28', '30', '32'],
    isFeatured: true,
    isNewArrival: false
  },

  {
    name: 'Embroidered Cotton Kurti',
    description: 'Beautiful cotton kurti with delicate embroidery detailing.',
    category: 'Women',
    subCategory: 'Kurtis',
    price: 999,
    originalPrice: 1499,
    discount: 33,
    rating: 4.5,
    numReviews: 134,
    stock: 45,
    images: [
      'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    isFeatured: true,
    isNewArrival: false
  },

  {
    name: 'Classic Denim Jacket',
    description: 'Timeless denim jacket that works with almost every outfit.',
    category: 'Women',
    subCategory: 'Jackets',
    price: 1999,
    originalPrice: 2799,
    discount: 29,
    rating: 4.6,
    numReviews: 88,
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1601333144130-8cbb312386b6?w=800'
    ],
    sizes: ['S', 'M', 'L'],
    isFeatured: true,
    isNewArrival: false
  },

  {
    name: 'Pleated Midi Skirt',
    description: 'Elegant pleated midi skirt with a comfortable waistband.',
    category: 'Women',
    subCategory: 'Skirts',
    price: 1199,
    originalPrice: 1699,
    discount: 29,
    rating: 4.3,
    numReviews: 47,
    stock: 38,
    images: [
      'https://images.unsplash.com/photo-1583496661160-fb5886a13d77?w=800'
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    isFeatured: false,
    isNewArrival: true
  },

  {
    name: 'Satin Evening Dress',
    description: 'Elegant satin dress designed for evening parties and special occasions.',
    category: 'Women',
    subCategory: 'Dresses',
    price: 2299,
    originalPrice: 3299,
    discount: 30,
    rating: 4.8,
    numReviews: 91,
    stock: 24,
    images: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800'
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    isFeatured: true,
    isNewArrival: true
  },

  {
    name: 'Casual Cotton Blouse',
    description: 'Lightweight cotton blouse for comfortable everyday wear.',
    category: 'Women',
    subCategory: 'Tops',
    price: 899,
    originalPrice: 1299,
    discount: 31,
    rating: 4.4,
    numReviews: 74,
    stock: 46,
    images: [
      'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    isFeatured: false,
    isNewArrival: true
  },

  {
    name: 'Wide Leg Denim Jeans',
    description: 'Trendy wide leg jeans with a relaxed modern silhouette.',
    category: 'Women',
    subCategory: 'Jeans',
    price: 1799,
    originalPrice: 2599,
    discount: 31,
    rating: 4.5,
    numReviews: 103,
    stock: 42,
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800'
    ],
    sizes: ['26', '28', '30', '32', '34'],
    isFeatured: false,
    isNewArrival: true
  },

  {
    name: 'Printed Summer Kurti',
    description: 'Breathable printed kurti designed for warm summer days.',
    category: 'Women',
    subCategory: 'Kurtis',
    price: 1099,
    originalPrice: 1599,
    discount: 31,
    rating: 4.6,
    numReviews: 121,
    stock: 52,
    images: [
      'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    isFeatured: true,
    isNewArrival: false
  },

  {
    name: 'Elegant Black Skirt',
    description: 'Versatile black skirt suitable for both casual and formal outfits.',
    category: 'Women',
    subCategory: 'Skirts',
    price: 999,
    originalPrice: 1499,
    discount: 33,
    rating: 4.2,
    numReviews: 59,
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1583496661160-fb5886a13d77?w=800'
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    isFeatured: false,
    isNewArrival: false
  },

  {
    name: 'Floral Midi Dress',
    description: 'Feminine floral midi dress with a comfortable relaxed fit.',
    category: 'Women',
    subCategory: 'Dresses',
    price: 1599,
    originalPrice: 2299,
    discount: 30,
    rating: 4.7,
    numReviews: 148,
    stock: 37,
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    isFeatured: true,
    isNewArrival: true
  },

  {
    name: 'Soft Ribbed Cardigan',
    description: 'Cozy ribbed cardigan for stylish layering during cooler days.',
    category: 'Women',
    subCategory: 'Tops',
    price: 1399,
    originalPrice: 1999,
    discount: 30,
    rating: 4.5,
    numReviews: 82,
    stock: 32,
    images: [
      'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=800'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    isFeatured: false,
    isNewArrival: true
  },


  // =========================================================
  // KIDS - 12 PRODUCTS
  // =========================================================

  {
    name: 'Kids Graphic Print T-Shirt',
    description: 'Colorful soft cotton t-shirt made specially for active kids.',
    category: 'Kids',
    subCategory: 'T-Shirts',
    price: 449,
    originalPrice: 699,
    discount: 36,
    rating: 4.5,
    numReviews: 112,
    stock: 60,
    images: [
      'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800'
    ],
    sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y'],
    isFeatured: true,
    isNewArrival: false
  },

  {
    name: 'Kids Party Frock Dress',
    description: 'Cute party frock designed for birthdays and special occasions.',
    category: 'Kids',
    subCategory: 'Dresses',
    price: 999,
    originalPrice: 1499,
    discount: 33,
    rating: 4.6,
    numReviews: 76,
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1519457851961-27fedd75a4d1?w=800'
    ],
    sizes: ['2-3Y', '4-5Y', '6-7Y'],
    isFeatured: true,
    isNewArrival: true
  },

  {
    name: 'Kids Stretch Denim Jeans',
    description: 'Durable stretch denim jeans designed for everyday play.',
    category: 'Kids',
    subCategory: 'Jeans',
    price: 799,
    originalPrice: 1199,
    discount: 33,
    rating: 4.3,
    numReviews: 58,
    stock: 40,
    images: [
      'https://images.unsplash.com/photo-1519238360530-eef2c14e50cd?w=800'
    ],
    sizes: ['4-5Y', '6-7Y', '8-9Y', '10-11Y'],
    isFeatured: false,
    isNewArrival: false
  },

  {
    name: 'Kids Cozy Hoodie',
    description: 'Warm fleece hoodie with a comfortable fit for chilly days.',
    category: 'Kids',
    subCategory: 'Hoodies',
    price: 899,
    originalPrice: 1299,
    discount: 31,
    rating: 4.4,
    numReviews: 63,
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1519278409-1f56fdda7485?w=800'
    ],
    sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y'],
    isFeatured: false,
    isNewArrival: true
  },

  {
    name: 'Kids Casual Co-ord Set',
    description: 'Comfortable two-piece co-ord outfit for playdates and outings.',
    category: 'Kids',
    subCategory: 'Casual Wear',
    price: 1099,
    originalPrice: 1599,
    discount: 31,
    rating: 4.5,
    numReviews: 41,
    stock: 28,
    images: [
      'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800'
    ],
    sizes: ['2-3Y', '4-5Y', '6-7Y'],
    isFeatured: false,
    isNewArrival: false
  },

  {
    name: 'Kids Cotton Polo',
    description: 'Classic cotton polo shirt with a smart casual look.',
    category: 'Kids',
    subCategory: 'T-Shirts',
    price: 599,
    originalPrice: 899,
    discount: 33,
    rating: 4.4,
    numReviews: 67,
    stock: 48,
    images: [
      'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800'
    ],
    sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y'],
    isFeatured: false,
    isNewArrival: true
  },

  {
    name: 'Kids Summer Dress',
    description: 'Lightweight colorful summer dress made for comfortable play.',
    category: 'Kids',
    subCategory: 'Dresses',
    price: 799,
    originalPrice: 1199,
    discount: 33,
    rating: 4.6,
    numReviews: 84,
    stock: 36,
    images: [
      'https://images.unsplash.com/photo-1519457851961-27fedd75a4d1?w=800'
    ],
    sizes: ['2-3Y', '4-5Y', '6-7Y'],
    isFeatured: true,
    isNewArrival: true
  },

  {
    name: 'Kids Jogger Pants',
    description: 'Soft stretch joggers designed for school, play and travel.',
    category: 'Kids',
    subCategory: 'Trousers',
    price: 699,
    originalPrice: 999,
    discount: 30,
    rating: 4.3,
    numReviews: 72,
    stock: 45,
    images: [
      'https://images.unsplash.com/photo-1519238360530-eef2c14e50cd?w=800'
    ],
    sizes: ['4-5Y', '6-7Y', '8-9Y', '10-11Y'],
    isFeatured: false,
    isNewArrival: false
  },

  {
    name: 'Kids Printed Sweatshirt',
    description: 'Soft sweatshirt with a fun printed design for winter days.',
    category: 'Kids',
    subCategory: 'Hoodies',
    price: 849,
    originalPrice: 1299,
    discount: 35,
    rating: 4.5,
    numReviews: 61,
    stock: 39,
    images: [
      'https://images.unsplash.com/photo-1519278409-1f56fdda7485?w=800'
    ],
    sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y'],
    isFeatured: true,
    isNewArrival: false
  },

  {
    name: 'Kids Denim Jacket',
    description: 'Classic denim jacket with a lightweight comfortable design.',
    category: 'Kids',
    subCategory: 'Jackets',
    price: 1199,
    originalPrice: 1699,
    discount: 29,
    rating: 4.5,
    numReviews: 48,
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1519278409-1f56fdda7485?w=800'
    ],
    sizes: ['4-5Y', '6-7Y', '8-9Y', '10-11Y'],
    isFeatured: false,
    isNewArrival: true
  },

  {
    name: 'Kids Festive Kurta Set',
    description: 'Traditional festive kurta set designed for celebrations.',
    category: 'Kids',
    subCategory: 'Ethnic Wear',
    price: 1299,
    originalPrice: 1899,
    discount: 32,
    rating: 4.7,
    numReviews: 93,
    stock: 27,
    images: [
      'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800'
    ],
    sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y'],
    isFeatured: true,
    isNewArrival: true
  },

  {
    name: 'Kids Rainbow T-Shirt',
    description: 'Bright colorful t-shirt made from soft breathable cotton.',
    category: 'Kids',
    subCategory: 'T-Shirts',
    price: 399,
    originalPrice: 599,
    discount: 33,
    rating: 4.4,
    numReviews: 105,
    stock: 65,
    images: [
      'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800'
    ],
    sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y'],
    isFeatured: false,
    isNewArrival: true
  },


  // =========================================================
  // INFANTS - 13 PRODUCTS
  // =========================================================

  {
    name: 'Infant Cotton Romper',
    description: 'Ultra-soft cotton romper with snap buttons for easy changing.',
    category: 'Infants',
    subCategory: 'Rompers',
    price: 399,
    originalPrice: 599,
    discount: 33,
    rating: 4.7,
    numReviews: 95,
    stock: 50,
    images: [
      'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800'
    ],
    sizes: ['0-3M', '3-6M', '6-9M'],
    isFeatured: true,
    isNewArrival: false
  },

  {
    name: 'Organic Cotton Bodysuit Pack',
    description: 'Pack of three soft cotton bodysuits for everyday baby comfort.',
    category: 'Infants',
    subCategory: 'Bodysuits',
    price: 699,
    originalPrice: 999,
    discount: 30,
    rating: 4.8,
    numReviews: 140,
    stock: 55,
    images: [
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800'
    ],
    sizes: ['0-3M', '3-6M', '6-9M', '9-12M'],
    isFeatured: true,
    isNewArrival: true
  },

  {
    name: 'Baby Girl Summer Dress',
    description: 'Cute lightweight cotton dress designed for warm sunny days.',
    category: 'Infants',
    subCategory: 'Baby Dresses',
    price: 599,
    originalPrice: 899,
    discount: 33,
    rating: 4.6,
    numReviews: 67,
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800'
    ],
    sizes: ['0-3M', '3-6M', '6-9M'],
    isFeatured: false,
    isNewArrival: true
  },

  {
    name: 'Baby Sleep & Play Set',
    description: 'Soft two-piece sleep and play set for comfortable everyday use.',
    category: 'Infants',
    subCategory: 'Baby Sets',
    price: 549,
    originalPrice: 799,
    discount: 31,
    rating: 4.5,
    numReviews: 54,
    stock: 42,
    images: [
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800'
    ],
    sizes: ['0-3M', '3-6M', '6-9M', '9-12M'],
    isFeatured: false,
    isNewArrival: false
  },

  {
    name: 'Infant Dungaree Set',
    description: 'Adorable dungaree set with a soft cotton inner bodysuit.',
    category: 'Infants',
    subCategory: 'Infant Casual Wear',
    price: 649,
    originalPrice: 949,
    discount: 32,
    rating: 4.4,
    numReviews: 38,
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1600091166971-7f9faad6c1e2?w=800'
    ],
    sizes: ['3-6M', '6-9M', '9-12M'],
    isFeatured: false,
    isNewArrival: false
  },

  {
    name: 'Newborn Welcome Home Set',
    description: 'Gentle newborn outfit set designed for a baby first days.',
    category: 'Infants',
    subCategory: 'Baby Sets',
    price: 799,
    originalPrice: 1199,
    discount: 33,
    rating: 4.9,
    numReviews: 29,
    stock: 20,
    images: [
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800'
    ],
    sizes: ['0-3M'],
    isFeatured: true,
    isNewArrival: true
  },

  {
    name: 'Baby Cotton T-Shirt Set',
    description: 'Comfortable cotton t-shirt set for babies and toddlers.',
    category: 'Infants',
    subCategory: 'T-Shirts',
    price: 499,
    originalPrice: 749,
    discount: 33,
    rating: 4.5,
    numReviews: 71,
    stock: 48,
    images: [
      'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800'
    ],
    sizes: ['6-9M', '9-12M', '12-18M'],
    isFeatured: false,
    isNewArrival: true
  },

  {
    name: 'Baby Cozy Winter Set',
    description: 'Warm and soft winter clothing set for chilly days.',
    category: 'Infants',
    subCategory: 'Baby Sets',
    price: 899,
    originalPrice: 1299,
    discount: 31,
    rating: 4.7,
    numReviews: 83,
    stock: 32,
    images: [
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800'
    ],
    sizes: ['3-6M', '6-9M', '9-12M'],
    isFeatured: true,
    isNewArrival: true
  },

  {
    name: 'Baby Printed Romper',
    description: 'Soft printed romper with convenient snap closure.',
    category: 'Infants',
    subCategory: 'Rompers',
    price: 449,
    originalPrice: 699,
    discount: 36,
    rating: 4.6,
    numReviews: 96,
    stock: 58,
    images: [
      'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800'
    ],
    sizes: ['0-3M', '3-6M', '6-9M'],
    isFeatured: false,
    isNewArrival: false
  },

  {
    name: 'Baby Party Dress',
    description: 'Sweet festive dress for baby girls on special occasions.',
    category: 'Infants',
    subCategory: 'Baby Dresses',
    price: 749,
    originalPrice: 1099,
    discount: 32,
    rating: 4.8,
    numReviews: 62,
    stock: 24,
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800'
    ],
    sizes: ['3-6M', '6-9M', '9-12M'],
    isFeatured: true,
    isNewArrival: true
  },

  {
    name: 'Baby Everyday Bodysuit',
    description: 'Essential soft cotton bodysuit for everyday baby wear.',
    category: 'Infants',
    subCategory: 'Bodysuits',
    price: 349,
    originalPrice: 549,
    discount: 36,
    rating: 4.7,
    numReviews: 118,
    stock: 70,
    images: [
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800'
    ],
    sizes: ['0-3M', '3-6M', '6-9M', '9-12M'],
    isFeatured: false,
    isNewArrival: false
  },

  {
    name: 'Baby Soft Cotton Jumpsuit',
    description: 'One-piece cotton jumpsuit designed for comfort and easy movement.',
    category: 'Infants',
    subCategory: 'Rompers',
    price: 699,
    originalPrice: 999,
    discount: 30,
    rating: 4.6,
    numReviews: 77,
    stock: 36,
    images: [
      'https://images.unsplash.com/photo-1600091166971-7f9faad6c1e2?w=800'
    ],
    sizes: ['3-6M', '6-9M', '9-12M'],
    isFeatured: false,
    isNewArrival: true
  },

  {
    name: 'Baby Cute Outfit Set',
    description: 'Complete everyday outfit set made with soft baby-friendly fabric.',
    category: 'Infants',
    subCategory: 'Baby Sets',
    price: 849,
    originalPrice: 1199,
    discount: 29,
    rating: 4.8,
    numReviews: 89,
    stock: 31,
    images: [
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800'
    ],
    sizes: ['0-3M', '3-6M', '6-9M'],
    isFeatured: true,
    isNewArrival: true
  }

];


// =========================================================
// SEED DATABASE
// =========================================================

const seedDB = async () => {
  try {
    await connectDB();

    await Product.deleteMany({});
    console.log('[Veloura] Existing products cleared.');

    await Product.insertMany(products);

    console.log(
      `[Veloura] Successfully seeded ${products.length} products.`
    );

    process.exit(0);

  } catch (err) {
    console.error('[Veloura] Seeding failed:', err.message);
    process.exit(1);
  }
};

seedDB();