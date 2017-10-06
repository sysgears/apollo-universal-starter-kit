/* eslint-disable import/no-extraneous-dependencies */
import 'dotenv/config';

// Google
export const GOOGLE_TRACKING_ID = 'UA-000000-01'; // Replace with your GA tracking id here

// Auth
export const AUTH_SECRET = process.env.AUTH_SECRET;

// Email
export const EMAIL_HOST = process.env.EMAIL_HOST;
export const EMAIL_PORT = process.env.EMAIL_PORT;
export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
