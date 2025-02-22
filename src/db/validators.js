const { ValidatorResponse } = require('./responses');

/** The rules for the different input types. */
const rules = {
    username: [
        'Username must be a string.', //0
        'Username must have a length between 6 and 20 characters.', // 1
        'Username may include only letters, numbers, and underscores.', // 2
        'Username may not start with an underscore.', // 3
        'Username must be case-insensitively unique.' // 4
    ],
    email: [
        'Email must be a string.', // 0
        'Email must be in the format: "prefix@domain".', // 1
        'Domain must be at most 255 characters in length.', // 2
        'Domain may only include letters, numbers, dots, and dashes.', // 3
        'Domain must include at least two levels, separated by a dot.', // 4
        'Domain may not include consecutive dots or dashes.', // 5
        'Domain may not begin or end with dots or dashes.', // 6
        'Prefix must be at most 64 characters in length.', // 7
        'Prefix may only include letters, numbers, and the symbols in this set: [_ . - ! # $ % &]', // 8
        'Prefix may not start or end with a symbol.', // 9
        'Prefix may not contain consecutive symbols.', // 10
        'Email must be case-insensitively unique.', // 11
        'Email must be verified by the user.' // 12
    ],
    password: [
        'Password must be a string', // 0
        'Password must be between 8 and 32 characters.', // 1
        'Password must include at least one capital letter.', // 2
        'Password must include at least one lowercase letter.', // 3
        'Password must include at least one number.', // 4
        'Password must include at least one symbol from the following set: [! @ # $ % ^ & * + = ?].', // 5
        'Password may not include any symbols not included in the set: [! @ # $ % ^ & * + = ?], or any spaces.' // 6
    ]
};

/**
 * Validates a username against the rules defined in `rules.username`.
 *
 * 0. Username must be a string.
 * 1. Username must have a length between 6 and 20 characters.
 * 2. Username may include only letters, numbers, and underscores.
 * 3. Username may not start with an underscore.
 * 4. Username must be case-insensitively unique.
 *
 * __NOTE:__ Rule number 4 is not tested by this function, and must be checked
 * during the user's creation or username update.
 * @param {string} username The username to be validated.
 */
const validateUsername = (username) => {
    const problems = [];
    if (typeof username !== 'string') {
        // We don't know how else to examine this, so just return immediately.
        problems.push(rules.username[0]);
        return new ValidatorResponse(problems);
    }
    if (username.length < 6 || username.length > 20) {
        problems.push(rules.username[1]);
    }
    if (!/^[A-Za-z0-9_]$/.test(username)) {
        problems.push(rules.username[2]);
    }
    if (username.charAt(0) === '_') {
        problems.push(rules.username[3]);
    }
    return new ValidatorResponse(problems);
};

/**
 * Validates an email address against the following requirements:
 *
 * 0. Email must be a string.
 * 1. Email must be in the format: "prefix@domain".
 * 2. Domain must be between 2 and 255 characters in length.
 * 3. Domain may only include letters, numbers, dots, and dashes.
 * 4. Domain must include at least two levels, separated by a dot.
 * 5. Domain may not include consecutive dots or dashes.
 * 6. Domain may not begin or end with dots or dashes.
 * 7. Prefix must be at most 64 characters in length.
 * 8. Prefix may only include letters, numbers, and the symbols in this set:
 * [`_` `.` `-` `!` `#` `$` `%` `&` ]
 * 9. Prefix may not start or end with a symbol.
 * 10. Prefix may not contain consecutive symbols.
 * 11. Email must be case-insensitively unique.
 * 12. Email must be verified by the user.
 *
 * __NOTE:__ Rule number 11 is not tested by this function, and must be checked
 * during the user's creation or email update.
 *
 * __NOTE:__ Rule number 12 cannot be tested before creation. It is necessary
 * to send a confirmation email with a link for them to visit and verify their
 * email.
 * @param {string} email The email address to be validated.
 */
const validateEmail = (email) => {
    const problems = [];
    if (typeof email !== 'string') {
        problems.push(rules.email[0]);
        return new ValidatorResponse(problems);
    }
    if (!/^[^@]+@[^@]+/.test(email)) {
        problems.push(rules.email[1]);
    }
    // Because of the previous regex, we know this will work perfectly.
    const [prefix, domain] = email.split('@');
    if (domain.length > 255) {
        problems.push(rules.email[2]);
    }
    if (!/^[A-Za-z0-9.-]$/.test(email)) {
        problems.push(rules.email[3]);
    }
    const domains = domain.split('.');
    if (domains.length < 2) {
        problems.push(rules.email[4]);
    }
    const dd = '.-';
    for (let i = 0; i < domain.length; i++) {
        if (
            dd.includes(domain.charAt(i)) &&
            dd.includes(domain.charAt(i + 1))
        ) {
            problems.push(rules.email[5]);
            break;
        }
    }
    if (
        dd.includes(domain.charAt(0)) ||
        dd.includes(domain.charAt(domain.length - 1))
    ) {
        problems.push(rules.email[6]);
    }
    if (prefix.length > 64) {
        problems.push(rules.email[7]);
    }
    if (!/^[A-Za-z0-9_.!#$%&-]+$/.test(prefix)) {
        problems.push(rules.email[8]);
    }
    if (
        !/[A-Za-z0-9]/.test(prefix.charAt(0)) ||
        !/[A-Za-z0-9]/.test(prefix.charAt(prefix.length - 1))
    ) {
        problems.push(rules.email[9]);
    }
    const symbols = '_.!#$%&-';
    for (let i = 0; i < domain.length; i++) {
        if (
            symbols.includes(
                prefix.charAt(i) && symbols.includes(prefix.charAt(i + 1))
            )
        ) {
            problems.push(rules.email[10]);
            break;
        }
    }
    return new ValidatorResponse(problems);
};

/**
 * Validates a password against the following requirements:
 * 0. Password must be a string.
 * 1. Password must be between 8 and 32 characters.
 * 2. Password must include at least one capital letter.
 * 3. Password must include at least one lowercase letter.
 * 4. Password must include at least one number.
 * 5. Password must include at least one symbol from the following set:
 * [`!` `@` `#` `$` `%` `^` `&` `*` `+` `=` `?`].
 * 6. Password may not include any symbols not included in the set:
 * [`!` `@` `#` `$` `%` `^` `&` `*` `+` `=` `?`], or any spaces.
 * @param {string} password The password to be validated.
 */
const validatePassword = (password) => {
    const problems = [];
    if (typeof password !== 'string') {
        problems.push(rules.password[0]);
        return new ValidatorResponse(problems);
    }
    if (password.length < 8 || password.length > 32) {
        problems.push(rules.password[1]);
    }
    if (!/[A-Z]/.test(password)) {
        problems.push(rules.password[2]);
    }
    if (!/[a-z]/.test(password)) {
        problems.push(rules.password[3]);
    }
    if (!/[0-9]/.test(password)) {
        problems.push(rules.password[4]);
    }
    if (!/[!@#$%^&*+=?]/.test(password)) {
        problems.push(rules.password[5]);
    }
    if (!/^[A-Za-z0-9!@#$%^&*+=?]+$/.test(password)) {
        problems.push(rules.password[6]);
    }
    return new ValidatorResponse(problems);
};

/**
 * Validates a username, email address, and password against their requirements
 * (see requirements of specific fields in their proper functions).
 * @param {string} username The username to be validated.
 * @param {string} email The email address to be validated.
 * @param {string} password The password to be validated.
 */
const validateAll = (username, email, password) => {
    // Validate all fields individually.
    const unVal = validateUsername(username);
    const emVal = validateEmail(email);
    const pwVal = validatePassword(password);

    // We want to combine all these validations into a single object.
    const validation = {
        success: unVal.success && emVal.success && pwVal.success
    };
    if (!validation.success) {
        if (!unVal.success) {
            validation.username = unVal.problems;
        }
        if (!emVal.success) {
            validation.email = emVal.problems;
        }
        if (!pwVal.success) {
            validation.password = pwVal.problems;
        }
    }
    return validation;
};

module.exports = {
    rules,
    validateUsername,
    validateEmail,
    validatePassword,
    validateAll
};
