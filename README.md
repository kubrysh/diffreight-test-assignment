# Test Assignment for DiFFreight

**Tech**: AdonisJS, TypeScript, PostgreSQL, Redis, Lucide ORM

## Prerequisites

- Node.js (Latest LTS version)
- Docker and Docker Compose

## Usage

1. Install dependencies:
```bash
npm i
```

2. Start PostgreSQL and Redis containers using Docker Compose:
```bash
docker compose up -d
```

3. Run database migrations:
```bash
node ace migration:run
```

4. Seed the database:
```bash
node ace db:seed
```

5. Start the development server
```bash
npm run dev
```

## API Endpoints

### Update Transaction Price

**PATCH** `/transactions/:id`

Updates the price of a transaction with the given ID.

#### Request

- **URL Parameter:**
  - `id` (number): The ID of the transaction to update.

- **Body:**
  ```json
  {
    "price": 123.45
  }
  ```
  - `price` (number, required): The new price for the transaction. Must be between 0.01 and 100,000,000,000.

#### Response

- **200 OK**  
  Returns the updated transaction object.

- **400 Bad Request**  
  If validation fails, returns:
  ```json
  {
    "errors": { ... }
  }
  ```

- **404 Not Found**  
  If the transaction does not exist:
  ```json
  {
    "message": "Transaction not found"
  }
  ```

#### Example

```bash
curl -X PATCH http://localhost:3333/transactions/1 \
  -H "Content-Type: application/json" \
  -d '{"price": 500.00}'
```
