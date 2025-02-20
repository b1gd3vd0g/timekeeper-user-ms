require('dotenv').config({
    path: '../.env'
});

const app = require('./app');
const fs = require('fs');

const { CERT_PATH, KEY_PATH } = process.env;

const options = {
    cert: fs.readFileSync(CERT_PATH),
    key: fs.readFileSync(KEY_PATH)
};

const server = require('https').createServer(options, app);
const port = 6901;

server.listen(port, () => {
    console.log(`Server listening on port ${port}.`);
});
