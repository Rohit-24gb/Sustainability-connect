const requiredEnv = ["MONGODB_URI", "JWT_SECRET"];

const optionalEnv = [
  "CLIENT_URL",
  "JWT_EXPIRES_IN",
  "JWT_REFRESH_EXPIRES_IN",
  "RAZORPAY_KEY_ID",
  "RAZORPAY_KEY_SECRET",
  "MAIL_USER",
  "MAIL_PASS"
];

const validateEnv = () => {
  const missing = requiredEnv.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  optionalEnv
    .filter((key) => !process.env[key])
    .forEach((key) => {
      console.warn(`Optional environment variable not set: ${key}`);
    });
};

module.exports = { validateEnv };
