require('dotenv').config({ path: './config/.env' });

const express = require('express');
const connectDb = require('./services/connectDb');
const { APP_PORT, NODE_ENV } = require('./config/appConfig');
const appMiddleware = require('./middleware/appMiddleware');
const appRoutes = require('./routes/appRoutes');

const app = express();

connectDb(app);

app.on('ready', () => {
  appMiddleware(app);
  appRoutes(app);

  app.listen(APP_PORT, () => {
    console.log(`Server running on port: ${APP_PORT} in '${NODE_ENV}' mode`);
  });
});
