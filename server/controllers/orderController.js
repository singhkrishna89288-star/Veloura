const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Place a new order
// @route   POST /api/orders
// @access  Private
const placeOrder = async (req, res) => {
  try {
    const {
      products,
      shippingAddress,
      subtotal,
      discount = 0,
      deliveryCharge = 0,
      totalAmount,
      paymentMethod,
      razorpayOrderId = '',
      razorpayPaymentId = '',
    } = req.body;

    if (!products || products.length === 0) {
      return res.status(400).json({ success: false, message: 'No products in order.' });
    }
    if (!shippingAddress) {
      return res.status(400).json({ success: false, message: 'Shipping address is required.' });
    }
    if (!paymentMethod || !['COD', 'Razorpay'].includes(paymentMethod)) {
      return res.status(400).json({ success: false, message: 'Valid payment method is required.' });
    }

    // Validate stock for each product
    for (const item of products) {
      const dbProduct = await Product.findById(item.product);
      if (!dbProduct) {
        return res.status(404).json({ success: false, message: `Product not found: ${item.name || item.product}` });
      }
      if (dbProduct.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${dbProduct.name}.` });
      }
    }

    const paymentStatus = paymentMethod === 'Razorpay' && razorpayPaymentId ? 'Paid' : 'Pending';

    const order = await Order.create({
      user: req.user._id,
      products,
      shippingAddress,
      subtotal,
      discount,
      deliveryCharge,
      totalAmount,
      paymentMethod,
      paymentStatus,
      razorpayOrderId,
      razorpayPaymentId,
    });

    // Decrease stock
    for (const item of products) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
    }

    res.status(201).json({ success: true, message: 'Order placed successfully.', order });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to place order.', error: err.message });
  }
};

// @desc    Get logged-in user's orders (or all orders if admin)
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { user: req.user._id };
    const orders = await Order.find(filter).populate('user', 'fullName email').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch orders.', error: err.message });
  }
};

// @desc    Get a single order
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'fullName email');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }
    if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order.' });
    }
    res.status(200).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch order.', error: err.message });
  }
};

// @desc    Update order status (admin only)
// @route   PUT /api/orders/:id
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const validStatuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid order status.' });
    }

    const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus }, { new: true });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    res.status(200).json({ success: true, message: 'Order status updated.', order });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update order.', error: err.message });
  }
};

module.exports = { placeOrder, getOrders, getOrderById, updateOrderStatus };
