const ejs = require('ejs')
const { transporter } = require('../config/nodemailer')

const { SMTP_USER, ADMIN_EMAIL, ADMIN_SITE_URL } = process.env

const TEMPLATE_PATH = './views/email'

function getTemplatePath(template) {
  return `${TEMPLATE_PATH}/${template}.ejs`
}

class EmailService {
  static async send(to, subject, template, data) {
    ejs.renderFile(template, { ...data }, (err, templateContent) => {
      if (err) {
        console.log(err)
      } else {
        transporter
          .sendMail({
            from: SMTP_USER,
            to,
            subject,
            html: templateContent,
          })
          .then(() => console.log(`📧 Email sent to ${to}`))
          .catch((error) => console.log(error))
      }
    })
  }

  static async sendNewMusicianEmail(profile) {
    const subject = `A new musician has registered`
    const template = getTemplatePath('new-profile')

    return this.send(ADMIN_EMAIL, subject, template, {
      profile,
      profileType: 'Musician 🎸',
      adminSiteUrl: `${ADMIN_SITE_URL}/musicians`,
    })
  }

  static async sendNewArtistEmail(profile) {
    const subject = `A new artist has registered`
    const template = getTemplatePath('new-profile')

    return this.send(ADMIN_EMAIL, subject, template, {
      profile,
      profileType: 'Artist 🎨',
      adminSiteUrl: `${ADMIN_SITE_URL}/artists`,
    })
  }

  static async sendUserVerificationEmail(userEmail, verificationUrl) {
    const subject = 'Please verify your E-mail'
    const template = getTemplatePath('verify-email')

    return this.send(userEmail, subject, template, { verificationUrl })
  }

  static async sendFeedbackEmail(feedback) {
    const subject = 'New Feedback from 800smellit'
    const template = getTemplatePath('feedback')

    return this.send(ADMIN_EMAIL, subject, template, feedback)
  }
}

module.exports = EmailService
