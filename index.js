require('dotenv').config({ path: './config/.env' });

const express = require('express');
const { APP_PORT, NODE_ENV } = require('./config/appConfig');

const app = express();

app.listen(APP_PORT, () => {
  console.log(`Server running on port: ${APP_PORT} in '${NODE_ENV}' mode`);
});
