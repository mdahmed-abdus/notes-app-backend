require('dotenv').config({ path: './config/.env' });

const express = require('express');
const connectDb = require('./services/connectDb');
const { APP_PORT, NODE_ENV } = require('./config/appConfig');

const app = express();

connectDb(app);

app.on('ready', () => {
  app.listen(APP_PORT, () => {
    console.log(`Server running on port: ${APP_PORT} in '${NODE_ENV}' mode`);
  });
});
