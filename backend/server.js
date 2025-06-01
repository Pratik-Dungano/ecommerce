import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/mongodb.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRouter.js'
import orderRouter from './routes/orderRoute.js'
import wishListRouter from './routes/wishListRouter.js'
import reviewRoute from './routes/reviewRoute.js'
import categoryRouter from './routes/categoryRoute.js'
import lookRouter from './routes/lookRoutes.js'
import uploadRouter from './routes/uploadRoute.js'
import { handleMulterError } from './middleware/multer.js'

dotenv.config()

//App Config
const app = express()
const port = process.env.PORT || 4000
connectDB()

//middlewares
// Important: Raw body parser for Stripe webhook must come before JSON parser
app.use('/api/order/stripe-webhook', express.raw({ type: 'application/json' }));

// Regular middleware for other routes
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000', 'http://localhost:4000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'))

//api endpoints
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/wishlist', wishListRouter);
app.use('/api/reviews', reviewRoute);
app.use('/api/category', categoryRouter); 
app.use('/api/looks', lookRouter);
app.use('/api/upload', uploadRouter);

app.get('/',(req,res)=>{
    res.send("API Working")
})

// Error handling for Stripe webhook
app.use((err, req, res, next) => {
    if (err.type === 'StripeSignatureVerificationError') {
        res.status(400).json({ success: false, message: 'Invalid Stripe webhook signature' });
    } else {
        next(err);
    }
});

// Multer error handling
app.use(handleMulterError);

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        success: false, 
        message: err.message || 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

app.listen(port,()=>console.log('Server started on Port:'+port))