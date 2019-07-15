import { log } from '@gqlapp/core-common';
import settings from '@gqlapp/config';

import crypto from 'crypto';

// Use password-based key derivation function to derive MAC key and encryption key from secret passphrase
const _deriveSymmetricKey = salt => crypto.pbkdf2Sync(settings.auth.secret, salt, 10000, 32, 'sha256');

const _macKey = _deriveSymmetricKey('mac key');
const _encKey = _deriveSymmetricKey('enc key');

const hmac = (val, macKey) => {
  return crypto
    .createHmac('sha256', macKey)
    .update(val)
    .digest();
};

// Encrypt then MAC session object as JSON
export const encryptSession = session => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', _encKey, iv);
  const enc = Buffer.concat([cipher.update(JSON.stringify(session)), cipher.final()]);

  return iv.toString('base64') + '.' + enc.toString('base64') + '.' + hmac(enc, _macKey).toString('base64');
};

// Check MAC and decryption session object from JSON
export const decryptSession = session => {
  let result;
  if (session) {
    try {
      const [iv64, enc64, encMac64] = session.split('.');
      const [iv, enc, encMac] = [iv64, enc64, encMac64].map(it => it && Buffer.from(it, 'base64'));
      const mac = hmac(enc, _macKey);
      if (!encMac.equals(mac)) {
        return undefined;
      }
      const cipher = crypto.createDecipheriv('aes-256-cbc', _encKey, iv);
      const dec = Buffer.concat([cipher.update(enc), cipher.final()]).toString('utf-8');
      return JSON.parse(dec);
    } catch (e) {
      log.error('Failed to read session cookie:', e);
    }
  }

  return result;
};
