import mongoose from "mongoose";

const productSchema=new mongoose.Schema({
    name:{type:String, required:true},
    description:{type:String, required:true},
    price:{type:Number, required:true},
    discountPercentage:{type:Number, default:0, min:0, max:100},
    image:{type:Array, required:true},
    video:{type:Array, default:[]},
    category:{type:String, required:true},
    subcategory:{type:String, required:false},
    categoryId:{type:mongoose.Schema.Types.ObjectId, ref:'category', required:true},
    subcategoryId:{type:mongoose.Schema.Types.ObjectId, required:false},
    sizes:{type:Array, required:true},
    bestseller:{type:Boolean},
    ecoFriendly:{type:Boolean, default:false},
    quantity:{type:Number, default:0, min:0},
    isOutOfStock:{type:Boolean, default:false},
    date:{type:Number,required:true},
    reviews: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
        orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'order', required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        text: { type: String, required: true },
        images: [{ type: String }],
        date: { type: Date, default: Date.now }
    }],
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 }
})

// Pre-save middleware to auto-compute isOutOfStock from quantity
productSchema.pre('save', function(next) {
    this.isOutOfStock = this.quantity === 0;
    next();
});

const productModel=mongoose.models.product||mongoose.model('product',productSchema)
 
export default productModel
