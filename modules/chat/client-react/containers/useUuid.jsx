import { useState, useEffect } from 'react';
import createUuid from 'uuid';

import { clientStorage } from '@gqlapp/core-common';

const useUuid = () => {
  const [uuid, setUuid] = useState(null);

  useEffect(() => {
    clientStorage.getItem('uuid').then(res => {
      setUuid(res || createUuid.v4());
      if (!res) clientStorage.setItem('uuid', uuid);
    });
  }, [uuid]);

  return uuid;
};

export default useUuid;
