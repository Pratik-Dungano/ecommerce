import mongoose from 'mongoose';

const productColorSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  colors: [{
    name: {
      type: String,
      required: true
    },
    hex: {
      type: String,
      required: true
    },
    rgb: {
      r: Number,
      g: Number,
      b: Number
    }
  }]
}, {
  timestamps: true
});

// Create index for faster color searches
productColorSchema.index({ 'colors.name': 1 });
productColorSchema.index({ 'colors.hex': 1 });

const ProductColor = mongoose.model('ProductColor', productColorSchema);

export default ProductColor; 