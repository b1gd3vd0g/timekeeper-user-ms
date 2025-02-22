/**
 * Constructs an API Response. These should be returned from all database
 * functions, to keep the code for the routers very simple.
 * @param {number} status An HTTP response code reflecting the status of the request.
 * @param {object|string} info All necessary info to be returned in the body of the response.
 */
function ApiResponse(status, info = {}) {
    this.status = status;
    this.info = typeof info === 'string' ? { message: info } : info;
}

/**
 * Constructs a ValidatorResponse. This should be returned from validator
 * functions which validate a _singular_ input.
 * @param {string[]} problems A list of problems with the input.
 */
function ValidatorResponse(problems = []) {
    this.success = problems.length === 0;
    if (!this.success) {
        this.problems = problems;
    }
}

module.exports = { ApiResponse, ValidatorResponse };
