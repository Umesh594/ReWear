# ReWear – Clothing Swap Platform
An interactive web platform where users can upload clothing items, browse listings, and swap using points or other items. Built using React.js, Node.js, Express.js, and MongoDB.
Features
-User Authentication
1)Register and login with JWT-based authentication
2)Secure password hashing (bcrypt)
-Item Management
1)Upload items with images, title, category, condition, size, and tags
2)View all available items
3)Manage your own items
4)Image upload handled via multer
- Swap System
1)Request swaps by offering:
  -Your own listed item OR
  -Points
2)Accept or reject incoming swap requests
  -Realtime status updates (pending, accepted, rejected, completed)
  -Points automatically transferred on accepted swap
- File Upload & Display
  1)Upload and serve item images (stored in /uploads) 
  2)Display images on item detail and listings
- Tech Stack Used
  - Frontend
   1)Javascript
   2)React Router DOM
   3)Axios
   4)Material UI (MUI)
   5)HTML
   6)CSS
 - Backend
    1)Node.js
    2)Express.js
    3)MongoDB with Mongoose
    4)Multer (image upload)
    5)Helmet, CORS, Rate Limiting, Mongo-Sanitize (security)
