var express = require('express');
var router = express.Router();

const userModel = require('../routes/users');
const postModel = require('../routes/posts');
const passport = require('passport');
const upload = require('../routes/multer');

const localStrategy = require('passport-local');
passport.use(new localStrategy(userModel.authenticate()));


const isLoggedIn = (req, res, next) => {
  if(req.isAuthenticated()) return next();
  res.redirect('/');
}
/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {nav: false});
});

router.get('/register', function(req, res) {
  res.render('register', {nav: false});
});

router.get('/profile', isLoggedIn, async (req, res) => {
  const user = await userModel.findOne({
    username: req.session.passport.user
  }).populate('posts')
  res.render('profile', {user, nav: true});
});

router.post('/register', async (req, res) => {
  try {
    const { username, email, contact, password, name } = req.body;
    const userData = new userModel({
      username,
      email,
      contact,
      name,
    });

    await userModel.register(userData, password);
    passport.authenticate('local')(req, res, () => {
      res.redirect('/profile');
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Registration Error');
  }
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true,
}), (req, res) => {});

router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if(err) return next(err);
    res.redirect('/');
  })
});

router.get('/login', (req, res) => {
  res.render('login', {error: req.flash('error')});
});

router.get('/feed', isLoggedIn, async (req, res) => {
  const user = await userModel.findOne({username: req.session.passport.user})
  const posts = await postModel.find().populate('user');
  res.render('feed', {nav: true, posts, user});
  console.log(posts);
});

router.post('/upload', isLoggedIn, upload.single('file'), async (req, res) => {
  if(!req.file) {
    return res.status(404).send("no files were given.");
  }
  const user = await userModel.findOne({username: req.session.passport.user});
  const post = await postModel.create({
    image: req.file.filename,
    postText: req.body.filecaption,
    user: user._id,
  });
   user.posts.push(post._id);
   await user.save();
   res.redirect('profile');
});

router.post('/fileupload', isLoggedIn, upload.single('image'), async (req, res) => {
  const user = await userModel.findOne({username: req.session.passport.user});
  user.profileImage = req.file.filename;
  await user.save();
  res.redirect('/profile');
});

router.get('/add', isLoggedIn, async (req, res) => {
  const user = await userModel.findOne({username: req.session.passport.user});
  res.render('add', {nav: true, user});
});

router.post('/createpost', isLoggedIn, upload.single('postImage'), async (req, res) => {
  const user = await userModel.findOne({username: req.session.passport.user});
  const post = await postModel.create({
    user: user._id,
    description: req.body.description,
    title: req.body.title,
    image: req.file.filename,
  });
  user.posts.push(post._id);
  await user.save();
  res.redirect('/profile');
});

router.get('/show/posts', isLoggedIn, async (req, res) => {
  const user = await userModel.findOne({username: req.session.passport.user})
  .populate('posts')
  res.render('show', {user, nav: true});
});

router.get('/show/post/:id', isLoggedIn, async (req, res) => {
  const post = await postModel.findById(req.params.id);
  res.render('post', {post, nav: true});
});


module.exports = router;