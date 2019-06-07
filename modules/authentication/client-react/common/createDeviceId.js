import uuid from 'uuid';

let deviceId;

const createDeviceId = () => {
  if (!deviceId) {
    deviceId = uuid.v4();
    return deviceId;
  }
  return deviceId;
};

export default createDeviceId;
