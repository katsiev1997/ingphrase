# Миграция с Prisma на Drizzle ORM

## Выполненные изменения

### 1. Установка пакетов

- Удален: `@prisma/client`, `prisma`
- Установлен: `drizzle-orm`, `postgres`, `@neondatabase/serverless`, `drizzle-kit`

### 2. Создана схема Drizzle

- Файл: `drizzle/schema.ts` - содержит все таблицы и связи
- Файл: `drizzle/db.ts` - конфигурация подключения к базе данных
- Файл: `drizzle/db-client.ts` - экспорт клиента базы данных

### 3. Обновлены API роуты

Все API роуты обновлены для использования Drizzle ORM:

- `/api/auth/` - аутентификация
- `/api/categories/` - управление категориями
- `/api/phrases/` - управление фразами
- `/api/phrases/search/` - поиск фраз
- `/api/phrases/favorite/` - избранные фразы
- `/api/phrases/upload-audio/` - загрузка аудио
- `/api/phrases/delete-audio/` - удаление аудио
- `/api/dialogs/` - управление диалогами

### 4. Обновлены утилиты

- `src/shared/lib/auth-utils.ts` - обновлен для работы с Drizzle

### 5. Обновлен package.json

Добавлены скрипты для Drizzle:

- `db:generate` - генерация миграций
- `db:migrate` - применение миграций
- `db:push` - отправка схемы в базу данных
- `db:studio` - открытие Drizzle Studio

## Следующие шаги

### 1. Применить миграции к базе данных

```bash
bun run db:push
```

### 2. Проверить работу приложения

```bash
bun run dev
```

### 3. При необходимости создать дополнительные миграции

```bash
bun run db:generate
bun run db:migrate
```

## Преимущества Drizzle

1. **Производительность** - более быстрые запросы
2. **TypeScript** - полная типизация из коробки
3. **Простота** - более простой API
4. **Размер** - меньший размер бандла
5. **SQL-подобный синтаксис** - более понятные запросы

## Структура базы данных

- `users` - пользователи с ролями
- `categories` - категории фраз
- `phrases` - фразы с переводами и аудио
- `dialogues` - диалоги
- `messages` - сообщения в диалогах
- `favoritePhrases` - связь пользователей и избранных фраз

## Поддержка Neon Database

Проект настроен для работы с Neon Database через `@neondatabase/serverless` пакет, что обеспечивает:

- Serverless подключение
- Автоматическое масштабирование
- Высокую производительность
