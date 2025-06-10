const jwt = require('jsonwebtoken');

const generateToken = (id, res) => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: true,         // ✅ Required for cross-site cookies over HTTPS
    sameSite: 'none',     // ✅ Required for cross-site usage
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
});


    return token;
};

module.exports = generateToken;
