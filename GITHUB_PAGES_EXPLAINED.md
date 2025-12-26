# 🌐 Як працює GitHub Pages з base path

## 📋 Поточна конфігурація:

### 1. Vite Config (`vite.config.ts`):
```typescript
const base = mode === 'production' ? '/pan-zelek/' : '/';
```

**Що це означає:**
- **Локально** (`npm run dev`): `base = '/'` → файли доступні на `http://localhost:5173/`
- **Production** (`npm run build`): `base = '/pan-zelek/'` → файли доступні на `https://marodi-mykhailo.github.io/pan-zelek/`

### 2. React Router (`src/App.tsx`):
```typescript
const basename = import.meta.env.BASE_URL || '/';
<Router basename={basename}>
```

**Що це означає:**
- Vite автоматично встановлює `import.meta.env.BASE_URL` = значення з `base` в конфігурації
- React Router використовує цей `basename` для всіх маршрутів

---

## 🔄 Як це працює на GitHub Pages:

### URL структура:

**GitHub Pages URL:** `https://marodi-mykhailo.github.io/pan-zelek/`

**Як працюють маршрути:**

1. **Головна сторінка:**
   - URL: `https://marodi-mykhailo.github.io/pan-zelek/`
   - React Router бачить: `/pan-zelek/` → з `basename="/pan-zelek/"` → обробляє як `/`
   - Відображає: `<PanZelekDefault />`

2. **Сторінка продуктів:**
   - URL: `https://marodi-mykhailo.github.io/pan-zelek/products`
   - React Router бачить: `/pan-zelek/products` → з `basename="/pan-zelek/"` → обробляє як `/products`
   - Відображає: `<ProductsPage />`

3. **Корзина:**
   - URL: `https://marodi-mykhailo.github.io/pan-zelek/cart`
   - React Router бачить: `/pan-zelek/cart` → з `basename="/pan-zelek/"` → обробляє як `/cart`
   - Відображає: `<CartPage />`

### Як працюють посилання:

**В компонентах використовується `Link` з react-router-dom:**
```tsx
import { Link } from 'react-router-dom';

<Link to="/products">Sklep</Link>
```

**Що відбувається:**
- React Router автоматично додає `basename` до всіх посилань
- `<Link to="/products">` → генерує `/pan-zelek/products` на GitHub Pages
- `<Link to="/cart">` → генерує `/pan-zelek/cart` на GitHub Pages

### Як працюють статичні файли:

**В `index.html` після build:**
```html
<script src="/pan-zelek/assets/index-xxx.js"></script>
<link href="/pan-zelek/assets/index-xxx.css">
```

**Що відбувається:**
- Vite автоматично додає `/pan-zelek/` до всіх шляхів до статичних файлів
- Браузер завантажує: `https://marodi-mykhailo.github.io/pan-zelek/assets/index-xxx.js`
- Все працює правильно! ✅

---

## ✅ Перевірка що все працює:

### Після деплою на GitHub Pages:

1. **Відкрийте:** https://marodi-mykhailo.github.io/pan-zelek/
2. **Перевірте консоль браузера (F12):**
   - Не має бути помилок 404 для JS/CSS файлів
   - Не має бути помилок "No routes matched location"

3. **Перевірте навігацію:**
   - Натисніть на "Sklep" → має перейти на `/pan-zelek/products`
   - Натисніть на "Koszyk" → має перейти на `/pan-zelek/cart`
   - Все має працювати без перезавантаження сторінки (SPA)

---

## 🔧 Якщо щось не працює:

### Проблема: Білий екран на GitHub Pages

**Рішення:**
1. Переконайтеся що використовуєте `Link` з `react-router-dom`, а не `<a>` теги
2. Переконайтеся що `basename` встановлений в `Router`
3. Перевірте що `base` в `vite.config.ts` = `/pan-zelek/` для production

### Проблема: 404 для статичних файлів

**Рішення:**
1. Переконайтеся що `base: '/pan-zelek/'` в `vite.config.ts` для production
2. Перебудьте проект: `npm run build`
3. Перевірте `dist/index.html` - шляхи мають починатися з `/pan-zelek/`

### Проблема: Маршрути не працюють

**Рішення:**
1. Переконайтеся що `basename={import.meta.env.BASE_URL}` в `Router`
2. Переконайтеся що всі посилання використовують `Link` з `react-router-dom`
3. Не використовуйте `<a href="/products">` - використовуйте `<Link to="/products">`

---

## 📝 Приклад правильного використання:

### ✅ Правильно:
```tsx
import { Link } from 'react-router-dom';

<Link to="/products">Sklep</Link>
<Link to="/cart">Koszyk</Link>
```

### ❌ Неправильно:
```tsx
<a href="/products">Sklep</a>  // Не працюватиме на GitHub Pages!
```

---

## 🎯 Підсумок:

**Локально:**
- `base = '/'` → `BASE_URL = '/'` → маршрути: `/`, `/products`, `/cart`
- URL: `http://localhost:5173/`

**GitHub Pages:**
- `base = '/pan-zelek/'` → `BASE_URL = '/pan-zelek/'` → маршрути: `/pan-zelek/`, `/pan-zelek/products`, `/pan-zelek/cart`
- URL: `https://marodi-mykhailo.github.io/pan-zelek/`

**React Router автоматично обробляє `basename`** - вам не потрібно нічого змінювати в компонентах! Просто використовуйте `<Link to="/path">` і все працюватиме. 🎉
