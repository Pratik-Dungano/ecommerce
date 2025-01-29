import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import useRouter from './routes/userRoute.js';
import productRouter from './routes/productRoute.js';
import cartRouter from './routes/cartRouter.js';
import orderRouter from './routes/orderRoute.js';

// App Config
const app = express();
connectDB();
connectCloudinary();

// ✅ Allow CORS for Your Frontend Domain
const corsOptions = {
    origin: [
      "https://adaa-admin.vercel.app",
      "https://adaa.vercel.app"
    ], // ✅ Allow both frontend domains
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // ✅ Allow cookies and authentication headers
  };
  
  app.use(cors(corsOptions));
app.use(express.json());

// API Endpoints
app.use('/api/user', useRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);

app.get('/', (req, res) => {
  res.send("API Working");
});

// Start Server
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server started on Port: ${port}`));
