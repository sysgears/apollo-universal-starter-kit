import { BatchHttpLink } from 'apollo-link-batch-http';
import { ApolloLink } from 'apollo-link';
import { createUploadLink } from 'apollo-upload-client';
import extractFiles from 'extract-files';
import { cloneDeep } from 'lodash';
import i18n from 'i18next';

import settings from '@gqlapp/config';

import { PLATFORM } from '../../../packages/common/utils';

export default uri =>
  ApolloLink.split(
    ({ variables }) => extractFiles(cloneDeep(variables)).length > 0,
    createUploadLink({ uri, credentials: 'include' }),
    new BatchHttpLink({
      uri: settings.i18n.enabled && PLATFORM === 'mobile' ? () => `${uri}?lng=${i18n.language}` : uri,
      credentials: 'include'
    })
  );
