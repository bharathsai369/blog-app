# Cloudinary Setup Guide

## To fix the Cloudinary 401 Unauthorized error:

### Option 1: Set up Cloudinary (Recommended)
1. Go to [Cloudinary](https://cloudinary.com/) and create a free account
2. Get your credentials from the dashboard:
   - Cloud Name
   - API Key
   - API Secret
3. Update your `frontend/.env` file:
   ```
   VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
   VITE_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
   ```
4. Update your `backend/.env` file:
   ```
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

### Option 2: Disable image upload (Quick fix)
If you don't want to set up Cloudinary right now, you can:
1. Use image URLs instead of file uploads
2. The image upload button will show an error, but you can still create blogs with image URLs

## Current Issues Fixed:
✅ **Authentication**: Blog creation now requires login
✅ **Error Handling**: Better error messages and loading states
✅ **User Experience**: Forms are disabled during submission
✅ **Security**: Protected routes properly implemented

## Next Steps:
1. **Login/Register** first to create blogs
2. **Set up Cloudinary** for image uploads (optional)
3. **Test blog creation** with text content first

The 500 error should now be resolved since the authentication is properly handled! 