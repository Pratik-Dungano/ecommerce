# CSV Bulk Product Upload - Admin Dashboard

This admin dashboard includes a powerful CSV bulk upload feature for adding multiple products at once.

## CSV Upload Feature

### How to Use
1. Navigate to the "Add Items" page
2. Scroll down to the "Bulk Product Upload via CSV" section
3. Click "Download Template" to get a sample CSV file
4. Fill in your product data following the template format
5. Upload your CSV file and click "Process CSV"
6. Review the preview and click "Upload Products from CSV"

### CSV Format

The CSV should have the following columns (in order):

| Column | Description | Example | Required |
|--------|-------------|---------|----------|
| image1 | First product image URL | https://example.com/image1.jpg | Yes |
| image2 | Second product image URL | https://example.com/image2.jpg | No |
| image3 | Third product image URL | https://example.com/image3.jpg | No |
| image4 | Fourth product image URL | https://example.com/image4.jpg | No |
| video | Product video URL | https://example.com/video.mp4 | No |
| name | Product name | "Casual T-Shirt" | Yes |
| description | Product description | "Comfortable cotton t-shirt" | Yes |
| category | Product category | "New Arrival" | Yes |
| subcategory | Product subcategory | "New Arrival" | Yes |
| price | Product price | 25 | Yes |
| discountPercentage | Discount percentage | 10 | No |
| sizes | Available sizes | "S,M,L" | No |
| bestseller | Is bestseller | TRUE/FALSE | No |
| ecoFriendly | Is eco-friendly | TRUE/FALSE | No |

### Boolean Fields (bestseller, ecoFriendly)

For the `bestseller` and `ecoFriendly` columns, use these values:
- **TRUE** - for true/yes
- **FALSE** - for false/no

**Note**: The system accepts various formats:
- `TRUE`, `true`, `True`, `1`, `yes` → All treated as `true`
- `FALSE`, `false`, `False`, `0`, `no` → All treated as `false`

### Tips
- At least one image URL is required
- Sizes should be comma-separated (e.g., "S,M,L,XL")
- Categories and subcategories must exist in the system
- The first row should contain the column headers exactly as shown above
- Empty fields will use default values

### Troubleshooting
- If products fail to upload, check the browser console for detailed error messages
- Ensure all required fields are filled
- Verify that category and subcategory names match exactly with those in the system
- Check that image URLs are accessible
