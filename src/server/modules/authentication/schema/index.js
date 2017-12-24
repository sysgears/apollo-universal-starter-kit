import settings from '../../../../../settings';

import baseSchema from './base.graphql';
import apikeySchema from './apikey.graphql';
import certificateSchema from './cert.graphql';

import userSchema from './user.graphql';
import userPasswordSchema from './userPassword.graphql';
import userPasswordlessSchema from './userPasswordless.graphql';
import userOAuthSchema from './userOAuth.graphql';
import userApikeySchema from './userApikey.graphql';
import userCertificateSchema from './userCert.graphql';

import saSchema from './sa.graphql';
import saApikeySchema from './saApikey.graphql';
import saCertificateSchema from './saCert.graphql';

const entities = settings.entities;
const authn = settings.auth.authentication;

let schema = [baseSchema];

if (authn.apikey.enabled) {
  schema.push(apikeySchema);
}

if (authn.certificate.enabled) {
  schema.push(certificateSchema);
}

if (entities.users.enabled) {
  schema.push(userSchema);

  if (authn.password.enabled) {
    schema.push(userPasswordSchema);
  }

  if (authn.passwordless.enabled) {
    schema.push(userPasswordlessSchema);
  }

  if (authn.oauth.enabled) {
    schema.push(userOAuthSchema);
  }

  if (authn.apikey.enabled) {
    schema.push(userApikeySchema);
  }

  if (authn.certificate.enabled) {
    schema.push(userCertificateSchema);
  }
}

if (entities.serviceaccounts.enabled === true) {
  schema.push(saSchema);

  if (authn.apikey.enabled) {
    schema.push(saApikeySchema);
  }

  if (authn.certificate.enabled) {
    schema.push(saCertificateSchema);
  }
}

const exportedSchema = schema;

export default exportedSchema;
