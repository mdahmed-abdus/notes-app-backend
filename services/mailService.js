const nodemailer = require('nodemailer');
const { Resend } = require('resend');
const { IN_PROD } = require('../config/appConfig');
const { SMTP_OPTIONS, FROM, RESEND_API_KEY } = require('../config/mailConfig');

// smtp
const transporter = nodemailer.createTransport(SMTP_OPTIONS);

// resend

const smtpSendMail = options =>
  transporter.sendMail({ ...options, from: FROM });

// resend
const resend = new Resend(RESEND_API_KEY);

const resendSendMail = options =>
  resend.emails.send({ ...options, from: RESEND_FROM });

// use smtp for development and resend for production
const sendMail = IN_PROD ? resendSendMail : smtpSendMail;

module.exports = { sendMail };
