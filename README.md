# 📚 Modern Blog Application

A full-stack modern blog platform built with React, Node.js, Express, and MongoDB. Features a beautiful UI with advanced functionality including search, filtering, comments, likes, and social features.

## ✨ Features

### 🎨 Modern UI/UX
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark/Light Theme**: Built with DaisyUI for beautiful theming
- **Modern Components**: Cards, modals, dropdowns, and more
- **Loading States**: Smooth loading animations and skeleton screens
- **Toast Notifications**: User-friendly feedback messages

### 🔍 Advanced Search & Filtering
- **Real-time Search**: Search blogs by title and content
- **Category Filtering**: Filter by blog categories
- **Tag Filtering**: Filter by multiple tags
- **Author Filtering**: Find blogs by specific authors
- **Sorting Options**: Sort by latest, most viewed, most liked
- **Pagination**: Efficient pagination for large datasets

### 👥 Social Features
- **User Profiles**: Complete user profiles with avatars and bios
- **Follow System**: Follow/unfollow other users
- **Like System**: Like and unlike blog posts
- **Comments**: Add and delete comments on blog posts
- **Social Sharing**: Share blogs via native sharing or copy link

### 📊 Analytics & Insights
- **View Counting**: Track blog views automatically
- **Read Time**: Automatic read time calculation
- **Trending Blogs**: Algorithm-based trending content
- **User Stats**: Blog count, followers, following
- **Engagement Metrics**: Likes, comments, views

### ✍️ Rich Content Creation
- **Rich Text Editor**: React Quill with image upload
- **Featured Images**: Add beautiful cover images
- **Excerpts**: Write compelling blog descriptions
- **Categories & Tags**: Organize content effectively
- **Draft System**: Save and edit drafts

### 🔐 Authentication & Security
- **JWT Authentication**: Secure token-based auth
- **Protected Routes**: Secure access to user-specific features
- **Password Hashing**: Bcrypt password security
- **User Validation**: Input validation and sanitization

## 🛠️ Tech Stack

### Frontend
- **React 18**: Modern React with hooks
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **DaisyUI**: Beautiful component library
- **React Quill**: Rich text editor
- **Axios**: HTTP client
- **Day.js**: Date manipulation
- **React Icons**: Beautiful icons
- **React Hot Toast**: Toast notifications

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB ODM
- **JWT**: Authentication tokens
- **Bcrypt**: Password hashing
- **CORS**: Cross-origin resource sharing
- **Multer**: File upload handling

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd BlogApp
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Setup**

   Create `.env` files in both backend and frontend directories:

   **Backend (.env)**
   ```env
   MONGODB_URI=mongodb://localhost:27017/blogapp
   JWT_SECRET=your-secret-key
   PORT=5000
   ```

   **Frontend (.env)**
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_CLOUDINARY_CLOUD_NAME=your-cloud-name
   VITE_CLOUDINARY_UPLOAD_PRESET=your-upload-preset
   ```

5. **Start the development servers**

   **Backend**
   ```bash
   cd backend
   npm run dev
   ```

   **Frontend**
   ```bash
   cd frontend
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
BlogApp/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── index.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── api/
│   │   └── App.jsx
│   └── package.json
└── README.md
```

## 🎯 Key Features Explained

### Advanced Blog Model
- **Slugs**: SEO-friendly URLs
- **Excerpts**: Blog descriptions
- **Featured Images**: Cover images
- **Read Time**: Automatic calculation
- **View Tracking**: View counting
- **Like System**: User likes
- **Comments**: Nested comments
- **Categories & Tags**: Content organization

### Modern UI Components
- **Sidebars**: Categories, trending, user stats
- **Search Bar**: Real-time search
- **Blog Cards**: Beautiful blog previews
- **User Profiles**: Complete user pages
- **Responsive Layout**: Mobile-first design

### Social Features
- **Follow System**: Follow/unfollow users
- **Like System**: Like/unlike blogs
- **Comments**: Add and manage comments
- **User Profiles**: Public user pages
- **Activity Feed**: Recent activity

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/logout` - User logout
- `GET /api/auth/check` - Check authentication
- `GET /api/auth/user/:username` - Get user profile
- `POST /api/auth/follow/:username` - Follow user

### Blogs
- `GET /api/blogs` - Get all blogs (with filtering)
- `GET /api/blogs/:id` - Get single blog
- `POST /api/blogs` - Create blog
- `PUT /api/blogs/edit/:id` - Update blog
- `DELETE /api/blogs/:id` - Delete blog
- `POST /api/blogs/:id/like` - Like/unlike blog
- `POST /api/blogs/:id/comments` - Add comment
- `DELETE /api/blogs/:id/comments/:commentId` - Delete comment

### Analytics
- `GET /api/blogs/trending` - Get trending blogs
- `GET /api/blogs/featured` - Get featured blogs
- `GET /api/blogs/categories` - Get categories
- `GET /api/blogs/tags` - Get popular tags

## 🎨 UI/UX Highlights

### Modern Design
- **Clean Layout**: Three-column layout with sidebars
- **Beautiful Cards**: Hover effects and shadows
- **Responsive Grid**: Adaptive blog grid
- **Loading States**: Skeleton screens and spinners
- **Toast Notifications**: User feedback

### User Experience
- **Intuitive Navigation**: Easy-to-use navigation
- **Search Functionality**: Real-time search
- **Filtering Options**: Multiple filter types
- **Pagination**: Smooth page navigation
- **Mobile Responsive**: Works on all devices

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or local MongoDB
2. Configure environment variables
3. Deploy to Heroku, Vercel, or similar

### Frontend Deployment
1. Build the project: `npm run build`
2. Deploy to Vercel, Netlify, or similar
3. Configure environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- DaisyUI for beautiful components
- React Quill for rich text editing
- Tailwind CSS for utility-first styling
- MongoDB for the database
- Express.js for the backend framework

---

**Built with ❤️ using modern web technologies** 