const authService = require("./auth.service");

const authMiddleware = async (req, res, next) => {
verifyToken: async (req, res, next) => {
        try {
            const token = req.headers.authorization.split(' ')[1];
            const decoded = await authService.verifyToken(token);
            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    };

    verifyAdmin: (req, res, next) => {
        if (req.user && req.user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ error: 'Access denied' });
        }
    }
    
};

module.exports = authMiddleware;