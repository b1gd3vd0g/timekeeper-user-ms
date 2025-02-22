const sql = require('./sql');

const createUsersTable = async () => {
    await sql`
        CREATE TABLE IF NOT EXISTS users(
            user_id     TEXT                        PRIMARY KEY UNIQUE NOT NULL,
            username    TEXT                        UNIQUE NOT NULL,
            email       TEXT                        UNIQUE NOT NULL,
            password    TEXT                        NOT NULL,   
            salt        TEXT                        NOT NULL,
            created     TIMESTAMP WITH TIME ZONE    NOT NULL
            f_name      TEXT,
            l_name      TEXT,
            job_title   TEXT
        );
    `;
};

module.exports = { createUsersTable };
