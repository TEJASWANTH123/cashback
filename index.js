const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// In-memory database
let users = {};

app.use(bodyParser.json());

// Log In
app.post('/login', (req, res) => {
  const { phoneNum } = req.body;

  if (!users[phoneNum]) {
    users[phoneNum] = { phoneNum, availableAmount: 0, transactions: [] };
    return res.json({ message: 'First login. Please add initial amount.' });
  }

  return res.json({ message: 'Login successful.', availableAmount: users[phoneNum].availableAmount });
});

// Add Initial Amount
app.post('/add-amount', (req, res) => {
  const { phoneNum, initialAmount } = req.body;

  if (!users[phoneNum]) {
    return res.status(400).json({ error: 'User not found.' });
  }

  users[phoneNum].availableAmount += initialAmount;
  return res.json({ message: 'Amount added successfully.', availableAmount: users[phoneNum].availableAmount });
});

// Transfer Amount
app.post('/transfer', (req, res) => {
  const { from, to, amount } = req.body;

  if (!users[from] || !users[to]) {
    return res.status(400).json({ error: 'Invalid user or recipient.' });
  }

  if (users[from].availableAmount < amount) {
    return res.status(400).json({ error: 'Insufficient balance.' });
  }

  // Deduct from sender and credit to recipient
  users[from].availableAmount -= amount;
  users[to].availableAmount += amount;

  // Handle cashback
  let cashback = 0;
  if (amount % 500 !== 0) {
    cashback = amount < 1000 ? amount * 0.05 : amount * 0.02;
    users[from].availableAmount += cashback;
  }

  // Record the transaction
  users[from].transactions.push({ from, to, amount, cashback });

  return res.json({ message: 'Transaction successful.', cashback, availableAmount: users[from].availableAmount });
});

// Display Transaction History
app.get('/transactions/:phoneNum', (req, res) => {
  const { phoneNum } = req.params;

  if (!users[phoneNum]) {
    return res.status(400).json({ error: 'User not found.' });
  }

  const transactions = users[phoneNum].transactions;
  return res.json({ transactions });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
