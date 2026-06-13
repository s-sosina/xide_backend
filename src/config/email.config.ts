import { registerAs } from '@nestjs/config';

export default registerAs('email', () => ({
  apiKey: process.env.SENDGRID_API_KEY || 'SG.mock',
}));
