const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');

const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');

const productRouter = require('./routers/products');
const categoryRouter = require('./routers/categories');
const userRouter = require('./routers/users');
const orderRouter = require('./routers/orders');

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
app.use(authJwt());
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
app.use(errorHandler);

//Routers
app.use(`${api}/products`, productRouter);
app.use(`${api}/categories`, categoryRouter);
app.use(`${api}/users`, userRouter);
app.use(`${api}/orders`, orderRouter);

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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('server is running on port ' + PORT);
});
