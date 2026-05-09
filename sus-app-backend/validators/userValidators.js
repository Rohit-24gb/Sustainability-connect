const registerSchema = {
  name: { required: true, type: "string", min: 2, max: 80 },
  email: { required: true, type: "string", email: true, max: 120 },
  password: { required: true, type: "string", min: 6, max: 128 },
  phone: { required: true, type: "string", min: 7, max: 20 },
  gender: { required: true, type: "string", max: 40 },
  city: { required: true, type: "string", max: 80 }
};

const loginSchema = {
  email: { required: true, type: "string", email: true, max: 120 },
  password: { required: true, type: "string", min: 1, max: 128 }
};

module.exports = { registerSchema, loginSchema };
