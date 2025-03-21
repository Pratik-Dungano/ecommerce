# Adaa Jaipur - E-commerce Website 
## Team-Ein Bin Tin
- **Pratikkumar Dungano**
- **Suraj Yaligar**
- **Ananya Sah**

## Introduction
Adaa Jaipur is a modern e-commerce platform designed for seamless shopping. It provides a user-friendly interface, efficient backend, and an intuitive admin panel for managing products and orders.

## Features
- **Home Page**
- **Product Listings**
- **Product Detail Page**
- **Cart Management**
- **Checkout & Payments (Stripe Integration-in progress)**
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
MONGODB_URL="mongodb+srv://<username>:<password>@<cluster>.mongodb.net"
CLOUDINARY_API_KEY="<your_cloudinary_api_key>"
CLOUDINARY_SECRET_KEY="<your_cloudinary_secret_key>"
CLOUDINARY_NAME="<your_cloudinary_name>"
JWT_SECRET="<your_jwt_secret>"
ADMIN_EMAIL="<your_admin_email>"
ADMIN_PASSWORD="<your_admin_password>"
STRIPE_SECRET_KEY="<your_stripe_secret_key>"
FRONTEND_URL="<your_frontend_url>"
STRIPE_WEBHOOK_SECRET="<your_stripe_webhook_secret>"

```

### Frontend
```
VITE_BACKEND_URL="<your_backend_url>"
VITE_STRIPE_PUBLISHABLE_KEY="<your_stripe_publishable_key>"

```

### Admin Panel
```

VITE_BACKEND_URL="<your_backend_url>"
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
   npm run server
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
## Screenshots 
**Home Page:**  
![Home Page](./frontend/src/assets/home1.png)

**Product Listings:**  
![Product Listings](./frontend/src/assets/listing1.png)

**Product Detail:**  
![Product Detail](./frontend/src/assets/product1.png)

**Cart Page:**  

![Cart](./frontend/src/assets/cart1.png)

**Checkout Page:**  
![Checkout](./frontend/src/assets/checkout1.png)

**Admin Dashboard:**  
![Admin Dashboard](./frontend/src/assets/dashboard1.png)

**Order Management:**  
   ![Order Management](./frontend/src/assets/orders1.png)

**User Login & Signup:**  
![User Authentication](./frontend/src/assets/login1.png)



---
## Contributors
- **Pratikkumar Dungano** - Developer
- **Suraj Yaligar** - Developer
- **Ananya Sah Mu** - Developer

## License
This project is licensed under the MIT License.

