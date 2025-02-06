import {v2 as cloudinary} from "cloudinary"
import productModel from "../models/productModel.js";


const addProduct = async (req, res) => {
    try {
        const { name, description, price, category, subcategory, sizes, bestseller, discountPercentage } = req.body;

        // Accessing uploaded files
        const image1 = req.files.image1 && req.files.image1[0];
        const image2 = req.files.image2 && req.files.image2[0];
        const image3 = req.files.image3 && req.files.image3[0];
        const image4 = req.files.image4 && req.files.image4[0];
        const images=[image1,image2,image3,image4].filter((item)=>item !== undefined)

        let imagesUrl=await Promise.all(
            images.map(async(item)=>{
                let result=await cloudinary.uploader.upload(item.path,{resource_type:'image'});
                return result.secure_url
            })
        )
        // Log received data for debugging
        const productData={
            name,
            description,
            category,
            price:Number(price),
            discountPercentage: Number(discountPercentage) || 0,
            subcategory,
            bestseller:bestseller==="true" ? true:false,
            sizes:JSON.parse(sizes),
            image:imagesUrl,
            date:Date.now()
        }
       
        const product=new productModel(productData);
        await product.save()
        // Example response
        res.json({success:true,message:"Product added"});
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message });
    }
}



const listProducts=async(req,res)=>{
    try {
        const products=await productModel.find({});
        res.json({success:true,products})
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message });
        
    }

}


const removeProduct=async(req,res)=>{
    try{
        await productModel.findByIdAndDelete(req.body.id)
        res.json({success:true,message:"Product Removed"})
    }catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message });
        
    }

}

const singleProduct=async(req,res)=>{
    try {
        const {productId}=req.body
        const product=await productModel.findById(productId)
        res.json({
            success:true,product
        })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message });
        
    }
    
}

const editProduct = async (req, res) => {
    try {
        const { id, name, description, price, category, subcategory, sizes, bestseller, discountPercentage } = req.body;
        
        // Find the existing product
        const existingProduct = await productModel.findById(id);
        if (!existingProduct) {
            return res.json({ success: false, message: "Product not found" });
        }

        // Prepare update data
        const updateData = {
            name,
            description,
            category,
            price: Number(price),
            discountPercentage: Number(discountPercentage) || 0,
            subcategory,
            bestseller: bestseller === "true" ? true : false,
            sizes: JSON.parse(sizes),
        };

        // Handle image updates if new images are uploaded
        if (req.files && Object.keys(req.files).length > 0) {
            const image1 = req.files.image1 && req.files.image1[0];
            const image2 = req.files.image2 && req.files.image2[0];
            const image3 = req.files.image3 && req.files.image3[0];
            const image4 = req.files.image4 && req.files.image4[0];
            const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

            if (images.length > 0) {
                // Upload new images to cloudinary
                let imagesUrl = await Promise.all(
                    images.map(async (item) => {
                        let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' });
                        return result.secure_url;
                    })
                );

                // Optional: Delete old images from cloudinary
                // You would need to extract the public_ids from the old URLs and use cloudinary.uploader.destroy()

                updateData.image = imagesUrl;
            }
        }

        // Update the product
        const updatedProduct = await productModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true } // This option returns the updated document
        );

        res.json({ 
            success: true, 
            message: "Product updated successfully", 
            product: updatedProduct 
        });

    } catch (error) {
        console.error("Edit product error:", error);
        res.json({ success: false, message: error.message });
    }
};

export {listProducts,addProduct,singleProduct,removeProduct,editProduct}