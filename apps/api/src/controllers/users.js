const jsonwebtoken = require('jsonwebtoken')
const User = require('../models/user')
const ExpressError = require('../lib/ExpressError')
const EmailService = require('../services/email.service')

const secret = process.env.JWT_SECRET

const {
  genPassword,
  issueJWT,
  validatePassword,
  getUser,
} = require('../lib/utils')

const signup = async (req, res, next) => {
  const { email, password } = req.body
  const { salt, hash } = genPassword(password)

  const emailVerificationToken = jsonwebtoken.sign({ email }, secret)
  const verificationUrl = `${req.protocol}://${req.headers.host}/verify-email/${emailVerificationToken}`

  const newUser = new User({
    email,
    hash,
    salt,
    emailVerificationToken,
    status: 'pending',
    roles: [],
  })

  try {
    const user = await newUser.save()
    EmailService.sendUserVerificationEmail(user.email, verificationUrl)

    res.json({
      success: true,
    })
  } catch (err) {
    next(err)
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    const foundUser = await User.findOne({ email })

    if (foundUser) {
      const isValid = validatePassword(password, foundUser.hash, foundUser.salt)

      if (isValid) {
        // check if user has veirfied their email
        if (!foundUser.isEmailVerified) {
          throw new ExpressError('Please verify your email', 401)
        }

        // issue JWT if password is valid
        const { token, expires } = issueJWT(foundUser)

        res.json({
          success: true,
          user: {
            id: foundUser.id,
            email: foundUser.email,
            roles: foundUser.roles,
          },
          token,
          expiresIn: expires,
        })
      } else {
        throw new ExpressError('Incorrect username or password', 401)
      }
    } else {
      throw new ExpressError('Incorrect username or password', 401)
    }
  } catch (err) {
    next(err)
  }
}

const verifyEmail = async (req, res) => {
  const user = await User.findOne({
    emailVerificationToken: req.params.token,
  })

  if (!user) {
    return res.status(404).send({ message: 'User Not found.' })
  }
  if (user.isEmailVerified) {
    res.status(400).send('Your E-mail is already verified.')
  }

  user.isEmailVerified = true
  user.save((err) => {
    if (err) {
      res.status(500).send({ message: err })
    }
  })

  return res.render('message', { message: 'Your E-mail is verified!' })
}

const getCurrentUser = async (req, res) => {
  const user = await getUser(req)

  await res.json({
    id: user.id,
    email: user.email,
    roles: user.roles,
  })
}

module.exports = {
  signup,
  login,
  verifyEmail,
  getCurrentUser,
}
