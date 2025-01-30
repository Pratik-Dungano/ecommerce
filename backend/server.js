import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import useRouter from './routes/userRoute.js'
import productRouter from './routes/productRoute.js'
import cartRouter from './routes/cartRouter.js'
import orderRouter from './routes/orderRoute.js'
import wishListRouter from './routes/wishListRouter.js'

// App Config
const app = express();
connectDB();
connectCloudinary();

// ✅ CORS Middleware with Preflight Handling
const corsOptions = {
    origin: [
      "https://adaa-admin.vercel.app",
      "https://adaa.vercel.app"
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // ✅ Ensure allowed methods
    allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization",
    credentials: true,
    preflightContinue: false, // ✅ Important to prevent preflight redirects
    optionsSuccessStatus: 204, // ✅ Ensure success for preflight requests
  };
  
  app.use(cors(corsOptions));
  app.options("*", cors(corsOptions)); // Explicitly handle OPTIONS requests

// Middleware
app.use(express.json());

//api endpoints
app.use('/api/user',useRouter)
app.use('/api/product',productRouter)
app.use('/api/cart', cartRouter);
app.use('/api/order',orderRouter);
app.use('/api/wishlist',wishListRouter);
app.get('/',(req,res)=>{
    res.send("API Working")
})

app.listen(port,()=>console.log('Server started on Port:'+port))