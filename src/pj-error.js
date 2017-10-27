'use strict';

/**
 * plantJournal Error class
 * Error class for plantJournal specific errors.
 * @type {Error}
 */
class pjError extends Error {
    /**
     * All pjErrors shall have an error code and an error message.
     * We enfore this by having the error code as a function argument
     * instead of a instance attribute.
     * @param  {Integer} status
     *         HTTP status code for this error
     * @param  {String} code
     *         A short computer understandable code starting with an capital
     *         E. All characters should be uppersized and
     * @param  {String} message [description]
     */
    constructor(status, code, message) {
        super(message);
        this.status = status;
        this.code = code;
        Error.captureStackTrace(this, pjError);
    }
}

module.exports = pjError;
