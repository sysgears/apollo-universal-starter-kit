export class ContextError extends Error {
  constructor(message = '`auth` property not found on context!') {
    super(message);
    this.message = message;
    this.name = 'ContextError';
  }
}

export class AuthorizationError extends Error {
  constructor(message = 'Permission Denied!') {
    super(message);
    this.message = message;
    this.name = 'AuthorizationError';
  }
}
