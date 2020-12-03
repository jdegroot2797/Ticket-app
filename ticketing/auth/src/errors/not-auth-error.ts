import { CustomError } from './custom-error';

export class NotAuthError extends CustomError {
  statusCode = 401;

  constructor() {
    super('Not Authorized');

    Object.setPrototypeOf(this, NotAuthError.prototype);
  }

  serializeErrors() {
    return [{ message: 'Not Authorized' }];
  }
}
