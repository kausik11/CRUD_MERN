# Product CRUD API (Express + MongoDB)

Simple REST API for managing products using Express.js and MongoDB via Mongoose.

## Prerequisites
- Node.js 18+
- MongoDB instance (local or remote)

## Setup
1) Install dependencies:
```bash
npm install
```
2) Configure environment:
   - Copy `.env.example` to `.env`
   - Update `MONGODB_URI` to your MongoDB connection string
   - Optionally change `PORT`
3) Start the server:
```bash
# development with watch
npm run dev

# production
npm start
```
Server defaults to `http://localhost:5000`.

## API
Base URL: `/api/products`

### Create Product
- **POST** `/api/products`
- Body:
```json
{
  "name": "Desk Lamp",
  "description": "Warm LED lamp",
  "price": 39.99,
  "category": "Lighting",
  "inStock": true
}
```
- Sample response `201`:
```json
{
  "_id": "665b5df51b7849fc9cfbcf42",
  "name": "Desk Lamp",
  "description": "Warm LED lamp",
  "price": 39.99,
  "category": "Lighting",
  "inStock": true,
  "createdAt": "2025-12-03T10:07:17.234Z",
  "__v": 0
}
```

### Read All Products
- **GET** `/api/products`
- Sample response `200`:
```json
[
  {
    "_id": "665b5df51b7849fc9cfbcf42",
    "name": "Desk Lamp",
    "description": "Warm LED lamp",
    "price": 39.99,
    "category": "Lighting",
    "inStock": true,
    "createdAt": "2025-12-03T10:07:17.234Z",
    "__v": 0
  }
]
```

### Read Single Product
- **GET** `/api/products/:id`
- Response `200` same shape as create response when found
- Response `404` if not found: `{"message":"Product not found"}`

### Update Product
- **PUT** `/api/products/:id`
- Body: any updatable fields, e.g.
```json
{ "price": 34.99, "inStock": false }
```
- Response `200` returns the updated product; `404` if missing.

### Delete Product
- **DELETE** `/api/products/:id`
- Response `200`: `{"message":"Product deleted"}`; `404` if missing.

## Project Structure
```
src/
  config/db.js          # Mongo connection helper
  controllers/          # Route handlers
  models/               # Mongoose schemas
  routes/               # Express routers
  server.js             # App entry point
```

## Notes
- Requests and responses are JSON; set `Content-Type: application/json`.
- Errors return `{ "message": "..." }` with appropriate HTTP status codes.
