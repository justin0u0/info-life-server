'use strict';

class ErrorRes extends Error {
  constructor(code, message, errors = null, status = 400) {
    let messageString = '';
    if (typeof message === 'object') {
      messageString = message.message || JSON.stringify(message);
    } else {
      messageString = message;
    }
    super(messageString);

    this.code = code;
    this.message = messageString;
    this.status = status;
    this.errors = errors;
  }
}

module.exports = ErrorRes;
