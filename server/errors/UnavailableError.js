"use strict";
function UnavailableError(code, error) {
    Error.call(this, error.message);
    Error.captureStackTrace(this, this.constructor);
    this.name = "UnavailableError";
    this.message = error.message;
    this.code = code;
    this.status = 422;
    this.inner = error;
}

UnavailableError.prototype = Object.create(Error.prototype);
UnavailableError.prototype.constructor = UnavailableError;

module.exports = UnavailableError;