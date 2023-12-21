// routes/transactionRoutes.js
const express = require('express');

const router = express.Router();

module.exports = (User) => {
  // Import transaction controller with the User model
  const transactionController = require('../controllers/transactionController')(User);

  router.post('/transfer', transactionController.transfer);
  router.get('/:phoneNum', transactionController.getTransactionHistory);

  return router;
};
