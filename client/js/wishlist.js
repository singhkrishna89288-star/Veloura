/* =====================================================
   VELOURA — wishlist.js
   localStorage-backed wishlist.
===================================================== */

const WISHLIST_KEY = 'veloura_wishlist';

const Wishlist = {
  getIds() {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  },
  saveIds(ids) {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids));
    updateWishlistBadge();
  },
  has(productId) {
    return this.getIds().includes(productId);
  },
  async toggle(productId) {
    const ids = this.getIds();
    const idx = ids.indexOf(productId);
    if (idx > -1) {
      ids.splice(idx, 1);
      showToast('Removed from wishlist.');
    } else {
      ids.push(productId);
      showToast('Added to wishlist.');
    }
    this.saveIds(ids);
    if (document.getElementById('page-wishlist') && !document.getElementById('page-wishlist').classList.contains('hidden')) {
      renderWishlistPage();
    }
  },
  remove(productId) {
    this.saveIds(this.getIds().filter((id) => id !== productId));
  },
  count() {
    return this.getIds().length;
  },
};

function updateWishlistBadge() {
  const badge = document.getElementById('wishlistCount');
  if (badge) badge.textContent = Wishlist.count();
}

async function renderWishlistPage() {
  const grid = document.getElementById('wishlistGrid');
  const ids = Wishlist.getIds();

  if (ids.length === 0) {
    grid.innerHTML = `
      <div class="empty-wishlist">
        <h3>Your wishlist is empty</h3>
        <p>Save items you love so you can find them later.</p>
        <button class="btn btn-primary" data-page="shop" data-category="">Browse Products</button>
      </div>`;
    attachNavHandlers(grid);
    return;
  }

  grid.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:var(--ink-soft);">Loading wishlist...</p>`;

  try {
    const products = await Promise.all(ids.map((id) => fetchProductById(id).catch(() => null)));
    const validProducts = products.filter(Boolean);

    grid.innerHTML =
      validProducts
        .map(
          (p) => `
      <div class="product-card" data-id="${p._id}">
        <div class="product-thumb">
          <button class="wishlist-mini active" data-wishlist-remove="${p._id}" title="Remove from wishlist">♥</button>
          <img src="${p.images[0] || ''}" alt="${p.name}" />
        </div>
        <div class="product-info">
          <span class="product-cat">${p.category} · ${p.subCategory}</span>
          <span class="product-name">${p.name}</span>
          <div class="product-price-row">
            <span class="price-now">${formatPrice(p.price)}</span>
          </div>
          <button class="add-cart-mini" data-move-to-cart="${p._id}">Move to Cart</button>
        </div>
      </div>`
        )
        .join('') || `<div class="empty-state">No items found.</div>`;

    grid.querySelectorAll('.product-card').forEach((card) => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('[data-wishlist-remove]') || e.target.closest('[data-move-to-cart]')) return;
        navigateTo('product', { id: card.dataset.id });
      });
    });
    grid.querySelectorAll('[data-wishlist-remove]').forEach((btn) =>
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        Wishlist.remove(btn.dataset.wishlistRemove);
        renderWishlistPage();
      })
    );
    grid.querySelectorAll('[data-move-to-cart]').forEach((btn) =>
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        const product = await fetchProductById(btn.dataset.moveToCart);
        Cart.add(product, product.sizes && product.sizes[0] ? product.sizes[0] : '', 1);
        Wishlist.remove(product._id);
        showToast('Moved to cart.');
        renderWishlistPage();
      })
    );
  } catch (err) {
    grid.innerHTML = `<div class="empty-state">Could not load wishlist items.</div>`;
  }
}
