# Налаштування бази даних Neon

## Крок 1: Створіть файл `backend/.env`

Створіть файл `backend/.env` з таким вмістом:

```env
# Database
DATABASE_URL="postgresql://neondb_owner:npg_RZt2I0QpTwjW@ep-icy-mode-ag6b7lop-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# Server
PORT=3000
NODE_ENV=development

# JWT Secret (згенеровано автоматично)
JWT_SECRET=lcDX4Fj2CJgm5qqcCUspXRdFwve2JcqeNZ2+xgylB1s=

# Payment Gateway (Mock for now)
PAYMENT_API_KEY=mock-payment-api-key

# Email (Mock for now)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=mock-email@gmail.com
SMTP_PASS=mock-password
```

## Крок 2: Запустіть міграції

```bash
# Згенеруйте Prisma Client
npm run db:generate

# Застосуйте схему до бази даних
npm run db:push

# (Опціонально) Заповніть базу тестовими даними
npm run db:seed
```

## Крок 3: Перевірте підключення

```bash
# Запустіть backend сервер
npm run dev:server
```

Якщо все працює, ви побачите:
```
🚀 Server running on http://localhost:3000
```

## Готово! 🎉

База даних налаштована і готова до використання.
