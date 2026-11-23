// Importa todos os modelos para garantir que estão registrados no Sequelize
const User = require('../user/user.model');
const Category = require('../category/category.model');
const Author = require('../author/author.model');
const Book = require('../book/book.model');
const Reader = require('../reader/reader.model');
const Loan = require('../loan/loan.model');
const RefreshToken = require('../auth/refreshToken.model');

// 1. Categoria → Livros (1:N)
Category.hasMany(Book, { foreignKey: 'CategoryId' });
Book.belongsTo(Category, { foreignKey: 'CategoryId' });

// 2. Livro ↔ Autor (N:N) via tabela BookAuthor
Author.belongsToMany(Book, { through: 'BookAuthor', foreignKey: 'AuthorId' });
Book.belongsToMany(Author, { through: 'BookAuthor', foreignKey: 'BookId' });

// 3. Leitor → Empréstimos (1:N)
Reader.hasMany(Loan, { foreignKey: 'readerId' });
Loan.belongsTo(Reader, { foreignKey: 'readerId' });

// 4. Livro → Empréstimos (1:N)
Book.hasMany(Loan, { foreignKey: 'bookId' });
Loan.belongsTo(Book, { foreignKey: 'bookId' });

// 5. Usuário (Atendente) → Empréstimos (1:N)
User.hasMany(Loan, { foreignKey: 'userId' });
Loan.belongsTo(User, { foreignKey: 'userId' });

// 6. Usuário → RefreshTokens (1:N)
User.hasMany(RefreshToken, { foreignKey: 'userId' });
RefreshToken.belongsTo(User, { foreignKey: 'userId' });

module.exports = { User, Category, Author, Book, Reader, Loan, RefreshToken };
