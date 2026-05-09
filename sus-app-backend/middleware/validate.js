const validate = (schema) => (req, res, next) => {
  const errors = [];

  for (const [field, rules] of Object.entries(schema)) {
    const value = req.body[field];

    if (rules.required && (value === undefined || value === null || String(value).trim() === "")) {
      errors.push(`${field} is required`);
      continue;
    }

    if (value === undefined || value === null || value === "") {
      continue;
    }

    if (rules.type === "string" && typeof value !== "string") {
      errors.push(`${field} must be a string`);
    }

    if (rules.type === "number" && typeof value !== "number") {
      errors.push(`${field} must be a number`);
    }

    if (rules.type === "array" && !Array.isArray(value)) {
      errors.push(`${field} must be an array`);
      continue;
    }

    if (rules.enum && !rules.enum.includes(value)) {
      errors.push(`${field} must be one of: ${rules.enum.join(", ")}`);
    }

    if (rules.objectId && !/^[0-9a-fA-F]{24}$/.test(String(value))) {
      errors.push(`${field} must be a valid id`);
    }

    if (rules.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value))) {
      errors.push(`${field} must be a valid email`);
    }

    if (rules.min && String(value).trim().length < rules.min) {
      errors.push(`${field} must be at least ${rules.min} characters`);
    }

    if (rules.max && String(value).trim().length > rules.max) {
      errors.push(`${field} must be at most ${rules.max} characters`);
    }

    if (rules.minValue !== undefined && Number(value) < rules.minValue) {
      errors.push(`${field} must be at least ${rules.minValue}`);
    }

    if (rules.minItems !== undefined && Array.isArray(value) && value.length < rules.minItems) {
      errors.push(`${field} must contain at least ${rules.minItems} item(s)`);
    }

    if (rules.items && Array.isArray(value)) {
      value.forEach((item, index) => {
        for (const [itemField, itemRules] of Object.entries(rules.items)) {
          const itemValue = item?.[itemField];
          const label = `${field}[${index}].${itemField}`;

          if (itemRules.required && (itemValue === undefined || itemValue === null || String(itemValue).trim() === "")) {
            errors.push(`${label} is required`);
            continue;
          }

          if (itemValue === undefined || itemValue === null || itemValue === "") {
            continue;
          }

          if (itemRules.type === "string" && typeof itemValue !== "string") {
            errors.push(`${label} must be a string`);
          }

          if (itemRules.type === "number" && typeof itemValue !== "number") {
            errors.push(`${label} must be a number`);
          }

          if (itemRules.objectId && !/^[0-9a-fA-F]{24}$/.test(String(itemValue))) {
            errors.push(`${label} must be a valid id`);
          }

          if (itemRules.minValue !== undefined && Number(itemValue) < itemRules.minValue) {
            errors.push(`${label} must be at least ${itemRules.minValue}`);
          }
        }
      });
    }
  }

  if (errors.length > 0) {
    if (res.fail) {
      return res.fail("Validation failed", 400, errors);
    }

    return res.status(400).json({ success: false, message: "Validation failed", errors });
  }

  next();
};

module.exports = validate;
