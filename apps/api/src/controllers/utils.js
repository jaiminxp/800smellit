// default route controller
const EmailService = require('../services/email.service')

const sendFeedBack = (req, res) => {
  const { email, feedback } = req.body

  const payload = {
    email,
    feedback,
  }

  EmailService.sendFeedbackEmail(payload)

  return res.json({ message: 'We have received your feedback, thank you!' })
}

module.exports = { sendFeedBack }
