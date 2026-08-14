 require('dns').setServers(['8.8.8.8', '8.8.4.4']);

const path = require('path');
const dotenv = require('dotenv');

dotenv.config({
  path: path.join(__dirname, '..', '..', '.env')
});

const connectDB = require('./db');
const Product = require('../models/Product');

const products = [

  // =========================================================
  // MEN - 15 PRODUCTS
  // =========================================================

  {
    name: 'Classic White Cotton T-Shirt',
    description: 'Premium cotton crew neck t-shirt for everyday casual wear.',
    category: 'Men',
    subCategory: 'T-Shirts',
    price: 599,
    originalPrice: 999,
    discount: 40,
    rating: 4.6,
    numReviews: 128,
    stock: 50,
    images: [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    isFeatured: true,
    isNewArrival: true
  },

  {
    name: 'Sky Blue Casual Shirt',
    description: 'Lightweight casual shirt with a relaxed modern fit.',
    category: 'Men',
    subCategory: 'Shirts',
    price: 999,
    originalPrice: 1599,
    discount: 38,
    rating: 4.5,
    numReviews: 96,
    stock: 45,
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    isFeatured: true,
    isNewArrival: true
  },

  {
    name: 'Slim Fit Blue Jeans',
    description: 'Stretch denim jeans with a comfortable slim fit.',
    category: 'Men',
    subCategory: 'Jeans',
    price: 1699,
    originalPrice: 2499,
    discount: 32,
    rating: 4.7,
    numReviews: 214,
    stock: 60,
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800'
    ],
    sizes: ['28', '30', '32', '34', '36'],
    isFeatured: true,
    isNewArrival: false
  },

  {
    name: 'Black Oversized Hoodie',
    description: 'Warm fleece hoodie with a stylish oversized silhouette.',
    category: 'Men',
    subCategory: 'Hoodies',
    price: 1399,
    originalPrice: 2199,
    discount: 36,
    rating: 4.8,
    numReviews: 187,
    stock: 42,
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    isFeatured: true,
    isNewArrival: true
  },

  {
    name: 'Classic Bomber Jacket',
    description: 'Modern lightweight bomber jacket for everyday street style.',
    category: 'Men',
    subCategory: 'Jackets',
    price: 2499,
    originalPrice: 3499,
    discount: 29,
    rating: 4.5,
    numReviews: 72,
    stock: 28,
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800'
    ],
    sizes: ['M', 'L', 'XL'],
    isFeatured: true,
    isNewArrival: true
  },

  {
    name: 'Beige Chino Trousers',
    description: 'Smart casual chino trousers with a tapered comfortable fit.',
    category: 'Men',
    subCategory: 'Trousers',
    price: 1299,
    originalPrice: 1899,
    discount: 32,
    rating: 4.4,
    numReviews: 68,
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800'
    ],
    sizes: ['30', '32', '34', '36'],
    isFeatured: false,
    isNewArrival: false
  },

  {
    name: 'Premium Black Polo',
    description: 'Clean premium polo shirt for smart casual occasions.',
    category: 'Men',
    subCategory: 'T-Shirts',
    price: 799,
    originalPrice: 1199,
    discount: 33,
    rating: 4.5,
    numReviews: 115,
    stock: 48,
    images: [
      'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    isFeatured: false,
    isNewArrival: true
  },

  {
    name: 'White Linen Shirt',
    description: 'Breathable linen shirt designed for a refined summer look.',
    category: 'Men',
    subCategory: 'Shirts',
    price: 1499,
    originalPrice: 2199,
    discount: 32,
    rating: 4.7,
    numReviews: 89,
    stock: 32,
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    isFeatured: true,
    isNewArrival: true
  },

  {
    name: 'Dark Wash Denim',
    description: 'Classic dark wash jeans with a modern comfortable cut.',
    category: 'Men',
    subCategory: 'Jeans',
    price: 1799,
    originalPrice: 2699,
    discount: 33,
    rating: 4.6,
    numReviews: 143,
    stock: 45,
    images: [
      'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=800'
    ],
    sizes: ['28', '30', '32', '34', '36'],
    isFeatured: false,
    isNewArrival: false
  },

  {
    name: 'Grey Essential Sweatshirt',
    description: 'Soft cotton sweatshirt perfect for everyday layering.',
    category: 'Men',
    subCategory: 'Hoodies',
    price: 1199,
    originalPrice: 1799,
    discount: 33,
    rating: 4.5,
    numReviews: 104,
    stock: 40,
    images: [
      'https://images.unsplash.com/photo-1578681994506-b8f463449011?w=800'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    isFeatured: false,
    isNewArrival: true
  },

  {
    name: 'Leather Style Jacket',
    description: 'Statement jacket with a sleek contemporary finish.',
    category: 'Men',
    subCategory: 'Jackets',
    price: 2999,
    originalPrice: 4299,
    discount: 30,
    rating: 4.6,
    numReviews: 76,
    stock: 20,
    images: [
      'https://images.unsplash.com/photo-1520975958225-9c8b1c9a5d6c?w=800'
    ],
    sizes: ['M', 'L', 'XL'],
    isFeatured: true,
    isNewArrival: false
  },

  {
    name: 'Relaxed Fit Cargo Pants',
    description: 'Functional cargo pants with a relaxed modern silhouette.',
    category: 'Men',
    subCategory: 'Trousers',
    price: 1599,
    originalPrice: 2299,
    discount: 30,
    rating: 4.4,
    numReviews: 91,
    stock: 38,
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800'
    ],
    sizes: ['30', '32', '34', '36'],
    isFeatured: false,
    isNewArrival: true
  },

  {
    name: 'Navy Blue Polo Shirt',
    description: 'Classic navy polo made from breathable cotton fabric.',
    category: 'Men',
    subCategory: 'T-Shirts',
    price: 749,
    originalPrice: 1099,
    discount: 32,
    rating: 4.3,
    numReviews: 57,
    stock: 44,
    images: [
      'https://images.unsplash.com/photo-1625910513413-5fc45a5b0a65?w=800'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    isFeatured: false,
    isNewArrival: false
  },

  {
    name: 'Checked Formal Shirt',
    description: 'Smart checked shirt suitable for office and semi-formal occasions.',
    category: 'Men',
    subCategory: 'Shirts',
    price: 1199,
    originalPrice: 1799,
    discount: 33,
    rating: 4.5,
    numReviews: 83,
    stock: 36,
    images: [
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=800'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    isFeatured: false,
    isNewArrival: true
  },

  {
    name: 'Straight Fit Black Trousers',
    description: 'Minimal black trousers designed for formal and smart casual wear.',
    category: 'Men',
    subCategory: 'Trousers',
    price: 1399,
    originalPrice: 1999,
    discount: 30,
    rating: 4.5,
    numReviews: 71,
    stock: 40,
    images: [
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800'
    ],
    sizes: ['30', '32', '34', '36'],
    isFeatured: true,
    isNewArrival: false
  },


  // =========================================================
  // WOMEN - 15 PRODUCTS
  // =========================================================

  {
    name: 'Floral Summer Dress',
    description: 'Elegant floral dress with a soft feminine silhouette.',
    category: 'Women',
    subCategory: 'Dresses',
    price: 1899,
    originalPrice: 2799,
    discount: 32,
    rating: 4.8,
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
    name: 'Elegant White Top',
    description: 'Minimal everyday top with a clean modern design.',
    category: 'Women',
    subCategory: 'Tops',
    price: 799,
    originalPrice: 1199,
    discount: 33,
    rating: 4.5,
    numReviews: 94,
    stock: 52,
    images: [
      'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=800'
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    isFeatured: false,
    isNewArrival: true
  },

  {
    name: 'High Waist Blue Jeans',
    description: 'Stretch denim jeans with a flattering high waist fit.',
    category: 'Women',
    subCategory: 'Jeans',
    price: 1699,
    originalPrice: 2399,
    discount: 29,
    rating: 4.7,
    numReviews: 210,
    stock: 50,
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800'
    ],
    sizes: ['26', '28', '30', '32', '34'],
    isFeatured: true,
    isNewArrival: false
  },

  {
    name: 'Embroidered Cotton Kurti',
    description: 'Beautiful cotton kurti with elegant embroidery details.',
    category: 'Women',
    subCategory: 'Kurtis',
    price: 999,
    originalPrice: 1499,
    discount: 33,
    rating: 4.6,
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
    description: 'Timeless denim jacket for casual everyday outfits.',
    category: 'Women',
    subCategory: 'Jackets',
    price: 1999,
    originalPrice: 2799,
    discount: 29,
    rating: 4.6,
    numReviews: 88,
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=800'
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
    rating: 4.4,
    numReviews: 67,
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
    description: 'Premium satin dress for parties and special occasions.',
    category: 'Women',
    subCategory: 'Dresses',
    price: 2299,
    originalPrice: 3299,
    discount: 30,
    rating: 4.9,
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
    name: 'Casual Beige Blouse',
    description: 'Lightweight blouse designed for comfortable everyday styling.',
    category: 'Women',
    subCategory: 'Tops',
    price: 899,
    originalPrice: 1299,
    discount: 31,
    rating: 4.4,
    numReviews: 74,
    stock: 46,
    images: [
      'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800'
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
    rating: 4.6,
    numReviews: 103,
    stock: 42,
    images: [
      'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=800'
    ],
    sizes: ['26', '28', '30', '32', '34'],
    isFeatured: false,
    isNewArrival: true
  },

  {
    name: 'Printed Summer Kurti',
    description: 'Breathable printed kurti for stylish summer outfits.',
    category: 'Women',
    subCategory: 'Kurtis',
    price: 1099,
    originalPrice: 1599,
    discount: 31,
    rating: 4.6,
    numReviews: 121,
    stock: 52,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    isFeatured: true,
    isNewArrival: false
  },

  {
    name: 'Elegant Black Skirt',
    description: 'Versatile black skirt for casual and formal styling.',
    category: 'Women',
    subCategory: 'Skirts',
    price: 999,
    originalPrice: 1499,
    discount: 33,
    rating: 4.3,
    numReviews: 59,
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800'
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    isFeatured: false,
    isNewArrival: false
  },

  {
    name: 'Floral Midi Dress',
    description: 'Feminine floral midi dress with a comfortable fit.',
    category: 'Women',
    subCategory: 'Dresses',
    price: 1599,
    originalPrice: 2299,
    discount: 30,
    rating: 4.7,
    numReviews: 148,
    stock: 37,
    images: [
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    isFeatured: true,
    isNewArrival: true
  },

  {
    name: 'Soft Knit Cardigan',
    description: 'Cozy knit cardigan for fashionable layering.',
    category: 'Women',
    subCategory: 'Tops',
    price: 1399,
    originalPrice: 1999,
    discount: 30,
    rating: 4.5,
    numReviews: 82,
    stock: 32,
    images: [
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    isFeatured: false,
    isNewArrival: true
  },

  {
    name: 'Elegant Party Blazer',
    description: 'Structured blazer designed to elevate evening outfits.',
    category: 'Women',
    subCategory: 'Jackets',
    price: 2199,
    originalPrice: 3199,
    discount: 31,
    rating: 4.6,
    numReviews: 63,
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=800'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    isFeatured: true,
    isNewArrival: true
  },

  {
    name: 'Minimal Cotton Shirt',
    description: 'Relaxed cotton shirt for effortless everyday looks.',
    category: 'Women',
    subCategory: 'Tops',
    price: 1099,
    originalPrice: 1599,
    discount: 31,
    rating: 4.5,
    numReviews: 78,
    stock: 40,
    images: [
      'https://images.unsplash.com/photo-1551489186-cf8726f514f8?w=800'
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    isFeatured: false,
    isNewArrival: true
  },


  // =========================================================
  // KIDS - 15 PRODUCTS
  // =========================================================

  {
    name: 'Kids Colorful T-Shirt',
    description: 'Soft cotton t-shirt with a fun colorful design.',
    category: 'Kids',
    subCategory: 'T-Shirts',
    price: 449,
    originalPrice: 699,
    discount: 36,
    rating: 4.6,
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
    name: 'Kids Party Frock',
    description: 'Cute party frock for birthdays and celebrations.',
    category: 'Kids',
    subCategory: 'Dresses',
    price: 999,
    originalPrice: 1499,
    discount: 33,
    rating: 4.7,
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
    name: 'Kids Denim Jeans',
    description: 'Durable stretch denim jeans for active children.',
    category: 'Kids',
    subCategory: 'Jeans',
    price: 799,
    originalPrice: 1199,
    discount: 33,
    rating: 4.4,
    numReviews: 58,
    stock: 40,
    images: [
      'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800'
    ],
    sizes: ['4-5Y', '6-7Y', '8-9Y', '10-11Y'],
    isFeatured: false,
    isNewArrival: false
  },

  {
    name: 'Kids Cozy Hoodie',
    description: 'Warm fleece hoodie for chilly days.',
    category: 'Kids',
    subCategory: 'Hoodies',
    price: 899,
    originalPrice: 1299,
    discount: 31,
    rating: 4.5,
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
    description: 'Comfortable two-piece outfit for playtime and outings.',
    category: 'Kids',
    subCategory: 'Casual Wear',
    price: 1099,
    originalPrice: 1599,
    discount: 31,
    rating: 4.5,
    numReviews: 41,
    stock: 28,
    images: [
      'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800'
    ],
    sizes: ['2-3Y', '4-5Y', '6-7Y'],
    isFeatured: false,
    isNewArrival: false
  },

  {
    name: 'Kids Cotton Polo',
    description: 'Classic cotton polo with a smart casual look.',
    category: 'Kids',
    subCategory: 'T-Shirts',
    price: 599,
    originalPrice: 899,
    discount: 33,
    rating: 4.4,
    numReviews: 67,
    stock: 48,
    images: [
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800'
    ],
    sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y'],
    isFeatured: false,
    isNewArrival: true
  },

  {
    name: 'Kids Summer Dress',
    description: 'Lightweight colorful dress made for summer days.',
    category: 'Kids',
    subCategory: 'Dresses',
    price: 799,
    originalPrice: 1199,
    discount: 33,
    rating: 4.6,
    numReviews: 84,
    stock: 36,
    images: [
      'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800'
    ],
    sizes: ['2-3Y', '4-5Y', '6-7Y'],
    isFeatured: true,
    isNewArrival: true
  },

  {
    name: 'Kids Jogger Pants',
    description: 'Soft stretch joggers for school, play and travel.',
    category: 'Kids',
    subCategory: 'Trousers',
    price: 699,
    originalPrice: 999,
    discount: 30,
    rating: 4.3,
    numReviews: 72,
    stock: 45,
    images: [
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800'
    ],
    sizes: ['4-5Y', '6-7Y', '8-9Y', '10-11Y'],
    isFeatured: false,
    isNewArrival: false
  },

  {
    name: 'Kids Printed Sweatshirt',
    description: 'Soft sweatshirt with a fun winter print.',
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
    description: 'Lightweight denim jacket with a classic design.',
    category: 'Kids',
    subCategory: 'Jackets',
    price: 1199,
    originalPrice: 1699,
    discount: 29,
    rating: 4.5,
    numReviews: 48,
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800'
    ],
    sizes: ['4-5Y', '6-7Y', '8-9Y', '10-11Y'],
    isFeatured: false,
    isNewArrival: true
  },

  {
    name: 'Kids Festive Kurta Set',
    description: 'Traditional kurta set designed for festive celebrations.',
    category: 'Kids',
    subCategory: 'Ethnic Wear',
    price: 1299,
    originalPrice: 1899,
    discount: 32,
    rating: 4.7,
    numReviews: 93,
    stock: 27,
    images: [
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800'
    ],
    sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y'],
    isFeatured: true,
    isNewArrival: true
  },

  {
    name: 'Kids Rainbow T-Shirt',
    description: 'Bright breathable cotton t-shirt for everyday play.',
    category: 'Kids',
    subCategory: 'T-Shirts',
    price: 399,
    originalPrice: 599,
    discount: 33,
    rating: 4.5,
    numReviews: 105,
    stock: 65,
    images: [
      'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800'
    ],
    sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y'],
    isFeatured: false,
    isNewArrival: true
  },

  {
    name: 'Kids Checked Shirt',
    description: 'Smart casual checked shirt for children.',
    category: 'Kids',
    subCategory: 'Shirts',
    price: 699,
    originalPrice: 999,
    discount: 30,
    rating: 4.4,
    numReviews: 54,
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800'
    ],
    sizes: ['4-5Y', '6-7Y', '8-9Y', '10-11Y'],
    isFeatured: false,
    isNewArrival: true
  },

  {
    name: 'Kids Warm Winter Jacket',
    description: 'Comfortable warm jacket for cold weather adventures.',
    category: 'Kids',
    subCategory: 'Jackets',
    price: 1499,
    originalPrice: 2199,
    discount: 32,
    rating: 4.7,
    numReviews: 69,
    stock: 24,
    images: [
      'https://images.unsplash.com/photo-1519278409-1f56fdda7485?w=800'
    ],
    sizes: ['4-5Y', '6-7Y', '8-9Y', '10-11Y'],
    isFeatured: true,
    isNewArrival: true
  },

  {
    name: 'Kids Soft Cotton Shorts',
    description: 'Comfortable cotton shorts for summer and playtime.',
    category: 'Kids',
    subCategory: 'Trousers',
    price: 499,
    originalPrice: 749,
    discount: 33,
    rating: 4.3,
    numReviews: 46,
    stock: 50,
    images: [
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800'
    ],
    sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y'],
    isFeatured: false,
    isNewArrival: false
  },


  // =========================================================
  // INFANTS - 15 PRODUCTS
  // =========================================================

  {
    name: 'Infant Cotton Romper',
    description: 'Ultra-soft cotton romper with convenient snap buttons.',
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
    description: 'Soft cotton bodysuits designed for everyday baby comfort.',
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
    description: 'Cute lightweight cotton dress for warm sunny days.',
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
    name: 'Baby Sleepwear Set',
    description: 'Soft two-piece sleepwear set for peaceful nights.',
    category: 'Infants',
    subCategory: 'Sleepwear',
    price: 549,
    originalPrice: 799,
    discount: 31,
    rating: 4.5,
    numReviews: 54,
    stock: 42,
    images: [
      'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=800'
    ],
    sizes: ['0-3M', '3-6M', '6-9M', '9-12M'],
    isFeatured: false,
    isNewArrival: false
  },

  {
    name: 'Infant Dungaree Set',
    description: 'Adorable dungaree outfit made from soft baby-friendly fabric.',
    category: 'Infants',
    subCategory: 'Sets',
    price: 649,
    originalPrice: 949,
    discount: 32,
    rating: 4.4,
    numReviews: 38,
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800'
    ],
    sizes: ['3-6M', '6-9M', '9-12M'],
    isFeatured: false,
    isNewArrival: false
  },

  {
    name: 'Newborn Welcome Home Set',
    description: 'Gentle newborn outfit set for the first precious days.',
    category: 'Infants',
    subCategory: 'Baby Sets',
    price: 799,
    originalPrice: 1199,
    discount: 33,
    rating: 4.9,
    numReviews: 29,
    stock: 20,
    images: [
      'https://images.unsplash.com/photo-1544126592-807ade215a0b?w=800'
    ],
    sizes: ['0-3M'],
    isFeatured: true,
    isNewArrival: true
  },

  {
    name: 'Baby Cotton T-Shirt Set',
    description: 'Comfortable cotton t-shirt set for babies.',
    category: 'Infants',
    subCategory: 'T-Shirts',
    price: 499,
    originalPrice: 749,
    discount: 33,
    rating: 4.5,
    numReviews: 71,
    stock: 48,
    images: [
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800'
    ],
    sizes: ['6-9M', '9-12M', '12-18M'],
    isFeatured: false,
    isNewArrival: true
  },

  {
    name: 'Baby Cozy Winter Set',
    description: 'Warm soft clothing set for chilly days.',
    category: 'Infants',
    subCategory: 'Baby Sets',
    price: 899,
    originalPrice: 1299,
    discount: 31,
    rating: 4.7,
    numReviews: 83,
    stock: 32,
    images: [
      'https://images.unsplash.com/photo-1596870230751-ebdfce98ec42?w=800'
    ],
    sizes: ['3-6M', '6-9M', '9-12M'],
    isFeatured: true,
    isNewArrival: true
  },

  {
    name: 'Baby Printed Romper',
    description: 'Soft printed romper with easy snap closure.',
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
    description: 'Sweet festive dress for special baby occasions.',
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
    name: 'Baby Cotton Jumpsuit',
    description: 'One-piece cotton jumpsuit designed for comfort.',
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
    description: 'Complete everyday outfit made with soft baby-friendly fabric.',
    category: 'Infants',
    subCategory: 'Baby Sets',
    price: 849,
    originalPrice: 1199,
    discount: 29,
    rating: 4.8,
    numReviews: 89,
    stock: 31,
    images: [
      'https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=800'
    ],
    sizes: ['0-3M', '3-6M', '6-9M'],
    isFeatured: true,
    isNewArrival: true
  },

  {
    name: 'Baby Soft Sleepsuit',
    description: 'Soft full-length sleepsuit for comfortable nighttime sleep.',
    category: 'Infants',
    subCategory: 'Sleepwear',
    price: 599,
    originalPrice: 899,
    discount: 33,
    rating: 4.6,
    numReviews: 71,
    stock: 45,
    images: [
      'https://images.unsplash.com/photo-1544126592-807ade215a0b?w=800'
    ],
    sizes: ['0-3M', '3-6M', '6-9M'],
    isFeatured: false,
    isNewArrival: true
  },

  {
    name: 'Baby Summer Romper Set',
    description: 'Lightweight romper set perfect for warm weather.',
    category: 'Infants',
    subCategory: 'Rompers',
    price: 649,
    originalPrice: 949,
    discount: 32,
    rating: 4.7,
    numReviews: 83,
    stock: 40,
    images: [
      'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800'
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