const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

const productRouter = require('./routers/products');

// Setup
const app = express();

app.use(cors());
app.options('*', cors());

require('dotenv/config');
const api = process.env.API_URL;
const user = process.env.DB_USER;
const cluster = process.env.DB_NAME;
const collection = process.env.DB_COLLECTION;
const password = process.env.DB_PASSWORD;

//Middleware
app.use(express.json());
app.use(morgan('tiny'));

//Routers
app.use(`${api}/products`, productRouter);

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

app.listen(3000, () => {
  console.log('server is running http://localhost:3000');
});
