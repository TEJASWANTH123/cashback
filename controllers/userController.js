// controllers/userController.js
const jwt = require('jsonwebtoken');

const config = require('../config/jwt');

module.exports = (User) => {
  const login = async (req, res) => {
    const { phoneNum } = req.body;

    try {
      let user = await User.findOne({ phoneNum });

      if (!user) {
        const tokens = jwt.sign({ phoneNum }, config.secretKey, { expiresIn: '1h' });
        const newUser = new User({ phoneNum, tokens }); // Store the token in the user schema
        user = await newUser.save();

        return res.status(200).json({ message: 'First login. Please add an initial amount.', tokens });
      } else {
        return res.status(200).json({ message: 'Login successful.', availableAmount: user.availableAmount });
      }
    } catch (error) {
      console.error('Error in login:', error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  };

  const addAmount = async (req, res) => {
    const { phoneNum, initialAmount } = req.body;

    try {
      // Verify the JWT token
      const token = req.headers.authorization.split(' ')[1]; // Extract the token from the Authorization header
      const decodedToken = jwt.verify(token, config.secretKey);

      // Check if the decoded token matches the user's phone number
      if (decodedToken.phoneNum !== phoneNum) {
        return res.status(403).json({ error: 'Forbidden: Token does not match user.' });
      }

      // Find the user in the database
      let user = await User.findOne({ phoneNum });

      if (!user) {
        return res.status(400).json({ error: 'User not found.' });
      }

      // Update the user's availableAmount
      user.availableAmount += initialAmount;
      await user.save();

      return res.status(200).json({ message: 'Amount added successfully.', availableAmount: user.availableAmount });
    } catch (error) {
      console.error('Error in addAmount:', error);
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ error: 'Unauthorized: Token expired.' });
      }
      return res.status(500).json({ error: 'Internal server error.' });
    }
  };

  return {
    login,
    addAmount
  };
};