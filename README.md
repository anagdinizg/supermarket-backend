# Supermercado Backend

Backend de exemplo para um sistema de supermercado (API REST) em Node.js + Express + MongoDB.

## Visão geral
API com autenticação JWT, controle de roles (admin / manager / employee), CRUD de usuários, produtos e clientes, e tratamento de erros centralizado.

## Arquivos principais
- [server.js](server.js) — ponto de entrada da aplicação.
- [.env](.env) — variáveis de ambiente.
- [package.json](package.json) — scripts e dependências.
- [seed.js](seed.js) — script para inserir usuários de exemplo.

Configuração e conexão com o banco:
- [`connectDB`](src/config/database.js) ([src/config/database.js](src/config/database.js))

Autenticação / autorização:
- Middleware: [`protect`](src/middleware/authMiddleware.js), [`authorize`](src/middleware/authMiddleware.js), e gerador de token [`generateToken`](src/middleware/authMiddleware.js) ([src/middleware/authMiddleware.js](src/middleware/authMiddleware.js))
- Tratamento de erros: [`errorHandler`](src/middleware/errorHandler.js) ([src/middleware/errorHandler.js](src/middleware/errorHandler.js))

Rotas (principais):
- [src/routes/authRoutes.js](src/routes/authRoutes.js) — autenticação (register, login, me, update-password)
- [src/routes/userRoutes.js](src/routes/userRoutes.js) — gerenciamento de usuários
- [src/routes/productRoutes.js](src/routes/productRoutes.js) — gerenciamento de produtos
- [src/routes/customerRoutes.js](src/routes/customerRoutes.js) — gerenciamento de clientes

Controllers (implementações das rotas):
- [src/controllers/authController.js](src/controllers/authController.js) — `register`, `login`, `getMe`, `updatePassword`
- [src/controllers/userController.js](src/controllers/userController.js) — `getUsers`, `getUser`, `updateUser`, `deleteUser`, `uploadProfileImage`, `deleteProfileImage`
- [src/controllers/productController.js](src/controllers/productController.js)
- [src/controllers/customerController.js](src/controllers/customerController.js)

Services (lógica de negócio):
- [src/services/authService.js](src/services/authService.js)
- [src/services/userService.js](src/services/userService.js)
- [src/services/productService.js](src/services/productService.js)
- [src/services/customerService.js](src/services/customerService.js)

Models:
- [`User`](src/models/User.js) ([src/models/User.js](src/models/User.js))
- [src/models/Product.js](src/models/Product.js)
- [src/models/Customer.js](src/models/Customer.js)

## Requisitos
- Node.js >= 18
- MongoDB rodando (URI em [.env](.env))

## Instalação e execução
1. Instalar dependências:
```bash
npm install
```

2. Configurar variáveis em [.env](.env) (ex.: `MONGODB_URI`, `JWT_SECRET`, `PORT`).

3. Popular dados de teste (opcional):
```bash
npm run seed
# remover dados:
# npm run seed -- -d
```

4. Rodar em desenvolvimento:
```bash
npm run dev
```
ou em produção:
```bash
npm start
```

## Endpoints principais
- Auth: [src/routes/authRoutes.js](src/routes/authRoutes.js)
  - POST /api/auth/register
  - POST /api/auth/login
  - GET /api/auth/me (protegido)
  - PUT /api/auth/update-password (protegido)

- Users: [src/routes/userRoutes.js](src/routes/userRoutes.js)
- Products: [src/routes/productRoutes.js](src/routes/productRoutes.js)
- Customers: [src/routes/customerRoutes.js](src/routes/customerRoutes.js)

Detalhes de autorização e geração de token: ver [`protect`](src/middleware/authMiddleware.js), [`authorize`](src/middleware/authMiddleware.js) e [`generateToken`](src/middleware/authMiddleware.js).

## Tratamento de erros
Centralizado em [`errorHandler`](src/middleware/errorHandler.js) — retorna mensagens e códigos HTTP apropriados.

## Boas práticas / Observações
- Senhas são armazenadas hashed (ver [src/models/User.js](src/models/User.js)).
- Algumas operações são soft-delete (clientes ficam com `active: false`).
- Validações de dados e códigos de erro estão nas services e no middleware de erros.
