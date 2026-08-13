const crypto = require('crypto');

let Razorpay = null;
try {
  Razorpay = require('razorpay');
} catch (e) {
  // razorpay package not installed yet — handled gracefully below
}

const isRazorpayConfigured = () => {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
};

const getRazorpayInstance = () => {
  if (!Razorpay || !isRazorpayConfigured()) return null;
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

// @desc    Create a Razorpay order
// @route   POST /api/payment/create-order
// @access  Private
const createRazorpayOrder = async (req, res) => {
  try {
    if (!isRazorpayConfigured()) {
      return res.status(503).json({
        success: false,
        configured: false,
        message:
          'Razorpay is not configured on this server. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in your .env file to enable online payments. You can still place an order using Cash on Delivery.',
      });
    }

    const { amount } = req.body; // amount in rupees
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'A valid amount is required.' });
    }

    const instance = getRazorpayInstance();
    const options = {
      amount: Math.round(amount * 100), // paise
      currency: 'INR',
      receipt: `veloura_rcpt_${Date.now()}`,
    };

    const order = await instance.orders.create(options);

    res.status(200).json({
      success: true,
      configured: true,
      order,
      key_id: process.env.RAZORPAY_KEY_ID, // public key id only — safe to expose
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to create Razorpay order.', error: err.message });
  }
};

// @desc    Verify Razorpay payment signature
// @route   POST /api/payment/verify
// @access  Private
const verifyRazorpayPayment = async (req, res) => {
  try {
    if (!isRazorpayConfigured()) {
      return res.status(503).json({
        success: false,
        configured: false,
        message: 'Razorpay is not configured on this server. Cannot verify payment.',
      });
    }

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Missing payment verification fields.' });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (!isAuthentic) {
      return res.status(400).json({ success: false, verified: false, message: 'Payment verification failed. Signature mismatch.' });
    }

    res.status(200).json({
      success: true,
      verified: true,
      message: 'Payment verified successfully.',
      razorpay_payment_id,
      razorpay_order_id,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Payment verification error.', error: err.message });
  }
};

// @desc    Check whether Razorpay is configured (used by frontend to decide whether to show the option)
// @route   GET /api/payment/status
// @access  Public
const getPaymentStatus = async (req, res) => {
  res.status(200).json({ success: true, configured: isRazorpayConfigured() });
};

module.exports = { createRazorpayOrder, verifyRazorpayPayment, getPaymentStatus };
