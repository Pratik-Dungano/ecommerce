import mongoose from "mongoose";

const subcategorySchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: '' },
    active: { type: Boolean, default: true }
}, { timestamps: true });

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: '' },
    image: { type: String, default: null },
    subcategories: [subcategorySchema],
    active: { type: Boolean, default: true }
}, { timestamps: true });

// Use slug for better URL structure
categorySchema.pre('save', function(next) {
    if (!this.slug) {
        this.slug = this.name.toLowerCase().replace(/\s+/g, '-');
    }
    next();
});

subcategorySchema.pre('save', function(next) {
    if (!this.slug) {
        this.slug = this.name.toLowerCase().replace(/\s+/g, '-');
    }
    next();
});

const CategoryModel = mongoose.models.category || mongoose.model('category', categorySchema);

export default CategoryModel; 