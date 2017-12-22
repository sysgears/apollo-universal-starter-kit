import settings from '../../../../../../settings';

import baseSchema from './base.graphql';
import userSchema from './user.graphql';
import groupSchema from './group.graphql';
import orgSchema from './org.graphql';
import saSchema from './sa.graphql';

const entities = settings.entities;

let schema = [baseSchema];

if (entities.users.enabled === true) {
  schema.push(userSchema);
}

if (entities.groups.enabled === true) {
  schema.push(groupSchema);
}

if (entities.orgs.enabled === true) {
  schema.push(orgSchema);
}

if (entities.serviceaccounts.enabled === true) {
  schema.push(saSchema);
}

const exportedSchema = schema;

export default exportedSchema;
