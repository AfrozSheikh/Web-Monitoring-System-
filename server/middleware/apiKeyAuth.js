// const User = require('../models/User');

// const apiKeyAuth = async (req, res, next) => {
//   try {
//     const apiKey = req.headers['x-api-key'];
    
//     if (!apiKey) {
//       return res.status(401).json({ message: 'No API key provided' });
//     }

//     const user = await User.findOne({ apiKey });
    
//     if (!user) {
//       return res.status(401).json({ message: 'Invalid API key' });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// module.exports = apiKeyAuth;
// In server/middleware/apiKeyAuth.js
const User = require('../models/User');

const apiKeyAuth = async (req, res, next) => {
  try {
    // CORRECTED PART: Check query parameter first, then fall back to header
    const apiKey = req.query.apiKey || req.headers['x-api-key'];
    
    if (!apiKey) {
      return res.status(401).json({ message: 'No API key provided' });
    }

    const user = await User.findOne({ apiKey });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid API key' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = apiKeyAuth;