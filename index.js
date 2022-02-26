const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

// setup
const app = express();
require('dotenv/config');
const api = process.env.API_URL;
const user = process.env.DB_USER;
const cluster = process.env.DB_NAME;
const collection = process.env.DB_COLLECTION;
const password = process.env.DB_PASSWORD;

//Middleware
app.use(express.json());
app.use(morgan('tiny'));

const productSchema = mongoose.Schema({
  name: String,
  image: String,
  countInStock: {
    type: Number,
    required: true,
  },
});

const Product = mongoose.model('Product', productSchema);

app.get(`${api}/products`, async (req, res) => {
  const productList = await Product.find();

  if (!productList) {
    res.status(500).json({ success: false });
  }
  res.send(productList);
});

app.post(`${api}/products`, (req, res) => {
  const product = new Product({
    name: req.body.name,
    image: req.body.image,
    countInStock: req.body.countInStock,
  });

  product
    .save()
    .then((createdProduct) => {
      res.status(201).json(createdProduct);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
        success: false,
      });
    });
});

mongoose
  .connect(
    `mongodb+srv://${user}:${password}@${cluster}.tgo7u.mongodb.net/${collection}?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log('Database Connection is ready...');
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(8080, () => {
  console.log('server is running http://localhost:8080');
});
