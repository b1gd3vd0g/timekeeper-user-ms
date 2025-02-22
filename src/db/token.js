const jwt = require('jsonwebtoken');

// This chunk here guarantees that the environment variable is configured, even
// if the program is not started from `src/server.js` (such as if I'm testing in
// node).
if (!process.env.JWT_SECRET) {
    require('dotenv').config({
        path: '../../.env'
    });
}
const { JWT_SECRET } = process.env;
if (!JWT_SECRET) {
    throw new Error('ENVIRONMENT VARIABLE IS NOT CONFIGURED FOR JSONWEBTOKENS');
}

/**
 * Generates a JWT containing the information necessary to authenticate a user.
 * @param {object} user An object containing a `username` and `user_id`
 * representative of a single user in the database.
 * @returns A JWT containing all the necessary information to be used for
 * authentication purposes.
 * @throws an Error if `user` does not have a `username` and a `user_id` field.
 */
const generateAuthenticationToken = (user) => {
    const { username, user_id } = user;
    if (!(username && user_id)) {
        throw new Error('user.username && user.user_id are required!');
    }
    return jwt.sign(
        {
            username,
            user_id
        },
        JWT_SECRET,
        {
            expiresIn: 60 * 60 * 24 * 30 // 30 days
        }
    );
};

/**
 * Verifies an authentication token, and returns the payload upon success.
 * @param {string} token The JSON web token (provided by the `generateAuthenticationToken` function) to be verified.
 * @returns An object with a success boolean, and if that is true, a payload from the token - otherwise, returns a
 * message explaining why the token was rejected, and a three digit code to make life easier coding the front end.
 */
const verifyAuthenticationToken = (token) => {
    if (!token) {
        return {
            success: false,
            code: 'ABS',
            message: 'Token is missing.'
        };
    }
    try {
        const payload = jwt.verify(token, JWT_SECRET);
        return {
            success: true,
            payload: payload
        };
    } catch (e) {
        if (e instanceof jwt.TokenExpiredError) {
            return {
                success: false,
                code: 'EXP',
                message: 'Token is expired!'
            };
        } else if (e instanceof jwt.NotBeforeError) {
            return {
                success: false,
                code: 'EAR',
                message: 'It is too early to use this token!'
            };
        } else {
            return {
                success: false,
                code: 'INV',
                message: 'Token could not be parsed.'
            };
        }
    }
};

module.exports = { generateAuthenticationToken, verifyAuthenticationToken };
