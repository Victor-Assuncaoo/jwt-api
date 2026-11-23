const dotenv = require('dotenv');
dotenv.config();

const db = require('./config/db');
const express = require('express');
const cors = require('cors');

// Importa associações (deve ser antes de usar os modelos nas rotas)
require('./models/index');

const authRouter = require('./auth/auth.router');
const userRouter = require('./user/user.router');
const categoryRouter = require('./category/category.router');
const authorRouter = require('./author/author.router');
const bookRouter = require('./book/book.router');
const readerRouter = require('./reader/reader.router');
const loanRouter = require('./loan/loan.router');
const reportsRouter = require('./reports/reports.router');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS liberado para qualquer porta local (5173, 3000, 3001, etc.)
app.use(cors({
    origin: (origin, callback) => {
        // Permite requisições sem origin (como curl/Postman) ou de qualquer localhost
        if (!origin || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
            callback(null, true);
        } else {
            callback(null, true);
        }
    },
    credentials: true,
}));
app.use(express.json());

// Rotas
app.use('/v1/auth', authRouter);
app.use('/v1/user', userRouter);
app.use('/v1/categories', categoryRouter);
app.use('/v1/authors', authorRouter);
app.use('/v1/books', bookRouter);
app.use('/v1/readers', readerRouter);
app.use('/v1/loans', loanRouter);
app.use('/v1/reports', reportsRouter);

// Seed: cria ou atualiza o usuário admin (admin@biblioteca.com / 123456)
async function seed() {
    const bcrypt = require('bcrypt');
    const User = require('./user/user.model');
    const hashedPassword = await bcrypt.hash('123456', 10);
    const admin = await User.findOne({ where: { email: 'admin@biblioteca.com' } });
    if (!admin) {
        await User.create({
            name: 'Admin',
            username: 'admin',
            email: 'admin@biblioteca.com',
            password: hashedPassword,
            isAdmin: true,
            active: true,
        });
        console.log('✅ Seed: admin@biblioteca.com criado (senha: 123456)');
    } else {
        await admin.update({
            password: hashedPassword,
            isAdmin: true,
            active: true,
        });
        console.log('✅ Seed: admin@biblioteca.com pronto (senha: 123456)');
    }
}

db.sync()
    .then(async () => {
        await seed();
        app.listen(PORT, () => {
            console.log(`🚀 SERVIDOR RODANDO http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Erro ao sincronizar banco:', err);
    });
