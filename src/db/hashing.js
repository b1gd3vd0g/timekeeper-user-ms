const crypto = require('crypto');

const HASH_SIZE = 64;

/**
 * Create a hash out of a password and a salt.
 * @param {string} pw The password to be hashed.
 * @param {string} salt The salt, to make the password more secure.
 * Should be the output of the `generateSalt` function.
 * @returns A hash made using the password and salt.
 */
const hash = (pw, salt) => {
    return crypto
        .pbkdf2Sync(pw, salt, 10_000, HASH_SIZE, 'sha512')
        .toString('hex');
};

/**
 * Generates a random salt string that is twice the length of hashSize.
 * @param {number} hashSize Half the length of the string.
 * @returns {string} A random salt string.
 */
const generateSalt = (hashSize = HASH_SIZE) => {
    return crypto.randomBytes(HASH_SIZE).toString('hex');
};

module.exports = { hash, generateSalt };
