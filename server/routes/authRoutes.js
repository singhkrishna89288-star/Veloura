const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getProfile, logoutUser, getAllUsers } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getProfile);
router.post('/logout', protect, logoutUser);
router.get('/users', protect, admin, getAllUsers);

module.exports = router;
