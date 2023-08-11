const nodemailer = require('nodemailer')
const debug = require('../lib/debug')

const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: parseInt(SMTP_PORT, 10),
  secure: true,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
})

transporter.verify((error) => {
  if (error) {
    debug.error('SMTP connection error:', error)
  } else {
    debug.status('SMTP server ready.')
  }
})

module.exports.transporter = transporter
