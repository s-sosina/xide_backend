import * as Joi from 'joi';

export const validationSchema = Joi.object({
  PORT: Joi.number().default(3000),
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
  DB_HOST: Joi.string().default('localhost'),
  DB_PORT: Joi.number().default(5432),
  DB_USERNAME: Joi.string().default('postgres'),
  DB_PASSWORD: Joi.string().default('postgres'),
  DB_DATABASE: Joi.string().default('xide'),
  JWT_SECRET: Joi.string().default('secretKey'),
  PAYSTACK_SECRET_KEY: Joi.string().default('sk_test_mock'),
  SENDGRID_API_KEY: Joi.string().default('SG.mock'),
});
