# Інструкція з PostgreSQL для macOS

## Перевірка чи встановлено PostgreSQL

### 1. Перевірка через команду `psql`:
```bash
which psql
```
Якщо команда повертає шлях (наприклад `/opt/homebrew/bin/psql`), то PostgreSQL встановлено.

### 2. Перевірка версії:
```bash
psql --version
```

### 3. Перевірка чи запущено сервіс:
```bash
pg_isready
```
Або через Homebrew:
```bash
brew services list | grep postgresql
```

## Встановлення PostgreSQL (якщо не встановлено)

### Через Homebrew:
```bash
brew install postgresql@16
```
Або останню версію:
```bash
brew install postgresql
```

## Запуск PostgreSQL

### Варіант 1: Запуск як сервіс (рекомендовано)
```bash
brew services start postgresql@16
```
Або для останньої версії:
```bash
brew services start postgresql
```

### Варіант 2: Одноразовий запуск
```bash
pg_ctl -D /opt/homebrew/var/postgresql@16 start
```

### Перевірка статусу:
```bash
brew services list | grep postgresql
```

## Зупинка PostgreSQL

```bash
brew services stop postgresql@16
```

## Перезапуск PostgreSQL

```bash
brew services restart postgresql@16
```

## Створення бази даних

Після встановлення та запуску:
```bash
createdb mytest
```

## Підключення до PostgreSQL

```bash
psql postgres
```
Або до конкретної бази:
```bash
psql mytest
```

## Корисні команди

- Вийти з psql: `\q`
- Показати всі бази даних: `\l`
- Показати всі таблиці: `\dt`
- Показати поточну базу даних: `SELECT current_database();`
