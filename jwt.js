const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = (req, res, next) => {
    //check if the request headers has authorization or not
    const authorization=req.headers.authorization //21.22
    if(!authorization) return res.status(401).json({ error: 'Token not found' });
    // Extract the JWT token from the request header
    const token = req.headers.authorization.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    try {
        // Verify the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Attach user information to the request object
        req.user = decoded;
        next();
    } catch (err) {
        console.error(err);
        res.status(401).json({ error: 'Invalid token' });
    }
};

const generateToken = (userData) => {
    // Generate a new JWT token using user data
    return jwt.sign({ user: userData }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

module.exports = { jwtAuthMiddleware, generateToken };
