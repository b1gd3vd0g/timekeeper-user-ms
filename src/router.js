const {
    fetchUserByToken,
    authenticateUserLogin,
    createUser
} = require('../db/crud');

const router = require('express').Router();

const bLen = 'BEARER '.length;

router.get('/auth', async (req, res) => {
    const token = req.headers.authorization.substring(bLen);
    const response = await fetchUserByToken(token);
    return res.status(response.status).json(response.info);
});

router.post('/auth', async (req, res) => {
    const { username, password } = req.body;
    const response = await authenticateUserLogin(username, password);
    return res.status(response.status).json(response.info);
});

router.post('/', async (req, res) => {
    const {
        username,
        password,
        email,
        f_name = null,
        l_name = null,
        job_title = null
    } = req.body;
    const response = await createUser(
        username,
        email,
        password,
        f_name,
        l_name,
        job_title
    );
    return res.status(response.status).json(response.info);
});

module.exports = router;
