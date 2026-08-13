const express = require('express');
const router = express.Router();
const { createRazorpayOrder, verifyRazorpayPayment, getPaymentStatus } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.get('/status', getPaymentStatus);
router.post('/create-order', protect, createRazorpayOrder);
router.post('/verify', protect, verifyRazorpayPayment);

module.exports = router;
