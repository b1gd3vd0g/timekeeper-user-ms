/**
 * Validates a username against the following requirements:
 * 1. Must be between 6 and 20 characters.
 * 2. Can only include letters, numbers, and underscores.\
 * __Note:__ The uniqueness requirement is NOT tested in this function.
 * @param {string} username The username to be validated.
 */
const validateUsername = (username) => {};

/**
 * Validates an email address against the following requirements:
 * 1. Must be in the format: username\@domain.
 * 2. The domain must contain at least two levels, separated by a dot.
 * 3. The top level domain must include only letters.
 * 4. The domain may only include letters, numbers, dots, and dashes.
 * 5. The username may only contain letters, numbers, and certain symbols.\
 * __Note:__ The uniqueness requirement is NOT tested in this function.
 * @param {string} email The email address to be validated.
 */
const validateEmail = (email) => {};

/**
 * Validates a password against the following requirements:
 * 1. Must be between 8 and 32 characters.
 * 2. Must include at least one capital letter.
 * 3. Must include at least one lowercase letter.
 * 4. Must include at least one number.
 * 5. Must include at least one symbol.
 * 6. May not contain any forbidden symbols or spaces.
 * @param {string} password The password to be validated.
 */
const validatePassword = (password) => {};

/**
 * Validates a username, email address, and password against their requirements
 * (see requirements of specific fields in their proper functions).
 * @param {string} username The username to be validated.
 * @param {string} email The email address to be validated.
 * @param {string} password The password to be validated.
 */
const validateAll = (username, email, password) => {
    const unVal = validateUsername(username);
    const emVal = validateEmail(email);
    const pwVal = validatePassword(password);
};
