require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');
const swapRoutes = require('./routes/swaps');

const app = express();


app.use(helmet());
const corsOptions = {
  origin: ['http://localhost:3000', 'https://resonant-medovik-49c2f9.netlify.app'],
  credentials: true, 
};
app.use(cors(corsOptions));
app.use(express.json({ limit: '10kb' }));
app.use(mongoSanitize());
app.use('/uploads', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); 
  next();
}, express.static('uploads'));


const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100 
});
app.use('/api/', limiter);


app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/swaps', swapRoutes);


mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
