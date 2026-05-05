## API-контракт (что нужно от бэкенда)
База URL: `/api`.
Во все приватные запросы: `Authorization: Bearer <accessToken>`.

### 1) Регистрация
`POST /api/auth/register`

Request:
```json
{
  "email": "user@example.com",
  "password": "string_min_8",
  "name": "User Name"
}
```
Response `201`:
```json
{
  "accessToken": "jwt_token",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

### 2) Вход
`POST /api/auth/login`

Request:
```json
{
  "email": "user@example.com",
  "password": "password"
}
```
Response `200`:
```json
{
  "accessToken": "jwt_token",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

### 3) Профиль (проверка токена)
`GET /api/auth/me`

Response `200`:
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "User Name"
}
```

### 4) Выход (опционально)
`POST /api/auth/logout`

Request: пустой body.
Response `204`.

### 5) Список финансовых событий
`GET /api/transactions?type=income|expense&from=2026-01-01&to=2026-12-31&page=1&limit=20`

Response `200`:
```json
{
  "items": [
    {
      "id": "uuid",
      "type": "expense",
      "amount": 1250.5,
      "currency": "RUB",
      "category": "Food",
      "comment": "Lunch",
      "occurredAt": "2026-04-30T10:00:00.000Z",
      "createdAt": "2026-04-30T10:00:00.000Z",
      "updatedAt": "2026-04-30T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 53
  },
  "summary": {
    "incomeTotal": 100000,
    "expenseTotal": 42000,
    "balance": 58000
  }
}
```

### 6) Создание события
`POST /api/transactions`

Request:
```json
{
  "type": "income",
  "amount": 30000,
  "currency": "RUB",
  "category": "Salary",
  "comment": "April salary",
  "occurredAt": "2026-04-29T18:00:00.000Z"
}
```
Response `201`:
```json
{
  "id": "uuid",
  "type": "income",
  "amount": 30000,
  "currency": "RUB",
  "category": "Salary",
  "comment": "April salary",
  "occurredAt": "2026-04-29T18:00:00.000Z",
  "createdAt": "2026-04-30T10:00:00.000Z",
  "updatedAt": "2026-04-30T10:00:00.000Z"
}
```

### 7) Обновление события
`PATCH /api/transactions/:id`

Request (частичный):
```json
{
  "amount": 32000,
  "comment": "Corrected amount"
}
```
Response `200`: обновленный объект события (как в create).

### 8) Удаление события
`DELETE /api/transactions/:id`

Response `204`.

## Единая модель ошибок
Для удобства фронта:
```json
{
  "message": "Validation error",
  "code": "VALIDATION_ERROR",
  "errors": {
    "email": ["Invalid email"]
  }
}
```
Коды: `400`, `401`, `403`, `404`, `409`, `422`, `500`.

## Проверка готовности
- Регистрация и логин работают и ведут в кабинет.
- После перезагрузки страницы с валидным токеном пользователь остается в кабинете.
- CRUD операций по событиям корректно синхронизирует UI и backend.
- Ошибки API отображаются пользователю человекочитаемо.
- `401` гарантированно разлогинивает и отправляет на auth-страницу.