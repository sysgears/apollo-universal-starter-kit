export function mobileDetect(userAgent) {
  if (userAgent.indexOf('Android') !== -1) {
    return 'AndroidOS';
  } else if (userAgent.indexOf('iPhone') !== -1) {
    return 'iOS';
  }
  return 'other';
}

export function generateUrl(userAgent, ip, os, port) {
  if (process.env.NODE_ENV === 'production') {
    return 'graphql-app://';
  }
  return `exp://${ip}:${port}/+`;
}
