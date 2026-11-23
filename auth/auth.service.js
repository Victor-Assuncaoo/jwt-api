const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const userService = require('../user/user.service');
const RefreshToken = require('./refreshToken.model');

const authService = {
    login: async (email, password) => {
        // Regra 2.5 do README: verificar se usuário existe antes do bcrypt.compare
        const user = await userService.findByEmail(email);
        if (!user) throw new Error('Invalid email or password');

        if (user.active === false) throw new Error('Usuário desativado');

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error('Invalid email or password');

        // Access token: 15 minutos, payload com id, name, email e isAdmin
        const accessToken = jwt.sign(
            { id: user.id, email: user.email, name: user.name, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        // Refresh token: 7 dias, salvo na tabela RefreshToken
        const refreshTokenValue = crypto.randomBytes(64).toString('hex');
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        await RefreshToken.create({
            token: refreshTokenValue,
            userId: user.id,
            expiresAt,
            revoked: false,
        });

        return {
            token: accessToken,
            accessToken,
            refreshToken: refreshTokenValue,
            user: { id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin },
        };
    },

    refresh: async (refreshTokenValue) => {
        const tokenData = await RefreshToken.findOne({ where: { token: refreshTokenValue } });

        if (!tokenData) throw new Error('Invalid refresh token');

        // Detecção de roubo de token: se já revogado, revoga TODOS os refresh tokens daquele usuário
        if (tokenData.revoked) {
            await RefreshToken.update({ revoked: true }, { where: { userId: tokenData.userId } });
            throw new Error('Refresh token revogado – detecção de reuso/roubo de token');
        }

        if (new Date() > new Date(tokenData.expiresAt)) {
            await tokenData.update({ revoked: true });
            throw new Error('Refresh token expirado');
        }

        const user = await userService.findById(tokenData.userId);
        if (!user) throw new Error('User not found');
        if (user.active === false) throw new Error('Usuário desativado');

        // Rotação: revoga o antigo
        await tokenData.update({ revoked: true });

        // Emite novo par de tokens
        const accessToken = jwt.sign(
            { id: user.id, email: user.email, name: user.name, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '15m' }
        );

        const newRefreshTokenValue = crypto.randomBytes(64).toString('hex');
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        await RefreshToken.create({
            token: newRefreshTokenValue,
            userId: user.id,
            expiresAt,
            revoked: false,
        });

        return {
            token: accessToken,
            accessToken,
            refreshToken: newRefreshTokenValue,
            user: { id: user.id, name: user.name, email: user.email, isAdmin: user.isAdmin },
        };
    },

    logout: async (refreshTokenValue) => {
        if (refreshTokenValue) {
            await RefreshToken.update(
                { revoked: true },
                { where: { token: refreshTokenValue } }
            );
        }
    },

    me: async (userId) => {
        const user = await userService.findById(userId);
        if (!user) throw new Error('User not found');
        return { id: user.id, name: user.name, email: user.email, username: user.username, isAdmin: user.isAdmin };
    },

    verifyToken: (token) => {
        try {
            return jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            throw new Error('Invalid token');
        }
    },
};

module.exports = authService;
