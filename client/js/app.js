/* =====================================================
   VELOURA — app.js
   Page routing, navbar interactions, account/admin panel,
   toast notifications, and app initialization.
===================================================== */

const PAGES = ['home', 'shop', 'product', 'cart', 'wishlist', 'login', 'register', 'account', 'checkout', 'about', 'contact'];

function showToast(message, isError = false) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.style.background = isError ? '#b23a3a' : '#1b1b1f';
  toast.classList.add('show');
  clearTimeout(window.__toastTimeout);
  window.__toastTimeout = setTimeout(() => toast.classList.remove('show'), 2600);
}

function navigateTo(page, params = {}) {
  if (!PAGES.includes(page)) page = 'home';

  // Guard: account/checkout require login
  if ((page === 'account' || page === 'checkout') && !Auth.isLoggedIn()) {
    showToast('Please login to continue.', true);
    page = 'login';
  }

  PAGES.forEach((p) => {
    const el = document.getElementById(`page-${p}`);
    if (el) el.classList.toggle('hidden', p !== page);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
  closeMobileNav();

  if (page === 'home') renderHomePage();
  if (page === 'shop') openShopPage(params.category || '', params.search || '');
  if (page === 'product' && params.id) renderProductDetail(params.id);
  if (page === 'cart') renderCartPage();
  if (page === 'wishlist') renderWishlistPage();
  if (page === 'account') renderAccountPage(params.tab || 'profile');
  if (page === 'checkout') renderCheckoutPage();

  window.__currentPage = page;
}

function closeMobileNav() {
  document.getElementById('navLinks').classList.remove('open');
}

/* -------- Global nav-link click delegation -------- */
function attachNavHandlers(root = document) {
  root.querySelectorAll('[data-page]').forEach((el) => {
    if (el.__navBound) return;
    el.__navBound = true;
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const page = el.dataset.page;
      const category = el.dataset.category;
      navigateTo(page, category !== undefined ? { category } : {});
    });
  });
}

document.addEventListener('click', (e) => {
  const target = e.target.closest('[data-page]');
  if (target) {
    e.preventDefault();
    navigateTo(target.dataset.page, target.dataset.category !== undefined ? { category: target.dataset.category } : {});
  }
});

/* -------- Navbar: hamburger, account button, explore button -------- */
document.getElementById('hamburgerBtn').addEventListener('click', () => {
  document.getElementById('navLinks').classList.toggle('open');
});

document.getElementById('accountBtn').addEventListener('click', () => {
  navigateTo(Auth.isLoggedIn() ? 'account' : 'login');
});

document.getElementById('exploreBtn').addEventListener('click', () => {
  document.getElementById('categorySection').scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('newsletterForm').addEventListener('submit', (e) => {
  e.preventDefault();
  e.target.reset();
  showToast('Thanks for subscribing to Veloura!');
});

document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  e.target.reset();
  showToast('Message sent! We will get back to you soon.');
});

document.getElementById('logoutBtn').addEventListener('click', logoutUser);

/* =====================================================
   ACCOUNT PAGE
===================================================== */
async function renderAccountPage(tab = 'profile') {
  document.querySelectorAll('.account-tab').forEach((t) => t.classList.toggle('active', t.dataset.tab === tab));
  const content = document.getElementById('accountContent');
  content.innerHTML = `<p style="color:var(--ink-soft);">Loading...</p>`;

  if (tab === 'profile') return renderProfileTab(content);
  if (tab === 'orders') return renderOrdersTab(content);
  if (tab === 'wishlist') return renderAccountWishlistTab(content);
  if (tab === 'admin') return renderAdminTab(content);
}

document.querySelectorAll('.account-tab[data-tab]').forEach((btn) => {
  btn.addEventListener('click', () => renderAccountPage(btn.dataset.tab));
});

async function renderProfileTab(content) {
  try {
    const data = await fetchProfile();
    const user = data.user;
    content.innerHTML = `
      <h2>My Profile</h2>
      <div class="profile-row"><span>Full Name</span><strong>${user.fullName}</strong></div>
      <div class="profile-row"><span>Email</span><strong>${user.email}</strong></div>
      <div class="profile-row"><span>Role</span><strong>${user.role === 'admin' ? 'Administrator' : 'Customer'}</strong></div>
      <div class="profile-row"><span>Member Since</span><strong>${new Date(user.createdAt).toLocaleDateString()}</strong></div>
    `;
  } catch (err) {
    content.innerHTML = `<p>Could not load profile. ${err.message}</p>`;
  }
}

async function renderOrdersTab(content) {
  try {
    const data = await apiRequest('/orders');
    if (data.orders.length === 0) {
      content.innerHTML = `<h2>My Orders</h2><p style="color:var(--ink-soft);">You haven't placed any orders yet.</p>`;
      return;
    }
    content.innerHTML =
      `<h2>My Orders</h2>` +
      data.orders
        .map(
          (o) => `
      <div class="order-card">
        <div class="order-card-head">
          <span>Order #${o._id.slice(-8).toUpperCase()} · ${new Date(o.createdAt).toLocaleDateString()}</span>
          <span class="status-pill">${o.orderStatus}</span>
        </div>
        <p style="font-size:0.85rem;color:var(--ink-soft);margin:4px 0;">${o.products.map((p) => `${p.name} × ${p.quantity}`).join(', ')}</p>
        <p style="font-size:0.85rem;">Payment: ${o.paymentMethod} (${o.paymentStatus}) · Total: <strong>${formatPrice(o.totalAmount)}</strong></p>
      </div>`
        )
        .join('');
  } catch (err) {
    content.innerHTML = `<p>Could not load orders. ${err.message}</p>`;
  }
}

async function renderAccountWishlistTab(content) {
  const ids = Wishlist.getIds();
  if (ids.length === 0) {
    content.innerHTML = `<h2>Wishlist</h2><p style="color:var(--ink-soft);">Your wishlist is empty.</p>`;
    return;
  }
  content.innerHTML = `<h2>Wishlist</h2><p style="color:var(--ink-soft);">You have ${ids.length} item(s) saved.</p><button class="btn btn-outline" data-page="wishlist">View Full Wishlist</button>`;
  attachNavHandlers(content);
}

/* =====================================================
   ADMIN PANEL
===================================================== */
let adminActiveSubtab = 'products';

async function renderAdminTab(content) {
  if (!Auth.isAdmin()) {
    content.innerHTML = `<p>You do not have access to the admin panel.</p>`;
    return;
  }

  content.innerHTML = `
    <h2>Admin Dashboard</h2>
    <div class="admin-tabs">
      <button class="admin-subtab ${adminActiveSubtab === 'products' ? 'active' : ''}" data-admin-tab="products">Products</button>
      <button class="admin-subtab ${adminActiveSubtab === 'orders' ? 'active' : ''}" data-admin-tab="orders">Orders</button>
      <button class="admin-subtab ${adminActiveSubtab === 'users' ? 'active' : ''}" data-admin-tab="users">Users</button>
    </div>
    <div id="adminSubcontent">Loading...</div>
  `;

  content.querySelectorAll('[data-admin-tab]').forEach((btn) =>
    btn.addEventListener('click', () => {
      adminActiveSubtab = btn.dataset.adminTab;
      renderAdminTab(content);
    })
  );

  const sub = document.getElementById('adminSubcontent');
  if (adminActiveSubtab === 'products') renderAdminProducts(sub);
  if (adminActiveSubtab === 'orders') renderAdminOrders(sub);
  if (adminActiveSubtab === 'users') renderAdminUsers(sub);
}

async function renderAdminProducts(sub) {
  try {
    const data = await fetchProducts({ limit: 100 });
    sub.innerHTML = `
      <div class="admin-actions-row">
        <h3 style="margin:0;">All Products (${data.total})</h3>
        <button class="btn btn-primary btn-sm" id="showAddProductForm">+ Add Product</button>
      </div>
      <div id="adminProductForm"></div>
      <table class="admin-table">
        <thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
        <tbody>
          ${data.products
            .map(
              (p) => `
            <tr>
              <td>${p.name}</td>
              <td>${p.category} / ${p.subCategory}</td>
              <td>${formatPrice(p.price)}</td>
              <td>${p.stock}</td>
              <td>
                <button class="mini-btn" data-edit-product="${p._id}">Edit</button>
                <button class="mini-btn danger" data-delete-product="${p._id}">Delete</button>
              </td>
            </tr>`
            )
            .join('')}
        </tbody>
      </table>
    `;

    document.getElementById('showAddProductForm').addEventListener('click', () => showAdminProductForm(null));
    sub.querySelectorAll('[data-edit-product]').forEach((btn) =>
      btn.addEventListener('click', async () => {
        const product = await fetchProductById(btn.dataset.editProduct);
        showAdminProductForm(product);
      })
    );
    sub.querySelectorAll('[data-delete-product]').forEach((btn) =>
      btn.addEventListener('click', async () => {
        if (!confirm('Delete this product?')) return;
        try {
          await apiRequest(`/products/${btn.dataset.deleteProduct}`, { method: 'DELETE' });
          showToast('Product deleted.');
          renderAdminProducts(sub);
        } catch (err) {
          showToast(err.message, true);
        }
      })
    );
  } catch (err) {
    sub.innerHTML = `<p>Could not load products. ${err.message}</p>`;
  }
}

function showAdminProductForm(product) {
  const formHost = document.getElementById('adminProductForm');
  const isEdit = Boolean(product);

  formHost.innerHTML = `
    <form class="admin-form" id="productForm">
      <input type="text" id="pfName" placeholder="Product Name" value="${isEdit ? product.name : ''}" required />
      <select id="pfCategory" required>
        <option value="">Select Category</option>
        ${Object.keys(CATEGORY_SUBCATEGORIES)
          .map((c) => `<option value="${c}" ${isEdit && product.category === c ? 'selected' : ''}>${c}</option>`)
          .join('')}
      </select>
      <input type="text" id="pfSubCategory" placeholder="Subcategory (e.g. T-Shirts)" value="${isEdit ? product.subCategory : ''}" required />
      <input type="number" id="pfPrice" placeholder="Price" value="${isEdit ? product.price : ''}" required />
      <input type="number" id="pfOriginalPrice" placeholder="Original Price" value="${isEdit ? product.originalPrice : ''}" required />
      <input type="number" id="pfStock" placeholder="Stock" value="${isEdit ? product.stock : ''}" required />
      <input type="text" id="pfImage" placeholder="Image URL" value="${isEdit && product.images ? product.images[0] : ''}" required />
      <input type="text" id="pfSizes" placeholder="Sizes (comma separated, e.g. S,M,L)" value="${isEdit && product.sizes ? product.sizes.join(',') : ''}" />
      <textarea id="pfDescription" placeholder="Description" required>${isEdit ? product.description : ''}</textarea>
      <div class="full" style="display:flex;gap:10px;">
        <button type="submit" class="btn btn-primary btn-sm">${isEdit ? 'Update Product' : 'Create Product'}</button>
        <button type="button" class="btn btn-outline btn-sm" id="cancelProductForm">Cancel</button>
      </div>
    </form>
  `;

  document.getElementById('cancelProductForm').addEventListener('click', () => {
    formHost.innerHTML = '';
  });

  document.getElementById('productForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      name: document.getElementById('pfName').value.trim(),
      category: document.getElementById('pfCategory').value,
      subCategory: document.getElementById('pfSubCategory').value.trim(),
      price: Number(document.getElementById('pfPrice').value),
      originalPrice: Number(document.getElementById('pfOriginalPrice').value),
      stock: Number(document.getElementById('pfStock').value),
      images: [document.getElementById('pfImage').value.trim()],
      sizes: document.getElementById('pfSizes').value.split(',').map((s) => s.trim()).filter(Boolean),
      description: document.getElementById('pfDescription').value.trim(),
      discount: isEdit
        ? product.discount
        : Math.max(0, Math.round((1 - Number(document.getElementById('pfPrice').value) / Number(document.getElementById('pfOriginalPrice').value)) * 100)),
    };

    try {
      if (isEdit) {
        await apiRequest(`/products/${product._id}`, { method: 'PUT', body: JSON.stringify(payload) });
        showToast('Product updated.');
      } else {
        await apiRequest('/products', { method: 'POST', body: JSON.stringify(payload) });
        showToast('Product created.');
      }
      formHost.innerHTML = '';
      renderAdminProducts(document.getElementById('adminSubcontent'));
    } catch (err) {
      showToast(err.message, true);
    }
  });
}

async function renderAdminOrders(sub) {
  try {
    const data = await apiRequest('/orders');
    sub.innerHTML = `
      <h3>All Orders (${data.orders.length})</h3>
      <table class="admin-table">
        <thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Payment</th><th>Status</th></tr></thead>
        <tbody>
          ${data.orders
            .map(
              (o) => `
            <tr>
              <td>#${o._id.slice(-8).toUpperCase()}</td>
              <td>${o.user ? o.user.fullName : 'N/A'}</td>
              <td>${formatPrice(o.totalAmount)}</td>
              <td>${o.paymentMethod} (${o.paymentStatus})</td>
              <td>
                <select data-order-status="${o._id}">
                  ${['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled']
                    .map((s) => `<option value="${s}" ${o.orderStatus === s ? 'selected' : ''}>${s}</option>`)
                    .join('')}
                </select>
              </td>
            </tr>`
            )
            .join('')}
        </tbody>
      </table>
    `;

    sub.querySelectorAll('[data-order-status]').forEach((select) =>
      select.addEventListener('change', async () => {
        try {
          await apiRequest(`/orders/${select.dataset.orderStatus}`, {
            method: 'PUT',
            body: JSON.stringify({ orderStatus: select.value }),
          });
          showToast('Order status updated.');
        } catch (err) {
          showToast(err.message, true);
        }
      })
    );
  } catch (err) {
    sub.innerHTML = `<p>Could not load orders. ${err.message}</p>`;
  }
}

async function renderAdminUsers(sub) {
  try {
    const data = await apiRequest('/auth/users');
    sub.innerHTML = `
      <h3>All Users (${data.users.length})</h3>
      <table class="admin-table">
        <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr></thead>
        <tbody>
          ${data.users
            .map(
              (u) => `
            <tr>
              <td>${u.fullName}</td>
              <td>${u.email}</td>
              <td>${u.role}</td>
              <td>${new Date(u.createdAt).toLocaleDateString()}</td>
            </tr>`
            )
            .join('')}
        </tbody>
      </table>
    `;
  } catch (err) {
    sub.innerHTML = `<p>Could not load users. ${err.message}</p>`;
  }
}

/* =====================================================
   INIT
===================================================== */
document.addEventListener('DOMContentLoaded', () => {
  initSearch();
  initShopPageControls();
  updateCartBadge();
  updateWishlistBadge();
  updateAuthUI();
  navigateTo('home');
});
