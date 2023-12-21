// controllers/transactionController.js
module.exports = (User) => {
  const transfer = async (req, res) => {
    const { from, to, amount } = req.body;

    try {
      // Use the User model to interact with MongoDB
      const sender = await User.findOne({ phoneNum: from });
      const recipient = await User.findOne({ phoneNum: to });

      if (!sender || !recipient) {
        return res.status(400).json({ error: 'Invalid user or recipient.' });
      }

      if (sender.availableAmount < amount) {
        return res.status(400).json({ error: 'Insufficient balance.' });
      }

      // Deduct from sender and credit to recipient
      sender.availableAmount -= amount;
      recipient.availableAmount += amount;

      // Handle cashback
      let cashback = 0;
      if (amount % 500 !== 0) {
        cashback = amount < 1000 ? amount * 0.05 : amount * 0.02;
        sender.availableAmount += cashback;
      }

      // Record the transaction
      sender.transactions.push({ from, to, amount, cashback });
      await sender.save();
      await recipient.save();

      return res.json({ message: 'Transaction successful.', cashback, availableAmount: sender.availableAmount });
    } catch (error) {
      console.error('Error in transfer:', error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  };

  const getTransactionHistory = async (req, res) => {
    const { phoneNum } = req.params;

    try {
      // Use the User model to interact with MongoDB
      const user = await User.findOne({ phoneNum });

      if (!user) {
        return res.status(400).json({ error: 'User not found.' });
      }

      const transactions = user.transactions;
      return res.json({ transactions });
    } catch (error) {
      console.error('Error in getTransactionHistory:', error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  };

  return {
    transfer,
    getTransactionHistory
  };
};
