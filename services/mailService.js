const nodemailer = require('nodemailer');
const { SMTP_OPTIONS, FROM } = require('../config/mailConfig');

const transporter = nodemailer.createTransport(SMTP_OPTIONS);

const sendMail = options => transporter.sendMail({ ...options, from: FROM });

module.exports = { sendMail };
