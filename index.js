
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const app = express();
const port = 3000;




// Connect to MongoDB
const dbURI = process.env.dbURI;
console.log('dbURI:', process.env.dbURI);
mongoose.connect(dbURI, {
 
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err.message);
});

app.use(bodyParser.json());

// Use the User model
const User = require('./models/userModel');

// Use the routes
app.use('/users', userRoutes(User));
app.use('/transactions', transactionRoutes(User));

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
