const { validateUsername } = require('./validators');

test('valid username', () => {
    expect(validateUsername('b1gd3vd0g').success).toBe(true);
});
