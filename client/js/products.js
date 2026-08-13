/* =====================================================
   VELOURA — products.js
   Product fetching, rendering (home, shop, details), filters,
   sorting, pagination, and admin product management.
===================================================== */

const CATEGORY_SUBCATEGORIES = {
  Men: ['T-Shirts', 'Shirts', 'Jeans', 'Hoodies', 'Jackets', 'Trousers'],
  Women: ['Dresses', 'Tops', 'Jeans', 'Kurtis', 'Jackets', 'Skirts'],
  Kids: ['T-Shirts', 'Dresses', 'Jeans', 'Hoodies', 'Casual Wear'],
  Infants: ['Rompers', 'Bodysuits', 'Baby Dresses', 'Baby Sets', 'Infant Casual Wear'],
};

const CATEGORY_IMAGES = {
  Men: 'https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=600',
  Women: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600',
  Kids: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=600',
  Infants: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600',
};

const ShopState = {
  search: '',
  category: '',
  subCategory: '',
  minPrice: '',
  maxPrice: '',
  sortBy: '',
  order: '',
  page: 1,
  limit: 8,
  accumulatedProducts: [],
  totalPages: 1,
};

function formatPrice(n) {
  return `₹${Number(n).toLocaleString('en-IN')}`;
}

function productCardHTML(p) {
  const inWishlist = Wishlist.has(p._id);
  return `
    <div class="product-card" data-id="${p._id}">
      <div class="product-thumb">
        ${p.discount ? `<span class="discount-tag">${p.discount}% OFF</span>` : ''}
        <button class="wishlist-mini ${inWishlist ? 'active' : ''}" data-wishlist-toggle="${p._id}" title="Add to wishlist">${inWishlist ? '♥' : '♡'}</button>
        <img src="${p.images && p.images[0] ? p.images[0] : 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600'}" alt="${p.name}" loading="lazy" />
      </div>
      <div class="product-info">
        <span class="product-cat">${p.category} · ${p.subCategory}</span>
        <span class="product-name">${p.name}</span>
        <span class="product-rating">★ ${p.rating?.toFixed ? p.rating.toFixed(1) : p.rating} (${p.numReviews || 0})</span>
        <div class="product-price-row">
          <span class="price-now">${formatPrice(p.price)}</span>
          ${p.originalPrice > p.price ? `<span class="price-old">${formatPrice(p.originalPrice)}</span>` : ''}
        </div>
        <button class="add-cart-mini" data-quick-add="${p._id}">Add to Cart</button>
      </div>
    </div>
  `;
}

function attachProductCardEvents(container) {
  container.querySelectorAll('.product-card').forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('[data-wishlist-toggle]') || e.target.closest('[data-quick-add]')) return;
      navigateTo('product', { id: card.dataset.id });
    });
  });
  container.querySelectorAll('[data-wishlist-toggle]').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const id = btn.dataset.wishlistToggle;
      await Wishlist.toggle(id);
      btn.classList.toggle('active');
      btn.textContent = btn.classList.contains('active') ? '♥' : '♡';
    });
  });
  container.querySelectorAll('[data-quick-add]').forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const id = btn.dataset.quickAdd;
      const product = await fetchProductById(id);
      Cart.add(product, product.sizes && product.sizes[0] ? product.sizes[0] : '', 1);
      showToast('Added to cart.');
    });
  });
}

async function fetchProducts(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== '' && v !== null && v !== undefined) query.set(k, v);
  });
  const data = await apiRequest(`/products?${query.toString()}`);
  return data;
}

async function fetchProductById(id) {
  const data = await apiRequest(`/products/${id}`);
  return data.product;
}

/* -------- HOME PAGE RENDERING -------- */
async function renderHomePage() {
  const categoryGrid = document.getElementById('categoryGrid');
  categoryGrid.innerHTML = Object.keys(CATEGORY_SUBCATEGORIES)
    .map(
      (cat) => `
      <a href="#" class="category-card" style="background-image:url('${CATEGORY_IMAGES[cat]}')" data-page="shop" data-category="${cat}">
        <span>${cat}</span>
      </a>`
    )
    .join('');

  try {
    const trending = await fetchProducts({ sortBy: 'rating', order: 'desc', limit: 4 });
    document.getElementById('trendingGrid').innerHTML = trending.products.map(productCardHTML).join('') || emptyMsg();
    attachProductCardEvents(document.getElementById('trendingGrid'));

    const newArrivals = await fetchProducts({ limit: 4 });
    document.getElementById('newArrivalsGrid').innerHTML = newArrivals.products.map(productCardHTML).join('') || emptyMsg();
    attachProductCardEvents(document.getElementById('newArrivalsGrid'));
  } catch (err) {
    showToast('Could not load products. Is the backend server running?', true);
  }
}

function emptyMsg() {
  return `<div class="empty-state">No products found. Make sure you've run <code>npm run seed</code> and the server is connected to MongoDB.</div>`;
}

/* -------- SHOP PAGE RENDERING -------- */
function renderShopFilters() {
  const catBox = document.getElementById('filterCategory');
  catBox.innerHTML = Object.keys(CATEGORY_SUBCATEGORIES)
    .map(
      (cat) => `
      <label>
        <input type="radio" name="filterCat" value="${cat}" ${ShopState.category === cat ? 'checked' : ''} />
        ${cat}
      </label>`
    )
    .join('') + `<label><input type="radio" name="filterCat" value="" ${ShopState.category === '' ? 'checked' : ''} /> All Categories</label>`;

  const subBox = document.getElementById('filterSubcategory');
  const subs = ShopState.category ? CATEGORY_SUBCATEGORIES[ShopState.category] : Object.values(CATEGORY_SUBCATEGORIES).flat();
  const uniqueSubs = [...new Set(subs)];
  subBox.innerHTML =
    `<label><input type="radio" name="filterSub" value="" ${ShopState.subCategory === '' ? 'checked' : ''} /> All</label>` +
    uniqueSubs
      .map(
        (s) => `
      <label>
        <input type="radio" name="filterSub" value="${s}" ${ShopState.subCategory === s ? 'checked' : ''} />
        ${s}
      </label>`
      )
      .join('');

  catBox.querySelectorAll('input').forEach((input) =>
    input.addEventListener('change', () => {
      ShopState.category = input.value;
      ShopState.subCategory = '';
      ShopState.page = 1;
      ShopState.accumulatedProducts = [];
      renderShopFilters();
      loadShopProducts();
    })
  );
  subBox.querySelectorAll('input').forEach((input) =>
    input.addEventListener('change', () => {
      ShopState.subCategory = input.value;
      ShopState.page = 1;
      ShopState.accumulatedProducts = [];
      loadShopProducts();
    })
  );
}

async function loadShopProducts(append = false) {
  const grid = document.getElementById('shopGrid');
  const params = {
    search: ShopState.search,
    category: ShopState.category,
    subCategory: ShopState.subCategory,
    minPrice: ShopState.minPrice,
    maxPrice: ShopState.maxPrice,
    sortBy: ShopState.sortBy,
    order: ShopState.order,
    page: ShopState.page,
    limit: ShopState.limit,
  };

  try {
    const data = await fetchProducts(params);
    ShopState.totalPages = data.totalPages;
    ShopState.accumulatedProducts = append ? [...ShopState.accumulatedProducts, ...data.products] : data.products;

    grid.innerHTML = ShopState.accumulatedProducts.map(productCardHTML).join('') || `<div class="empty-state">No products match your filters. Try adjusting them.</div>`;
    attachProductCardEvents(grid);

    document.getElementById('shopResultCount').textContent = `${data.total} product${data.total === 1 ? '' : 's'} found`;

    const loadMoreBtn = document.getElementById('loadMoreBtn');
    loadMoreBtn.style.display = ShopState.page < ShopState.totalPages ? 'inline-flex' : 'none';

    document.getElementById('shopTitle').textContent = ShopState.category ? `Shop ${ShopState.category}` : 'Shop All';
  } catch (err) {
    grid.innerHTML = `<div class="empty-state">Could not load products. Is the backend server running and connected to MongoDB?</div>`;
  }
}

function initShopPageControls() {
  document.getElementById('sortSelect').addEventListener('change', (e) => {
    const [sortBy, order] = e.target.value ? e.target.value.split('-') : ['', ''];
    ShopState.sortBy = sortBy;
    ShopState.order = order;
    ShopState.page = 1;
    ShopState.accumulatedProducts = [];
    loadShopProducts();
  });

  document.getElementById('applyPriceBtn').addEventListener('click', () => {
    ShopState.minPrice = document.getElementById('minPriceInput').value;
    ShopState.maxPrice = document.getElementById('maxPriceInput').value;
    ShopState.page = 1;
    ShopState.accumulatedProducts = [];
    loadShopProducts();
  });

  document.getElementById('clearFiltersBtn').addEventListener('click', () => {
    ShopState.category = '';
    ShopState.subCategory = '';
    ShopState.minPrice = '';
    ShopState.maxPrice = '';
    ShopState.search = '';
    ShopState.page = 1;
    ShopState.accumulatedProducts = [];
    document.getElementById('minPriceInput').value = '';
    document.getElementById('maxPriceInput').value = '';
    document.getElementById('navSearchInput').value = '';
    renderShopFilters();
    loadShopProducts();
  });

  document.getElementById('loadMoreBtn').addEventListener('click', () => {
    ShopState.page += 1;
    loadShopProducts(true);
  });

  document.getElementById('mobileFilterToggle').addEventListener('click', () => {
    document.getElementById('filtersPanel').classList.toggle('mobile-open');
  });
}

function openShopPage(category = '', search = '') {
  ShopState.category = category;
  ShopState.subCategory = '';
  ShopState.search = search;
  ShopState.page = 1;
  ShopState.accumulatedProducts = [];
  renderShopFilters();
  loadShopProducts();
}

/* -------- PRODUCT DETAIL RENDERING -------- */
let currentDetailQty = 1;
let currentDetailSize = '';

async function renderProductDetail(id) {
  const container = document.getElementById('productDetailContent');
  container.innerHTML = `<p style="padding:60px 0;text-align:center;color:var(--ink-soft);">Loading product...</p>`;

  try {
    const product = await fetchProductById(id);
    currentDetailQty = 1;
    currentDetailSize = product.sizes && product.sizes[0] ? product.sizes[0] : '';

    container.innerHTML = `
      <div class="product-detail">
        <div class="pd-gallery">
          <img src="${product.images[0] || ''}" alt="${product.name}" />
        </div>
        <div class="pd-info">
          <span class="product-cat">${product.category} · ${product.subCategory}</span>
          <h1>${product.name}</h1>
          <div class="pd-rating">★ ${product.rating} <span>(${product.numReviews} reviews)</span></div>
          <div class="pd-price-row">
            <span class="price-now">${formatPrice(product.price)}</span>
            ${product.originalPrice > product.price ? `<span class="price-old">${formatPrice(product.originalPrice)}</span>` : ''}
            ${product.discount ? `<span class="discount-tag" style="position:static;">${product.discount}% OFF</span>` : ''}
          </div>
          <p class="pd-desc">${product.description}</p>

          <div class="pd-block">
            <h4>Select Size</h4>
            <div class="size-options" id="sizeOptions">
              ${(product.sizes || []).map((s) => `<button class="size-chip ${s === currentDetailSize ? 'selected' : ''}" data-size="${s}">${s}</button>`).join('') || '<span>One Size</span>'}
            </div>
          </div>

          <div class="pd-block">
            <h4>Quantity</h4>
            <div class="qty-row">
              <div class="qty-control">
                <button id="qtyMinus">−</button>
                <span id="qtyValue">1</span>
                <button id="qtyPlus">+</button>
              </div>
              <span class="stock-status ${product.stock > 0 ? 'in' : 'out'}">
                ${product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </span>
            </div>
          </div>

          <div class="pd-actions">
            <button class="btn btn-primary" id="pdAddToCart" ${product.stock === 0 ? 'disabled' : ''}>Add to Cart</button>
            <button class="btn btn-outline" id="pdAddToWishlist">${Wishlist.has(product._id) ? '♥ In Wishlist' : '♡ Add to Wishlist'}</button>
          </div>
        </div>
      </div>
    `;

    container.querySelectorAll('.size-chip').forEach((chip) =>
      chip.addEventListener('click', () => {
        currentDetailSize = chip.dataset.size;
        container.querySelectorAll('.size-chip').forEach((c) => c.classList.remove('selected'));
        chip.classList.add('selected');
      })
    );

    document.getElementById('qtyMinus').addEventListener('click', () => {
      currentDetailQty = Math.max(1, currentDetailQty - 1);
      document.getElementById('qtyValue').textContent = currentDetailQty;
    });
    document.getElementById('qtyPlus').addEventListener('click', () => {
      currentDetailQty = Math.min(product.stock || 99, currentDetailQty + 1);
      document.getElementById('qtyValue').textContent = currentDetailQty;
    });

    document.getElementById('pdAddToCart').addEventListener('click', () => {
      Cart.add(product, currentDetailSize, currentDetailQty);
      showToast('Added to cart.');
    });

    document.getElementById('pdAddToWishlist').addEventListener('click', async (e) => {
      await Wishlist.toggle(product._id);
      e.target.textContent = Wishlist.has(product._id) ? '♥ In Wishlist' : '♡ Add to Wishlist';
    });

    // Related products
    const related = await fetchProducts({ category: product.category, limit: 4 });
    const relatedGrid = document.getElementById('relatedGrid');
    relatedGrid.innerHTML = related.products.filter((p) => p._id !== product._id).map(productCardHTML).join('') || emptyMsg();
    attachProductCardEvents(relatedGrid);
  } catch (err) {
    container.innerHTML = `<div class="empty-state">Product not found or the server is unreachable.</div>`;
  }
}

/* -------- SEARCH -------- */
function initSearch() {
  const doSearch = () => {
    const val = document.getElementById('navSearchInput').value.trim();
    navigateTo('shop', { search: val });
  };
  document.getElementById('navSearchBtn').addEventListener('click', doSearch);
  document.getElementById('navSearchInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') doSearch();
  });
}
