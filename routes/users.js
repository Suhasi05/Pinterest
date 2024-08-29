const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');
require('dotenv').config();

const DB_URL = process.env.DB_URL;
// const DB_URL = process.env.DB_URL_Local;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000, // 30 seconds
  socketTimeoutMS: 45000, // 45 seconds
};

mongoose.connect(DB_URL, options)
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.log('Database connection error:', err));

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  profileImage: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  contact: Number,
  boards: {
    type: Array,
    default: [],
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'feed',
    }
  ]
});

userSchema.plugin(plm);

module.exports = mongoose.model('people', userSchema);
