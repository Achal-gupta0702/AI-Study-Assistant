const jwt = require('jsonwebtoken');
const memStore = require('../memStore');
let User;
try { User = require('../models/User'); } catch(e) {}

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }
  try {
    const secret = process.env.JWT_SECRET || 'fallback_secret_key_change_me';
    const decoded = jwt.verify(token, secret);

    if (memStore.isActive) {
      const user = await memStore.findUser({ _id: decoded.id });
      if (!user) return res.status(401).json({ success: false, message: 'User not found' });
      req.user = user;
      return next();
    }

    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ success: false, message: 'User not found' });
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};

module.exports = { protect };
