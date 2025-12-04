require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

//this variable is used to show error message if any error occurs instead of "internal server error 500"
// let dbConnected = false; 

app.use(express.json());

app.get('/', (_req, res) => {
  // if (!dbConnected) {
  //   return res.status(500).json({ message: 'Backend is down, wait until it is fixed' });
  // }
  res.json({ message: 'Product API is running' });
});

// Middleware to pass dbconnect to all /api/products routes
// app.use('/api/products', (req, res, next) => {
//   req.dbconnect = dbConnected;
// });

// APP Main Routes
app.use('/api/products', productRoutes);

// APP Main Routes
// app.use('/api/products', (req, res, next) => {
//   if (!dbConnected) {
//     return res.status(500).json({ message: 'Backend is down, wait until it is fixed' });
//   }
//   next();
// }, productRoutes);

// testing global error
app.get('/test', (req, res, next) => {
  throw new Error("Testing error");
});

// Global error middleware
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Server error' });
});

const start = async () => {
  if (!process.env.MONGODB_URI) {
    console.error('Missing MONGODB_URI in environment variables');
    process.exit(1);
    // dbConnected = false;
  } 

  try {
    await connectDB(process.env.MONGODB_URI);
    // dbConnected = true;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to start server:', err);
    // dbConnected = false;
    process.exit(1);
  }
};

start();
