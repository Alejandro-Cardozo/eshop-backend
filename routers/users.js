const { User } = require('../models/user');
const express = require('express');
const bcrypt = require('bcryptjs');
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

// POST new user
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

module.exports = router;
