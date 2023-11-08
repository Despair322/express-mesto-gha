const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const appRouter = require('./routes');

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
}).then(() => {
  console.log('Connected to MongoDB');
});

const app = express();

app.use(helmet());

app.use((req, res, next) => {
  req.user = { _id: '654a2bbb90820ba824ade098' };

  next();
});

app.use(express.json());

app.use(appRouter);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
