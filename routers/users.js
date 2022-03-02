const { User } = require('../models/user');
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// GET all users
router.get(`/`, async (req, res) => {
  const userList = await User.find().select('-passwordHash'); //exclude pass

  if (!userList) {
    res.status(500).json({ success: false });
  }
  res.send(userList);
});

// GET single user
router.get(`/:id`, async (req, res) => {
  const user = await User.findById(req.params.id).select('-passwordHash');

  if (!user) {
    res.status(500).json({ success: false });
  }
  res.send(user);
});

// POST new user (admin)
router.post('/', async (req, res) => {
  let user = new User({
    name: req.body.name,
    email: req.body.email,
    street: req.body.street,
    passwordHash: bcrypt.hashSync(req.body.password, 10),
    phone: req.body.phone,
    isAdmin: req.body.isAdmin,
    apartment: req.body.apartment,
    zip: req.body.zip,
    city: req.body.city,
    country: req.body.country,
  });
  user = await user.save();

  if (!user) return res.status(400).send('the user cannot be created!');

  res.send(user);
});

// POST new user (user)
router.post('/register', async (req, res) => {
    let user = new User({
      name: req.body.name,
      email: req.body.email,
      street: req.body.street,
      passwordHash: bcrypt.hashSync(req.body.password, 10),
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      apartment: req.body.apartment,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country,
    });
    user = await user.save();
  
    if (!user) return res.status(400).send('the user cannot be created!');
  
    res.send(user);
  });

// User login
router.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const secret = process.env.SECRET;
  if (!user) {
    return res.status(400).send('User not found');
  }

  if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
    const token = jwt.sign(
      {
        userId: user.id,
      },
      secret,
      { expiresIn: '1d' }
    );

    res.status(200).send({ user: user.email, token: token });
  } else {
    res.status(400).send('password is wrong');
  }
});

module.exports = router;
