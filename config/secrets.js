/* eslint-disable import/no-extraneous-dependencies */
import 'dotenv/config';

// Google
export const GOOGLE_TRACKING_ID = 'UA-000000-01'; // Replace with your GA tracking id here

// Db [sqlite|mysql|pg]
export const DB_TYPE = 'sqlite';
export const DB_USER = process.env.DB_USER;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_DATABASE = process.env.DB_DATABASE;

// Auth
export const AUTH_SECRET = process.env.AUTH_SECRET;
export const CERTIFICATE_DEVSERIAL = '00';
export const FACEBOOK_CLIENTID = process.env.FACEBOOK_CLIENTID;
export const FACEBOOK_CLIENTSECRET = process.env.FACEBOOK_CLIENTSECRET;
// Email
export const EMAIL_HOST = process.env.EMAIL_HOST;
export const EMAIL_PORT = process.env.EMAIL_PORT;
export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
