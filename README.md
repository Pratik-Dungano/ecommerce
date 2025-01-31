# Adaa Jaipur - E-commerce Website

## Introduction
Adaa Jaipur is a modern e-commerce platform designed for seamless shopping. It provides a user-friendly interface, efficient backend, and an intuitive admin panel for managing products and orders.

## Features
- **Home Page**
- **Product Listings**
- **Product Detail Page**
- **Cart Management**
- **Checkout & Payments (Stripe Integration)**
- **E-commerce Analytics** (Track customer behavior and trends)
- **UI/UX Optimized Design** for a smooth shopping experience

## Tech Stack
- **Frontend:** React.js, Vite
- **Backend:** Node.js, Express.js, MongoDB
- **Database:** MongoDB (Mongoose ODM)
- **Storage:** Cloudinary
- **Authentication:** JWT (JSON Web Token)
- **Payments:** Stripe
- **Admin Panel:** React.js

---
## Environment Variables
Environment variables must be set up correctly in the `.env` files for the backend, frontend, and admin panel. These include database connections, API keys, and authentication secrets.

### Backend
```
# Set up MongoDB, Cloudinary, JWT, and Stripe configurations
```

### Frontend
```
# Configure backend URL and Stripe publishable key
```

### Admin Panel
```
# Configure backend URL
```

---
## Installation & Setup
### Backend Setup
1. Clone the repository and navigate to the backend folder:
   ```sh
   git clone https://github.com/your-repo.git
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the server:
   ```sh
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend folder:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the frontend:
   ```sh
   npm run dev
   ```

### Admin Panel Setup
1. Navigate to the admin folder:
   ```sh
   cd admin
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the admin panel:
   ```sh
   npm run dev
   ```

---
## API Endpoints
### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create a new product (Admin only)
- `PUT /api/products/:id` - Update a product (Admin only)
- `DELETE /api/products/:id` - Delete a product (Admin only)

### Cart
- `POST /api/cart/get` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `POST /api/cart/update` - Update cart

### Orders
- `POST /api/orders/place` - Place an order
- `POST /api/orders/create-stripe-session` - Create Stripe checkout session
- `POST /api/orders/userorders` - Get user orders
- `POST /api/orders/list` - Get all orders (Admin only)
- `POST /api/orders/status` - Update order status (Admin only)
- `POST /api/orders/stripe-webhook` - Handle Stripe webhook

### Users
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/admin` - Admin login
- `GET /api/auth/` - Get user details
- `PUT /api/auth/update` - Update user details

### Wishlist
- `POST /api/wishlist/get` - Get user's wishlist
- `POST /api/wishlist/add` - Add item to wishlist
- `POST /api/wishlist/update` - Update wishlist

---
## Screenshots (Add images below)
**Home Page:**  
![Home Page](#)

**Product Listings:**  
![Product Listings](#)

**Product Detail:**  
![Product Detail](#)

**Cart Page:**  
![Cart](#)

**Checkout Page:**  
![Checkout](#)

**Admin Dashboard:**  
![Admin Dashboard](#)

**Order Management:**  
![Order Management](#)

**User Login & Signup:**  
![User Authentication](#)


**Payment Gateway:**  
![Stripe Payment](#)

---
## Contributors
- **Your Name** - Developer
- **Other Contributors** - (Add names if applicable)

## License
This project is licensed under the MIT License.

