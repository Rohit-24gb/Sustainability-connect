const express = require('express');
const { register, login, me, refresh, logout } = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');
const rateLimiter = require('../middleware/rateLimiter');
const validate = require('../middleware/validate');
const { registerSchema, loginSchema } = require('../validators/userValidators');
const router = express.Router();

// User registration route
router.post('/register', rateLimiter({ windowMs: 15 * 60 * 1000, limit: 10 }), validate(registerSchema), register);

router.post('/login', rateLimiter({ windowMs: 15 * 60 * 1000, limit: 20 }), validate(loginSchema), login);

router.get('/me', authenticate, me);
router.post('/refresh', rateLimiter({ windowMs: 15 * 60 * 1000, limit: 30 }), refresh);
router.post('/logout', authenticate, logout);

module.exports = router;
