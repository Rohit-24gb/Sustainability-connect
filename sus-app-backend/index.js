const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const dotenv = require('dotenv');



require('dotenv').config();
dotenv.config(); 
const app = express();
const port = process.env.PORT || 4000; 

// Middleware
app.use(express.json());
app.use(cors());




// Import routes
const productRoutes = require('./routes/ProductRoutes');
const productCategory = require('./routes/ProductCategoryRoutes');
const recyclingCenter = require('./routes/recyclingCenterRoutes');
const recyclableItemRoutes = require('./routes/recyclableItemRoutes');
const pickupRoutes = require('./routes/pickuproutes');
const userRoutes = require('./routes/userRoutes');
const OtpRoutes = require('./routes/OtpRoutes'); 
const CartRoutes = require('./routes/cartRoutes')
// const PaymentRoutes = require('./routes/paymentRoutes')
const bodyParser = require('body-parser');
const paymentRoutes = require('./routes/paymentRoutes');
const orderRoutes = require('./routes/Orderroute');



// Use Routes



// Routes
app.use('/api/products', productRoutes);
app.use('/api/product-categories', productCategory);
app.use('/api/recycling-centers', recyclingCenter);
app.use('/api/recyclable-items', recyclableItemRoutes);
app.use('/api', pickupRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', OtpRoutes);
app.use('/api/cart', CartRoutes);
// app.use('/payment', PaymentRoutes)
app.use(bodyParser.json());
app.use('/payment', paymentRoutes);
app.use('/orders', orderRoutes);




// Database Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// API Endpoints
app.get("/", (req, res) => {
  res.send("Express App is Running");
});

// Image storage engine
const storage = multer.diskStorage({
  destination: './upload/images', 
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage: storage });

// Serve static files
app.use('/images', express.static('upload/images'));

// Upload endpoint for products (add new product)
app.post("/upload", upload.single('photos'), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`
  });
});

// Start the server
app.listen(port, (error) => {
  if (error) throw error;
  console.log(`Server is running on port ${port}`);
});












