// routes/userRoutes.js
const express = require('express');

const router = express.Router();

module.exports = (User) => {
  // Import user controller with the User model
  const userController = require('../controllers/userController')(User);

  router.post('/login', userController.login);
  router.post('/add-amount', userController.addAmount);

  return router;
};
