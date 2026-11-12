const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const userService = require('../user/user.service');
const LogoutList = require('./logoutList.model');
const RefreshTokenService = require('./refreshToken.model');
const authService = {
    login: async (email, password) => {
        const user = await userService.findByEmail(email);

        if (!user) throw new Error('Invalid email or password');
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!user || !isMatch) {
            throw new Error('Invalid email or password');
        }
        const token = jwt.sign(
            {
             id: user.id,
              email: user.email,
              name: user.name
            }, process.env.JWT_SECRET, 
            { expiresIn: '1h', });
        return token;
    },

RefreshToken: async (refreshToken) => {
        try {
            const tokenData = await RefreshTokenService.findOne({ where: { token: refreshToken } });
            if (!tokenData) {
                throw new Error('Invalid refresh token');
            }
            const user = await userService.findById(tokenData.userId);
            if (!user) {
                throw new Error('User not found');
            }
            const newToken = jwt.sign(
                {
                    id: user.id,
                    email: user.email,
                    name: user.name
                }, process.env.JWT_SECRET, 
                { expiresIn: '1h' });
            return { token: newToken };
        } catch (error) {
            throw new Error('Error refreshing token: ' + error.message);
        }
    },

    me: async (userId) => {
        const user = await userService.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    },

    logout: async (token) => {
        // Implement logout logic if needed (e.g., token blacklisting)
        await LogoutList.create({ token });
        
    },

    verifyToken: async (token) => {
        try {
            const isBlacklisted = await LogoutList.findOne(
                { where: { token } });
            if (isBlacklisted) {
                throw new Error('Token revogado');
            }
          
        
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            return decoded;
        } catch (error) {
            throw new Error('Invalid token');
        }
    }
};

module.exports = authService;