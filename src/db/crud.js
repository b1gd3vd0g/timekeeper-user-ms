const { generateSalt, hash } = require('./hashing');
const { ApiResponse } = require('./responses');
const { validateAll } = require('./validators');
const sql = require('./sql');

const authenticateUserLogin = async (usernameOrEmail, password) => {
    let users = [];
    // Search case insensitively by username or email
    try {
        users = await sql`
        SELECT user_id, username, password, salt
            FROM users
            WHERE lower(username) = lower(${usernameOrEmail})
                OR lower(email) = lower(${usernameOrEmail})
            LIMIT 1;
    `;
    } catch (e) {
        return ApiResponse(500, e);
    }

    // Does username/email match database?
    if (users.length !== 1) {
        return new ApiResponse(401);
    }

    const user = users[0];

    // Does password match this username?
    const hashedPw = hash(password, user.salt);
    if (hashedPw !== user.password) {
        return new ApiResponse(401);
    }

    // The username and password match our records!
    return new ApiResponse(200);
};

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

module.exports = { authenticateUserLogin, createUser };
