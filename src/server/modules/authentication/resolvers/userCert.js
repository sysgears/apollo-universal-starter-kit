import { _ } from 'lodash';
import { createBatchResolver } from 'graphql-resolve-batch';

// import { withAuth } from '../../../../common/authValidation';
import { reconcileBatchOneToMany } from '../../../stores/sql/knex/helpers/batching';

export default function addResolvers(obj) {
  obj = addTypeResolvers(obj);
  obj = addMutations(obj);
  return obj;
}

function addTypeResolvers(obj) {
  obj.UserAuth.certificates = createBatchResolver(async (source, args, context) => {
    let ids = _.uniq(source.map(s => s.userId));
    const certs = await context.Authn.getCertificatesForUsers({ ids });
    const ret = reconcileBatchOneToMany(source, certs, 'userId');
    return ret;
  });

  return obj;
}

function addMutations(obj) {
  obj.Mutation.createUserCertificate = async (obj, args, context) => {
    try {
      console.log('RESOLVER - createUserCertificate - input', args);
      const existing = await context.Authn.searchUserCertificate(args.id, args.name);
      if (existing) {
        return {
          certificate: null,
          errors: [
            {
              field: 'general',
              message: 'User already has a certificate with that name'
            }
          ]
        };
      }

      const certificate = await context.Authn.createUserCertificate(args.id, args.name);
      console.log('RESOLVER - createUserCertificate - certificate', certificate);
      return {
        certificate: {
          name: args.name,
          serial: args.serial,
          pubkey: args.pubkey
        },
        errors: null
      };
    } catch (e) {
      return { certificate: null, errors: [e] };
    }
  };

  obj.Mutation.deleteUserCertificate = async (obj, args, context) => {
    try {
      const existing = await context.Authn.searchUserCertificate(args.id, args.name);
      if (!existing) {
        return {
          certificate: null,
          errors: [
            {
              field: 'general',
              message: 'User has no certificate with that name'
            }
          ]
        };
      }

      const ret = await context.Authn.deleteUserCertificate(args.id, args.name);
      if (!ret) {
        return {
          certificate: null,
          errors: [
            {
              field: 'general',
              message: 'An error ocurred, please try again later.'
            }
          ]
        };
      }
      return {
        certificate: null,
        errors: null
      };
    } catch (e) {
      return { certificate: null, errors: [e] };
    }
  };

  return obj;
}
