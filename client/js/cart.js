/* =====================================================
   VELOURA — cart.js
   localStorage-backed shopping cart.
===================================================== */

const CART_KEY = 'veloura_cart';
const DELIVERY_CHARGE = 79;
const FREE_DELIVERY_THRESHOLD = 1999;

const Cart = {
  getItems() {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  },
  saveItems(items) {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
    updateCartBadge();
  },
  add(product, size, quantity) {
    const items = this.getItems();
    const existing = items.find((i) => i.productId === product._id && i.size === size);
    if (existing) {
      existing.quantity += quantity;
    } else {
      items.push({
        productId: product._id,
        name: product.name,
        image: product.images && product.images[0],
        price: product.price,
        originalPrice: product.originalPrice,
        size,
        quantity,
        stock: product.stock,
      });
    }
    this.saveItems(items);
  },
  updateQuantity(productId, size, delta) {
    const items = this.getItems();
    const item = items.find((i) => i.productId === productId && i.size === size);
    if (!item) return;
    item.quantity = Math.max(1, item.quantity + delta);
    this.saveItems(items);
    renderCartPage();
  },
  remove(productId, size) {
    const items = this.getItems().filter((i) => !(i.productId === productId && i.size === size));
    this.saveItems(items);
    renderCartPage();
  },
  clear() {
    this.saveItems([]);
  },
  count() {
    return this.getItems().reduce((sum, i) => sum + i.quantity, 0);
  },
  subtotal() {
    return this.getItems().reduce((sum, i) => sum + i.price * i.quantity, 0);
  },
  discount() {
    return this.getItems().reduce((sum, i) => sum + Math.max(0, (i.originalPrice - i.price)) * i.quantity, 0);
  },
  deliveryCharge() {
    const sub = this.subtotal();
    if (sub === 0) return 0;
    return sub >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
  },
  total() {
    return this.subtotal() + this.deliveryCharge();
  },
};

function updateCartBadge() {
  const badge = document.getElementById('cartCount');
  if (badge) badge.textContent = Cart.count();
}

function renderCartPage() {
  const layout = document.getElementById('cartLayout');
  const items = Cart.getItems();

  if (items.length === 0) {
    layout.innerHTML = `
      <div class="empty-cart">
        <h3>Your cart is empty</h3>
        <p>Looks like you haven't added anything yet.</p>
        <button class="btn btn-primary" data-page="shop" data-category="">Start Shopping</button>
      </div>`;
    attachNavHandlers(layout);
    return;
  }

  const itemsHTML = items
    .map(
      (i) => `
    <div class="cart-item">
      <img src="${i.image || ''}" alt="${i.name}" />
      <div class="cart-item-info">
        <h4>${i.name}</h4>
        <p>Size: ${i.size || 'One Size'}</p>
        <p>${formatPrice(i.price)} × ${i.quantity}</p>
        <div class="qty-control">
          <button data-qty-minus="${i.productId}" data-size="${i.size}">−</button>
          <span>${i.quantity}</span>
          <button data-qty-plus="${i.productId}" data-size="${i.size}">+</button>
        </div>
      </div>
      <div class="cart-item-actions">
        <strong>${formatPrice(i.price * i.quantity)}</strong>
        <button class="remove-btn" data-remove="${i.productId}" data-size="${i.size}">Remove</button>
      </div>
    </div>`
    )
    .join('');

  layout.innerHTML = `
    <div class="cart-items">${itemsHTML}</div>
    <div class="summary-box">
      <h3>Order Summary</h3>
      <div class="summary-row"><span>Subtotal</span><span>${formatPrice(Cart.subtotal())}</span></div>
      <div class="summary-row"><span>Discount</span><span>−${formatPrice(Cart.discount())}</span></div>
      <div class="summary-row"><span>Delivery</span><span>${Cart.deliveryCharge() === 0 ? 'Free' : formatPrice(Cart.deliveryCharge())}</span></div>
      <div class="summary-row total"><span>Total</span><span>${formatPrice(Cart.total())}</span></div>
      <button class="btn btn-primary" id="checkoutBtn">Proceed to Checkout</button>
    </div>
  `;

  layout.querySelectorAll('[data-qty-minus]').forEach((btn) =>
    btn.addEventListener('click', () => Cart.updateQuantity(btn.dataset.qtyMinus, btn.dataset.size, -1))
  );
  layout.querySelectorAll('[data-qty-plus]').forEach((btn) =>
    btn.addEventListener('click', () => Cart.updateQuantity(btn.dataset.qtyPlus, btn.dataset.size, 1))
  );
  layout.querySelectorAll('[data-remove]').forEach((btn) =>
    btn.addEventListener('click', () => Cart.remove(btn.dataset.remove, btn.dataset.size))
  );

  document.getElementById('checkoutBtn').addEventListener('click', () => {
    if (!Auth.isLoggedIn()) {
      showToast('Please login to proceed to checkout.', true);
      navigateTo('login');
      return;
    }
    navigateTo('checkout');
  });
}
