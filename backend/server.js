import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import userRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRouter.js'
import orderRouter from './routes/orderRoute.js'
import wishListRouter from './routes/wishListRouter.js'

//App Config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

//middlewares
// Important: Raw body parser for Stripe webhook must come before JSON parser
app.use('/api/order/stripe-webhook', express.raw({ type: 'application/json' }));

// Regular middleware for other routes
app.use(express.json())
app.use(cors())

//api endpoints
app.use('/api/user', userRouter)
app.use('/api/product', productRouter)
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/wishlist', wishListRouter);
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

app.listen(port,()=>console.log('Server started on Port:'+port))