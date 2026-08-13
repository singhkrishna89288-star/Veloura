# VELOURA — Elevate Your Everyday Style

A full-stack clothing e-commerce web application built with **HTML/CSS/vanilla JS**, **Node.js/Express**, and **MongoDB**. Veloura sells only clothing across four categories: **Men, Women, Kids, and Infants**.

> Built as a college / portfolio project to demonstrate a complete e-commerce flow: product browsing, cart, wishlist, authentication, checkout (COD + Razorpay), orders, and a simple admin panel.

---

## 1. Project Overview

Veloura is a single-page-style storefront (vanilla JS, no framework) backed by a REST API. Users can browse clothing by category/subcategory, search and filter products, manage a cart and wishlist, register/login, place orders with Cash on Delivery or Razorpay, and track order history. Admins get a lightweight dashboard to manage products, view orders, and update order status.

---

## 2. Features

- Browse Men / Women / Kids / Infants clothing collections
- Search, category & subcategory filters, price range filter, sorting (price, rating, name), pagination (load more)
- Product detail page with size selection, quantity, stock status
- Cart with quantity controls, subtotal, discount, delivery charge, total (persisted in `localStorage`)
- Wishlist with move-to-cart (persisted in `localStorage`)
- JWT authentication (register/login/logout) with hashed passwords
- Account dashboard: profile, order history, wishlist summary
- Checkout with shipping details, Cash on Delivery, and Razorpay online payment
- Order model with full lifecycle: Pending → Confirmed → Shipped → Delivered / Cancelled
- Simple admin panel: manage products (create/edit/delete), view & update all orders, view users
- Secure by default: hashed passwords, JWT auth middleware, environment variables, no secrets in frontend, input validation, CORS, `.gitignore`

---

## 3. Technologies

**Frontend:** HTML5, CSS3, Vanilla JavaScript
**Backend:** Node.js, Express.js
**Database:** MongoDB with Mongoose
**Auth:** JWT + bcrypt password hashing
**Payments:** Razorpay (order creation + signature verification structure)

---

## 4. Folder Structure

```
Veloura/
│
├── client/                  # Frontend (served as static files by Express)
│   ├── index.html
│   ├── css/style.css
│   ├── js/
│   │   ├── app.js           # Routing, navbar, account & admin panel
│   │   ├── products.js      # Product fetching/rendering, filters, sort
│   │   ├── cart.js          # Cart (localStorage)
│   │   ├── wishlist.js      # Wishlist (localStorage)
│   │   ├── auth.js          # Register/login/logout, API helper
│   │   └── checkout.js      # Checkout + Razorpay flow
│   └── assets/
│
├── server/
│   ├── server.js            # Express app entry point
│   ├── config/db.js         # MongoDB connection
│   ├── models/               # User, Product, Order (Mongoose schemas)
│   ├── routes/                # authRoutes, productRoutes, orderRoutes, paymentRoutes
│   ├── controllers/           # Business logic for each route group
│   ├── middleware/authMiddleware.js   # JWT protect + admin guard
│   └── seed/seedProducts.js  # Seeds 24 demo clothing products
│
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

---

## 5. Prerequisites

- **Node.js** v18+ and npm — [nodejs.org](https://nodejs.org)
- **MongoDB** — either a local install ([mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)) or a free **MongoDB Atlas** cluster ([mongodb.com/atlas](https://www.mongodb.com/atlas))
- (Optional) A **Razorpay** account for live payment testing — [razorpay.com](https://razorpay.com)
- **VS Code** (or any editor)

---

## 6. Installation

1. Extract/open the `Veloura` folder in VS Code.
2. Open a terminal in the project root and install dependencies:

   ```bash
   npm install
   ```

---

## 7. Node.js Setup

Verify Node and npm are installed:

```bash
node -v
npm -v
```

If not installed, download the LTS version from [nodejs.org](https://nodejs.org).

---

## 8. MongoDB Setup

**Option A — Local MongoDB**

1. Install and start MongoDB locally (`mongod`).
2. Your connection string will be: `mongodb://127.0.0.1:27017/veloura`

**Option B — MongoDB Atlas (cloud, free tier)**

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Create a database user and allow your IP address (or `0.0.0.0/0` for testing).
3. Click "Connect" → "Drivers" and copy the connection string, e.g.:
   `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/veloura`

---

## 9. Environment Variables

1. Copy the example file:

   ```bash
   cp .env.example .env
   ```

   (On Windows: `copy .env.example .env`)

2. Open `.env` and fill in your own values:

   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=any_long_random_string
   JWT_EXPIRES_IN=7d
   RAZORPAY_KEY_ID=
   RAZORPAY_KEY_SECRET=
   PORT=5000
   NODE_ENV=development
   ```

   `.env` is already in `.gitignore` — never commit it.

---

## 10. How to Install Dependencies

Already covered in step 6, but for reference the key packages installed are:

```bash
npm install express mongoose bcryptjs jsonwebtoken cors dotenv razorpay express-validator
npm install --save-dev nodemon
```

(All of this happens automatically with a single `npm install` since they're listed in `package.json`.)

---

## 11. How to Run the Backend

Development mode (auto-restarts on file changes):

```bash
npm run dev
```

Production mode:

```bash
npm start
```

You should see:

```
[Veloura] MongoDB connected: ...
[Veloura] Server running at http://localhost:5000
```

---

## 12. How to Open the Frontend

The Express server serves the `client/` folder as static files, so once the backend is running, simply open:

```
http://localhost:5000
```

in your browser. There is no separate frontend server to start.

---

## 13. How to Seed Products

With your `.env` configured and MongoDB reachable, run:

```bash
npm run seed
```

This clears any existing products and inserts 24 demo clothing products across Men, Women, Kids, and Infants — enough to demonstrate search, filtering, sorting, and product details.

---

## 14. How to Configure Razorpay

1. Sign up at [razorpay.com](https://razorpay.com) and go to **Settings → API Keys** in the Razorpay Dashboard.
2. Generate a **Test Mode** key pair.
3. Add them to your `.env`:

   ```
   RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxx
   RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxx
   ```

4. Restart the server (`npm run dev`).

If these values are left empty, the app will **not** fake a successful payment — the checkout page will clearly disable the Razorpay option and display a configuration message, and customers can still check out using Cash on Delivery.

**Security note:** `RAZORPAY_KEY_SECRET` is only ever used on the server (order creation + signature verification). Only `RAZORPAY_KEY_ID` (public) is sent to the frontend.

---

## 15. How to Test the Project

1. Start the server: `npm run dev`
2. Seed products: `npm run seed`
3. Open `http://localhost:5000` in your browser.
4. Register a new account, browse categories, use search/filters/sort.
5. Add items to your cart and wishlist, then proceed to checkout.
6. Place an order using Cash on Delivery (works without Razorpay configured).
7. Check **Account → My Orders** to see the order.
8. To test the admin panel: register a user, then manually set that user's `role` field to `"admin"` in MongoDB (via MongoDB Compass, Atlas UI, or the `mongo`/`mongosh` shell), then log back in and go to **Account → Admin Panel**.

Note: MongoDB connectivity and Razorpay payments are only verified when you actually run the project with real credentials — this project does not claim to have tested either without them.

---

## 16. How to Upload to GitHub

```bash
cd Veloura
git init
git add .
git commit -m "Initial commit: Veloura e-commerce project"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

Since `.env` is in `.gitignore`, your real credentials will never be pushed. Remember to add a `.env` file manually (using `.env.example` as a guide) on any machine or hosting platform you deploy to.

---

## API Reference

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login and receive a JWT |
| GET | `/api/auth/profile` | Private | Get logged-in user's profile |
| GET | `/api/auth/users` | Admin | List all users |
| GET | `/api/products` | Public | List products (search/filter/sort/paginate) |
| GET | `/api/products/:id` | Public | Get a single product |
| POST | `/api/products` | Admin | Create a product |
| PUT | `/api/products/:id` | Admin | Update a product |
| DELETE | `/api/products/:id` | Admin | Delete a product |
| POST | `/api/orders` | Private | Place an order |
| GET | `/api/orders` | Private | Get own orders (all orders if admin) |
| GET | `/api/orders/:id` | Private | Get a single order |
| PUT | `/api/orders/:id` | Admin | Update order status |
| GET | `/api/payment/status` | Public | Check if Razorpay is configured |
| POST | `/api/payment/create-order` | Private | Create a Razorpay order |
| POST | `/api/payment/verify` | Private | Verify a Razorpay payment signature |

---

## License

This project was built for educational/demo purposes.
