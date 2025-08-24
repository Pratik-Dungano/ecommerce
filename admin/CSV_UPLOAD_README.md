# CSV Bulk Product Upload Guide

## Overview
The admin dashboard now supports bulk product uploads via CSV files. This feature allows you to add multiple products at once by uploading a CSV file with product information.

## How to Use

### 1. Download CSV Template
- Click the "Download Template" button in the CSV upload section
- This will download a `products_template.csv` file with the correct column structure

### 2. Prepare Your CSV File
Fill in the CSV file with your product data. The columns should be:

| Column | Description | Required | Example |
|--------|-------------|----------|---------|
| image1 | First product image URL | Yes | https://example.com/image1.jpg |
| image2 | Second product image URL | No | https://example.com/image2.jpg |
| image3 | Third product image URL | No | https://example.com/image3.jpg |
| image4 | Fourth product image URL | No | https://example.com/image4.jpg |
| video | Product video URL | No | https://example.com/video.mp4 |
| name | Product name | Yes | Casual T-Shirt |
| description | Product description | Yes | Comfortable cotton t-shirt |
| category | Product category | Yes | Clothing |
| subcategory | Product subcategory | Yes | T-Shirts |
| price | Product price | Yes | 25 |
| discountPercentage | Discount percentage (0-100) | No | 10 |
| sizes | Available sizes (comma-separated) | Yes | "S,M,L" |
| bestseller | Is bestseller (true/false) | No | true |
| ecoFriendly | Is eco-friendly (true/false) | No | false |

### 3. Upload and Process
1. Click "Choose CSV File" and select your prepared CSV file
2. Click "Process CSV" to parse the file
3. Review the preview of your products
4. Click "Upload All Products" to add all products to the website

### 4. Important Notes
- **Category Matching**: The system will automatically match category and subcategory names to existing ones in your database
- **Image URLs**: Make sure all image URLs are accessible and valid
- **Required Fields**: Name, description, category, subcategory, and price are required
- **Missing Data**: Products with missing optional data will still be added
- **Progress Tracking**: You can see the upload progress for each product

## CSV File Format Example

```csv
image1,image2,image3,image4,video,name,description,category,subcategory,price,discountPercentage,sizes,bestseller,ecoFriendly
https://example.com/img1.jpg,https://example.com/img2.jpg,https://example.com/img3.jpg,https://example.com/img4.jpg,https://example.com/video.mp4,Product Name,Product Description,Category,Subcategory,25,10,"S,M,L",true,false
```

## Troubleshooting

### Common Issues:
1. **CSV Parsing Errors**: Ensure your CSV file has the correct format and no special characters
2. **Category Not Found**: Make sure category and subcategory names exactly match those in your database
3. **Image Upload Failures**: Verify that image URLs are accessible and valid
4. **Missing Required Fields**: Ensure all required fields are filled in

### Best Practices:
1. Test with a small CSV file first (2-3 products)
2. Use absolute URLs for images and videos
3. Keep category and subcategory names consistent
4. Use quotes around fields that contain commas (like sizes)

## Technical Details
- Uses PapaParse library for CSV parsing
- Supports both image URLs and video URLs
- Automatically handles category ID mapping
- Progress tracking for bulk uploads
- Error handling for individual product failures
