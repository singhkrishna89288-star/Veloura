/* =====================================================
   VELOURA — checkout.js
   Checkout form, order summary, COD + Razorpay payment flow.
===================================================== */

let selectedPaymentMethod = 'COD';

async function renderCheckoutPage() {
  const layout = document.getElementById('checkoutLayout');
  const items = Cart.getItems();

  if (items.length === 0) {
    layout.innerHTML = `<div class="empty-cart"><h3>Your cart is empty</h3><p>Add some products before checking out.</p><button class="btn btn-primary" data-page="shop" data-category="">Shop Now</button></div>`;
    attachNavHandlers(layout);
    return;
  }

  const user = Auth.getUser();
  selectedPaymentMethod = 'COD';

  let razorpayConfigured = false;
  try {
    const status = await apiRequest('/payment/status');
    razorpayConfigured = status.configured;
  } catch (e) {
    razorpayConfigured = false;
  }

  layout.innerHTML = `
    <form class="checkout-form" id="checkoutForm">
      <h3>Customer Details</h3>
      <input type="text" id="coFullName" placeholder="Full Name" value="${user ? user.fullName : ''}" required />
      <input type="email" id="coEmail" placeholder="Email" value="${user ? user.email : ''}" required />
      <input type="tel" id="coPhone" placeholder="Phone Number" required />

      <h3>Delivery Address</h3>
      <input type="text" id="coAddress" placeholder="Address" required />
      <div class="form-row">
        <input type="text" id="coCity" placeholder="City" required />
        <input type="text" id="coState" placeholder="State" required />
      </div>
      <input type="text" id="coPincode" placeholder="Pincode" required />

      <h3>Payment Method</h3>
      <div class="payment-options">
        <label class="payment-option selected" data-method="COD">
          <input type="radio" name="paymentMethod" value="COD" checked /> Cash on Delivery
        </label>
        <label class="payment-option" data-method="Razorpay">
          <input type="radio" name="paymentMethod" value="Razorpay" ${razorpayConfigured ? '' : 'disabled'} /> Pay Online (Razorpay)
        </label>
      </div>
      ${!razorpayConfigured ? `<p class="payment-note">Online payment is currently unavailable — the store owner hasn't configured Razorpay credentials yet. Please choose Cash on Delivery.</p>` : ''}

      <button type="submit" class="btn btn-primary btn-block" id="placeOrderBtn">Place Order</button>
    </form>

    <div class="summary-box">
      <h3>Order Summary</h3>
      ${items.map((i) => `<div class="summary-row"><span>${i.name} (${i.size || 'One Size'}) × ${i.quantity}</span><span>${formatPrice(i.price * i.quantity)}</span></div>`).join('')}
      <div class="summary-row"><span>Subtotal</span><span>${formatPrice(Cart.subtotal())}</span></div>
      <div class="summary-row"><span>Discount</span><span>−${formatPrice(Cart.discount())}</span></div>
      <div class="summary-row"><span>Delivery</span><span>${Cart.deliveryCharge() === 0 ? 'Free' : formatPrice(Cart.deliveryCharge())}</span></div>
      <div class="summary-row total"><span>Total</span><span>${formatPrice(Cart.total())}</span></div>
    </div>
  `;

  layout.querySelectorAll('.payment-option').forEach((opt) => {
    opt.addEventListener('click', () => {
      if (opt.querySelector('input').disabled) return;
      layout.querySelectorAll('.payment-option').forEach((o) => o.classList.remove('selected'));
      opt.classList.add('selected');
      opt.querySelector('input').checked = true;
      selectedPaymentMethod = opt.dataset.method;
    });
  });

  document.getElementById('checkoutForm').addEventListener('submit', handlePlaceOrder);
}

async function handlePlaceOrder(e) {
  e.preventDefault();

  const shippingAddress = {
    fullName: document.getElementById('coFullName').value.trim(),
    email: document.getElementById('coEmail').value.trim(),
    phone: document.getElementById('coPhone').value.trim(),
    address: document.getElementById('coAddress').value.trim(),
    city: document.getElementById('coCity').value.trim(),
    state: document.getElementById('coState').value.trim(),
    pincode: document.getElementById('coPincode').value.trim(),
  };

  const items = Cart.getItems();
  const orderPayload = {
    products: items.map((i) => ({
      product: i.productId,
      name: i.name,
      image: i.image,
      size: i.size,
      quantity: i.quantity,
      price: i.price,
    })),
    shippingAddress,
    subtotal: Cart.subtotal(),
    discount: Cart.discount(),
    deliveryCharge: Cart.deliveryCharge(),
    totalAmount: Cart.total(),
    paymentMethod: selectedPaymentMethod,
  };

  const placeOrderBtn = document.getElementById('placeOrderBtn');
  placeOrderBtn.disabled = true;
  placeOrderBtn.textContent = 'Placing Order...';

  try {
    if (selectedPaymentMethod === 'Razorpay') {
      await payWithRazorpay(orderPayload);
    } else {
      const data = await apiRequest('/orders', {
        method: 'POST',
        body: JSON.stringify(orderPayload),
      });
      onOrderSuccess(data.order);
    }
  } catch (err) {
    showToast(err.message || 'Failed to place order.', true);
    placeOrderBtn.disabled = false;
    placeOrderBtn.textContent = 'Place Order';
  }
}

async function payWithRazorpay(orderPayload) {
  const orderRes = await apiRequest('/payment/create-order', {
    method: 'POST',
    body: JSON.stringify({ amount: orderPayload.totalAmount }),
  });

  if (!orderRes.configured) {
    showToast(orderRes.message, true);
    resetPlaceOrderBtn();
    return;
  }

  if (typeof Razorpay === 'undefined') {
    showToast('Razorpay checkout script is not loaded. Add the Razorpay checkout.js script tag to index.html to enable this.', true);
    resetPlaceOrderBtn();
    return;
  }

  const options = {
    key: orderRes.key_id,
    amount: orderRes.order.amount,
    currency: orderRes.order.currency,
    name: 'Veloura',
    description: 'Order Payment',
    order_id: orderRes.order.id,
    handler: async function (response) {
      try {
        const verifyRes = await apiRequest('/payment/verify', {
          method: 'POST',
          body: JSON.stringify(response),
        });
        if (verifyRes.verified) {
          const finalOrder = await apiRequest('/orders', {
            method: 'POST',
            body: JSON.stringify({
              ...orderPayload,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
            }),
          });
          onOrderSuccess(finalOrder.order);
        } else {
          showToast('Payment verification failed.', true);
          resetPlaceOrderBtn();
        }
      } catch (err) {
        showToast(err.message, true);
        resetPlaceOrderBtn();
      }
    },
    modal: {
      ondismiss: function () {
        resetPlaceOrderBtn();
      },
    },
    theme: { color: '#6e2a38' },
  };

  const rzp = new Razorpay(options);
  rzp.open();
}

function resetPlaceOrderBtn() {
  const btn = document.getElementById('placeOrderBtn');
  if (btn) {
    btn.disabled = false;
    btn.textContent = 'Place Order';
  }
}

function onOrderSuccess(order) {
  Cart.clear();
  showToast('Order placed successfully!');
  navigateTo('account', { tab: 'orders' });
}
