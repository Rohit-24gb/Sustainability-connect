const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
require("dotenv").config();
const { validateEnv } = require("./config/env");
const securityHeaders = require("./middleware/securityHeaders");
const requestLogger = require("./middleware/requestLogger");
const rateLimiter = require("./middleware/rateLimiter");
const responseMiddleware = require("./middleware/response");
const { metricsMiddleware, getMetrics } = require("./middleware/metrics");
const { notFound, errorHandler } = require("./middleware/errorHandler");
const logger = require("./utlis/logger");

validateEnv();

const app = express();
const port = process.env.PORT || 4000; 

// Middleware
app.set("trust proxy", 1);
app.use(securityHeaders);
app.use(requestLogger);
app.use(metricsMiddleware);
app.use(responseMiddleware);
app.use(express.json({ limit: "1mb" }));
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true
}));
app.use(rateLimiter({ windowMs: 15 * 60 * 1000, limit: 300 }));




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
const paymentRoutes = require('./routes/paymentRoutes');
const orderRoutes = require('./routes/Orderroute');
const interactionRoutes = require('./routes/interactionRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const ecoScoreRoutes = require('./routes/ecoScoreRoutes');
const adminAnalyticsRoutes = require('./routes/adminAnalyticsRoutes');



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
app.use('/v1', paymentRoutes);
app.use('/orders', orderRoutes);
app.use('/api/interactions', interactionRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/eco-score', ecoScoreRoutes);
app.use('/api/admin/analytics', adminAnalyticsRoutes);




// Database Connection
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 10000
})
  .then(() => logger.info('mongodb_connected'))
  .catch(err => logger.error('mongodb_connection_error', { message: err.message }));

// API Endpoints
app.get("/", (req, res) => {
  res.send("Express App is Running");
});

app.get("/health", (req, res) => {
  res.success({
    status: "ok",
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected"
  }, "Service health");
});

app.get("/metrics", (req, res) => {
  res.success({ metrics: getMetrics() }, "Service metrics");
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
  const publicBaseUrl =
    process.env.PUBLIC_BASE_URL ||
    process.env.RENDER_EXTERNAL_URL ||
    `http://localhost:${port}`;

  res.json({
    success: 1,
    image_url: `${publicBaseUrl}/images/${req.file.filename}`
  });
});

app.use(notFound);
app.use(errorHandler);

// Start the server
app.listen(port, (error) => {
  if (error) throw error;
  logger.info("server_started", { port });
});












