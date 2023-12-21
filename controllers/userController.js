// controllers/userController.js
module.exports = (User) => {
  const login = async (req, res) => {
    const { phoneNum } = req.body;

    try {
      let user = await User.findOne({ phoneNum });

      if (!user) {
        const newUser = new User({ phoneNum });
        user = await newUser.save();
        return res.json({ message: 'First login. Please add an initial amount.' });
      } else {
        return res.json({ message: 'Login successful.', availableAmount: user.availableAmount });
      }
    } catch (error) {
      console.error('Error in login:', error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  };

  const addAmount = async (req, res) => {
    const { phoneNum, initialAmount } = req.body;

    try {
      let user = await User.findOne({ phoneNum });

      if (!user) {
        return res.status(400).json({ error: 'User not found.' });
      }

      user.availableAmount += initialAmount;
      await user.save();

      return res.json({ message: 'Amount added successfully.', availableAmount: user.availableAmount });
    } catch (error) {
      console.error('Error in addAmount:', error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  };

  return {
    login,
    addAmount
  };
};
