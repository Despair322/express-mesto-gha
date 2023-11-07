const express = require('express');
const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const appRouter = require('./routes');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
}).then(() => {
  console.log('Connected to MongoDB');
});

const app = express();
const PORT = 3000;

// app.use((req, res, next) => {
//   req.user = { _id: '654a2bbb90820ba824ade098' };

//   next();
// });

// app.use(bodyParser.json());

// app.use(appRouter);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
