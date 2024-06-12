const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');
require('dotenv').config();

const mongoURL = process.env.DB_URL;
// const mongoURL = process.env.DB_URL_Local;

// mongoose.connect(mongoURL, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
mongoose.connect(mongoURL)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

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
      ref: 'post',
    }
  ]
});

userSchema.plugin(plm);

module.exports = mongoose.model('user', userSchema);
