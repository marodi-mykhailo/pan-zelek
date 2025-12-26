# Backend API

## Налаштування

1. **Встановіть залежності:**
```bash
npm install
```

2. **Створіть файл `.env` в папці `backend/`:**
```bash
cp backend/.env.example backend/.env
```

3. **Налаштуйте DATABASE_URL в `.env`:**
```
DATABASE_URL="postgresql://user:password@localhost:5432/panzelek?schema=public"
```

4. **Створіть базу даних:**
```bash
createdb panzelek
```

5. **Запустіть міграції Prisma:**
```bash
npm run db:push
# або для production
npm run db:migrate
```

6. **Згенеруйте Prisma Client:**
```bash
npm run db:generate
```

## Запуск

### Розробка (тільки backend):
```bash
npm run dev:server
```

### Розробка (frontend + backend):
```bash
npm run dev:all
```

### Production:
```bash
npm run build:all
node backend/dist/server.js
```

## API Endpoints

### Products
- `GET /api/products` - Отримати всі товари
- `GET /api/products/:id` - Отримати товар за ID

### Cart
- `GET /api/cart` - Отримати кошик
- `POST /api/cart/add` - Додати товар в кошик
- `DELETE /api/cart/:itemId` - Видалити товар з кошика

### Orders
- `POST /api/orders` - Створити замовлення
- `GET /api/orders/:id` - Отримати замовлення

### Auth
- `POST /api/auth/register` - Реєстрація
- `POST /api/auth/login` - Вхід

## Prisma Studio

Для перегляду бази даних:
```bash
npm run db:studio
```
