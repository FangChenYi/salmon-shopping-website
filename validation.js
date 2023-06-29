const Joi = require("joi");

const registerValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().trim().min(2).max(30).required().messages({
      "string.empty": "使用者名稱為必填項目",
      "string.min": "使用者名稱不得小於 2",
      "string.max": "使用者名稱不得大於 30",
    }),
    email: Joi.string().trim().email().min(6).max(80).required().messages({
      "string.empty": "Email為必填項目",
      "string.email": "必須為Email格式",
      "string.min": "Email長度不得小於 6",
      "string.max": "Email長度不得大於 30",
    }),
    password: Joi.string().trim().min(6).max(30).required().messages({
      "string.empty": "密碼為必填項目",
      "string.min": "密碼長度不得小於 6",
      "string.max": "密碼長度不得大於 30",
    }),
  });
  return schema.validate(data, { abortEarly: false });
};

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().trim().email().min(6).max(80).required().messages({
      "string.empty": "Email為必填項目",
      "string.email": "帳號必須為Email格式",
      "string.min": "Email長度不得小於 6",
      "string.max": "Email長度不得大於 30",
    }),
    password: Joi.string().trim().min(6).max(30).required().messages({
      "string.empty": "密碼為必填項目",
      "string.min": "密碼長度不得小於 6",
      "string.max": "密碼長度不得大於 30",
    }),
  });
  return schema.validate(data, { abortEarly: false });
};

const productValidation = (data) => {
  const schema = Joi.object({
    photo: Joi.binary().required().messages({
      "any.required": "圖片為必要項目",
    }),
    name: Joi.string().trim().min(1).max(50).required().messages({
      "string.empty": "商品名稱為必填項目",
      "string.min": "商品名稱不得小於 1",
      "string.max": "商品名稱不得大於 50",
    }),
    description: Joi.string().trim().min(1).max(80).required().messages({
      "string.empty": "商品描述為必填項目",
      "string.min": "商品描述不得小於 1",
      "string.max": "商品描述不得大於 80",
    }),
    price: Joi.number().integer().min(1).max(100000).required().messages({
      "number.base": "價格為必填項目，並且只能是數字",
      "number.integer": "價格必須是整數",
      "number.min": "價格不得小於 1",
      "number.max": "價格不得大於 100000",
    }),
  });

  return schema.validate(data, { abortEarly: false });
};

module.exports = {
  registerValidation,
  productValidation,
  loginValidation,
};
