#!/bin/bash

# Скрипт для створення backend/.env файлу з Neon connection string

ENV_FILE="backend/.env"

# Перевірка чи файл вже існує
if [ -f "$ENV_FILE" ]; then
    echo "⚠️  Файл $ENV_FILE вже існує!"
    read -p "Перезаписати? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Скасовано."
        exit 1
    fi
fi

# Генерація JWT secret
JWT_SECRET=$(openssl rand -base64 32)

# Створення .env файлу
cat > "$ENV_FILE" << EOF
# Database
DATABASE_URL="postgresql://neondb_owner:npg_RZt2I0QpTwjW@ep-icy-mode-ag6b7lop-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# Server
PORT=3000
NODE_ENV=development

# JWT Secret (auto-generated)
JWT_SECRET=$JWT_SECRET

# Payment Gateway (Mock for now)
PAYMENT_API_KEY=mock-payment-api-key

# Email (Mock for now)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=mock-email@gmail.com
SMTP_PASS=mock-password
EOF

echo "✅ Файл $ENV_FILE створено успішно!"
echo ""
echo "Наступні кроки:"
echo "1. npm run db:generate"
echo "2. npm run db:push"
echo "3. npm run db:seed (опціонально)"
echo "4. npm run dev:server"
