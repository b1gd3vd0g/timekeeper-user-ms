const { generateSalt, hash } = require('./hashing');
const { ApiResponse } = require('./responses');
const { validateAll } = require('./validators');
const sql = require('./sql');
const {
    verifyAuthenticationToken,
    generateAuthenticationToken
} = require('./token');

/**
 * Authenticates a user's login credentials against the database. Provides a
 * JSONWebToken authenticating the user's identity, valid for 30 days.
 * @param {string} usernameOrEmail The username or email address of the player.
 * @param {string} password The password of the user
 * @returns {ApiResponse} success: `200 OK` \
 * fail: `400 BAD REQUEST`, `401 UNAUTHORIZED`, `500 INTERNAL SERVER ERROR`
 */
const authenticateUserLogin = async (usernameOrEmail, password) => {
    // Make sure we have good input.
    const problems = [];

    if (typeof usernameOrEmail !== 'string') {
        problems.push('username is not a string.');
    } else if (!usernameOrEmail.length) {
        problems.push('username is empty.');
    }

    if (typeof password !== 'string') {
        problems.push('password is not a string.');
    } else if (!password.length) {
        problems.push('password is empty.');
    }

    if (problems.length) {
        return new ApiResponse(400, { problems });
    }

    // Search case insensitively by username or email
    let users = [];
    try {
        users = await sql`
            SELECT user_id, username, password, salt
                FROM users
                WHERE lower(username) = lower(${usernameOrEmail})
                    OR lower(email) = lower(${usernameOrEmail})
                LIMIT 1;
        `;
    } catch (e) {
        return new ApiResponse(500, e);
    }

    // Does username/email match database?
    if (users.length !== 1) {
        return new ApiResponse(401);
    }

    const user = users[0];

    // Does password match this username/email?
    const hashedPw = hash(password, user.salt);
    if (hashedPw !== user.password) {
        return new ApiResponse(401);
    }

    // User has been authenticated. Generate them a new token.
    const { username, user_id } = user;
    const token = generateAuthenticationToken({ username, user_id });
    return new ApiResponse(200, { token });
};

/**
 * Creates a new user in the database.
 * @param {string} username The username of the user. Must follow the rules
 * defined in `validator.js`.
 * @param {string} email The email address of the user. Must follow the rules
 * defined in `validator.js`.
 * @param {string} password The password of the user. Must follow the rules
 * defined in `validator.js`.
 * @param {string|null} fName The first name of the user. This is not required,
 * but is a good idea for professionals.
 * @param {string|null} lName The last name of the user. This is not required,
 * but is a good idea for professionals.
 * @param {string|null} jobTitle The job title of the user (example: "Software
 * Engineer"). This is not required, but is a good idea for professionals.
 * @returns {ApiResponse} success: `201 CREATED`\
 * fail: `400 BAD REQUEST` `500 INTERNAL SERVER ERROR`
 */
const createUser = async (
    username,
    email,
    password,
    fName = null,
    lName = null,
    jobTitle = null
) => {
    // Ensure good input!
    const validation = validateAll(username, email, password);
    if (!validation.success) {
        delete validation.success;
        return new ApiResponse(400, validation);
    }

    // Create db object.
    const userId = generateSalt(8);
    const salt = generateSalt();
    const hashedPw = hash(password, salt);
    const dbObj = {
        user_id: userId,
        username,
        email,
        password: hashedPw,
        salt,
        f_name: fName,
        l_name: lName,
        job_title: jobTitle,
        created: new Date()
    };
    const cols = Object.keys(dbObj);

    try {
        await sql`
            INSERT INTO users ${sql(dbObj, cols)};
        `;
        return new ApiResponse(201);
    } catch (err) {
        return new ApiResponse(500, err);
    }
};

/**
 * This will retrieve the information for a single player, based on a token
 * which should be provided by the `authenticateUserLogin` function.
 * @param {string} token The JSON web token identifying the user.
 * @returns {ApiResponse} Success: `200 OK`\
 * Failure: `401 UNAUTHORIZED` `500 INTERNAL SERVER ERROR`
 */
const fetchUserByToken = async (token) => {
    const verification = verifyAuthenticationToken(token);
    if (!verification.success) {
        delete verification.success;
        return new ApiResponse(401, verification);
    }
    const { payload } = verification;
    const { user_id, username } = payload;
    let users = [];
    try {
        users = await sql`
            SELECT username, user_id, email, f_name, l_name, job_title, created
                FROM users
                WHERE username = ${username}
                    AND user_id = ${user_id}
                LIMIT 1;
        `;
    } catch (e) {
        return new ApiResponse(500, e);
    }
    if (users.length !== 1) {
        return new ApiResponse(401, {
            code: 'NMF',
            message: 'No user was found matching this token.'
        });
    }
    const user = users[0];
    return new ApiResponse(200, { user });
};

module.exports = { authenticateUserLogin, createUser, fetchUserByToken };
